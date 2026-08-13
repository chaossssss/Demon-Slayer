<template>
  <div class="hud panel">
    <div class="identity">
      <span class="class-name" :style="{ color: classColor }">{{ className }}</span>
      <span class="meta">第 {{ floor }} 层 · 回合 {{ turn }}</span>
    </div>

    <div class="meters">
      <div class="meter">
        <div class="meter-label">
          <span>生命</span>
          <span>{{ hp }} / {{ maxHp }}<template v-if="block">（护甲 {{ block }}）</template></span>
        </div>
        <div class="bar-track">
          <div class="bar-fill hp" :style="{ width: hpPct + '%' }" />
        </div>
      </div>
    </div>

    <div class="resources">
      <div class="chip gold">
        <span class="icon">金</span>
        <strong>{{ gold }}</strong>
        <small>+{{ goldPerTurn }}/回合</small>
      </div>
      <div class="chip energy">
        <span class="icon">能</span>
        <strong>{{ energy }} / {{ maxEnergy }}</strong>
      </div>
      <div class="chip deck">
        <span class="icon">牌</span>
        <strong>{{ deckCount }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  className: String,
  classColor: String,
  floor: Number,
  turn: Number,
  hp: Number,
  maxHp: Number,
  block: Number,
  gold: Number,
  goldPerTurn: Number,
  energy: Number,
  maxEnergy: Number,
  deckCount: Number,
})

const hpPct = computed(() => Math.max(0, Math.min(100, (props.hp / props.maxHp) * 100)))
</script>

<style scoped>
.hud {
  display: grid;
  grid-template-columns: 1.1fr 1.4fr 1.2fr;
  gap: 20px;
  padding: 16px 22px;
  align-items: center;
}

.identity {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.class-name {
  font-family: var(--font-display);
  font-size: 1.45rem;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.meta {
  color: var(--ink-soft);
  letter-spacing: 0.08em;
}

.meter-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.resources {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.chip {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(28, 23, 18, 0.08);
  border: 1px solid var(--line);
  min-width: 92px;
}

.chip .icon {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  font-size: 0.75rem;
  background: var(--ink);
  color: var(--paper);
}

.chip.gold strong {
  color: #8a6a12;
}

.chip.energy strong {
  color: #2a4a6b;
}

.chip small {
  color: var(--ink-soft);
  font-size: 0.75rem;
}

@media (max-width: 960px) {
  .hud {
    grid-template-columns: 1fr;
  }
  .resources {
    justify-content: flex-start;
  }
}
</style>
