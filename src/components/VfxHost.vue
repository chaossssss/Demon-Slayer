<template>
  <div class="vfx-host" aria-hidden="true">
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
import VfxBurst from '@/components/VfxBurst.vue'

defineProps({
  items: { type: Array, default: () => [] },
  facing: { type: String, default: 'right' },
})

defineEmits(['ended'])
</script>

<style scoped>
.vfx-host {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 6;
  width: 250%;
  height: 250%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  overflow: visible;
}
</style>
