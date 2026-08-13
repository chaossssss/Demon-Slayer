import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ClassSelectView from '@/views/ClassSelectView.vue'
import BattleView from '@/views/BattleView.vue'
import UIPreview from '@/views/UIPreview.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/class', name: 'class', component: ClassSelectView },
    { path: '/battle', name: 'battle', component: BattleView },
    { path: '/ui-preview', name: 'ui-preview', component: UIPreview },
  ],
})

export default router
