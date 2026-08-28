import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ClassSelectView from '@/views/ClassSelectView.vue'
import BattleView from '@/views/BattleView.vue'
import BattleArenaView from '@/views/BattleArenaView.vue'
import BattleFieldView from '@/views/BattleFieldView.vue'
import UIPreview from '@/views/UIPreview.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/class', name: 'class', component: ClassSelectView },
    { path: '/field', name: 'field', component: BattleFieldView },
    { path: '/battle', name: 'battle', component: BattleView },
    { path: '/arena', name: 'arena', component: BattleArenaView },
    { path: '/ui-preview', name: 'ui-preview', component: UIPreview },
  ],
})

export default router
