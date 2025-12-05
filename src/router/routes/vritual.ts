import type { RouteRecordRaw } from 'vue-router'

export const virtualRoutes = [
  {
    path: '/virtual',
    name: 'Virtual',
    meta: {
      title: '虚拟列表',
    },
    component: () => import('@/views/virtual/VirtualListView.vue'),
  },
] satisfies RouteRecordRaw[]
