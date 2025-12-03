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
          title: '自定义计时器',
        },
        component: () => import('@/views/customer/CustomerInterval.vue'),
      },
      {
        path: 'debound-throtf',
        name: 'DeboundThrotf',
        meta: {
          title: '防抖截流',
        },
        component: () => import('@/views/customer/DeboundThrotf.vue'),
      },
    ],
  },
] satisfies RouteRecordRaw[]
