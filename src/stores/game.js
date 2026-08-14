import { defineStore } from 'pinia'
import {
  CARD_POOL,
  CLASSES,
  ENEMY_TEMPLATES,
  FLOORS_TO_WIN,
  HAND_SIZE,
  MAX_STAR,
  MERGE_COUNT,
  MULTI_ENEMY_FLOORS,
  RARITY_WEIGHT,
  SHOP_SIZE,
  TURN_START_COST1_CARDS,
  getCardTargetCount,
  scaleStats,
} from '@/data/gameData'
import { useProgressStore } from './progress'
import {
  TREASURE_POOL,
  aggregateTreasureEffects,
  getTreasure,
  rollTreasureOffers,
} from '@/data/treasures'

let uid = 1
let shopSeq = 1
let enemySeq = 1
const nextId = () => `c${uid++}`
const nextShopId = () => `s${shopSeq++}`
const nextEnemyId = () => `e${enemySeq++}`
const MULTI_LABELS = ['甲', '乙', '丙', '丁']

/** 不挂到 Pinia store 上，避免 storeToRefs 读 null.effect */
let activeTargets = null
let toastTimer = null

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function createCardInstance(cardId, star = 1) {
  const tpl = CARD_POOL[cardId]
  if (!tpl) throw new Error(`Unknown card ${cardId}`)
  const safeStar = Math.min(Math.max(1, Number(star) || 1), MAX_STAR)
  return {
    uid: nextId(),
    cardId,
    star: safeStar,
    name: tpl.name,
    type: tpl.type,
    cost: tpl.cost,
    rarity: tpl.rarity,
  }
}

/** 卡组按 uid 去重，防止拷贝残留导致多出三星卡 */
function dedupeByUid(cards) {
  const seen = new Set()
  return cards.filter((c) => {
    if (!c?.uid || seen.has(c.uid)) return false
    seen.add(c.uid)
    return true
  })
}

function pickWeighted(cards) {
  const total = cards.reduce((s, c) => s + (RARITY_WEIGHT[c.rarity] || 10), 0)
  let roll = Math.random() * total
  for (const c of cards) {
    roll -= RARITY_WEIGHT[c.rarity] || 10
    if (roll <= 0) return c
  }
  return cards[cards.length - 1]
}

/**
 * @param {number} floor
 * @param {{ forceNormal?: boolean, multiScale?: number }} [opts]
 */
function makeEnemy(floor, opts = {}) {
  const isBoss = floor >= FLOORS_TO_WIN && !opts.forceNormal
  const isElite = !opts.forceNormal && floor % 3 === 0 && !isBoss
  let pool = ENEMY_TEMPLATES.filter((e) => {
    if (isBoss) return e.boss
    if (isElite) return e.elite && !e.boss
    return !e.elite && !e.boss
  })
  if (!pool.length) pool = ENEMY_TEMPLATES.filter((e) => !e.boss)
  const t = pool[Math.floor(Math.random() * pool.length)]
  const scale = (1 + (floor - 1) * 0.18) * (opts.multiScale ?? 1)
  const maxHp = Math.round(t.hp * scale)
  return {
    uid: nextEnemyId(),
    id: t.id,
    name: isBoss ? t.name : `${t.name}`,
    maxHp,
    hp: maxHp,
    damage: Math.max(1, Math.round(t.damage * scale)),
    burn: t.burn || 0,
    blockChance: t.blockChance || 0,
    intent: t.intent || 'attack',
    block: 0,
    burnStacks: 0,
    elite: !!t.elite,
    boss: !!t.boss,
  }
}

function makeFloorEnemies(floor) {
  const count = MULTI_ENEMY_FLOORS[floor] || 1
  const multiScale = count > 1 ? 0.72 : 1
  const list = []
  for (let i = 0; i < count; i++) {
    const e = makeEnemy(floor, {
      forceNormal: count > 1,
      multiScale,
    })
    if (count > 1) e.name = `${e.name}·${MULTI_LABELS[i] || i + 1}`
    list.push(e)
  }
  return list
}

