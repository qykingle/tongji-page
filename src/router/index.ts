import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/computing',
    },
    {
      path: '/computing',
      name: 'computing',
      component: () => import('../views/ComputingView.vue')
    },
    {
      path: '/delay',
      name: 'delay',
      component: () => import('../views/DelayView.vue')
    },
    {
      path:'/log',
      name:'log',
      component: () => import('../views/LogView.vue')
    }
  ]
})

export default router
