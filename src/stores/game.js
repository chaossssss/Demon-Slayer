import { defineStore } from 'pinia'
import {
  CARD_POOL,
  CLASSES,
  ENEMY_TEMPLATES,
  FLOORS_TO_WIN,
  HAND_SIZE,
  MAX_STAR,
  MERGE_COUNT,
  RARITY_WEIGHT,
  SHOP_SIZE,
  scaleStats,
} from '@/data/gameData'
import { useProgressStore } from './progress'

let uid = 1
const nextId = () => `c${uid++}`

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
  return {
    uid: nextId(),
    cardId,
    star,
    name: tpl.name,
    type: tpl.type,
    cost: tpl.cost,
    rarity: tpl.rarity,
  }
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

function makeEnemy(floor) {
  const isBoss = floor >= FLOORS_TO_WIN
  const isElite = floor % 3 === 0 && !isBoss
  let pool = ENEMY_TEMPLATES.filter((e) => {
    if (isBoss) return e.boss
    if (isElite) return e.elite && !e.boss
    return !e.elite && !e.boss
  })
  if (!pool.length) pool = ENEMY_TEMPLATES.filter((e) => !e.boss)
  const t = pool[Math.floor(Math.random() * pool.length)]
  const scale = 1 + (floor - 1) * 0.18
  const maxHp = Math.round(t.hp * scale)
  return {
    id: t.id,
    name: isBoss ? t.name : `${t.name}`,
    maxHp,
    hp: maxHp,
    damage: Math.round(t.damage * scale),
    burn: t.burn || 0,
    blockChance: t.blockChance || 0,
    intent: t.intent || 'attack',
    block: 0,
    burnStacks: 0,
    elite: !!t.elite,
    boss: !!t.boss,
  }
}

