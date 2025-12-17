import type { RouteRecordRaw } from 'vue-router'
import { chartRouter } from './routes/chart'

export const routes = [
  {
    path: '/',
    meta: {
      title: '首页',
    },
    component: () => import('@/views/HomeView.vue'),
  },
  ...chartRouter,
] satisfies RouteRecordRaw[]
