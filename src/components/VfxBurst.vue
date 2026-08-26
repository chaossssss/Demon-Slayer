<template>
  <div class="vfx-burst" :class="{ ult }" aria-hidden="true">
    <img
      v-if="spriteUrl"
      class="fx-sprite"
      :class="{ flip: facing === 'left' }"
      :src="spriteUrl"
      :style="spriteStyle"
      alt=""
    />
    <canvas v-else ref="canvasEl" class="fx-canvas" />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { getSpriteSpec, resolveVfxTag, VFX_DURATION } from '@/data/vfx'
import { createFxWorld, drawFxWorld, stepFxWorld } from '@/data/vfxEngine'

const props = defineProps({
  tag: { type: String, required: true },
  ult: { type: Boolean, default: false },
  facing: { type: String, default: 'right' },
})
const emit = defineEmits(['ended'])

const canvasEl = ref(null)
const spriteUrl = ref('')
let raf = 0
let timer = 0
let frameTimer = 0
let running = false
let world = null
let last = 0
let frameIndex = 0
let spriteSpec = null
let playTag = ''

const resolvedTag = computed(() => resolveVfxTag(props.tag, props.ult))
const spriteStyle = computed(() => {
  const pos = getSpriteSpec(resolvedTag.value)?.objectPosition
  return pos && pos !== 'center center' ? { objectPosition: pos } : undefined
})

onMounted(async () => {
  running = true
  playTag = resolveVfxTag(props.tag, props.ult)
  spriteSpec = getSpriteSpec(playTag)
  if (spriteSpec) {
    await playSprite(spriteSpec)
    return
  }
  world = createFxWorld(props.tag, props.ult, props.facing, (Date.now() ^ Math.random() * 1e9) >>> 0)
  const duration = Math.round((VFX_DURATION[props.tag] || 680) * (props.ult ? 1.12 : 1))
  timer = window.setTimeout(() => finish(), duration)
  await nextTick()
  last = performance.now()
  loop()
})

onBeforeUnmount(() => finish(false))

async function playSprite(spec) {
  frameIndex = 0
  showFrame(spec, 0)
  const total = Math.round(spec.frames * spec.frameMs * (props.ult ? 1.12 : 1))
  timer = window.setTimeout(() => finish(), total + 40)
  frameTimer = window.setInterval(() => {
    frameIndex += 1
    if (frameIndex >= spec.frames) {
      window.clearInterval(frameTimer)
      frameTimer = 0
      return
    }
    showFrame(spec, frameIndex)
  }, spec.frameMs)
}

function showFrame(spec, i) {
  const n = String(i + 1).padStart(2, '0')
  spriteUrl.value = `${spec.dir}/${n}.png`
}

function finish(notify = true) {
  if (!running) return
  running = false
  cancelAnimationFrame(raf)
  clearTimeout(timer)
  if (frameTimer) clearInterval(frameTimer)
  if (notify) emit('ended')
}

function loop() {
  if (!running) return
  const canvas = canvasEl.value
  const now = performance.now()
  const dt = Math.min(0.033, (now - last) / 1000)
  last = now
  if (world) stepFxWorld(world, dt)
  if (canvas && world) {
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const w = Math.max(16, Math.round(rect.width * dpr))
    const h = Math.max(16, Math.round(rect.height * dpr))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    drawFxWorld(canvas.getContext('2d'), world, w, h)
  }
  raf = requestAnimationFrame(loop)
}
</script>

<style scoped>
.vfx-burst {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.fx-canvas,
.fx-sprite {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

.fx-sprite {
  mix-blend-mode: screen;
  filter: drop-shadow(0 0 6px rgba(140, 200, 255, 0.35));
}

.fx-sprite.flip {
  transform: scaleX(-1);
}

.ult .fx-sprite {
  transform: scale(1.22);
  filter: drop-shadow(0 0 10px rgba(201, 162, 39, 0.55));
}

.ult .fx-sprite.flip {
  transform: scaleX(-1) scale(1.22);
}
</style>
