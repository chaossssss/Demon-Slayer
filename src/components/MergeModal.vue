<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal panel fade-up">
      <header>
        <h2>卡组合成</h2>
        <button class="close" @click="$emit('close')">×</button>
      </header>
      <p class="hint">收集 3 张同名同星卡牌可合成更高星级（最高 3 星）。购买后若满足条件会自动合成。</p>

      <div v-if="groups.length" class="groups">
        <div v-for="g in groups" :key="g.key" class="group">
          <div>
            <strong>{{ '★'.repeat(g.star) }}{{ g.name }}</strong>
            <span>{{ g.count }} / 3</span>
          </div>
          <button class="btn btn-primary" @click="$emit('merge', g.cardId, g.star)">合成 → {{ '★'.repeat(g.star + 1) }}</button>
        </div>
      </div>
      <p v-else class="empty">暂无可以合成的卡组</p>

      <div class="deck-list">
        <h3>当前卡组（{{ deck.length }}）</h3>
        <ul>
          <li v-for="c in sortedDeck" :key="c.uid">
            <span class="stars">{{ '★'.repeat(c.star) }}</span>
            {{ c.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  groups: { type: Array, default: () => [] },
  deck: { type: Array, default: () => [] },
})

defineEmits(['close', 'merge'])

const sortedDeck = computed(() =>
  [...props.deck].sort((a, b) => b.star - a.star || a.name.localeCompare(b.name, 'zh')),
)
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(12, 8, 5, 0.72);
  display: grid;
  place-items: center;
  padding: 24px;
}

.modal {
  width: min(560px, 100%);
  max-height: 85vh;
  overflow: auto;
  padding: 22px 24px 28px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h2 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.1em;
}

.close {
  font-size: 1.8rem;
  line-height: 1;
  color: var(--ink-soft);
}

.hint {
  color: var(--ink-soft);
  line-height: 1.5;
}

.groups {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 16px 0;
}

.group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(28, 23, 18, 0.06);
  border: 1px solid var(--line);
}

.group span {
  margin-left: 10px;
  color: var(--ink-soft);
}

.empty {
  color: var(--ink-soft);
}

.deck-list h3 {
  margin: 18px 0 8px;
  font-size: 1rem;
  letter-spacing: 0.08em;
}

.deck-list ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 16px;
}

.deck-list li {
  padding: 6px 0;
  border-bottom: 1px dashed var(--line);
}

.stars {
  color: #8a6a12;
  margin-right: 4px;
}
</style>
