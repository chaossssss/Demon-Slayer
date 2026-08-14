<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal panel fade-up">
      <header>
        <h2>卡组合成</h2>
        <button class="close" type="button" @click="$emit('close')">×</button>
      </header>
      <p class="hint">
        收集 <strong>3 张同名同星</strong> 可合成更高星（最高 3 星）。
        市集购买凑满 3 张同名同星时会自动合成；也可在此手动合成。
        <strong>三星卡解锁专属大招</strong>，打出时额外触发强力效果。
      </p>

      <div class="groups">
        <div
          v-for="g in progress"
          :key="g.key"
          class="group"
          :class="{ ready: g.count >= 3 }"
        >
          <div class="info">
            <strong>{{ '★'.repeat(g.star) }}{{ g.name }}</strong>
            <span class="count" :class="{ full: g.count >= 3 }">{{ Math.min(g.count, 3) }} / 3</span>
            <span v-if="g.count > 3" class="extra">（另有 {{ g.count - 3 }} 张可继续合成）</span>
          </div>
          <button
            class="btn btn-primary"
            type="button"
            :disabled="g.count < 3"
            @click="$emit('merge', g.cardId, g.star)"
          >
            合成 → {{ '★'.repeat(g.star + 1) }}
          </button>
        </div>
        <p v-if="!progress.length" class="empty">卡组中暂无未满星的卡牌</p>
      </div>

      <div class="deck-list">
        <h3>当前卡组（{{ deck.length }}）</h3>
        <ul>
          <li v-for="c in sortedDeck" :key="c.uid">
            <span class="stars">{{ '★'.repeat(c.star) }}</span>
            {{ c.name }}
            <span v-if="c.star >= 3 && ultimateOf(c)" class="ult-tag">大招·{{ ultimateOf(c) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CARD_POOL, MAX_STAR } from '@/data/gameData'

const props = defineProps({
  progress: { type: Array, default: () => [] },
  deck: { type: Array, default: () => [] },
})

defineEmits(['close', 'merge'])

const sortedDeck = computed(() =>
  [...props.deck].sort((a, b) => b.star - a.star || a.name.localeCompare(b.name, 'zh')),
)

function ultimateOf(card) {
  if (card.star < MAX_STAR) return ''
  return CARD_POOL[card.cardId]?.ultimate?.name || ''
}
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

.group.ready {
  border-color: rgba(155, 45, 31, 0.45);
  background: rgba(155, 45, 31, 0.08);
}

.info {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
}

.count {
  color: var(--ink-soft);
}

.count.full {
  color: var(--blood);
  font-weight: 700;
}

.extra {
  font-size: 0.85rem;
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

.ult-tag {
  margin-left: 6px;
  color: var(--blood);
  font-size: 0.82rem;
}
</style>
