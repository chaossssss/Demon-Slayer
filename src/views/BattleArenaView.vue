<template>
  <main class="arena-page">
    <div class="arena-bg" aria-hidden="true" />
    <div class="petals" aria-hidden="true" />

    <header class="hud-top">
      <RouterLink class="nav-link" to="/class">← 返回</RouterLink>
      <span class="meta">第 {{ floor }} 层 · 回合 {{ turn }}</span>
      <div class="hud-chips">
        <span class="chip gold">金 {{ gold }} <small>+12</small></span>
        <span class="chip energy">能 {{ energy }} / {{ maxEnergy }}</span>
        <span class="chip">牌 {{ hand.length }}</span>
      </div>
      <RelicBar :treasures="treasures" />
      <aside class="combat-log" :class="{ collapsed: logCollapsed }">
        <button type="button" class="log-toggle" @click="logCollapsed = !logCollapsed">
          战报
          <span>{{ logCollapsed ? '▾' : '▴' }}</span>
        </button>
        <ul v-show="!logCollapsed">
          <li v-for="item in log" :key="item.id">{{ item.msg }}</li>
        </ul>
      </aside>
    </header>

    <div class="stage">
      <div class="hero-cluster">
        <aside class="side-panel hero-panel">
          <div class="panel-head">
            <strong>剑士 · 破晓斩</strong>
          </div>
          <div class="meter">
            <div class="meter-label">
              <span>生命</span>
              <span>{{ hp }} / {{ maxHp }}</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill hp" :style="{ width: playerHpPct + '%' }" />
            </div>
          </div>
          <div class="status-icons">
            <span v-if="block" class="chip block">甲 {{ block }}</span>
            <span class="chip energy">能 {{ energy }}</span>
          </div>
        </aside>
        <button class="shop-fab" type="button" :disabled="locked" @click="shopOpen = true">市集</button>
      </div>

      <aside class="side-panel enemy-panel">
        <button
          v-for="e in enemies"
          :key="e.uid"
          type="button"
          class="enemy-row"
          :class="{
            dead: e.hp <= 0,
            selected: selectedIds.includes(e.uid),
            targeting: targeting && e.hp > 0,
          }"
          :disabled="e.hp <= 0 || locked"
          @click="onEnemyClick(e)"
        >
          <div class="enemy-head">
            <span class="badge" :class="{ elite: e.elite, boss: e.boss }">
              {{ e.boss ? 'BOSS' : e.elite ? '精英' : '妖鬼' }}
            </span>
            <strong>{{ e.name }}</strong>
            <span class="intent">{{ intentLabel(e) }}</span>
          </div>
          <div class="meter">
            <div class="meter-label">
              <span>生命</span>
              <span>{{ e.hp }} / {{ e.maxHp }}</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill hp" :style="{ width: hpPct(e) + '%' }" />
            </div>
          </div>
          <div class="status-icons">
            <span v-if="e.block" class="chip block">甲 {{ e.block }}</span>
            <span v-if="e.burnStacks" class="chip burn">灼 {{ e.burnStacks }}</span>
            <span v-if="e.weaken" class="chip weaken">弱 {{ e.weaken }}</span>
          </div>
        </button>
      </aside>

      <div class="rune" aria-hidden="true" />

      <div class="hero-slot" :class="{ busy: locked }">
        <PixelActor v-show="!skillClip" kind="swordsman" :anim="heroAnim" :size="120" />
        <SkillClip :clip="skillClip" @ended="onSkillEnded" />
      </div>

      <div class="enemy-sprites">
        <button
          v-for="e in enemies"
          :key="e.uid"
          type="button"
          class="enemy-unit"
          :class="{
            dead: e.hp <= 0,
            selected: selectedIds.includes(e.uid),
            targeting: targeting && e.hp > 0,
          }"
          :disabled="e.hp <= 0 || locked"
          @click="onEnemyClick(e)"
        >
          <PixelActor :kind="e.kind" :anim="e.anim" :size="e.elite || e.boss ? 112 : 92" />
        </button>
      </div>
    </div>

    <p v-if="pendingCard" class="target-hint">
      选择目标「{{ pendingCard.name }}」
      <button type="button" class="btn-link" @click="pendingUid = null">取消</button>
    </p>

    <section class="hand-dock">
      <div class="hand-wrap">
        <div class="hand-meta">
          <p class="hand-count">手牌 {{ hand.length }} / 10</p>
          <button class="btn btn-primary end-turn" :disabled="locked" type="button" @click="endTurn">
            结束回合
          </button>
        </div>
        <div class="hand" :style="handStyle">
          <GameCard
            v-for="(card, i) in hand"
            :key="card.uid"
            :card="card"
            :playable="canPlay(card)"
            :disabled="!canPlay(card)"
            :class="{ armed: pendingUid === card.uid }"
            :style="{ zIndex: i + 1 }"
            @select="playCard(card)"
          />
        </div>
      </div>
    </section>

    <div v-if="shopOpen" class="shop-overlay" @click.self="shopOpen = false">
      <div class="shop-sheet">
        <button class="shop-close" type="button" @click="shopOpen = false">关闭</button>
        <ShopPanel
          :shop="shop"
          :gold="gold"
          :reroll-cost="4"
          :shop-locked="shopLocked"
          @buy="buyCard"
          @reroll="rerollShop"
          @merge="pushLog('预览页暂不开放合成。')"
          @toggle-lock="shopLocked = !shopLocked"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import RelicBar from '@/components/RelicBar.vue'
