<template>
  <div class="vfx-burst" aria-hidden="true">
    <canvas ref="canvasEl" class="fx-canvas" />
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { VFX_DURATION } from '@/data/vfx'
import { createFxWorld, drawFxWorld, stepFxWorld } from '@/data/vfxEngine'

const props = defineProps({
  tag: { type: String, required: true },
  ult: { type: Boolean, default: false },
  facing: { type: String, default: 'right' },
})
const emit = defineEmits(['ended'])

const canvasEl = ref(null)
let raf = 0
let timer = 0
let running = false
let world = null
let last = 0

onMounted(async () => {
  running = true
  world = createFxWorld(props.tag, props.ult, props.facing, (Date.now() ^ Math.random() * 1e9) >>> 0)
  const duration = Math.round((VFX_DURATION[props.tag] || 680) * (props.ult ? 1.12 : 1))
  timer = window.setTimeout(() => finish(), duration)
  await nextTick()
  last = performance.now()
  loop()
})

onBeforeUnmount(() => finish(false))

function finish(notify = true) {
  if (!running) return
  running = false
  cancelAnimationFrame(raf)
  clearTimeout(timer)
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
}

.fx-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
