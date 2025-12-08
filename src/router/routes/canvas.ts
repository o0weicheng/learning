import type { RouteRecordRaw } from 'vue-router'

export const canvasRoutes = [
  {
    path: '/canvas',
    name: 'canvas',
    meta: {
      title: 'canvas',
    },
    children: [
      {
        path: 'ball',
        name: 'ball',
        meta: {
          title: '小球',
        },
        component: () => import('@/views/canvas/Ball.ts'),
      },
      {
        path: 'gravity-ball',
        name: 'GravityBall',
        meta: {
          title: '重力小球',
        },
        component: () => import('@/views/canvas/GravityBall.ts'),
      },
      {
        path: 'waves',
        name: 'Waves',
        meta: {
          title: '波浪',
        },
        component: () => import('@/views/canvas/Waves.ts'),
      },
      {
        path: 'making-chart',
        name: 'CanvasChart',
        meta: {
          title: 'Charts',
        },
        component: () => import('@/views/canvas/CanvasChart.vue'),
      },
    ],
  },
] satisfies RouteRecordRaw[]
