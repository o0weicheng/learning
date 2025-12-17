import type { RouteRecordRaw } from 'vue-router'

export const chartRouter = [
  {
    path: '/chart',
    meta: {
      title: 'Chart',
    },
    children: [
      {
        path: 'bar',
        meta: {
          title: '柱状图',
        },
        component: () => import('@/views/chart/ChartBar.vue'),
      },
    ],
  },
] satisfies RouteRecordRaw[]
