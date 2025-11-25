import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: '首页'
    },
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/current-timer',
    name: 'current-timer',
    meta: {
      title: '自定义计时'
    },
    component: () => import('@/views/currentTimer/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
