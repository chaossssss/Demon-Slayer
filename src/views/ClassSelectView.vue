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
        :style="{ animationDelay: `${i * 0.08}s`, '--accent': cls.color }"
        :disabled="!cls.unlocked"
        @click="selected = cls.id"
      >
        <div class="mark" />
        <h2>{{ cls.name }}</h2>
        <p class="title">{{ cls.title }}</p>
        <p class="desc">{{ cls.desc }}</p>
        <ul>
          <li>生命 {{ cls.maxHp }}</li>
          <li>能量 {{ cls.energy }}</li>
          <li>起步金 {{ cls.startGold }}</li>
          <li>每回合 +{{ cls.goldPerTurn }} 金</li>
        </ul>
        <div class="lock" v-if="!cls.unlocked">{{ cls.unlockHint }}</div>
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

const router = useRouter()
const progress = useProgressStore()
const game = useGameStore()
progress.checkUnlocks()

const selected = ref(progress.unlocked.includes('swordsman') ? 'swordsman' : progress.unlocked[0] || null)

function start() {
  if (!selected.value) return
  game.startRun(selected.value)
  router.push('/battle')
}
</script>

<style scoped>
.class-select {
  max-width: 1180px;
  margin: 0 auto;
  color: var(--paper);
}

.top {
  margin-bottom: 28px;
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
  margin: 12px 0 8px;
  font-size: clamp(2.4rem, 5vw, 3.4rem);
}

.top p {
  margin: 0;
  color: rgba(217, 203, 179, 0.7);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.class-card {
  position: relative;
  text-align: left;
  padding: 22px 18px 18px;
  color: var(--ink);
  background: linear-gradient(180deg, rgba(217, 203, 179, 0.96), rgba(196, 179, 150, 0.92));
  border: 2px solid transparent;
  box-shadow: var(--shadow);
  transition: transform 0.25s ease, border-color 0.25s ease;
  overflow: hidden;
}

.class-card:hover:not(:disabled) {
  transform: translateY(-6px);
}

.class-card.selected {
  border-color: var(--accent);
}

.class-card.locked {
  filter: grayscale(0.7);
  opacity: 0.72;
}

.mark {
  width: 42px;
  height: 6px;
  background: var(--accent);
  margin-bottom: 14px;
}

h2 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.14em;
  font-size: 1.6rem;
}

.title {
  margin: 4px 0 12px;
  color: var(--ink-soft);
  letter-spacing: 0.2em;
}

.desc {
  margin: 0 0 14px;
  line-height: 1.5;
  min-height: 3em;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--ink-soft);
}

.lock {
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px dashed var(--line);
  color: var(--blood);
  font-size: 0.88rem;
}

.footer {
  margin-top: 28px;
  display: flex;
  justify-content: center;
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
