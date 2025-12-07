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
    ],
  },
] satisfies RouteRecordRaw[]
