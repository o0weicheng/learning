import type { RouteRecordRaw } from 'vue-router'

export const webapiRoutes = [
  {
    path: '/webapi',
    name: 'webapi',
    meta: {
      title: 'Web Api',
    },
    children: [
      {
        path: 'broadcast-channel',
        name: 'broadcastChannel',
        meta: {
          title: '同源 worker 基本通信',
        },
        component: () => import('@/views/webapi/BroadcastChannel.vue'),
      },
      {
        path: 'css-custom-highlight',
        name: 'cssCustomHighlight',
        meta: {
          title: 'CSS 自定义高亮',
        },
        component: () => import('@/views/webapi/CSSCustomHighlight.vue'),
      },
      {
        path: 'clipboard-api',
        name: 'clipboardApi',
        meta: {
          title: '剪切板',
        },
        component: () => import('@/views/webapi/WebClipboard.vue'),
      },
      {
        path: 'drag-drop',
        name: 'DragAndDrop',
        meta: {
          title: '拖放',
        },
        component: () => import('@/views/webapi/DragAndDrop.vue'),
      },
      {
        path: 'animation',
        name: 'Animation',
        meta: {
          title: '动画',
        },
        component: () => import('@/views/webapi/AnimationApi.vue'),
      },
    ],
  },
] satisfies RouteRecordRaw[]
