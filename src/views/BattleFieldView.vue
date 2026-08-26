<template>
  <main v-if="ready" class="arena-page">
    <div class="arena-bg" aria-hidden="true" />
    <div class="petals" aria-hidden="true" />

    <header class="hud-top">
      <RouterLink class="nav-link" to="/class">← 返回</RouterLink>
      <div class="hud-floorblock">
        <span class="meta">第 {{ game.floor }} / {{ totalFloors }} 层 · 回合 {{ game.turn }}</span>
        <div class="px-floornav" aria-label="层数进度">
          <div class="px-floortrack" aria-hidden="true">
            <div class="px-floorfill" :style="{ width: floorProgressPct + '%' }"></div>
          </div>
          <div
            v-for="n in totalFloors"
            :key="'f' + n"
            class="px-fnode"
            :class="{
              passed: n < game.floor,
              current: n === game.floor,
              elite: n % 3 === 0 && n !== totalFloors,
              boss: n === totalFloors,
            }"
          >
            <span>{{ n === totalFloors ? '王' : n % 3 === 0 ? '精' : n }}</span>
          </div>
        </div>
      </div>
      <div class="hud-chips">
        <div class="pxchip gold">
          <div class="pxchip-ico">金</div>
          <div class="pxchip-val">
            <strong>{{ game.gold }}</strong>
            <small>+{{ incomePreview }}/回合</small>
          </div>
        </div>
        <div class="pxchip energy">
          <div class="pxchip-ico">能</div>
          <div class="pxchip-val">
            <div class="px-energydots" aria-hidden="true">
              <span
                v-for="i in game.maxEnergy"
                :key="'e' + i"
                :class="{ on: i <= game.energy }"
              />
            </div>
            <small>{{ game.energy }} / {{ game.maxEnergy }}</small>
          </div>
        </div>
        <div class="pxchip deck">
          <div class="pxchip-ico">牌</div>
          <div class="pxchip-val">
            <strong>{{ game.deck.length }}</strong>
            <small>卡组</small>
          </div>
        </div>
      </div>
      <RelicBar :treasures="game.ownedTreasures" />
      <aside class="combat-log" :class="{ collapsed: logCollapsed }">
        <button type="button" class="log-toggle" @click="logCollapsed = !logCollapsed">
          战报
          <span>{{ logCollapsed ? '▾' : '▴' }}</span>
        </button>
        <ul v-show="!logCollapsed">
          <li v-for="item in game.log" :key="item.id">{{ item.msg }}</li>
        </ul>
      </aside>
    </header>

    <div class="stage">
      <div class="hero-cluster">
        <aside class="side-panel hero-panel">
          <div class="panel-head">
            <strong>{{ heroLabel }}</strong>
          </div>
          <div class="meter">
            <div class="meter-label">
              <span>生命</span>
              <span>{{ game.hp }} / {{ game.maxHp }}</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill hp" :style="{ width: playerHpPct + '%' }" />
            </div>
          </div>
          <div class="status-icons">
            <span v-if="game.block" class="chip block">甲 {{ game.block }}</span>
            <span class="chip energy">能 {{ game.energy }}</span>
          </div>
        </aside>
        <button
          class="shop-fab"
          type="button"
          :disabled="fxLocked"
          @click="shopOpen = true"
        >
          市集
        </button>
      </div>

      <aside class="side-panel enemy-panel">
        <template v-if="game.phase === 'combat' && game.enemies.length">
          <button
            v-for="e in game.enemies"
            :key="e.uid"
            type="button"
            class="enemy-row"
            :class="{
              dead: e.hp <= 0,
              selected: game.selectedTargetIds.includes(e.uid),
              targeting: targeting && e.hp > 0,
            }"
            :disabled="e.hp <= 0 || fxLocked"
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
        </template>
        <div v-else class="rest-note">
          <strong>
            {{
              game.phase === 'victory'
                ? '胜利'
                : game.phase === 'treasure'
                  ? '拾取宝物'
                  : game.phase === 'defeat'
                    ? '陨落'
                    : '层间休整'
            }}
          </strong>
          <p>
            {{
              game.phase === 'victory'
                ? '十层鬼域已平定。'
                : game.phase === 'treasure'
                  ? '从三件宝物中选择一件。'
                  : game.phase === 'defeat'
                    ? `倒在第 ${game.floor} 层。`
                    : '补充卡组，准备下一层。'
            }}
          </p>
        </div>
      </aside>

      <div class="rune" aria-hidden="true" />

      <div class="hero-slot" :class="{ busy: fxLocked }">
        <PixelActor :kind="heroKind" :anim="heroAnim" :size="heroSize" />
        <VfxHost :items="heroFx" facing="right" @ended="onHeroFxEnded" />
      </div>

      <div class="enemy-sprites">
        <button
          v-for="e in game.enemies"
          :key="e.uid"
          type="button"
          class="enemy-unit"
          :class="{
            dead: e.hp <= 0,
            selected: game.selectedTargetIds.includes(e.uid),
            targeting: targeting && e.hp > 0,
          }"
          :disabled="e.hp <= 0 || fxLocked || game.phase !== 'combat'"
          @click="onEnemyClick(e)"
        >
          <PixelActor
            :kind="e.kind || e.id"
            :anim="enemyAnimOf(e)"
            :size="enemySize(e)"
          />
          <VfxHost
            :items="enemyFxOf(e.uid)"
            facing="right"
            @ended="onEnemyFxEnded(e.uid, $event)"
          />
        </button>
      </div>
    </div>

    <p v-if="targeting" class="target-hint">
      选择 {{ Math.min(game.targetingNeed, game.livingEnemies.length) }} 个目标（已选
      {{ game.selectedTargetIds.length }}）
      <button type="button" class="btn-link" @click="game.cancelTargeting">取消</button>
    </p>

    <section v-if="game.phase === 'combat'" class="hand-dock">
      <div class="hand-wrap">
        <div class="hand-meta">
          <p class="hand-count">手牌 {{ handCards.length }} / 10</p>
          <button
            class="btn btn-primary end-turn"
            type="button"
            :disabled="fxLocked"
            @click="endTurn"
          >
            结束回合
          </button>
        </div>
        <div class="hand" :style="handStyle">
          <GameCard
            v-for="(card, i) in handCards"
            :key="card.uid"
            :card="card"
            :playable="!fxLocked && game.canPlay(card)"
            :disabled="fxLocked || !game.canPlay(card)"
            :class="{ armed: game.pendingCardUid === card.uid }"
            :style="{ zIndex: i + 1 }"
            @select="playCard(card)"
          />
        </div>
      </div>
    </section>

    <section v-else-if="game.phase === 'shop'" class="hand-dock rest-dock">
      <div class="hand-wrap">
        <p class="hand-count">我的卡组 {{ restCards.length }} 张 · 进入下一层将按此上手</p>
        <div class="hand" :style="restHandStyle">
          <GameCard
            v-for="(card, i) in restCards"
            :key="card.uid"
            :card="card"
            :disabled="true"
            :style="{ zIndex: i + 1 }"
          />
        </div>
      </div>
      <div class="between-actions">
        <p>可继续购买卡牌并合成，准备妥当后进入下一层。</p>
        <button class="btn btn-primary" type="button" @click="game.nextFloor">
          前往第 {{ game.floor + 1 }} 层
        </button>
      </div>
    </section>

    <div
      v-if="shopOpen || game.phase === 'shop'"
      class="shop-overlay"
      @click.self="shopOpen = false"
    >
      <div class="shop-sheet">
        <button
          v-if="game.phase !== 'shop'"
          class="shop-close"
          type="button"
          @click="shopOpen = false"
        >
          关闭
        </button>
        <ShopPanel
          :shop="game.shop"
          :gold="game.gold"
          :reroll-cost="rerollCost"
          :disabled="game.phase !== 'combat' && game.phase !== 'shop'"
          :shop-locked="game.shopLocked"
          @buy="game.buyCard"
          @reroll="game.rerollShop"
          @merge="game.toggleMergePanel(true)"
          @toggle-lock="game.toggleShopLock"
        />
      </div>
    </div>

    <TreasurePick
      v-if="game.phase === 'treasure'"
      :offers="game.treasureOffers"
      @pick="game.pickTreasure"
      @skip="game.skipTreasure"
    />

    <div v-if="game.phase === 'victory' || game.phase === 'defeat'" class="result-overlay">
      <div class="result panel fade-up">
        <h2>{{ game.phase === 'victory' ? '凯旋' : '陨落' }}</h2>
        <p>
          {{
            game.phase === 'victory'
              ? '你以一人之力斩尽鬼域。新的职业或许已经解锁。'
              : `你在第 ${game.floor} 层倒下。再试一次，积攒解锁进度。`
          }}
        </p>
        <div class="result-actions">
          <RouterLink class="btn btn-primary" to="/class">再选职业</RouterLink>
          <RouterLink class="btn btn-ghost dark" to="/">返回首页</RouterLink>
        </div>
      </div>
    </div>

    <MergeModal
      v-if="game.showMerge"
      :progress="game.mergeProgress"
      :deck="game.deck"
      @close="game.toggleMergePanel(false)"
      @merge="(cardId, star) => game.manualMerge(cardId, star)"
    />

    <div v-if="game.mergeToast" class="merge-toast">{{ game.mergeToast }}</div>
  </main>

  <main v-else class="arena-page fallback-page">
    <p class="fallback">尚未开始征途，<RouterLink to="/class">选择职业</RouterLink></p>
  </main>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useGameStore } from '@/stores/game'
