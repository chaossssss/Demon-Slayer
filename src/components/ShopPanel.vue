<template>
  <aside class="shop panel" :class="{ 'is-locked': shopLocked }">
    <header>
      <div class="title-row">
        <h2>卡牌市集</h2>
        <span v-if="shopLocked" class="lock-badge">已锁定</span>
      </div>
      <p>
        {{ shopLocked ? '货架已锁定，过关休整也不会刷新' : '结束回合保留货架 · 可锁定防止过关刷新' }}
      </p>
    </header>

    <div class="offers">
      <GameCard
        v-for="offer in shop"
        :key="offer.offerId"
        :card="offer"
        :price="offer.price"
        :disabled="gold < offer.price || disabled"
        @select="$emit('buy', offer.offerId)"
      />
      <p v-if="!shop.length" class="empty">本回合货架已空</p>
    </div>

    <div class="actions">
      <button
        class="btn btn-ghost dark"
        :class="{ active: shopLocked }"
        :disabled="disabled"
        type="button"
        @click="$emit('toggle-lock')"
      >
        {{ shopLocked ? '解锁市集' : '锁定市集' }}
      </button>
      <button
        class="btn btn-ghost dark"
        :disabled="disabled || shopLocked || gold < rerollCost"
        type="button"
        @click="$emit('reroll')"
      >
        刷新（{{ rerollCost }}金）
      </button>
      <button class="btn btn-ghost dark" type="button" @click="$emit('merge')">合成一览</button>
    </div>
  </aside>
</template>

<script setup>
import GameCard from './GameCard.vue'

defineProps({
  shop: { type: Array, default: () => [] },
  gold: Number,
  rerollCost: Number,
  disabled: Boolean,
  shopLocked: Boolean,
})

defineEmits(['buy', 'reroll', 'merge', 'toggle-lock'])
</script>

<style scoped>
.shop {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 320px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.shop.is-locked {
  box-shadow: inset 0 0 0 2px rgba(155, 45, 31, 0.35);
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

header h2 {
  margin: 0;
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  font-size: 1.25rem;
}

.lock-badge {
  padding: 2px 8px;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--paper);
  background: var(--blood);
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

.btn-ghost.dark:hover:not(:disabled) {
  background: rgba(28, 23, 18, 0.12);
  border-color: var(--ink);
}

.btn-ghost.dark.active {
  color: var(--paper);
  background: var(--blood);
  border-color: #5c180f;
}
</style>
