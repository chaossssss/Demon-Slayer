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
    <div v-if="artUrl" class="card-art">
      <img :src="artUrl" :alt="card.name" draggable="false" loading="lazy" />
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
import { CARD_POOL, getCardDesc, MAX_STAR, scaleStats } from '@/data/gameData'
import { getCardArtUrl } from '@/data/cardArt'

const props = defineProps({
  card: { type: Object, required: true },
  disabled: Boolean,
  playable: Boolean,
  price: { type: Number, default: undefined },
})

defineEmits(['select'])

const star = computed(() => {
  // 市集货架强制按一星展示，防止异常字段把三星样式带进商店
  if (props.card.fromShop || props.price != null) return 1
  return Math.min(Math.max(1, Number(props.card.star) || 1), MAX_STAR)
})
const tpl = computed(() => CARD_POOL[props.card.cardId])
const artUrl = computed(() => getCardArtUrl(props.card.cardId))
const isUltimate = computed(() => {
  if (props.card.fromShop || props.price != null) return false
  return star.value >= MAX_STAR && !!tpl.value?.ultimate
})
const ultimateName = computed(() => tpl.value?.ultimate?.name || '')

const description = computed(() => {
  if (!tpl.value) return ''
  if (props.card.fromShop || props.price != null) {
    return tpl.value.desc(scaleStats(tpl.value.base, 1))
  }
  return getCardDesc(tpl.value, star.value)
})

const typeLabel = computed(() => {
  if (isUltimate.value) return '大招'
  return props.card.type === 'attack' ? '攻击' : '技能'
})
</script>

<style scoped>
.card {
  --glow: rgba(201, 162, 39, 0.38);
  position: relative;
  width: 148px;
  min-height: 230px;
  padding: 10px 10px 12px;
  display: flex;
  flex-direction: column;
  text-align: left;
  color: var(--paper);
  border: 2px solid rgba(232, 213, 163, 0.35);
  border-radius: 4px;
  background: linear-gradient(165deg, #3a2a22 0%, #1f1712 100%);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  transform-origin: center bottom;
  overflow: hidden;
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.28s ease,
    filter 0.28s ease;
  animation: drawIn 0.35s ease both;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    transparent 28%,
    rgba(255, 244, 214, 0.22) 48%,
    transparent 68%
  );
  transform: translateX(-140%);
  transition: transform 0.55s ease;
  pointer-events: none;
  z-index: 1;
}

.card:hover:not(:disabled)::before {
  transform: translateX(140%);
}

.card:hover:not(:disabled) {
  transform: translateY(-12px) scale(1.045);
  box-shadow:
    0 22px 40px rgba(0, 0, 0, 0.5),
    0 0 22px var(--glow);
  border-color: var(--gold);
  filter: brightness(1.08);
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
  --glow: rgba(196, 92, 38, 0.45);
  background: linear-gradient(165deg, #4a241c 0%, #1a1210 100%);
}

.card.type-skill {
  --glow: rgba(61, 107, 79, 0.42);
  background: linear-gradient(165deg, #1f3a32 0%, #121816 100%);
}

.card.rarity-rare {
  border-color: rgba(201, 162, 39, 0.55);
}

.card.ultimate {
  --glow: rgba(201, 162, 39, 0.58);
  width: 158px;
  min-height: 248px;
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
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-art {
  position: relative;
  z-index: 0;
  margin: 6px -4px 4px;
  height: 88px;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(201, 162, 39, 0.22);
  box-shadow: inset 0 0 18px rgba(0, 0, 0, 0.45);
}

.card-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  display: block;
  user-select: none;
}

.card.ultimate .card-art {
  border-color: rgba(201, 162, 39, 0.55);
  box-shadow:
    inset 0 0 20px rgba(0, 0, 0, 0.5),
    0 0 12px rgba(201, 162, 39, 0.18);
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
  position: relative;
  z-index: 2;
  margin: 8px 0 3px;
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
