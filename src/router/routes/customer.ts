import type { RouteRecordRaw } from 'vue-router'

export const customerRoutes = [
  {
    path: '/customer',
    name: 'customer',
    meta: {
      title: '自定义事件',
    },
    children: [
      {
        path: 'interval',
        name: 'interval',
        meta: {
          title: '时间间隔',
        },
        component: () => import('@/views/customer/CustomerInterval.vue'),
      },
    ],
  },
] satisfies RouteRecordRaw[]
