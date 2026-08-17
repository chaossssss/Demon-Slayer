<template>
  <div v-if="treasures.length" class="relic-bar panel">
    <span class="label">宝物</span>
    <div class="list">
      <div
        v-for="t in treasures"
        :key="t.id"
        class="relic"
        :class="[`tier-${t.tier}`, { mixed: isMixed(t) }]"
      >
        <span class="icon">{{ t.icon }}</span>
        <span class="name">{{ t.name }}</span>

        <div class="tip" role="tooltip">
          <div class="tip-head">
            <strong>{{ t.name }}</strong>
            <span class="tip-tier">{{ tierName(t.tier) }}</span>
          </div>
          <p class="tip-desc">{{ t.desc }}</p>
          <ul v-if="effectLines(t).length" class="tip-effects">
            <li
              v-for="(line, i) in effectLines(t)"
              :key="i"
              :class="lineClass(line)"
            >
              {{ line }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TREASURE_TIERS, isMixedTreasure, summarizeEffects } from '@/data/treasures'

defineProps({
  treasures: { type: Array, default: () => [] },
})

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
.relic-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding: 10px 14px;
  overflow: visible;
}

.label {
  flex-shrink: 0;
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  color: var(--ink-soft);
}

.list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.relic {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 4px;
  background: rgba(28, 23, 18, 0.06);
  border: 1px solid var(--line);
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  cursor: help;
}

.relic .icon {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  background: var(--ink);
  color: var(--paper);
  font-size: 0.7rem;
}

.relic.tier-rare {
  border-color: rgba(138, 106, 18, 0.5);
}

.relic.tier-cursed {
  border-color: rgba(155, 45, 31, 0.55);
}

.relic.tier-uncommon {
  border-color: rgba(61, 107, 79, 0.45);
}

.relic.mixed {
  border-style: dashed;
}

.tip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  transform: translateX(-50%) translateY(4px);
  z-index: 60;
  width: max-content;
  max-width: min(280px, 70vw);
  padding: 10px 12px;
  color: var(--paper);
  background: linear-gradient(165deg, #3a2a22 0%, #1f1712 100%);
  border: 1px solid rgba(232, 213, 163, 0.35);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
}

.tip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #1f1712;
}

.relic:hover .tip,
.relic:focus-within .tip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.tip-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}

.tip-head strong {
  font-family: var(--font-display);
  letter-spacing: 0.08em;
  font-size: 0.98rem;
}

.tip-tier {
  flex-shrink: 0;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: rgba(232, 213, 163, 0.7);
}

.tier-common .tip-tier {
  color: #9aa3ad;
}

.tier-uncommon .tip-tier {
  color: #7da88a;
}

.tier-rare .tip-tier {
  color: var(--gold);
}

.tier-cursed .tip-tier {
  color: #e08a7a;
}

.tip-desc {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.45;
  color: rgba(232, 213, 163, 0.88);
}

.tip-effects {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.tip-effects li {
  font-size: 0.78rem;
  letter-spacing: 0.04em;
}

.tip-effects .pos {
  color: #8fbf8a;
}

.tip-effects .neg {
  color: #e08a7a;
}
</style>
