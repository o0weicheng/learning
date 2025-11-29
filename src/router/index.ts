import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { customerRoutes } from './routes/customer'
import { webapiRoutes } from './routes/webapi'

export const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: '首页',
      scroll: true
    },
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      title: '关于我们',
    },
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue'),
  },
  ...customerRoutes,
  ...webapiRoutes,
] satisfies RouteRecordRaw[]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) ?? 'Learning App'
  next()
})

export default router