export const useGameStore = defineStore('game', {
  state: () => ({
    phase: 'idle', // idle | shop | combat | victory | defeat
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
    enemy: null,
    log: [],
    selectedForMerge: [],
    showMerge: false,
  }),

  getters: {
    classInfo(state) {
      return state.classId ? CLASSES[state.classId] : null
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
      return (card) => this.phase === 'combat' && this.energy >= card.cost && this.hp > 0
    },
    mergeGroups(state) {
      const map = new Map()
      for (const c of state.deck) {
        if (c.star >= MAX_STAR) continue
        const key = `${c.cardId}_${c.star}`
        if (!map.has(key)) map.set(key, [])
        map.get(key).push(c)
      }
      return [...map.entries()]
        .filter(([, list]) => list.length >= MERGE_COUNT)
        .map(([key, list]) => ({
          key,
          cardId: list[0].cardId,
          star: list[0].star,
          count: list.length,
          name: list[0].name,
          cards: list,
        }))
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
        enemy: null,
        log: [],
        selectedForMerge: [],
        showMerge: false,
      })
      this.pushLog(`以「${cls.name}」踏上斩鬼之路。`)
      this.enterFloor()
    },

    enterFloor() {
      this.enemy = makeEnemy(this.floor)
      this.block = 0
      this.thorns = 0
      this.drawPile = shuffle(this.deck.map((c) => ({ ...c })))
      this.hand = []
      this.discard = []
      this.phase = 'combat'
      this.pushLog(`—— 第 ${this.floor} 层：遭遇 ${this.enemy.name} ——`)
      this.beginTurn()
    },

    beginTurn() {
      if (this.phase === 'victory' || this.phase === 'defeat') return
      this.turn += 1
      this.block = 0
      this.thorns = 0
      this.energy = this.maxEnergy

      const income = this.goldPerTurn + Math.floor((this.floor - 1) / 2) * 2
      this.gold += income
      this.pushLog(`回合 ${this.turn}：获得 ${income} 金币。`)

      this.refreshShop()
      this.drawCards(HAND_SIZE)
      this.tickEnemyBurn()
      this.checkCombatEnd()
    },

    refreshShop() {
      const cls = this.classId
      const pool = Object.values(CARD_POOL).filter((c) => c.classes.includes(cls))
      const offers = []
      for (let i = 0; i < SHOP_SIZE; i++) {
        const tpl = pickWeighted(pool)
        offers.push({
          offerId: nextId(),
          cardId: tpl.id,
          star: 1,
          name: tpl.name,
          type: tpl.type,
          cost: tpl.cost,
          rarity: tpl.rarity,
          price: tpl.price + Math.floor(this.floor * 1.5),
          desc: tpl.desc(scaleStats(tpl.base, 1)),
        })
      }
      this.shop = offers
    },

    buyCard(offerId) {
      const offer = this.shop.find((o) => o.offerId === offerId)
      if (!offer || this.gold < offer.price) return false
      this.gold -= offer.price
      const card = createCardInstance(offer.cardId, 1)
      this.deck.push(card)
      this.discard.push({ ...card })
      this.shop = this.shop.filter((o) => o.offerId !== offerId)
      this.pushLog(`购入「${offer.name}」(-${offer.price}金)`)
      this.tryAutoMerge(offer.cardId, 1)
      return true
    },

    rerollShop() {
      const cost = 8 + this.floor
      if (this.gold < cost) return false
      this.gold -= cost
      this.refreshShop()
      this.pushLog(`刷新商店 (-${cost}金)`)
      return true
    },

    drawCards(n) {
      for (let i = 0; i < n; i++) {
        if (!this.drawPile.length) {
          if (!this.discard.length) break
          this.drawPile = shuffle(this.discard)
          this.discard = []
        }
        const card = this.drawPile.shift()
        if (card) this.hand.push(card)
      }
    },

    playCard(uid) {
      const idx = this.hand.findIndex((c) => c.uid === uid)
      if (idx < 0) return
      const card = this.hand[idx]
      if (!this.canPlay(card)) return

      this.energy -= card.cost
      this.hand.splice(idx, 1)
      this.resolveCard(card)
      this.discard.push(card)
      this.checkCombatEnd()
    },

    resolveCard(card) {
      const tpl = CARD_POOL[card.cardId]
      const s = scaleStats(tpl.base, card.star)
      const starLabel = '★'.repeat(card.star)

      if (s.block) this.block += s.block
      if (s.thorns) this.thorns += s.thorns
      if (s.energy) this.energy += s.energy
      if (s.heal) {
        const heal = Math.min(s.heal, this.maxHp - this.hp)
        this.hp += heal
      }
      if (s.draw) this.drawCards(s.draw)

      let dmg = s.damage || 0
      const hits = s.hits || (dmg ? 1 : 0)
      if (s.executeBonus && this.enemy && this.enemy.hp <= this.enemy.maxHp / 2) {
        dmg += s.executeBonus
      }

      for (let i = 0; i < hits; i++) {
        this.dealDamageToEnemy(dmg)
      }
      if (s.burn && this.enemy) {
        this.enemy.burnStacks += s.burn
      }

      this.pushLog(`打出 ${starLabel}${card.name}`)
    },

    dealDamageToEnemy(raw) {
      if (!this.enemy || raw <= 0) return
      let dmg = raw
      if (this.enemy.block > 0) {
        const absorbed = Math.min(this.enemy.block, dmg)
        this.enemy.block -= absorbed
        dmg -= absorbed
      }
      this.enemy.hp = Math.max(0, this.enemy.hp - dmg)
    },

    tickEnemyBurn() {
      if (!this.enemy?.burnStacks) return
      const burn = this.enemy.burnStacks
      this.enemy.hp = Math.max(0, this.enemy.hp - burn)
      this.enemy.burnStacks = Math.max(0, burn - 1)
      this.pushLog(`${this.enemy.name} 受到 ${burn} 点灼烧。`)
    },

    endTurn() {
      if (this.phase !== 'combat') return
      // discard hand
      this.discard.push(...this.hand)
      this.hand = []

      this.enemyAct()
      if (this.hp <= 0) {
        this.phase = 'defeat'
        this.pushLog('你倒下了……')
        useProgressStore().recordRun({ floor: this.floor, won: false })
        return
      }
      this.beginTurn()
    },

    enemyAct() {
      const e = this.enemy
      if (!e || e.hp <= 0) return

      if (e.blockChance && Math.random() < e.blockChance) {
        e.block += Math.round(e.damage * 0.8)
        this.pushLog(`${e.name} 进入防御姿态。`)
      }

      let dmg = e.damage
      if (e.intent === 'boss' && this.turn % 3 === 0) dmg = Math.round(dmg * 1.4)

      if (this.thorns > 0) {
        e.hp = Math.max(0, e.hp - this.thorns)
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

      if (e.intent === 'burn' || e.burn) {
        // flavor only; damage already applied
      }

      this.checkCombatEnd()
    },

    checkCombatEnd() {
      if (!this.enemy) return
      if (this.enemy.hp > 0) return

      const reward = 18 + this.floor * 6 + (this.enemy.elite ? 20 : 0) + (this.enemy.boss ? 50 : 0)
      this.gold += reward
      this.hand = []
      this.drawPile = []
      this.discard = []
      this.shop = []
      this.pushLog(`击败 ${this.enemy.name}！获得 ${reward} 金币。`)

      if (this.enemy.boss || this.floor >= FLOORS_TO_WIN) {
        this.phase = 'victory'
        this.pushLog('鬼域肃清，凯旋而归！')
        useProgressStore().recordRun({ floor: this.floor, won: true })
        return
      }

      this.phase = 'shop'
      // heal a bit between floors
      const heal = Math.min(8 + Math.floor(this.floor / 2), this.maxHp - this.hp)
      if (heal > 0) {
        this.hp += heal
        this.pushLog(`休整，回复 ${heal} 生命。`)
      }
      this.refreshShop()
    },

    nextFloor() {
      if (this.phase !== 'shop') return
      this.floor += 1
      this.enterFloor()
    },

    tryAutoMerge(cardId, star) {
      if (star >= MAX_STAR) return
      const matches = this.deck.filter((c) => c.cardId === cardId && c.star === star)
      if (matches.length < MERGE_COUNT) return

      const remove = matches.slice(0, MERGE_COUNT)
      const removeUids = new Set(remove.map((c) => c.uid))
      this.deck = this.deck.filter((c) => !removeUids.has(c.uid))
      // also clean combat piles of removed cards
      this.drawPile = this.drawPile.filter((c) => !removeUids.has(c.uid))
      this.hand = this.hand.filter((c) => !removeUids.has(c.uid))
      this.discard = this.discard.filter((c) => !removeUids.has(c.uid))

      const upgraded = createCardInstance(cardId, star + 1)
      this.deck.push(upgraded)
      if (this.phase === 'combat') this.discard.push({ ...upgraded })
      this.pushLog(`合成成功！获得 ${'★'.repeat(star + 1)}${upgraded.name}`)
      this.tryAutoMerge(cardId, star + 1)
    },

    manualMerge(cardId, star) {
      this.tryAutoMerge(cardId, star)
    },

    toggleMergePanel(show) {
      this.showMerge = show ?? !this.showMerge
    },
  },
})