import ShopPanel from '@/components/ShopPanel.vue'
import GameCard from '@/components/GameCard.vue'
import PixelActor from '@/components/PixelActor.vue'
import SkillClip from '@/components/SkillClip.vue'
import { CARD_POOL, getCardDesc, getCardTargetCount } from '@/data/gameData'
import { TREASURE_POOL } from '@/data/treasures'

const treasures = [TREASURE_POOL.copper_coin, TREASURE_POOL.wooden_amulet, TREASURE_POOL.herb_pouch]

const floor = 3
const maxHp = 70
const maxEnergy = 3
const hp = ref(62)
const block = ref(6)
const gold = ref(48)
const energy = ref(3)
const turn = ref(2)
const locked = ref(false)
const shopOpen = ref(false)
const shopLocked = ref(false)
const logCollapsed = ref(true)
const pendingUid = ref(null)
const selectedIds = ref([])
const heroAnim = ref('idle')
const skillClip = ref(null)
let skillDone = null
let logSeq = 1
const log = ref([
  { id: logSeq++, msg: '第 3 层 · 小鬼与血犬拦路。' },
  { id: logSeq++, msg: '布局预览：点卡出招，结束回合后市集会自动打开。' },
])

let cardSeq = 1
function makeCard(cardId, star = 1) {
  const tpl = CARD_POOL[cardId]
  return {
    uid: `p${cardSeq++}`,
    cardId,
    star,
    name: tpl.name,
    type: tpl.type,
    cost: tpl.cost,
    rarity: tpl.rarity,
    desc: getCardDesc(tpl, star),
  }
}

function makeOffer(cardId, price) {
  const tpl = CARD_POOL[cardId]
  return {
    offerId: `s${cardSeq++}`,
    cardId,
    star: 1,
    name: tpl.name,
    type: tpl.type,
    cost: tpl.cost,
    rarity: tpl.rarity,
    fromShop: true,
    price,
  }
}

const hand = ref([
  makeCard('slash'),
  makeCard('slash'),
  makeCard('guard'),
  makeCard('heal_potion'),
  makeCard('ember'),
])

const shop = ref([makeOffer('stab', 17), makeOffer('ward', 17), makeOffer('focus_strike', 32)])

