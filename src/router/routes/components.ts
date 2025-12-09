import type { RouteRecordRaw } from 'vue-router'

export const componentsRoutes = [
  {
    path: '/components',
    name: 'components',
    meta: {
      title: '自定义组件',
    },
    children: [
      {
        path: 'button',
        name: 'button',
        meta: {
          title: '按钮',
        },
        component: () => import('@/views/components/UiButton.vue'),
      },
    ],
  },
] satisfies RouteRecordRaw[]
