<template>
  <main class="home">
    <img class="home-bg" src="/assets/ui/home-bg.png" alt="" draggable="false" />

    <div class="home-ui fade-up">
      <RouterLink class="btn-start" to="/class" aria-label="开始游戏">
        <img src="/assets/ui/btn-start.png" alt="开始游戏" draggable="false" />
      </RouterLink>
    </div>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
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
  object-fit: cover;
  object-position: center center;
  pointer-events: none;
  user-select: none;
}

.home-ui {
  position: absolute;
  left: 50%;
  bottom: clamp(28px, 6vh, 56px);
  z-index: 2;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
}

.btn-start {
  display: block;
  line-height: 0;
  transition: transform 0.18s ease, filter 0.18s ease;
}

.btn-start img {
  width: min(360px, 82vw);
  height: auto;
  display: block;
  user-select: none;
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
    bottom: 16px;
  }
}
</style>