import RelicBar from '@/components/RelicBar.vue'
import ShopPanel from '@/components/ShopPanel.vue'
import GameCard from '@/components/GameCard.vue'
import MergeModal from '@/components/MergeModal.vue'
import TreasurePick from '@/components/TreasurePick.vue'
import PixelActor from '@/components/PixelActor.vue'
import VfxHost from '@/components/VfxHost.vue'
import { CARD_POOL, FLOORS_TO_WIN, getCardDesc, getCardTargetCount } from '@/data/gameData'
import { classActorKind } from '@/data/actorSprites'
import { getCardVfx, vfxImpactDelay, vfxPlayDuration } from '@/data/vfx'

const game = useGameStore()
const ready = computed(() => !!game.classId)

const logCollapsed = ref(true)
const shopOpen = ref(false)
const fxLocked = ref(false)
const heroAnim = ref('idle')
const heroFx = ref([])
const enemyAnim = reactive({})
const enemyFx = reactive({})
let fxSeq = 1

const heroSize = 168
const heroKind = computed(() => classActorKind(game.classId))
const heroLabel = computed(() => {
  const cls = game.classInfo
  return cls ? `${cls.name} · ${cls.title}` : '斩鬼'
})

const targeting = computed(() => !!game.pendingCardUid && game.phase === 'combat')
const playerHpPct = computed(() => Math.max(0, Math.min(100, (game.hp / game.maxHp) * 100)))
const rerollCost = computed(() => 3 + game.floor)
const totalFloors = FLOORS_TO_WIN
const floorProgressPct = computed(() => {
  if (totalFloors <= 1) return 100
  const step = Math.max(0, Math.min(game.floor - 1, totalFloors - 1))
  return (step / (totalFloors - 1)) * 100
})

