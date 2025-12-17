import type { VNode } from 'vue'

export interface LayoutSidebarItem {
  path: string
  title: string
  icon?: VNode
  children?: LayoutSidebarItem[]
}

export { default as LayoutBasic } from './LayoutBasic.vue'