const enemies = ref([
  {
    uid: 'e1',
    name: '小鬼·甲',
    kind: 'imp',
    hp: 18,
    maxHp: 28,
    damage: 6,
    intent: 'attack',
    block: 0,
    burnStacks: 2,
    weaken: 0,
    elite: false,
    boss: false,
    anim: 'idle',
  },
  {
    uid: 'e2',
    name: '血犬·乙',
    kind: 'hound',
    hp: 34,
    maxHp: 34,
    damage: 8,
    intent: 'attack',
    block: 4,
    burnStacks: 0,
    weaken: 1,
    elite: false,
    boss: false,
    anim: 'idle',
  },
  {
    uid: 'e3',
    name: '鬼将',
    kind: 'elite',
    hp: 70,
    maxHp: 70,
    damage: 14,
    intent: 'attack',
    block: 0,
    burnStacks: 0,
    weaken: 0,
    elite: true,
    boss: false,
    anim: 'idle',
  },
])

const pendingCard = computed(() => hand.value.find((c) => c.uid === pendingUid.value) || null)
const targeting = computed(() => !!pendingCard.value)
const living = computed(() => enemies.value.filter((e) => e.hp > 0))

const playerHpPct = computed(() => Math.max(0, Math.min(100, (hp.value / maxHp) * 100)))

function hpPct(e) {
  if (!e?.maxHp) return 0
  return Math.max(0, Math.min(100, (e.hp / e.maxHp) * 100))
}

function intentLabel(e) {
  if (e.intent === 'burn') return `意图：灼烧 ${e.damage}`
  const dmg = Math.max(1, e.damage - (e.weaken || 0))
  return `意图：攻击 ${dmg}`
}

function canPlay(card) {
  return !locked.value && energy.value >= card.cost && hp.value > 0
}

function handLayoutStyle(n) {
  let scale = 1
  let overlap = 0
  if (n >= 9) {
    scale = 0.78
    overlap = 72
  } else if (n >= 7) {
    scale = 0.86
    overlap = 56
  } else if (n >= 6) {
    scale = 0.92
    overlap = 36
  }
  return {
    '--hand-scale': String(scale),
    '--hand-overlap': `${overlap}px`,
  }
}

const handStyle = computed(() => handLayoutStyle(hand.value.length))