const incomePreview = computed(() => {
  const mods = game.relicMods
  return (
    Math.max(0, game.goldPerTurn + (mods.goldPerTurn || 0)) +
    Math.floor((game.floor - 1) / 2) * 2 +
    (mods.turnStartGold || 0)
  )
})

const handCards = computed(() =>
  game.hand.map((c) => ({
    ...c,
    desc: getCardDesc(CARD_POOL[c.cardId], c.star),
  })),
)

const restCards = computed(() =>
  game.deck.map((c) => ({
    ...c,
    desc: getCardDesc(CARD_POOL[c.cardId], c.star),
  })),
)

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

const handStyle = computed(() => handLayoutStyle(handCards.value.length))
const restHandStyle = computed(() => handLayoutStyle(restCards.value.length))

function enemySize(e) {
  if (e.boss) return 168
  if (e.elite) return 144
  return 116
}

function hpPct(e) {
  if (!e?.maxHp) return 0
  return Math.max(0, Math.min(100, (e.hp / e.maxHp) * 100))
}

function intentLabel(e) {
  if (e.intent === 'burn') return `意图：灼烧 ${e.damage}`
  let dmg = e.damage
  if (e.intent === 'boss' && game.turn % 3 === 0) dmg = Math.round(dmg * 1.4)
  const weakened = Math.max(1, dmg - (e.weaken || 0))
  return `意图：攻击 ${weakened}`
}

