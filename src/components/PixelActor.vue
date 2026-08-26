<template>
  <div
    class="pixel-actor"
    :class="[kind, anim, { dead: anim === 'die', art: !!artSrc, enemy: isEnemy }]"
    :style="sizeStyle"
  >
    <div class="body" :key="poseKey">
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
    </div>
    <span class="ground" aria-hidden="true" />
    <span v-if="anim === 'guard'" class="shield" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ACTOR_PALETTE, ACTOR_SPRITES, getActorArt, resolveActorKind } from '@/data/actorSprites'

const ENEMY_KINDS = new Set(['imp', 'hound', 'brute', 'shaman', 'elite', 'boss'])

const props = defineProps({
  kind: { type: String, default: 'swordsman' },
  anim: { type: String, default: 'idle' },
  size: { type: Number, default: 96 },
  /** 强制重播同一动作时递增 */
  poseKey: { type: [Number, String], default: 0 },
})

const resolvedKind = computed(() => resolveActorKind(props.kind, 'swordsman'))
const artSrc = computed(() => getActorArt(resolvedKind.value))
const isEnemy = computed(() => ENEMY_KINDS.has(resolvedKind.value))

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

.body {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  transform-origin: bottom center;
}

.art,
.sheet {
  display: block;
  width: 100%;
  height: 100%;
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

/* —— 待机 —— */
.idle .body {
  animation: bob 1.6s ease-in-out infinite;
}

.enemy.idle .body {
  animation: bobFlip 1.6s ease-in-out infinite;
}

/* —— 斩击：前冲 + 拧身 —— */
.slash .body,
.attack .body {
  animation: slashPose 0.48s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.enemy.slash .body,
.enemy.attack .body {
  animation: slashPoseFlip 0.48s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* —— 刺击：直线突刺 —— */
.thrust .body {
  animation: thrustPose 0.42s cubic-bezier(0.15, 0.85, 0.25, 1);
}

.enemy.thrust .body {
  animation: thrustPoseFlip 0.42s cubic-bezier(0.15, 0.85, 0.25, 1);
}

/* —— 重击/回旋：下砸 —— */
.slam .body {
  animation: slamPose 0.52s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.enemy.slam .body {
  animation: slamPoseFlip 0.52s cubic-bezier(0.2, 0.7, 0.2, 1);
}

/* —— 施法/治疗/烟 —— */
.cast .body {
  animation: castPose 0.55s ease-out;
}

.enemy.cast .body {
  animation: castPoseFlip 0.55s ease-out;
}

.mage.cast .body {
  animation: castPoseMage 0.55s ease-out;
}

.assassin.cast .body {
  animation: castPoseSmoke 0.55s ease-out;
}

/* —— 防御 —— */
.guard .body {
  animation: guardPose 0.5s ease-out;
}

.enemy.guard .body {
  animation: guardPoseFlip 0.5s ease-out;
}

/* —— 受击 —— */
.hurt .body {
  animation: hurtPose 0.4s ease-out;
}

.enemy.hurt .body {
  animation: hurtPoseFlip 0.4s ease-out;
}

.die {
  animation: none;
  filter: grayscale(0.7) brightness(0.55) drop-shadow(0 8px 6px rgba(0, 0, 0, 0.45));
  opacity: 0.55;
}

.die .body {
  transform: translateY(10px) rotate(-10deg);
}

.enemy.die .body {
  transform: scaleX(-1) translateY(10px) rotate(10deg);
}

.shield {
  position: absolute;
  inset: -10px;
  z-index: 2;
  border-radius: 50%;
  border: 3px solid rgba(106, 143, 163, 0.9);
  box-shadow: inset 0 0 16px rgba(106, 143, 163, 0.4), 0 0 18px rgba(106, 143, 163, 0.45);
  pointer-events: none;
  animation: shieldPulse 0.5s ease-out;
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
}

@keyframes bobFlip {
  0%,
  100% {
    transform: scaleX(-1) translateY(0);
  }
  50% {
    transform: scaleX(-1) translateY(-7px);
  }
}

@keyframes slashPose {
  0% {
    transform: translateX(0) rotate(0deg) scale(1);
  }
  18% {
    transform: translateX(-10px) rotate(-12deg) scale(0.96, 1.04);
  }
  48% {
    transform: translateX(42px) rotate(14deg) scale(1.06, 0.94);
  }
  100% {
    transform: translateX(0) rotate(0deg) scale(1);
  }
}

@keyframes slashPoseFlip {
  0% {
    transform: scaleX(-1) translateX(0) rotate(0deg);
  }
  18% {
    transform: scaleX(-1) translateX(-10px) rotate(-12deg) scale(0.96, 1.04);
  }
  48% {
    transform: scaleX(-1) translateX(42px) rotate(14deg) scale(1.06, 0.94);
  }
  100% {
    transform: scaleX(-1) translateX(0) rotate(0deg);
  }
}

@keyframes thrustPose {
  0% {
    transform: translateX(0) scale(1);
  }
  22% {
    transform: translateX(-14px) scale(0.92, 1.06);
  }
  52% {
    transform: translateX(48px) scale(1.12, 0.9);
  }
  100% {
    transform: translateX(0) scale(1);
  }
}

@keyframes thrustPoseFlip {
  0% {
    transform: scaleX(-1) translateX(0);
  }
  22% {
    transform: scaleX(-1) translateX(-14px) scale(0.92, 1.06);
  }
  52% {
    transform: scaleX(-1) translateX(48px) scale(1.12, 0.9);
  }
  100% {
    transform: scaleX(-1) translateX(0);
  }
}

@keyframes slamPose {
  0% {
    transform: translate(0, 0) rotate(0) scale(1);
  }
  25% {
    transform: translate(-6px, -22px) rotate(-8deg) scale(0.94, 1.08);
  }
  55% {
    transform: translate(28px, 8px) rotate(10deg) scale(1.1, 0.88);
  }
  100% {
    transform: translate(0, 0) rotate(0) scale(1);
  }
}

@keyframes slamPoseFlip {
  0% {
    transform: scaleX(-1) translate(0, 0);
  }
  25% {
    transform: scaleX(-1) translate(-6px, -22px) rotate(-8deg) scale(0.94, 1.08);
  }
  55% {
    transform: scaleX(-1) translate(28px, 8px) rotate(10deg) scale(1.1, 0.88);
  }
  100% {
    transform: scaleX(-1) translate(0, 0);
  }
}

@keyframes castPose {
  0%,
  100% {
    transform: translateY(0) scale(1);
    filter: none;
  }
  35% {
    transform: translateY(-10px) scale(1.04);
    filter: brightness(1.18) drop-shadow(0 0 12px rgba(201, 162, 39, 0.7));
  }
}

@keyframes castPoseFlip {
  0%,
  100% {
    transform: scaleX(-1) translateY(0);
    filter: none;
  }
  35% {
    transform: scaleX(-1) translateY(-10px) scale(1.04);
    filter: brightness(1.18) drop-shadow(0 0 12px rgba(201, 162, 39, 0.7));
  }
}

@keyframes castPoseMage {
  0%,
  100% {
    transform: translateY(0) scale(1);
    filter: none;
  }
  35% {
    transform: translateY(-12px) scale(1.05);
    filter: brightness(1.22) drop-shadow(0 0 14px rgba(74, 200, 200, 0.8));
  }
}

@keyframes castPoseSmoke {
  0%,
  100% {
    transform: translateY(0) scale(1);
    filter: none;
    opacity: 1;
  }
  40% {
    transform: translateY(-8px) scale(1.02);
    filter: brightness(1.15) drop-shadow(0 0 14px rgba(138, 106, 155, 0.75));
    opacity: 0.55;
  }
  70% {
    opacity: 0.85;
  }
}

@keyframes guardPose {
  0% {
    transform: translateX(0) scale(1);
  }
  40% {
    transform: translateX(8px) scale(1.05, 0.95);
  }
  100% {
    transform: translateX(4px) scale(1.02, 0.98);
  }
}

@keyframes guardPoseFlip {
  0% {
    transform: scaleX(-1) translateX(0);
  }
  40% {
    transform: scaleX(-1) translateX(8px) scale(1.05, 0.95);
  }
  100% {
    transform: scaleX(-1) translateX(4px) scale(1.02, 0.98);
  }
}

@keyframes hurtPose {
  0%,
  100% {
    transform: translateX(0);
    filter: none;
  }
  25% {
    transform: translateX(-16px) rotate(-6deg);
    filter: brightness(1.9) saturate(0.35);
  }
  50% {
    transform: translateX(-8px) rotate(3deg);
    filter: brightness(1.35);
  }
}

@keyframes hurtPoseFlip {
  0%,
  100% {
    transform: scaleX(-1) translateX(0);
    filter: none;
  }
  25% {
    transform: scaleX(-1) translateX(-16px) rotate(-6deg);
    filter: brightness(1.9) saturate(0.35);
  }
  50% {
    transform: scaleX(-1) translateX(-8px) rotate(3deg);
    filter: brightness(1.35);
  }
}

@keyframes shieldPulse {
  0% {
    opacity: 0;
    transform: scale(0.85);
  }
  40% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
