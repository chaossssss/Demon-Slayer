<template>
  <div v-if="url" class="skill-clip" aria-hidden="true">
    <video
      ref="videoEl"
      class="src"
      :src="url"
      muted
      playsinline
      preload="auto"
      @ended="onEnded"
      @error="onError"
      @playing="onPlaying"
    />
    <canvas ref="canvasEl" class="out" />
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { skillClipCandidates } from '@/data/skillClips'

const props = defineProps({
  clip: { type: Object, default: null },
})
const emit = defineEmits(['ended'])

const videoEl = ref(null)
const canvasEl = ref(null)
const urls = ref([])
const url = ref('')
let raf = 0
let playing = false

watch(
  () => [props.clip?.classId, props.clip?.cardId, props.clip?.star, props.clip?.nonce],
  async () => {
    stop(false)
    if (!props.clip?.cardId) return
    urls.value = skillClipCandidates(props.clip.classId, props.clip.cardId, props.clip.star)
    url.value = urls.value.shift() || ''
    if (!url.value) {
      emit('ended')
      return
    }
    await nextTick()
    start()
  },
  { flush: 'post' },
)

onBeforeUnmount(() => stop(false))

function start() {
  const video = videoEl.value
  if (!video) {
    emit('ended')
    return
  }
  playing = true
  video.currentTime = 0
  const p = video.play()
  if (p?.catch) p.catch(() => onError())
  tick()
}

function stop(emitEnd) {
  playing = false
  cancelAnimationFrame(raf)
  const video = videoEl.value
  if (video) {
    video.pause()
  }
  url.value = ''
  if (emitEnd) emit('ended')
}

function onPlaying() {
  playing = true
}

function onEnded() {
  if (!playing) return
  stop(true)
}

function onError() {
  const next = urls.value.shift()
  if (next) {
    url.value = next
    nextTick(start)
    return
  }
  stop(true)
}

function tick() {
  if (!playing) return
  const video = videoEl.value
  const canvas = canvasEl.value
  if (video && canvas && video.readyState >= 2 && video.videoWidth) {
    drawKeyed(video, canvas)
  }
  raf = requestAnimationFrame(tick)
}

function drawKeyed(video, canvas) {
  const w = 480
  const h = 270
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.clearRect(0, 0, w, h)
  ctx.drawImage(video, 0, 0, w, h)
  const frame = ctx.getImageData(0, 0, w, h)
  const d = frame.data
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i]
    const g = d[i + 1]
    const b = d[i + 2]
    const dist = Math.hypot(r, g - 255, b)
    if (g > 130 && dist < 110) {
      d[i + 3] = 0
    } else if (g > r + 35 && g > b + 35) {
      d[i + 1] = Math.min(g, Math.round((r + b) / 2 + 16))
    }
  }
  ctx.putImageData(frame, 0, 0)
}
</script>

<style scoped>
.skill-clip {
  position: absolute;
  left: 50%;
  bottom: 0;
  z-index: 5;
  width: 420px;
  height: 236px;
  /* 原视频人在画面左侧约 35%，把人物中心对到角色槽中心 */
  transform: translateX(-18%);
  pointer-events: none;
}

.src {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.out {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