function pushLog(msg) {
  log.value.unshift({ id: logSeq++, msg })
  if (log.value.length > 12) log.value.pop()
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function onSkillEnded() {
  skillClip.value = null
  skillDone?.()
  skillDone = null
}

async function playSkillClip(card) {
  await new Promise((resolve) => {
    skillDone = resolve
    skillClip.value = {
      classId: 'swordsman',
      cardId: card.cardId,
      star: card.star || 1,
      nonce: Date.now(),
    }
    setTimeout(() => {
      if (skillDone === resolve) onSkillEnded()
    }, 5000)
  })
}

function playCard(card) {
  if (!canPlay(card)) return
  const tpl = CARD_POOL[card.cardId]
  const need = getCardTargetCount(tpl)

  if (need <= 0) {
    resolvePlay(card, [])
    return
  }
  if (living.value.length <= 1) {
    resolvePlay(card, living.value[0] ? [living.value[0].uid] : [])
    return
  }
  if (pendingUid.value === card.uid) {
    pendingUid.value = null
    return
  }
  pendingUid.value = card.uid
  selectedIds.value = []
  pushLog(`选择目标「${card.name}」`)
}

function onEnemyClick(e) {
  if (!pendingCard.value || e.hp <= 0 || locked.value) return
  resolvePlay(pendingCard.value, [e.uid])
}

async function resolvePlay(card, targetIds) {
  pendingUid.value = null
  selectedIds.value = targetIds
  locked.value = true
  energy.value -= card.cost

  const tpl = CARD_POOL[card.cardId]
  const isAttack = tpl.type === 'attack' || tpl.base?.damage || tpl.base?.burn
  heroAnim.value = isAttack ? 'attack' : tpl.base?.block ? 'guard' : 'cast'
  await playSkillClip(card)

  const targets = enemies.value.filter((e) => targetIds.includes(e.uid) && e.hp > 0)
  for (const e of targets) {
    if (tpl.base?.damage) {
      let dmg = tpl.base.damage
      if (e.block) {
        const absorbed = Math.min(e.block, dmg)
        e.block -= absorbed
        dmg -= absorbed
      }
      e.hp = Math.max(0, e.hp - dmg)
      e.anim = e.hp <= 0 ? 'die' : 'hurt'
      pushLog(`「${card.name}」对 ${e.name} 造成 ${tpl.base.damage} 点。`)
    }
    if (tpl.base?.burn) {
      e.burnStacks += tpl.base.burn
      if (e.anim !== 'die') e.anim = 'hurt'
      pushLog(`${e.name} 灼烧 +${tpl.base.burn}`)
    }
  }

  if (tpl.base?.block) {
    block.value += tpl.base.block
    pushLog(`获得 ${tpl.base.block} 点护甲。`)
  }
  if (tpl.base?.heal) {
    hp.value = Math.min(maxHp, hp.value + tpl.base.heal)
    pushLog(`回复 ${tpl.base.heal} 点生命。`)
  }

  const idx = hand.value.findIndex((c) => c.uid === card.uid)
  if (idx >= 0) hand.value.splice(idx, 1)

  await wait(360)
  heroAnim.value = 'idle'
  for (const e of enemies.value) {
    if (e.hp > 0 && e.anim !== 'die') e.anim = 'idle'
  }
  selectedIds.value = []
  locked.value = false
}

async function endTurn() {
  if (locked.value) return
  pendingUid.value = null
  locked.value = true
  pushLog('结束回合。')

  for (const e of living.value) {
    e.anim = 'attack'
    await wait(280)
    const dmg = Math.max(1, e.damage - (e.weaken || 0))
    let remaining = dmg
    if (block.value > 0) {
      const absorbed = Math.min(block.value, remaining)
      block.value -= absorbed
      remaining -= absorbed
    }
    if (remaining > 0) {
      hp.value = Math.max(0, hp.value - remaining)
      heroAnim.value = 'hurt'
      pushLog(`${e.name} 攻击，你受到 ${remaining} 点伤害。`)
    } else {
      heroAnim.value = 'guard'
      pushLog(`${e.name} 的攻击被完全格挡。`)
    }
    await wait(320)
    e.anim = e.hp > 0 ? 'idle' : 'die'
    heroAnim.value = hp.value <= 0 ? 'die' : 'idle'
    if (hp.value <= 0) break
  }

  turn.value += 1
  energy.value = maxEnergy
  if (hp.value > 0) pushLog(`第 ${turn.value} 回合开始。`)
  locked.value = false
  if (!shopLocked.value) shopOpen.value = true
}

function buyCard(offerId) {
  const offer = shop.value.find((s) => s.offerId === offerId)
  if (!offer || gold.value < offer.price) return
  gold.value -= offer.price
  shop.value = shop.value.filter((s) => s.offerId !== offerId)
  pushLog(`购入「${offer.name}」。`)
}

function rerollShop() {
  if (shopLocked.value || gold.value < 4) return
  gold.value -= 4
  shop.value = [makeOffer('bash', 18), makeOffer('smoke', 18), makeOffer('heavy_slash', 44)]
  pushLog('刷新市集。')
}
</script>

<style scoped>
.arena-page {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 12px 20px 168px;
  overflow: clip;
  color: var(--paper);
}

.arena-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 70% 50% at 50% 18%, rgba(155, 45, 31, 0.18), transparent 55%),
    radial-gradient(ellipse 50% 40% at 80% 70%, rgba(61, 107, 79, 0.12), transparent 50%),
    linear-gradient(180deg, #1a1410 0%, #2a2118 42%, #3a2a1c 58%, #1c140e 100%);
}

.arena-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, rgba(8, 5, 3, 0.55) 100%);
  pointer-events: none;
}

.petals {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle, rgba(236, 224, 200, 0.55) 1px, transparent 1.5px),
    radial-gradient(circle, rgba(217, 203, 179, 0.35) 1px, transparent 1.5px);
  background-size: 180px 180px, 260px 260px;
  background-position: 0 0, 80px 40px;
  animation: drift 18s linear infinite;
  opacity: 0.35;
}

.hud-top {
  position: relative;
  z-index: 12;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 6px 10px;
  overflow: visible;
  background: rgba(16, 11, 8, 0.78);
  border: 1px solid rgba(217, 203, 179, 0.22);
}