export const useGameStore = defineStore('game', {
  state: () => ({
    phase: 'idle', // idle | treasure | shop | combat | victory | defeat
    classId: null,
    floor: 1,
    turn: 0,
    hp: 0,
    maxHp: 0,
    gold: 0,
    goldPerTurn: 0,
    energy: 0,
    maxEnergy: 3,
    block: 0,
    thorns: 0,
    deck: [],
    drawPile: [],
    hand: [],
    discard: [],
    shop: [],
    shopLocked: false,
    treasures: [], // owned treasure ids
    treasureOffers: [],
    enemies: [],
    pendingCardUid: null,
    selectedTargetIds: [],
    log: [],
    selectedForMerge: [],
    showMerge: false,
    mergeToast: '',
  }),

  getters: {
    classInfo(state) {
      return state.classId ? CLASSES[state.classId] : null
    },
    livingEnemies(state) {
      return state.enemies.filter((e) => e.hp > 0)
    },
    /** 兼容单目标 UI：优先存活敌人 */
    enemy(state) {
      return state.enemies.find((e) => e.hp > 0) || state.enemies[0] || null
    },
    targetingNeed(state) {
      if (!state.pendingCardUid) return 0
      const card = state.hand.find((c) => c.uid === state.pendingCardUid)
      if (!card) return 0
      return getCardTargetCount(CARD_POOL[card.cardId])
    },
    cardView() {
      return (inst) => {
        const tpl = CARD_POOL[inst.cardId]
        const stats = scaleStats(tpl.base, inst.star)
        return {
          ...inst,
          stats,
          desc: tpl.desc(stats),
          price: Math.round(tpl.price * (0.85 + inst.star * 0.15)),
        }
      }
    },
    canPlay() {
      return (card) =>
        this.phase === 'combat' &&
        this.energy >= card.cost &&
        this.hp > 0 &&
        (!this.pendingCardUid || this.pendingCardUid === card.uid)
    },
    ownedTreasures(state) {
      return state.treasures.map((id) => getTreasure(id)).filter(Boolean)
    },
    relicMods() {
      return aggregateTreasureEffects(this.ownedTreasures)
    },
    /** 全部同名同星进度（含未满 3 张），便于合成面板展示 */
    mergeProgress(state) {
      const map = new Map()
      for (const c of state.deck) {
        if (c.star >= MAX_STAR) continue
        const key = `${c.cardId}_${c.star}`
        if (!map.has(key)) {
          map.set(key, {
            key,
            cardId: c.cardId,
            star: c.star,
            count: 0,
            name: c.name,
          })
        }
        map.get(key).count += 1
      }
      return [...map.values()].sort((a, b) => b.count - a.count || b.star - a.star)
    },
    mergeGroups() {
      return this.mergeProgress.filter((g) => g.count >= MERGE_COUNT)
    },
  },

  actions: {
    pushLog(msg) {
      this.log.unshift({ id: nextId(), msg, t: Date.now() })
      if (this.log.length > 40) this.log.length = 40
    },

    startRun(classId) {
      const cls = CLASSES[classId]
      if (!cls) return
      uid = 1
      shopSeq = 1
      enemySeq = 1
      const deck = []
      for (const { cardId, count } of cls.starterDeck) {
        for (let i = 0; i < count; i++) deck.push(createCardInstance(cardId, 1))
      }
      this.$patch({
        phase: 'combat',
        classId,
        floor: 1,
        turn: 0,
        hp: cls.maxHp,
        maxHp: cls.maxHp,
        gold: cls.startGold,
        goldPerTurn: cls.goldPerTurn,
        energy: 0,
        maxEnergy: cls.energy,
        block: 0,
        thorns: 0,
        deck,
        drawPile: [],
        hand: [],
        discard: [],
        shop: [],
        shopLocked: false,
        treasures: [],
        treasureOffers: [],
        enemies: [],
        pendingCardUid: null,
        selectedTargetIds: [],
        log: [],
        selectedForMerge: [],
        showMerge: false,
        mergeToast: '',
      })
      this.pushLog(`以「${cls.name}」踏上斩鬼之路。`)
      // 开局使用职业固定初始卡组，不自动合成
      activeTargets = null
      this.enterFloor()
    },

    enterFloor() {
      this.enemies = makeFloorEnemies(this.floor)
      this.clearTargeting()
      this.block = 0
      this.thorns = 0
      // 去重后，战斗牌堆与卡组共用同一对象引用，避免「同 uid 双份」导致三星卡异常再现
      this.deck = dedupeByUid(this.deck)
      this.drawPile = shuffle([...this.deck])
      this.hand = []
      this.discard = []
      this.phase = 'combat'
      const names = this.enemies.map((e) => e.name).join('、')
      this.pushLog(`—— 第 ${this.floor} 层：遭遇 ${names} ——`)
      if (this.shopLocked) {
        this.pushLog('市集已锁定，保留当前货架。')
      } else {
        this.refreshShop()
      }
      this.beginTurn()
    },

    beginTurn() {
      if (this.phase === 'victory' || this.phase === 'defeat') return
      this.turn += 1
      this.block = 0
      this.thorns = 0
      const mods = this.relicMods
      this.energy = this.maxEnergy

      if (mods.startBlock) this.block += mods.startBlock
      if (mods.thornsFlat) this.thorns += mods.thornsFlat

      const income =
        Math.max(0, this.goldPerTurn + (mods.goldPerTurn || 0)) +
        Math.floor((this.floor - 1) / 2) * 2 +
        (mods.turnStartGold || 0)
      this.gold += income
      this.pushLog(`回合 ${this.turn}：获得 ${income} 金币。`)

      if (mods.turnStartHpHeal) {
        const heal = Math.min(mods.turnStartHpHeal, this.maxHp - this.hp)
        if (heal > 0) {
          this.hp += heal
          this.pushLog(`宝物回春：回复 ${heal} 生命。`)
        }
      }
      if (mods.turnStartHpLoss) {
        this.hp = Math.max(0, this.hp - mods.turnStartHpLoss)
        this.pushLog(`咒物反噬：失去 ${mods.turnStartHpLoss} 生命。`)
        if (this.hp <= 0) {
          this.phase = 'defeat'
          this.pushLog('你倒下了……')
          useProgressStore().recordRun({ floor: this.floor, won: false })
          return
        }
      }

      // 每回合开始：从未打出的手牌之外，再获得 2 张 1 费牌（不超过手牌上限）
      this.drawCostOneCards(TURN_START_COST1_CARDS)
      this.tickEnemyBurn()
      this.checkCombatEnd()
    },

    refreshShop() {
      const cls = this.classId
      const pool = Object.values(CARD_POOL).filter((c) => c.classes.includes(cls))
      const priceMod = this.relicMods.shopPriceFlat || 0
      const offers = []
      for (let i = 0; i < SHOP_SIZE; i++) {
        const tpl = pickWeighted(pool)
        const stats = scaleStats(tpl.base, 1)
        offers.push({
          offerId: nextShopId(),
          cardId: tpl.id,
          star: 1,
          name: tpl.name,
          type: tpl.type,
          cost: tpl.cost,
          rarity: tpl.rarity,
          price: Math.max(5, tpl.price + Math.floor(this.floor * 1.5) + priceMod),
          desc: tpl.desc(stats),
          fromShop: true,
        })
      }
      this.shop = offers
    },

    buyCard(offerId) {
      const offer = this.shop.find((o) => o.offerId === offerId)
      if (!offer || this.gold < offer.price) return false
      this.gold -= offer.price
      // 购买始终生成一星实例，忽略货架上任何异常字段
      const card = createCardInstance(offer.cardId, 1)
      this.deck.push(card)
      // 战斗中：同一引用进手牌（不要 {...card} 拷贝，否则会同 uid 双份）
      if (this.phase === 'combat' && this.hand.length < HAND_SIZE) {
        this.hand.push(card)
      }
      this.shop = this.shop.filter((o) => o.offerId !== offerId)
      this.pushLog(`购入「${offer.name}」(-${offer.price}金)`)
      this.mergeAllPossible()
      return true
    },

    rerollShop() {
      if (this.shopLocked) return false
      const cost = 8 + this.floor
      if (this.gold < cost) return false
      this.gold -= cost
      this.refreshShop()
      this.pushLog(`刷新商店 (-${cost}金)`)
      return true
    },

    toggleShopLock() {
      if (this.phase === 'victory' || this.phase === 'defeat') return
      this.shopLocked = !this.shopLocked
      this.pushLog(this.shopLocked ? '市集已锁定，过关休整不会刷新货架。' : '市集已解锁，过关后将刷新货架。')
    },

    drawCards(n) {
      for (let i = 0; i < n; i++) {
        if (this.hand.length >= HAND_SIZE) break
        if (!this.drawPile.length) {
          if (!this.discard.length) break
          this.drawPile = shuffle(this.discard)
          this.discard = []
        }
        const card = this.drawPile.shift()
        if (card) this.hand.push(card)
      }
    },

    /** 从抽牌/弃牌中取出至多 n 张费用为 1 的牌进手牌 */
    drawCostOneCards(n) {
      const room = Math.max(0, HAND_SIZE - this.hand.length)
      const need = Math.min(n, room)
      if (need <= 0) return 0

      const cost1 = []
      const otherDraw = []
      for (const c of this.drawPile) {
        if (c.cost === 1) cost1.push(c)
        else otherDraw.push(c)
      }
      const otherDiscard = []
      for (const c of this.discard) {
        if (c.cost === 1) cost1.push(c)
        else otherDiscard.push(c)
      }

      const shuffled = shuffle(cost1)
      const taken = shuffled.slice(0, need)
      const remain = shuffled.slice(need)
      this.drawPile = shuffle([...otherDraw, ...remain])
      this.discard = otherDiscard
      this.hand.push(...taken)
      if (taken.length) {
        this.pushLog(`获得 ${taken.length} 张 1 费牌。`)
      }
      return taken.length
    },

    playCard(uid) {
      const idx = this.hand.findIndex((c) => c.uid === uid)
      if (idx < 0) return
      const card = this.hand[idx]

      if (this.pendingCardUid && this.pendingCardUid !== uid) {
        this.clearTargeting()
      }

      if (!this.canPlay(card)) return

      const tpl = CARD_POOL[card.cardId]
      const need = getCardTargetCount(tpl)
      const living = this.enemies.filter((e) => e.hp > 0)

      if (need <= 0) {
        this.commitPlay(card, [])
        return
      }

      if (!living.length) {
        this.commitPlay(card, [])
        return
      }

      // 仅剩 1 只时自动锁定；多只时一律点选（避免误把全体当成目标）
      if (living.length === 1) {
        this.commitPlay(card, [living[0].uid])
        return
      }

      if (this.pendingCardUid === uid) return
      this.pendingCardUid = uid
      this.selectedTargetIds = []
      this.pushLog(`选择 ${Math.min(need, living.length)} 个目标（「${card.name}」）`)
    },

    toggleTarget(enemyUid) {
      if (!this.pendingCardUid || this.phase !== 'combat') return
      const living = this.enemies.filter((e) => e.hp > 0)
      if (!living.some((e) => e.uid === enemyUid)) return

      const need = Math.min(this.targetingNeed, living.length)
      const idx = this.selectedTargetIds.indexOf(enemyUid)
      if (idx >= 0) {
        this.selectedTargetIds.splice(idx, 1)
        return
      }
      if (this.selectedTargetIds.length >= need) return
      this.selectedTargetIds.push(enemyUid)

      if (this.selectedTargetIds.length >= need) {
        this.confirmTargets()
      }
    },

    confirmTargets() {
      if (!this.pendingCardUid) return
      const card = this.hand.find((c) => c.uid === this.pendingCardUid)
      if (!card || !this.canPlay(card)) {
        this.clearTargeting()
        return
      }
      const ids = [...this.selectedTargetIds]
      this.clearTargeting()
      this.commitPlay(card, ids)
    },

    cancelTargeting() {
      if (!this.pendingCardUid) return
      this.pushLog('取消选目标。')
      this.clearTargeting()
    },

    clearTargeting() {
      this.pendingCardUid = null
      this.selectedTargetIds = []
      activeTargets = null
    },

    commitPlay(card, targetIds) {
      if (!this.canPlay(card)) return
      this.energy -= card.cost
      const idx = this.hand.findIndex((c) => c.uid === card.uid)
      if (idx >= 0) this.hand.splice(idx, 1)

      const tpl = CARD_POOL[card.cardId]
      const need = getCardTargetCount(tpl)
      // 严格按卡牌目标数截断，防止误伤全体
      const capped =
        need > 0 ? [...new Set(targetIds)].slice(0, need) : []
      const idSet = new Set(capped)
      activeTargets = this.enemies.filter((e) => idSet.has(e.uid) && e.hp > 0)
      try {
        this.resolveCard(card)
      } finally {
        activeTargets = null
      }
      this.discard.push(card)
      this.checkCombatEnd()
    },

    resolveCard(card) {
      const tpl = CARD_POOL[card.cardId]
      if (!tpl) return
      const s = scaleStats(tpl.base, card.star)
      const starLabel = '★'.repeat(card.star)
      const targetUids = (activeTargets || []).map((e) => e.uid)
      const targets = this.enemies.filter((e) => targetUids.includes(e.uid) && e.hp > 0)
      const aliveBefore = new Set(targets.map((e) => e.uid))

      this.applyCardEffects(s, targetUids)
      this.pushLog(`打出 ${starLabel}${card.name}`)

      if (card.star >= MAX_STAR && tpl.ultimate?.effect) {
        const effect = { ...tpl.ultimate.effect }
        const killHeal = effect.killHeal
        const normalHeal = effect.heal

        if (killHeal) {
          const { heal, killHeal: _kh, ...rest } = effect
          this.applyCardEffects(rest, targetUids)
          const killed = [...aliveBefore].some((id) => {
            const e = this.enemies.find((x) => x.uid === id)
            return e && e.hp <= 0
          })
          const amount = killed ? killHeal : normalHeal || 0
          if (amount) {
            const mods = this.relicMods
            const healAmt = Math.max(0, amount + (mods.healFlat || 0))
            const healed = Math.min(healAmt, this.maxHp - this.hp)
            if (healed > 0) {
              this.hp += healed
              this.pushLog(
                killed
                  ? `无想剑击杀回血：回复 ${healed} 生命。`
                  : `无想剑回血：回复 ${healed} 生命。`,
              )
            }
          }
        } else {
          this.applyCardEffects(effect, targetUids)
        }

        this.pushLog(`触发大招「${tpl.ultimate.name}」！`)
        this.showMergeToast(`大招：${tpl.ultimate.name}`)
      }
    },

    applyCardEffects(s, targetUids = null) {
      if (!s) return { dealt: 0, killed: false }
      const mods = this.relicMods
      let dealt = 0

      // 自身效果只结算一次
      if (s.block) this.block += Math.max(0, s.block + (mods.blockFlat || 0))
      if (s.thorns) this.thorns += s.thorns + (mods.thornsFlat || 0)
      if (s.energy) this.energy += s.energy
      if (s.draw) this.drawCards(s.draw)

      let uids = Array.isArray(targetUids) ? targetUids : null
      if (!uids) {
        uids = (activeTargets || []).map((e) => e.uid)
      }
      const needsEnemy =
        !!(s.damage || s.burn || s.weaken || s.executeBonus || s.killHeal)
      if (needsEnemy && !uids.length) {
        const first = this.enemies.find((e) => e.hp > 0)
        if (first) uids = [first.uid]
      }

      const aliveBefore = new Set(
        uids.filter((id) => {
          const e = this.enemies.find((x) => x.uid === id)
          return e && e.hp > 0
        }),
      )

      for (const uid of uids) {
        const enemy = this.enemies.find((e) => e.uid === uid)
        if (!enemy || enemy.hp <= 0) continue

        if (s.weaken) {
          enemy.damage = Math.max(1, enemy.damage - s.weaken)
          this.pushLog(`${enemy.name} 攻击被削弱 ${s.weaken}。`)
        }

        let dmg = s.damage || 0
        if (dmg) dmg += mods.damageFlat || 0
        if (s.executeBonus && enemy.hp <= enemy.maxHp / 2) {
          dmg += s.executeBonus
        }
        const hits = s.hits || (dmg ? 1 : 0)
        for (let i = 0; i < hits; i++) {
          dealt += this.dealDamageToEnemy(enemy.uid, dmg, !!s.pierce)
        }
        if (s.burn) {
          enemy.burnStacks += s.burn + (mods.burnFlat || 0)
        }
      }

      const killed = [...aliveBefore].some((id) => {
        const e = this.enemies.find((x) => x.uid === id)
        return e && e.hp <= 0
      })

      let healAmt = 0
      if (s.killHeal && killed) {
        healAmt = s.killHeal
      } else if (s.heal) {
        healAmt = s.heal
      }
      if (healAmt) {
        healAmt = Math.max(0, healAmt + (mods.healFlat || 0))
        const heal = Math.min(healAmt, this.maxHp - this.hp)
        if (heal > 0) {
          this.hp += heal
          if (s.killHeal && killed) {
            this.pushLog(`击杀回血：回复 ${heal} 生命。`)
          }
        }
      }

      if (dealt > 0 && mods.lifesteal) {
        const heal = Math.min(Math.floor(dealt * mods.lifesteal), this.maxHp - this.hp)
        if (heal > 0) this.hp += heal
      }

      return { dealt, killed }
    },

    dealDamageToEnemy(enemyOrUid, raw, pierce = false) {
      const enemy =
        typeof enemyOrUid === 'string'
          ? this.enemies.find((e) => e.uid === enemyOrUid)
          : this.enemies.find((e) => e.uid === enemyOrUid?.uid)
      if (!enemy || raw <= 0) return 0
      let dmg = raw
      if (!pierce && enemy.block > 0) {
        const absorbed = Math.min(enemy.block, dmg)
        enemy.block -= absorbed
        dmg -= absorbed
      }
      enemy.hp = Math.max(0, enemy.hp - dmg)
      return dmg
    },

    tickEnemyBurn() {
      for (const e of this.enemies) {
        if (!e.burnStacks || e.hp <= 0) continue
        const burn = e.burnStacks
        e.hp = Math.max(0, e.hp - burn)
        e.burnStacks = Math.max(0, burn - 1)
        this.pushLog(`${e.name} 受到 ${burn} 点灼烧。`)
      }
    },

    endTurn() {
      if (this.phase !== 'combat') return
      this.clearTargeting()
      // 未打出的手牌保留到下回合，不弃置

      this.enemiesAct()
      if (this.hp <= 0) {
        this.phase = 'defeat'
        this.pushLog('你倒下了……')
        useProgressStore().recordRun({ floor: this.floor, won: false })
        return
      }
      this.beginTurn()
    },

    enemiesAct() {
      for (const e of this.enemies) {
        if (e.hp <= 0) continue
        this.enemyActOne(e)
        if (this.hp <= 0) break
      }
      this.checkCombatEnd()
    },

    enemyActOne(e) {
      if (!e || e.hp <= 0) return

      if (e.blockChance && Math.random() < e.blockChance) {
        e.block += Math.round(e.damage * 0.8)
        this.pushLog(`${e.name} 进入防御姿态。`)
      }

      let dmg = e.damage
      if (e.intent === 'boss' && this.turn % 3 === 0) dmg = Math.round(dmg * 1.4)
      dmg += this.relicMods.damageTakenFlat || 0

      if (this.thorns > 0) {
        this.dealDamageToEnemy(e.uid, this.thorns, true)
        this.pushLog(`反伤对 ${e.name} 造成 ${this.thorns} 点。`)
      }

      let remaining = dmg
      if (this.block > 0) {
        const absorbed = Math.min(this.block, remaining)
        this.block -= absorbed
        remaining -= absorbed
      }
      if (remaining > 0) {
        this.hp = Math.max(0, this.hp - remaining)
        this.pushLog(`${e.name} 攻击，你受到 ${remaining} 点伤害。`)
      } else {
        this.pushLog(`${e.name} 的攻击被完全格挡。`)
      }
    },

    checkCombatEnd() {
      if (this.phase !== 'combat') return
      if (!this.enemies.length) return
      // 必须从 state 直接数存活，避免误判「死一只 = 全灭」
      const alive = this.enemies.filter((e) => e.hp > 0)
      if (alive.length > 0) return

      const anyElite = this.enemies.some((e) => e.elite)
      const anyBoss = this.enemies.some((e) => e.boss)
      const extra = Math.max(0, this.enemies.length - 1) * 10
      const reward = 18 + this.floor * 6 + (anyElite ? 20 : 0) + (anyBoss ? 50 : 0) + extra
      this.gold += reward
      this.hand = []
      this.drawPile = []
      this.discard = []
      this.clearTargeting()
      if (!this.shopLocked) {
        this.shop = []
      }
      const names = this.enemies.map((e) => e.name).join('、')
      this.pushLog(`击败 ${names}！获得 ${reward} 金币。`)

      if (anyBoss || this.floor >= FLOORS_TO_WIN) {
        this.phase = 'victory'
        this.pushLog('鬼域肃清，凯旋而归！')
        useProgressStore().recordRun({ floor: this.floor, won: true })
        return
      }

      this.openTreasurePick()
    },

    openTreasurePick() {
      const elite = this.enemies.some((e) => e.elite)
      this.treasureOffers = rollTreasureOffers(this.treasures, {
        elite,
        floor: this.floor,
      })
      if (!this.treasureOffers.length) {
        this.enterRestShop()
        return
      }
      this.phase = 'treasure'
      this.pushLog('发现散落宝物，可三选一（也可放弃）。')
    },

    pickTreasure(treasureId) {
      if (this.phase !== 'treasure') return false
      if (!this.treasureOffers.some((t) => t.id === treasureId)) return false
      if (this.treasures.includes(treasureId)) return false

      const t = TREASURE_POOL[treasureId]
      if (!t) return false
      this.treasures.push(treasureId)
      this.applyTreasureGain(t)
      this.treasureOffers = []
      this.pushLog(`获得宝物「${t.name}」。`)
      this.showMergeToast(`获得宝物：${t.name}`)
      this.enterRestShop()
      return true
    },

    skipTreasure() {
      if (this.phase !== 'treasure') return
      this.treasureOffers = []
      this.pushLog('你放弃了本次宝物。')
      this.enterRestShop()
    },

    applyTreasureGain(t) {
      const e = t.effects || {}
      if (e.maxHp) {
        this.maxHp = Math.max(1, this.maxHp + e.maxHp)
        if (e.maxHp > 0) this.hp = Math.min(this.maxHp, this.hp + e.maxHp)
        else this.hp = Math.min(this.hp, this.maxHp)
      }
      if (e.maxEnergy) {
        this.maxEnergy = Math.max(1, this.maxEnergy + e.maxEnergy)
      }
      if (e.goldPerTurn) {
        this.goldPerTurn = Math.max(0, this.goldPerTurn + e.goldPerTurn)
      }
    },

    enterRestShop() {
      this.phase = 'shop'
      const mods = this.relicMods
      const heal = Math.min(
        8 + Math.floor(this.floor / 2) + (mods.floorClearHeal || 0),
        this.maxHp - this.hp,
      )
      if (heal > 0) {
        this.hp += heal
        this.pushLog(`休整，回复 ${heal} 生命。`)
      }
      if (this.shopLocked) {
        this.pushLog('市集已锁定，保留当前货架。')
      } else {
        this.refreshShop()
      }
    },

    nextFloor() {
      if (this.phase !== 'shop') return
      this.deck = dedupeByUid(this.deck)
      this.floor += 1
      this.enterFloor()
    },

    /** 将一张同名同星的三张合成一张更高星；成功返回 true */
    tryAutoMerge(cardId, star) {
      if (star >= MAX_STAR) return false
      const matches = this.deck.filter((c) => c.cardId === cardId && c.star === star)
      if (matches.length < MERGE_COUNT) return false

      const remove = matches.slice(0, MERGE_COUNT)
      const removeUids = new Set(remove.map((c) => c.uid))
      this.deck = this.deck.filter((c) => !removeUids.has(c.uid))
      this.drawPile = this.drawPile.filter((c) => !removeUids.has(c.uid))
      this.hand = this.hand.filter((c) => !removeUids.has(c.uid))
      this.discard = this.discard.filter((c) => !removeUids.has(c.uid))

      const upgraded = createCardInstance(cardId, star + 1)
      this.deck.push(upgraded)
      // 战斗中同一引用进手牌，避免拷贝造成双份
      if (this.phase === 'combat' && this.hand.length < HAND_SIZE) {
        this.hand.push(upgraded)
      }

      const label = `${'★'.repeat(star + 1)}${upgraded.name}`
      const ult = CARD_POOL[cardId]?.ultimate
      if (star + 1 >= MAX_STAR && ult) {
        this.pushLog(`合成成功！${label} 解锁大招「${ult.name}」`)
        this.showMergeToast(`解锁大招：${ult.name}`)
      } else {
        this.pushLog(`合成成功！获得 ${label}`)
        this.showMergeToast(`合成成功：${label}`)
      }
      // 继续尝试同卡更高星连锁合成
      this.tryAutoMerge(cardId, star + 1)
      return true
    },

    /** 反复扫描卡组，直到没有可合成组合 */
    mergeAllPossible() {
      let guard = 0
      let merged = false
      while (guard++ < 40) {
        const ready = this.mergeGroups
        if (!ready.length) break
        const g = ready[0]
        if (!this.tryAutoMerge(g.cardId, g.star)) break
        merged = true
      }
      return merged
    },

    manualMerge(cardId, star) {
      const ok = this.tryAutoMerge(cardId, star)
      if (ok) this.mergeAllPossible()
      return ok
    },

    showMergeToast(msg) {
      this.mergeToast = msg
      clearTimeout(toastTimer)
      toastTimer = setTimeout(() => {
        if (this.mergeToast === msg) this.mergeToast = ''
      }, 2200)
    },

    toggleMergePanel(show) {
      this.showMerge = show ?? !this.showMerge
    },
  },
})
