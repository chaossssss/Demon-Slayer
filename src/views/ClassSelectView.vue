<template>
  <main class="view class-select">
    <header class="top fade-up">
      <RouterLink class="back" to="/">← 返回</RouterLink>
      <h1 class="brand">选择职业</h1>
      <p>最初只有剑士可出征，其余职业随战绩解锁。</p>
    </header>

    <div class="grid">
      <button
        v-for="(cls, i) in progress.classes"
        :key="cls.id"
        class="class-card fade-up"
        :class="{ locked: !cls.unlocked, selected: selected === cls.id }"
        :style="{
          animationDelay: `${i * 0.08}s`,
          '--accent': cls.color,
          backgroundImage: `url(${CLASS_ART[cls.id]})`,
        }"
        :disabled="!cls.unlocked"
        @click="selected = cls.id"
      >
        <div class="meta">
          <h2>{{ cls.name }}</h2>
          <ul class="stats" aria-label="职业属性">
            <li
              v-for="(stat, si) in statsOf(cls)"
              :key="si"
              :style="{ top: STAT_TOPS[si] }"
            >
              <span class="val">{{ stat }}</span>
            </li>
          </ul>
        </div>
        <div class="lock" v-if="!cls.unlocked">
          <span class="lock-ico" aria-hidden="true">锁</span>
          <span>{{ cls.unlockHint }}</span>
        </div>
      </button>
    </div>

    <div class="footer fade-up" style="animation-delay: 0.25s">
      <button class="btn btn-primary" :disabled="!selected" @click="start">踏入鬼域</button>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useProgressStore } from '@/stores/progress'
import { useGameStore } from '@/stores/game'
import { CARD_POOL } from '@/data/gameData'
import artSwordsman from '@/assets/classes/swordsman.png'
import artMage from '@/assets/classes/mage.png'
import artAssassin from '@/assets/classes/assassin.png'
import artGuardian from '@/assets/classes/guardian.png'

const CLASS_ART = {
  swordsman: artSwordsman,
  mage: artMage,
  assassin: artAssassin,
  guardian: artGuardian,
}

/** 与卡面五图标中心对齐（相对卡高 %） */
const STAT_TOPS = ['65.2%', '71%', '76.4%', '82%', '88.1%']

const router = useRouter()
const progress = useProgressStore()
const game = useGameStore()
progress.checkUnlocks()

const selected = ref(progress.unlocked.includes('swordsman') ? 'swordsman' : progress.unlocked[0] || null)

/** 卡面下半 5 图标：生命 / 能量 / 起步金 / 攻参考 / 防参考 */
function statsOf(cls) {
  let atk = 0
  let block = 0
  for (const { cardId } of cls.starterDeck || []) {
    const base = CARD_POOL[cardId]?.base
    if (!base) continue
    if (!atk && base.damage) atk = base.damage
    if (!block && base.block) block = base.block
    if (atk && block) break
  }
  return [cls.maxHp, cls.energy, cls.startGold, atk, block]
}

function start() {
  if (!selected.value) return
  game.startRun(selected.value)
  router.push('/battle')
}
</script>

<style scoped>
.class-select {
  max-width: min(1520px, 96vw);
  margin: 0 auto;
  color: var(--paper);
}

.top {
  margin-bottom: 18px;
}

.back {
  color: rgba(217, 203, 179, 0.65);
  text-decoration: none;
  letter-spacing: 0.08em;
}

.back:hover {
  color: var(--paper);
}

.brand {
  margin: 10px 0 6px;
  font-size: clamp(2.2rem, 4.5vw, 3.1rem);
}

.top p {
  margin: 0;
  color: rgba(217, 203, 179, 0.7);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: stretch;
}

.class-card {
  position: relative;
  aspect-ratio: 2 / 3;
  width: 100%;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 0;
  background-color: transparent;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: none;
  overflow: hidden;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    filter 0.25s ease;
}

.class-card:hover:not(:disabled) {
  transform: translateY(-4px);
}

.class-card.selected {
  border-color: var(--accent);
  box-shadow: none;
}

.class-card.locked {
  filter: grayscale(0.85) brightness(0.72);
}

.meta {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

h2 {
  position: absolute;
  left: 10%;
  right: 10%;
  top: 53.8%;
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2vw, 1.3rem);
  letter-spacing: 0.28em;
  font-weight: 600;
  text-indent: 0.28em;
  text-align: center;
  color: #f0e0b0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.75);
}

.stats {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.stats li {
  position: absolute;
  /* 图标中心约 41%，数值统一落在其右侧同一竖线 */
  left: 50%;
  width: 2.6em;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.val {
  display: block;
  width: 2.4em;
  text-align: left;
  font-family: Consolas, "Segoe UI", ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
  font-size: clamp(1.05rem, 1.55vw, 1.4rem);
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1;
  color: #f3e2b0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.85);
}

.lock {
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: 3.5%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 2px;
  background: rgba(12, 8, 5, 0.72);
  border: 1px solid rgba(155, 45, 31, 0.45);
  color: #e8c4b8;
  font-size: 0.78rem;
  line-height: 1.3;
  text-align: center;
  pointer-events: none;
}

.lock-ico {
  flex-shrink: 0;
  width: 1.1em;
  height: 1.1em;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  border: 1px solid rgba(180, 160, 120, 0.55);
  border-radius: 2px;
  color: rgba(200, 180, 140, 0.9);
}

.footer {
  margin-top: 22px;
  display: flex;
  justify-content: center;
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 720px;
    margin: 0 auto;
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
    max-width: 360px;
  }
}
</style>