function enemyAnimOf(e) {
  if (e.hp <= 0) return 'die'
  return enemyAnim[e.uid] || 'idle'
}

function enemyFxOf(uid) {
  return enemyFx[uid] || []
}

function ensureEnemyFx(uid) {
  if (!enemyFx[uid]) enemyFx[uid] = []
  if (!enemyAnim[uid]) enemyAnim[uid] = 'idle'
}

function spawnHeroFx(tag, ult) {
  heroFx.value = [...heroFx.value, { id: fxSeq++, tag, ult }]
}

function spawnEnemyFx(uid, tag, ult) {
  ensureEnemyFx(uid)
  enemyFx[uid] = [...enemyFx[uid], { id: fxSeq++, tag, ult }]
}

function onHeroFxEnded(id) {
  heroFx.value = heroFx.value.filter((item) => item.id !== id)
}

function onEnemyFxEnded(uid, id) {
  if (!enemyFx[uid]) return
  enemyFx[uid] = enemyFx[uid].filter((item) => item.id !== id)
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function playCombatFx(card, targetIds) {
  const tpl = CARD_POOL[card.cardId]
  const isAttack = tpl.type === 'attack' || tpl.base?.damage || tpl.base?.burn
  heroAnim.value = isAttack ? 'attack' : tpl.base?.block ? 'guard' : 'cast'

  const ult = Number(card.star) >= 3
  const spec = getCardVfx(card.cardId)
  for (const tag of spec.hero) spawnHeroFx(tag, ult)

  const delay = vfxImpactDelay(card.cardId)
  if (delay) await wait(delay)

  for (const uid of targetIds) {
    const e = game.enemies.find((x) => x.uid === uid)
    if (!e) continue
    ensureEnemyFx(uid)
    for (const tag of spec.targets) spawnEnemyFx(uid, tag, ult)
    enemyAnim[uid] = e.hp > 0 ? 'hurt' : 'die'
  }

  const remain = Math.max(180, vfxPlayDuration(card.cardId, card.star) - delay)
  await wait(remain)

  heroAnim.value = game.hp <= 0 ? 'die' : 'idle'
  for (const uid of targetIds) {
    const e = game.enemies.find((x) => x.uid === uid)
    enemyAnim[uid] = !e || e.hp <= 0 ? 'die' : 'idle'
  }
}

async function playCard(card) {
  if (fxLocked.value || !game.canPlay(card)) return

  const tpl = CARD_POOL[card.cardId]
  const need = getCardTargetCount(tpl)
  const living = game.livingEnemies

  // 多目标点选：交给 store，确认后再播特效
  if (need > 0 && living.length > 1) {
    if (game.pendingCardUid === card.uid) {
      game.cancelTargeting()
      return
    }
    game.playCard(card.uid)
    return
  }

  const targets = need > 0 && living.length === 1 ? [living[0].uid] : []
  fxLocked.value = true
  try {
    game.playCard(card.uid)
    await playCombatFx(card, targets)
  } finally {
    fxLocked.value = false
    if (game.phase === 'shop') shopOpen.value = true
  }
}

async function onEnemyClick(e) {
  if (!game.pendingCardUid || e.hp <= 0 || fxLocked.value || game.phase !== 'combat') return

  const card = game.hand.find((c) => c.uid === game.pendingCardUid)
  if (!card) return

  const need = Math.min(game.targetingNeed, game.livingEnemies.length)
  const selected = [...game.selectedTargetIds]
  const already = selected.includes(e.uid)
  const willConfirm = !already && selected.length + 1 >= need

  if (willConfirm) {
    const targets = [...selected, e.uid]
    fxLocked.value = true
    try {
      game.toggleTarget(e.uid)
      await playCombatFx(card, targets)
    } finally {
      fxLocked.value = false
      if (game.phase === 'shop') shopOpen.value = true
    }
    return
  }

  game.toggleTarget(e.uid)
}

async function endTurn() {
  if (fxLocked.value || game.phase !== 'combat') return
  fxLocked.value = true
  try {
    const attackers = [...game.livingEnemies]
    for (const e of attackers) {
      ensureEnemyFx(e.uid)
      enemyAnim[e.uid] = 'attack'
      await wait(160)
    }
    game.endTurn()
    heroAnim.value = game.hp <= 0 ? 'die' : 'hurt'
    await wait(280)
    heroAnim.value = game.hp <= 0 ? 'die' : 'idle'
    for (const e of attackers) {
      enemyAnim[e.uid] = 'idle'
    }
    // 回合结束：战斗中刷新市集后弹出；清场进休整时也弹出
    if (game.phase === 'combat' || game.phase === 'shop') {
      shopOpen.value = true
    }
  } finally {
    fxLocked.value = false
  }
}

watch(
  () => game.enemies.map((e) => `${e.uid}:${e.hp}`).join('|'),
  () => {
    for (const e of game.enemies) {
      ensureEnemyFx(e.uid)
      if (e.hp <= 0) enemyAnim[e.uid] = 'die'
      else if (enemyAnim[e.uid] === 'die') enemyAnim[e.uid] = 'idle'
    }
  },
  { immediate: true },
)

watch(
  () => game.phase,
  (phase) => {
    if (phase === 'shop') shopOpen.value = true
    if (phase === 'combat') shopOpen.value = false
    if (phase === 'defeat') heroAnim.value = 'die'
  },
)
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
  background-color: #14100c;
  background-image: url('/assets/ui/bg-battle.png');
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}

