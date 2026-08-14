<template>
  <div v-if="treasures.length" class="relic-bar panel">
    <span class="label">宝物</span>
    <div class="list">
      <div
        v-for="t in treasures"
        :key="t.id"
        class="relic"
        :class="`tier-${t.tier}`"
        :title="`${t.name}：${t.desc}`"
      >
        <span class="icon">{{ t.icon }}</span>
        <span class="name">{{ t.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  treasures: { type: Array, default: () => [] },
})
</script>

<style scoped>
.relic-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding: 10px 14px;
  overflow-x: auto;
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
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 4px;
  background: rgba(28, 23, 18, 0.06);
  border: 1px solid var(--line);
  font-size: 0.85rem;
  letter-spacing: 0.04em;
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
</style>
