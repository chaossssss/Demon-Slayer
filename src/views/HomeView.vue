<template>
  <main class="home">
    <img class="home-bg" :src="homeBgUrl" alt="" draggable="false" />

    <div class="home-ui fade-up">
      <RouterLink class="btn-start" to="/class" aria-label="新的游戏">
        <img :src="btnStartUrl" alt="新的游戏" draggable="false" />
      </RouterLink>
    </div>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { publicAsset } from '@/utils/publicAsset'

const homeBgUrl = publicAsset('/assets/ui/home-bg.jpg')
const btnStartUrl = publicAsset('/assets/ui/btn-start.png')
</script>

<style scoped>
.home {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 0;
  overflow: hidden;
  background: #1a1510;
}

.home-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  object-position: center center;
  pointer-events: none;
  user-select: none;
}

.home-ui {
  position: absolute;
  left: clamp(72px, 14vw, 180px);
  top: clamp(34%, 38vh, 44%);
  z-index: 2;
  display: flex;
  justify-content: flex-start;
}

.btn-start {
  display: block;
  line-height: 0;
  transition: transform 0.18s ease, filter 0.18s ease;
}

.btn-start img {
  width: min(280px, 42vw);
  height: auto;
  display: block;
  user-select: none;
  /* 素材黑底透明化，贴合首页暗色主视觉 */
  mix-blend-mode: lighten;
}

.btn-start:hover {
  transform: translateY(-3px) scale(1.02);
  filter: brightness(1.06);
}

.btn-start:active {
  transform: translateY(2px) scale(0.99);
}

@media (max-width: 640px) {
  .home-ui {
    left: 16px;
    top: auto;
    bottom: 20px;
  }

  .btn-start img {
    width: min(240px, 72vw);
  }
}
</style>