.arena-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(8, 5, 3, 0.42) 0%, transparent 18%, transparent 72%, rgba(8, 5, 3, 0.5) 100%),
    radial-gradient(ellipse 92% 72% at 50% 50%, transparent 36%, rgba(8, 5, 3, 0.38) 100%);
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
  opacity: 0.12;
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
  font-size: 0.82rem;
}

.hud-floorblock {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1 1 320px;
  max-width: 520px;
}

.px-floornav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0;
  padding: 4px 2px;
  width: 100%;
}

.px-floortrack {
  position: absolute;
  left: 14px;
  right: 14px;
  top: 50%;
  height: 2px;
  transform: translateY(-50%);
  background: rgba(217, 203, 179, 0.14);
  z-index: 1;
  border-radius: 1px;
  pointer-events: none;
}

.px-floorfill {
  height: 100%;
  background: linear-gradient(90deg, rgba(61, 107, 79, 0.9), rgba(201, 162, 39, 0.75));
  border-radius: 1px;
  box-shadow: 0 0 6px rgba(201, 162, 39, 0.28);
}

.px-fnode {
  position: relative;
  z-index: 2;
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: rgba(217, 203, 179, 0.38);
  background: rgba(18, 13, 10, 0.88);
  border: 1.5px solid rgba(217, 203, 179, 0.2);
  border-radius: 50%;
  flex-shrink: 0;
}

.px-fnode.passed {
  color: rgba(236, 224, 200, 0.92);
  background: rgba(45, 78, 58, 0.72);
  border-color: rgba(90, 140, 110, 0.75);
}

