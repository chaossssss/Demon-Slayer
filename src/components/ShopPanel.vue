<template>
  <aside class="shop panel">
    <header>
      <h2>卡牌市集</h2>
      <p>每回合自动刷新 · 三张同名同星可合成升星（最高 ★★★）</p>
    </header>

    <div class="offers">
      <GameCard
        v-for="offer in shop"
        :key="offer.offerId"
        :card="offer"
        :price="offer.price"
        :disabled="gold < offer.price || locked"
        @select="$emit('buy', offer.offerId)"
      />
      <p v-if="!shop.length" class="empty">本回合货架已空</p>
    </div>

    <div class="actions">
      <button class="btn btn-ghost dark" :disabled="locked || gold < rerollCost" @click="$emit('reroll')">
        刷新（{{ rerollCost }}金）
      </button>
      <button class="btn btn-ghost dark" @click="$emit('merge')">合成一览</button>
    </div>
  </aside>
</template>

<script setup>
import GameCard from './GameCard.vue'

defineProps({
  shop: { type: Array, default: () => [] },
  gold: Number,
  rerollCost: Number,
  locked: Boolean,
})

defineEmits(['buy', 'reroll', 'merge'])
</script>

<style scoped>
.shop {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 320px;
}

header h2 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  font-size: 1.25rem;
}

header p {
  margin: 6px 0 0;
  color: var(--ink-soft);
  font-size: 0.9rem;
}

.offers {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 220px;
  align-items: flex-start;
}

.empty {
  color: var(--ink-soft);
  margin: 40px auto;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-ghost.dark {
  color: var(--ink);
  border-color: rgba(28, 23, 18, 0.3);
  background: rgba(28, 23, 18, 0.06);
}

.btn-ghost.dark:hover {
  background: rgba(28, 23, 18, 0.12);
  border-color: var(--ink);
}
</style>
