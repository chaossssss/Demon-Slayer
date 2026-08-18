<template>
  <div class="pixel-actor" :class="[kind, anim, { dead: anim === 'die' }]" :style="sizeStyle">
    <svg
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
    <span v-if="anim === 'guard'" class="shield" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const SPRITES = {
  swordsman: [
    '................',
    '......xxxx......',
    '.....xssssx.....',
    '.....xseysx.....',
    '.....xssssx.....',
    '......xooox.....',
    '.....xooooox....',
    '....xooooooox...',
    '...xwxoooooxxx..',
    '..xwwxooxx......',
    '.xww.xoox.......',
    'xx....xpxpx.....',
    '......xp.px.....',
    '.....xx..xx.....',
    '.....x....x.....',
    '....xx....xx....',
  ],
  imp: [
    '................',
    '...r......r.....',
    '..xrr....rrx....',
    '...xggggggx.....',
    '..xggeeggggx....',
    '..xggggggggx....',
    '...xggggggx.....',
    '..xxggggggxx....',
    '.x..xggggx..x...',
    '....xggggx......',
    '....xnnnnx......',
    '...xn....nx.....',
    '..xx......xx....',
    '................',
    '................',
    '................',
  ],
  hound: [
    '................',
    '................',
    '....xx....xx....',
    '...xufx..xufx...',
    '...xuffffufx....',
    '..xuffeeuffx....',
    '.xufffffffx.....',
    'xufffwffffx.....',
    '.xuffffffx......',
    '..xuffffx.......',
    '...xuffux.......',
    '...xu..ux.......',
    '..xx....xx......',
    '................',
    '................',
    '................',
  ],
  elite: [
    '................',
    '.....xgyygx.....',
    '....xggssggx....',
    '....xgsyysgx....',
    '....xggssggx....',
    '.....xoooox.....',
    '....xooooooox...',
    '...xyoooooooyx..',
    '..xyxoooooooxyx.',
    '.xwwxooooox.....',
    'xww.xoooox......',
    'xx...xpppx......',
    '.....xp.px......',
    '....xx...xx.....',
    '....x.....x.....',
    '...xx.....xx....',
  ],
}

const PALETTE = {
  x: '#1a120c',
  s: '#e8c49a',
  e: '#1c1712',
  y: '#c9a227',
  o: '#c45c26',
  w: '#e8e0d0',
  p: '#5a3d28',
  r: '#9b2d1f',
  g: '#4a7a3a',
  n: '#2d4a24',
  u: '#3a2028',
  f: '#8a3a42',
}

const props = defineProps({
  kind: { type: String, default: 'swordsman' },
  anim: { type: String, default: 'idle' },
  size: { type: Number, default: 96 },
})

const grid = computed(() => SPRITES[props.kind] || SPRITES.imp)
const rows = computed(() => grid.value.length)
const cols = computed(() => grid.value[0]?.length || 16)

const pixels = computed(() => {
  const list = []
  grid.value.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const fill = PALETTE[row[x]]
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
  filter: drop-shadow(0 10px 0 rgba(0, 0, 0, 0.35));
  transform-origin: bottom center;
}

.sheet {
  width: 100%;
  height: 100%;
  display: block;
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
  filter: grayscale(0.7) brightness(0.55) drop-shadow(0 10px 0 rgba(0, 0, 0, 0.35));
  transform: translateY(8px) rotate(-8deg);
  opacity: 0.55;
}

.imp,
.hound,
.elite {
  transform: scaleX(-1);
}

.imp.die,
.hound.die,
.elite.die {
  transform: scaleX(-1) translateY(8px) rotate(8deg);
}

.imp.idle,
.hound.idle,
.elite.idle {
  animation: bobFlip 1.6s ease-in-out infinite;
}

.imp.attack,
.hound.attack,
.elite.attack {
  animation: lungeFlip 0.42s ease-out;
}

.imp.hurt,
.hound.hurt,
.elite.hurt {
  animation: hurtFlip 0.38s ease-out;
}

.swordsman.attack {
  animation: lunge 0.42s ease-out;
}

.shield {
  position: absolute;
  inset: -8px;
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
    filter: drop-shadow(0 10px 0 rgba(0, 0, 0, 0.35));
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
    filter: drop-shadow(0 10px 0 rgba(0, 0, 0, 0.35));
  }
  30% {
    transform: scaleX(-1) translateX(-10px);
    filter: brightness(1.8) saturate(0.4) drop-shadow(0 0 8px #9b2d1f);
  }
}

@keyframes cast {
  0%,
  100% {
    filter: drop-shadow(0 10px 0 rgba(0, 0, 0, 0.35));
  }
  40% {
    filter: drop-shadow(0 0 12px #c9a227) brightness(1.2);
  }
}
</style>
