import type { RouteRecordRaw } from 'vue-router'

export const customRouter = [
  {
    path: '/custom',
    meta: {
      title: '自定义',
    },
    children: [],
  },
] satisfies RouteRecordRaw[]
