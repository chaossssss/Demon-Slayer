<template>
  <div class="pixel-actor" :class="[kind, anim, { dead: anim === 'die', art: !!artSrc }]" :style="sizeStyle">
    <img v-if="artSrc" class="art" :src="artSrc" alt="" />
    <svg
      v-else
      class="sheet"
      :viewBox="`0 0 ${cols} ${rows}`"
      shape-rendering="crispEdges"
      aria-hidden="true"
    >
      <rect
        v-for="(p, i) in pixels"
        :key="i"
        :x="p.x"
        :y="p.y"
        width="1"
        height="1"
        :fill="p.fill"
      />
    </svg>
    <span class="ground" aria-hidden="true" />
    <span v-if="anim === 'guard'" class="shield" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ACTOR_PALETTE, ACTOR_SPRITES, getActorArt, resolveActorKind } from '@/data/actorSprites'

const props = defineProps({
  kind: { type: String, default: 'swordsman' },
  anim: { type: String, default: 'idle' },
  size: { type: Number, default: 96 },
})

const resolvedKind = computed(() => resolveActorKind(props.kind, 'swordsman'))
const artSrc = computed(() => getActorArt(resolvedKind.value))

const grid = computed(() => ACTOR_SPRITES[resolvedKind.value] || ACTOR_SPRITES.swordsman)
const rows = computed(() => grid.value.length)
const cols = computed(() => grid.value[0]?.length || 16)

const pixels = computed(() => {
  const list = []
  grid.value.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const fill = ACTOR_PALETTE[row[x]]
      if (fill) list.push({ x, y, fill })
    }
  })
  return list
})

const sizeStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))
</script>

<style scoped>
.pixel-actor {
  position: relative;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  filter: drop-shadow(0 8px 6px rgba(0, 0, 0, 0.45));
  transform-origin: bottom center;
}

.art,
.sheet {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  object-position: bottom center;
  pointer-events: none;
}

.ground {
  position: absolute;
  left: 50%;
  bottom: 2px;
  z-index: 0;
  width: 62%;
  height: 8px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.42) 0%, transparent 72%);
  pointer-events: none;
}

.art {
  transform: translateY(2px);
}

.idle {
  animation: bob 1.6s ease-in-out infinite;
}

.attack {
  animation: lunge 0.42s ease-out;
}

.cast {
  animation: cast 0.5s ease-out;
}

.hurt {
  animation: hurt 0.38s ease-out;
}

.guard {
  animation: bob 1.6s ease-in-out infinite;
}

.die {
  animation: none;
  filter: grayscale(0.7) brightness(0.55) drop-shadow(0 8px 6px rgba(0, 0, 0, 0.45));
  transform: translateY(8px) rotate(-8deg);
  opacity: 0.55;
}

.imp,
.hound,
.brute,
.shaman,
.elite,
.boss {
  transform: scaleX(-1);
}

.imp.die,
.hound.die,
.brute.die,
.shaman.die,
.elite.die,
.boss.die {
  transform: scaleX(-1) translateY(8px) rotate(8deg);
}

.imp.idle,
.hound.idle,
.brute.idle,
.shaman.idle,
.elite.idle,
.boss.idle {
  animation: bobFlip 1.6s ease-in-out infinite;
}

.imp.attack,
.hound.attack,
.brute.attack,
.shaman.attack,
.elite.attack,
.boss.attack {
  animation: lungeFlip 0.42s ease-out;
}

.imp.hurt,
.hound.hurt,
.brute.hurt,
.shaman.hurt,
.elite.hurt,
.boss.hurt {
  animation: hurtFlip 0.38s ease-out;
}

.mage.cast {
  animation: castMage 0.5s ease-out;
}

.assassin.cast {
  animation: castAssassin 0.5s ease-out;
}

.guardian.cast {
  animation: castGuardian 0.5s ease-out;
}

.swordsman.attack {
  animation: lunge 0.42s ease-out;
}

.shield {
  position: absolute;
  inset: -8px;
  z-index: 2;
  border-radius: 50%;
  border: 3px solid rgba(106, 143, 163, 0.85);
  box-shadow: inset 0 0 16px rgba(106, 143, 163, 0.35), 0 0 18px rgba(106, 143, 163, 0.4);
  pointer-events: none;
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes bobFlip {
  0%,
  100% {
    transform: scaleX(-1) translateY(0);
  }
  50% {
    transform: scaleX(-1) translateY(-6px);
  }
}

@keyframes lunge {
  0% {
    transform: translateX(0);
  }
  40% {
    transform: translateX(28px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes lungeFlip {
  0% {
    transform: scaleX(-1) translateX(0);
  }
  40% {
    transform: scaleX(-1) translateX(28px);
  }
  100% {
    transform: scaleX(-1) translateX(0);
  }
}

@keyframes hurt {
  0%,
  100% {
    transform: translateX(0);
    filter: drop-shadow(0 8px 6px rgba(0, 0, 0, 0.45));
  }
  30% {
    transform: translateX(-10px);
    filter: brightness(1.8) saturate(0.4) drop-shadow(0 0 8px #9b2d1f);
  }
}

@keyframes hurtFlip {
  0%,
  100% {
    transform: scaleX(-1) translateX(0);
    filter: drop-shadow(0 8px 6px rgba(0, 0, 0, 0.45));
  }
  30% {
    transform: scaleX(-1) translateX(-10px);
    filter: brightness(1.8) saturate(0.4) drop-shadow(0 0 8px #9b2d1f);
  }
}

@keyframes cast {
  0%,
  100% {
    filter: drop-shadow(0 8px 6px rgba(0, 0, 0, 0.45));
  }
  40% {
    filter: drop-shadow(0 0 12px #c9a227) brightness(1.2);
  }
}

@keyframes castMage {
  0%,
  100% {
    filter: drop-shadow(0 8px 6px rgba(0, 0, 0, 0.45));
  }
  40% {
    filter: drop-shadow(0 0 14px #4ac8c8) brightness(1.25);
  }
}

@keyframes castAssassin {
  0%,
  100% {
    filter: drop-shadow(0 8px 6px rgba(0, 0, 0, 0.45));
  }
  40% {
    filter: drop-shadow(0 0 14px #8a6a9b) brightness(1.2);
  }
}

@keyframes castGuardian {
  0%,
  100% {
    filter: drop-shadow(0 8px 6px rgba(0, 0, 0, 0.45));
  }
  40% {
    filter: drop-shadow(0 0 14px #7a9e6a) brightness(1.2);
  }
}
</style>
