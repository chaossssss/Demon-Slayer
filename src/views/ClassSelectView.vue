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
        <div v-if="selected === cls.id && cls.unlocked" class="select-fx" aria-hidden="true">
          <span class="select-stamp">选</span>
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
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.28s ease,
    box-shadow 0.35s ease,
    filter 0.25s ease;
}

.class-card:hover:not(:disabled):not(.selected) {
  transform: translateY(-4px);
}

.class-card.selected {
  z-index: 2;
  border-color: var(--accent);
  transform: translateY(-10px) scale(1.035);
  box-shadow:
    0 0 0 2px color-mix(in srgb, var(--accent) 85%, #fff 15%),
    0 18px 36px rgba(12, 8, 5, 0.5),
    0 0 22px color-mix(in srgb, var(--accent) 60%, transparent),
    0 0 48px color-mix(in srgb, var(--accent) 32%, transparent);
  filter: brightness(1.06);
}

.class-card.selected:hover:not(:disabled) {
  transform: translateY(-12px) scale(1.04);
}

.select-fx {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--accent) 30%, transparent), transparent 34%),
    linear-gradient(0deg, color-mix(in srgb, var(--accent) 22%, transparent), transparent 28%);
  box-shadow: inset 0 0 0 3px color-mix(in srgb, var(--accent) 72%, #f0e0b0 28%);
  animation: selectWash 0.45s ease both;
}

.select-fx::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    transparent 28%,
    rgba(255, 244, 214, 0.38) 48%,
    transparent 68%
  );
  transform: translateX(-140%);
  animation: selectSheen 0.7s ease 0.08s both;
}

.select-fx::after {
  content: '';
  position: absolute;
  inset: 8px;
  border: 1px solid color-mix(in srgb, var(--accent) 45%, #f0e0b0);
  opacity: 0.45;
  animation: selectRim 2.2s ease-in-out 0.4s infinite;
}

.select-stamp {
  position: absolute;
  top: 3.2%;
  right: 4.2%;
  width: 2.15em;
  height: 2.15em;
  display: grid;
  place-items: center;
  border: 2px solid var(--accent);
  border-radius: 50%;
  color: #f3e2b0;
  background: color-mix(in srgb, var(--accent) 78%, #1c120c);
  font-family: var(--font-display);
  font-size: clamp(0.95rem, 1.35vw, 1.15rem);
  letter-spacing: 0.08em;
  text-indent: 0.08em;
  box-shadow:
    0 0 0 1px rgba(12, 8, 5, 0.35),
    0 0 14px color-mix(in srgb, var(--accent) 55%, transparent);
  transform: rotate(14deg) scale(0.4);
  animation: stampIn 0.42s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
}

@keyframes selectWash {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes selectSheen {
  from {
    transform: translateX(-140%);
  }
  to {
    transform: translateX(140%);
  }
}

@keyframes selectRim {
  0%,
  100% {
    opacity: 0.28;
    box-shadow: inset 0 0 0 0 transparent;
  }
  50% {
    opacity: 0.7;
    box-shadow: inset 0 0 18px color-mix(in srgb, var(--accent) 35%, transparent);
  }
}

@keyframes stampIn {
  from {
    opacity: 0;
    transform: rotate(14deg) scale(0.4);
  }
  to {
    opacity: 1;
    transform: rotate(14deg) scale(1);
  }
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
