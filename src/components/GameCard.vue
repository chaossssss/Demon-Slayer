<template>
  <button
    class="card"
    :class="[
      `type-${card.type}`,
      `rarity-${card.rarity}`,
      { disabled, playable, ultimate: isUltimate },
    ]"
    :disabled="disabled"
    @click="$emit('select', card)"
  >
    <div class="card-top">
      <span class="cost">{{ card.cost }}</span>
      <span class="stars">{{ '★'.repeat(card.star || 1) }}</span>
    </div>
    <div v-if="isUltimate" class="ult-badge">大招</div>
    <h3 class="name">{{ card.name }}</h3>
    <p v-if="isUltimate && ultimateName" class="ult-name">{{ ultimateName }}</p>
    <p class="desc">{{ card.desc || description }}</p>
    <div class="card-foot">
      <span class="type-label">{{ typeLabel }}</span>
      <span v-if="price != null" class="price">{{ price }}金</span>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { CARD_POOL, getCardDesc, MAX_STAR } from '@/data/gameData'

const props = defineProps({
  card: { type: Object, required: true },
  disabled: Boolean,
  playable: Boolean,
  price: { type: Number, default: undefined },
})

defineEmits(['select'])

const star = computed(() => props.card.star || 1)
const tpl = computed(() => CARD_POOL[props.card.cardId])
const isUltimate = computed(() => star.value >= MAX_STAR && !!tpl.value?.ultimate)
const ultimateName = computed(() => tpl.value?.ultimate?.name || '')

const description = computed(() => {
  if (!tpl.value) return ''
  return getCardDesc(tpl.value, star.value)
})

const typeLabel = computed(() => {
  if (isUltimate.value) return '大招'
  return props.card.type === 'attack' ? '攻击' : '技能'
})
</script>

<style scoped>
.card {
  position: relative;
  width: 148px;
  min-height: 210px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  text-align: left;
  color: var(--paper);
  border: 2px solid rgba(232, 213, 163, 0.35);
  border-radius: 4px;
  background: linear-gradient(165deg, #3a2a22 0%, #1f1712 100%);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  animation: drawIn 0.35s ease both;
}

.card:hover:not(:disabled) {
  transform: translateY(-10px) scale(1.03);
  box-shadow: 0 18px 32px rgba(0, 0, 0, 0.45);
  border-color: var(--gold);
  z-index: 2;
}

.card.playable {
  border-color: rgba(201, 162, 39, 0.75);
  box-shadow: 0 0 0 1px rgba(201, 162, 39, 0.35), 0 12px 28px rgba(0, 0, 0, 0.4);
}

.card.disabled {
  opacity: 0.55;
  filter: grayscale(0.25);
}

.card.type-attack {
  background: linear-gradient(165deg, #4a241c 0%, #1a1210 100%);
}

.card.type-skill {
  background: linear-gradient(165deg, #1f3a32 0%, #121816 100%);
}

.card.rarity-rare {
  border-color: rgba(201, 162, 39, 0.55);
}

.card.ultimate {
  width: 158px;
  min-height: 230px;
  border-color: #c9a227;
  background: linear-gradient(165deg, #5a3a14 0%, #2a1810 55%, #1a1210 100%);
  box-shadow: 0 0 0 1px rgba(201, 162, 39, 0.45), 0 14px 28px rgba(0, 0, 0, 0.45);
}

.ult-badge {
  position: absolute;
  top: 42px;
  right: 8px;
  padding: 2px 6px;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  background: var(--blood);
  color: var(--paper);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cost {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #2a4a6b;
  color: #e8f0f8;
  font-weight: 700;
  font-size: 0.95rem;
  border: 1px solid rgba(232, 240, 248, 0.35);
}

.stars {
  color: var(--gold);
  letter-spacing: 1px;
  font-size: 0.85rem;
}

.name {
  margin: 14px 0 4px;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.ult-name {
  margin: 0 0 6px;
  color: #e8c56a;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
}

.desc {
  margin: 0;
  flex: 1;
  font-size: 0.84rem;
  line-height: 1.4;
  color: rgba(232, 213, 163, 0.88);
}

.card-foot {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  color: rgba(232, 213, 163, 0.55);
}

.price {
  color: var(--gold);
}
</style>