.px-fnode.current {
  width: 30px;
  height: 30px;
  color: var(--paper);
  background: linear-gradient(160deg, #c45c3a 0%, #9b2d1f 70%);
  border: 2px solid var(--gold);
  box-shadow:
    0 0 0 1px rgba(201, 162, 39, 0.25),
    0 0 12px rgba(155, 45, 31, 0.5);
  font-weight: 700;
}

.px-fnode.elite {
  border-color: rgba(201, 162, 39, 0.55);
  color: var(--gold);
  background: rgba(18, 13, 10, 0.92);
}

.px-fnode.elite.passed {
  color: #e8d08a;
  background: rgba(90, 70, 24, 0.55);
  border-color: rgba(201, 162, 39, 0.7);
}

.px-fnode.elite.current {
  color: var(--paper);
  background: linear-gradient(160deg, #c45c3a 0%, #9b2d1f 70%);
  border-color: var(--gold);
}

.px-fnode.boss {
  width: 28px;
  height: 28px;
  border-color: rgba(155, 45, 31, 0.75);
  color: #e8b4a8;
  background: rgba(40, 14, 12, 0.9);
}

.px-fnode.boss.current {
  width: 30px;
  height: 30px;
  color: var(--paper);
  background: linear-gradient(160deg, #c45c3a 0%, #9b2d1f 70%);
  border-color: var(--gold);
}

.hud-chips {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  align-items: stretch;
}

.pxchip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px 6px 6px;
  background: rgba(16, 11, 8, 0.82);
  border: 1px solid rgba(217, 203, 179, 0.22);
  border-radius: 4px;
  min-width: 96px;
  min-height: 40px;
  box-sizing: border-box;
}

.pxchip-ico {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.8rem;
  color: var(--paper);
  border-radius: 3px;
  flex-shrink: 0;
}

.pxchip.gold .pxchip-ico {
  background: linear-gradient(145deg, #d4b03a, #8a6a12);
  color: #1c1712;
}

.pxchip.energy .pxchip-ico {
  background: linear-gradient(145deg, #4a88b0, #1f3a5a);
}

.pxchip.deck .pxchip-ico {
  background: linear-gradient(145deg, #6a4a32, #3a2418);
}

.pxchip-val {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  min-width: 0;
}

.pxchip-val strong {
  font-family: var(--font-display);
  font-size: 1.05rem;
  color: var(--paper);
  line-height: 1;
}

.pxchip.gold .pxchip-val strong {
  color: var(--gold);
}

.pxchip-val small {
  font-size: 0.68rem;
  line-height: 1.1;
  color: rgba(217, 203, 179, 0.62);
  white-space: nowrap;
}

.px-energydots {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 11px;
}

.px-energydots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(12, 8, 5, 0.95);
  border: 1.5px solid rgba(90, 130, 160, 0.4);
  box-sizing: border-box;
}

.px-energydots span.on {
  background: radial-gradient(circle at 35% 30%, #9ad4f0, #2a6a9a 70%);
  border-color: #7ab8d8;
  box-shadow: 0 0 6px rgba(106, 168, 204, 0.65);
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
  min-height: min(52vh, 480px);
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

.rest-note {
  color: rgba(217, 203, 179, 0.82);
}

.rest-note strong {
  display: block;
  margin-bottom: 6px;
  font-family: var(--font-display);
  letter-spacing: 0.1em;
}

.rest-note p {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.4;
  color: rgba(217, 203, 179, 0.7);
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
  overflow: visible;
}

.hero-slot {
  position: absolute;
  left: 300px;
  bottom: 20px;
  width: 168px;
  height: 168px;
  overflow: visible;
}

.enemy-sprites {
  position: absolute;
  right: 200px;
  bottom: 20px;
  display: flex;
  align-items: flex-end;
  gap: 10px;
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

.rest-dock {
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.between-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(217, 203, 179, 0.78);
  font-size: 0.88rem;
}

.between-actions p {
  margin: 0;
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

.result-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgba(8, 5, 3, 0.72);
}

.result {
  width: min(420px, 90vw);
  padding: 28px 24px;
  text-align: center;
}

.result h2 {
  margin: 0 0 10px;
  font-family: var(--font-display);
  letter-spacing: 0.14em;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 18px;
}

.merge-toast {
  position: fixed;
  left: 50%;
  bottom: 190px;
  z-index: 45;
  transform: translateX(-50%);
  padding: 8px 14px;
  background: rgba(16, 11, 8, 0.92);
  border: 1px solid rgba(201, 162, 39, 0.45);
  color: var(--gold);
  letter-spacing: 0.08em;
}

.fallback-page {
  display: grid;
  place-items: center;
}

.fallback {
  position: relative;
  z-index: 2;
  color: var(--paper);
}

.fallback a {
  color: var(--gold);
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
