export { default as LayoutBasic } from './LayoutBasic.vue'
export { default as LayoutSidebar } from './LayoutSidebar.vue'

export interface SidebarItem {
  id: string
  label: string
  path: string
  children?: SidebarItem[]
}