.hud-top .meta {
  letter-spacing: 0.08em;
  color: rgba(217, 203, 179, 0.82);
  white-space: nowrap;
}

.hud-chips {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.hud-top :deep(.relic-bar) {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: 0;
  overflow: visible;
  background: none;
  border: none;
  box-shadow: none;
}

.hud-top :deep(.relic .name) {
  display: none;
}

.hud-top :deep(.relic) {
  padding: 2px;
  z-index: 2;
}

.hud-top :deep(.relic:hover),
.hud-top :deep(.relic:focus-within) {
  z-index: 30;
}

.hud-top :deep(.tip) {
  top: calc(100% + 8px);
  bottom: auto;
  z-index: 80;
  transform: translateX(-50%) translateY(-4px);
}

.hud-top :deep(.tip::after) {
  top: auto;
  bottom: 100%;
  border-top-color: transparent;
  border-bottom-color: #1f1712;
}

.hud-top :deep(.relic:hover .tip),
.hud-top :deep(.relic:focus-within .tip) {
  transform: translateX(-50%) translateY(0);
}

.hud-top :deep(.label) {
  color: rgba(217, 203, 179, 0.6);
  font-size: 0.78rem;
}

.nav-link {
  color: rgba(217, 203, 179, 0.7);
  text-decoration: none;
  letter-spacing: 0.08em;
  font-size: 0.82rem;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--paper);
}

.combat-log {
  position: relative;
  z-index: 8;
  margin-left: auto;
  flex-shrink: 0;
}

.log-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  color: var(--paper);
  letter-spacing: 0.12em;
  font-family: var(--font-display);
  font-size: 0.82rem;
  border: 1px solid rgba(217, 203, 179, 0.22);
  background: rgba(12, 8, 5, 0.45);
}

.combat-log ul {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 12;
  width: 260px;
  margin: 0;
  padding: 6px 10px 8px;
  list-style: none;
  max-height: 160px;
  overflow: auto;
  background: rgba(16, 11, 8, 0.94);
  border: 1px solid rgba(217, 203, 179, 0.22);
  box-shadow: var(--shadow);
}

.combat-log li {
  padding: 4px 0;
  border-bottom: 1px dashed rgba(217, 203, 179, 0.16);
  color: rgba(217, 203, 179, 0.82);
  font-size: 0.78rem;
  line-height: 1.35;
}

.stage {
  position: relative;
  z-index: 2;
  min-height: min(46vh, 420px);
  margin-top: 8px;
  padding: 12px 220px 36px;
}

.side-panel {
  width: 216px;
  padding: 10px;
  background: rgba(12, 8, 5, 0.78);
  border: 1px solid rgba(217, 203, 179, 0.2);
}

.hero-cluster {
  position: absolute;
  top: 12px;
  left: 8px;
  z-index: 4;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.enemy-panel {
  position: absolute;
  top: 12px;
  right: 8px;
  z-index: 4;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-head {
  margin-bottom: 8px;
  font-family: var(--font-display);
  letter-spacing: 0.1em;
}

.enemy-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px;
  background: none;
  color: inherit;
  text-align: left;
  border: 1px solid transparent;
}

.enemy-row.targeting {
  cursor: pointer;
}

.enemy-row.targeting:hover,
.enemy-row.selected {
  border-color: var(--blood);
  background: rgba(155, 45, 31, 0.16);
}

.enemy-row.dead {
  opacity: 0.45;
}

.rune {
  position: absolute;
  left: 50%;
  bottom: 18px;
  width: min(520px, 48vw);
  height: 88px;
  transform: translateX(-50%);
  border: 1px solid rgba(201, 162, 39, 0.28);
  border-radius: 50%;
  box-shadow:
    inset 0 0 24px rgba(201, 162, 39, 0.12),
    0 0 30px rgba(155, 45, 31, 0.18);
  pointer-events: none;
}

.hero-slot,
.enemy-unit {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  color: inherit;
}

.hero-slot {
  position: absolute;
  left: 320px;
  bottom: 28px;
  width: 120px;
  height: 120px;
  overflow: visible;
}

.enemy-sprites {
  position: absolute;
  right: 250px;
  bottom: 28px;
  display: flex;
  align-items: flex-end;
  gap: 18px;
}

.enemy-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.enemy-head strong {
  font-size: 0.86rem;
  letter-spacing: 0.04em;
}

.badge {
  padding: 2px 6px;
  font-size: 0.64rem;
  letter-spacing: 0.1em;
  background: var(--ink);
  color: var(--paper);
}

.badge.elite {
  background: #6b4f1f;
}

.badge.boss {
  background: var(--blood);
}

.intent {
  margin-left: auto;
  color: rgba(217, 203, 179, 0.7);
  font-size: 0.72rem;
}

.meter-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
  font-size: 0.72rem;
}

