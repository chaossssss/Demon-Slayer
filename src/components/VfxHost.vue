<template>
  <div class="vfx-host" :class="{ 'actor-host': hasActorClip }" aria-hidden="true">
    <VfxBurst
      v-for="item in items"
      :key="item.id"
      :tag="item.tag"
      :ult="item.ult"
      :facing="facing"
      @ended="$emit('ended', item.id)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VfxBurst from '@/components/VfxBurst.vue'
import { getSpriteSpec, resolveVfxTag } from '@/data/vfx'

const props = defineProps({
  items: { type: Array, default: () => [] },
  facing: { type: String, default: 'right' },
})

defineEmits(['ended'])

const hasActorClip = computed(() =>
  props.items.some((item) => getSpriteSpec(resolveVfxTag(item.tag, item.ult))?.actorClip),
)
</script>

<style scoped>
.vfx-host {
  position: absolute;
  left: 50%;
  top: 42%;
  z-index: 6;
  width: 280%;
  height: 280%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  overflow: visible;
}

/* 人刀一体帧：与 PixelActor 同高同缩放基准（素材 canvas 高=idle） */
.vfx-host.actor-host {
  top: auto;
  bottom: 0;
  width: 220%;
  height: 100%;
  transform: translateX(-50%);
}
</style>
