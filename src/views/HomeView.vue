<template>
  <main class="view home">
    <section class="hero fade-up">
      <p class="eyebrow">PC · 回合制卡牌</p>
      <h1 class="brand">斩鬼录</h1>
      <p class="tagline">购卡、合成、出招——在十层鬼域中杀出一条生路。</p>
      <div class="cta">
        <RouterLink class="btn btn-primary" to="/class">开始征途</RouterLink>
      </div>
      <ul class="stats" v-if="progress.totalRuns">
        <li>通关 {{ progress.wins }} 次</li>
        <li>最高抵达第 {{ progress.bestFloor }} 层</li>
        <li>已解锁 {{ progress.unlocked.length }} 个职业</li>
      </ul>
    </section>

    <section class="rules fade-up" style="animation-delay: 0.12s">
      <h2>核心规则</h2>
      <ol>
        <li>初始仅解锁<strong>剑士</strong>，通关与推进层数可解锁更多职业。</li>
        <li>每回合自动获得金币，并刷新 3 张可购卡牌。</li>
        <li>同名同星卡牌集齐 3 张可合成升星，最高 3 星。</li>
        <li>打出卡牌消耗能量；结束回合后敌人行动。</li>
      </ol>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useProgressStore } from '@/stores/progress'

const progress = useProgressStore()
progress.checkUnlocks()
</script>

<style scoped>
.home {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 48px;
  align-items: center;
  align-content: center;
  max-width: 1180px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
  padding-top: 0;
  box-sizing: border-box;
}

.hero {
  color: var(--paper);
  max-width: 640px;
}

.eyebrow {
  margin: 0 0 12px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(217, 203, 179, 0.55);
  font-size: 0.85rem;
}

.brand {
  font-size: clamp(4rem, 9vw, 7rem);
  line-height: 0.95;
  color: var(--paper);
  text-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
}

.tagline {
  margin: 22px 0 32px;
  font-size: 1.25rem;
  line-height: 1.6;
  color: rgba(217, 203, 179, 0.82);
  max-width: 28em;
}

.cta {
  display: flex;
  gap: 14px;
}

.stats {
  display: flex;
  gap: 18px;
  margin: 36px 0 0;
  padding: 0;
  list-style: none;
  color: rgba(217, 203, 179, 0.6);
  letter-spacing: 0.06em;
}

.rules {
  padding: 28px;
  color: var(--ink);
  background: linear-gradient(180deg, rgba(217, 203, 179, 0.94), rgba(196, 179, 150, 0.9));
  border: 1px solid rgba(28, 23, 18, 0.25);
  box-shadow: var(--shadow);
}

.rules h2 {
  margin: 0 0 14px;
  font-family: var(--font-display);
  letter-spacing: 0.14em;
}

.rules ol {
  margin: 0;
  padding-left: 1.2em;
  line-height: 1.8;
  color: var(--ink-soft);
}

.rules strong {
  color: var(--blood);
}

@media (max-width: 900px) {
  .home {
    grid-template-columns: 1fr;
    min-height: calc(100vh - 64px);
  }
}
</style>
