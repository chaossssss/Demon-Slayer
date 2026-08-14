<template>
  <div class="overlay">
    <div class="panel fade-up">
      <header>
        <h2>散落宝物</h2>
        <p>三选一纳入囊中，也可放弃。咒物往往福祸相依。</p>
      </header>

      <div class="offers">
        <button
          v-for="t in offers"
          :key="t.id"
          type="button"
          class="treasure"
          :class="[`tier-${t.tier}`, { mixed: isMixed(t) }]"
          @click="$emit('pick', t.id)"
        >
          <div class="top">
            <span class="icon">{{ t.icon }}</span>
            <span class="tier">{{ tierName(t.tier) }}</span>
          </div>
          <h3>{{ t.name }}</h3>
          <p class="desc">{{ t.desc }}</p>
          <ul class="effects">
            <li v-for="(line, i) in effectLines(t)" :key="i" :class="lineClass(line)">{{ line }}</li>
          </ul>
        </button>
      </div>

      <button type="button" class="btn btn-ghost dark skip" @click="$emit('skip')">放弃宝物</button>
    </div>
  </div>
</template>

<script setup>
import { TREASURE_TIERS, isMixedTreasure, summarizeEffects } from '@/data/treasures'

defineProps({
  offers: { type: Array, default: () => [] },
})

defineEmits(['pick', 'skip'])

function tierName(tier) {
  return TREASURE_TIERS[tier]?.name || tier
}

function isMixed(t) {
  return isMixedTreasure(t)
}

function effectLines(t) {
  return summarizeEffects(t.effects)
}

function lineClass(line) {
  if (/失去|承伤|减少|-\d/.test(line) && !/\+\d/.test(line)) return 'neg'
  if (/价格 \+/.test(line)) return 'neg'
  if (/产金 -\d|护甲获取 -/.test(line)) return 'neg'
  return 'pos'
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 45;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(10, 7, 4, 0.78);
}

.panel {
  width: min(920px, 100%);
  padding: 24px 26px 28px;
  color: var(--ink);
  background: linear-gradient(180deg, rgba(217, 203, 179, 0.97), rgba(196, 179, 150, 0.94));
  border: 1px solid rgba(28, 23, 18, 0.25);
  box-shadow: var(--shadow);
}

header h2 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.14em;
  font-size: 1.6rem;
}

header p {
  margin: 8px 0 0;
  color: var(--ink-soft);
}

.offers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin: 22px 0 18px;
}

.treasure {
  text-align: left;
  padding: 16px;
  color: var(--ink);
  background: rgba(28, 23, 18, 0.05);
  border: 2px solid var(--line);
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.treasure:hover {
  transform: translateY(-4px);
  border-color: var(--ink);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.treasure.tier-common {
  border-color: rgba(92, 102, 112, 0.45);
}

.treasure.tier-uncommon {
  border-color: rgba(61, 107, 79, 0.55);
}

.treasure.tier-rare {
  border-color: rgba(138, 106, 18, 0.65);
}

.treasure.tier-cursed {
  border-color: rgba(155, 45, 31, 0.7);
  background: rgba(155, 45, 31, 0.08);
}

.treasure.mixed .tier {
  background: var(--blood);
  color: var(--paper);
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: var(--ink);
  color: var(--paper);
  font-size: 0.95rem;
  letter-spacing: 0.08em;
}

.tier {
  padding: 2px 8px;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  background: rgba(28, 23, 18, 0.1);
}

h3 {
  margin: 0 0 8px;
  font-family: var(--font-display);
  letter-spacing: 0.1em;
  font-size: 1.2rem;
}

.desc {
  margin: 0 0 12px;
  color: var(--ink-soft);
  line-height: 1.45;
  font-size: 0.92rem;
  min-height: 2.8em;
}

.effects {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
}

.effects .pos {
  color: #2f5a4a;
}

.effects .neg {
  color: var(--blood);
}

.skip {
  display: block;
  margin: 0 auto;
  color: var(--ink);
  border-color: rgba(28, 23, 18, 0.3);
}

.btn-ghost.dark:hover {
  background: rgba(28, 23, 18, 0.1);
}

@media (max-width: 800px) {
  .offers {
    grid-template-columns: 1fr;
  }
}
</style>