.status-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-height: 18px;
  margin-top: 4px;
}

.chip {
  padding: 1px 6px;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  border: 1px solid rgba(217, 203, 179, 0.25);
}

.chip.gold {
  color: var(--gold);
}

.chip.block {
  color: #8eb4c9;
}

.chip.energy {
  color: #8eb4c9;
}

.chip.burn {
  color: var(--ember);
}

.chip.weaken {
  color: #c9a227;
}

.hud-chips .chip small {
  color: rgba(217, 203, 179, 0.55);
}

.enemy-unit.targeting {
  cursor: pointer;
}

.enemy-unit.targeting:hover,
.enemy-unit.selected {
  filter: drop-shadow(0 0 8px var(--blood));
}

.enemy-unit.dead {
  opacity: 0.45;
}

.shop-fab {
  flex-shrink: 0;
  align-self: center;
  padding: 10px 14px;
  background: var(--gold);
  color: #1c1712;
  letter-spacing: 0.14em;
  font-family: var(--font-display);
  box-shadow: 0 6px 0 #6b4f1f;
}

.shop-fab:hover:not(:disabled) {
  transform: translateY(-2px);
}

.target-hint {
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 0;
  color: var(--ember);
}

.btn-link {
  color: var(--paper);
  text-decoration: underline;
}

.hand-dock {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 18px;
  padding: 12px 24px 18px;
  background: linear-gradient(180deg, transparent, rgba(12, 8, 5, 0.9) 35%);
}

.hand-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: min(980px, calc(100vw - 48px));
}

.hand-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hand-count {
  margin: 0;
  font-size: 13px;
  color: rgba(236, 224, 200, 0.72);
}

.hand {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  padding-top: 28px;
  transform: scale(var(--hand-scale, 1));
  transform-origin: bottom center;
}

.hand :deep(.card) {
  flex: 0 0 auto;
  margin-left: calc(var(--hand-overlap, 0px) * -1);
}

.hand :deep(.card:first-child) {
  margin-left: 0;
}

.hand :deep(.card:hover:not(:disabled)),
.hand :deep(.card.armed) {
  transform: translateY(-28px) scale(1.05) !important;
  z-index: 40 !important;
}

.end-turn {
  min-width: 0;
  padding: 6px 14px;
  font-size: 0.88rem;
  box-shadow: 0 4px 0 #5c180f;
}

.shop-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(8, 5, 3, 0.62);
}

.shop-sheet {
  position: relative;
  width: min(760px, 100%);
}

.shop-close {
  position: absolute;
  top: 12px;
  right: 14px;
  z-index: 2;
  color: var(--ink);
  letter-spacing: 0.08em;
}

@keyframes drift {
  from {
    background-position: 0 0, 80px 40px;
  }
  to {
    background-position: 0 -180px, 80px -220px;
  }
}

@media (max-width: 1100px) {
  .stage {
    padding: 140px 12px 72px;
  }

  .hero-cluster,
  .enemy-panel {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    width: auto;
  }

  .hero-panel,
  .enemy-panel {
    width: 100%;
  }

  .combat-log ul {
    width: min(260px, 70vw);
  }

  .hero-slot {
    left: 16px;
  }

  .enemy-sprites {
    right: 16px;
  }
}
</style>
