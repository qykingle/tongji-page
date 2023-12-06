import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
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
