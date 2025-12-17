<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { LayoutSidebarItem } from '.'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutSidebar from './LayoutSidebar.vue'

import { routes } from '@/router/routes'
import ScrollArea from '@/components/ui/ScrollArea/ScrollArea.vue'

const formatRoutes = (routes: RouteRecordRaw[], parentPath?: string) => {
  return routes.map((r) => {
    const item: LayoutSidebarItem = {
      path: parentPath ? `${parentPath}/${r.path}` : r.path,
      title: (r.meta?.title as string) ?? '',
    }
    if (r.children) {
      Reflect.set(item, 'children', formatRoutes(r.children, r.path))
    }
    return item
  })
}

const side: LayoutSidebarItem[] = formatRoutes(routes)
</script>

<template>
  <LayoutHeader></LayoutHeader>
  <div
    class="grid grid-cols-layout mask-origin-content mask-content [grid-template-areas:'sidebar_._body_._toc'] justify-between px-3 w-screen"
  >
    <main class="contents">
      <ScrollArea class="h-view-scroll [grid-area:toc]"> </ScrollArea>

      <ScrollArea class="[grid-area:body] pb-12 h-view-scroll">
        <slot></slot>
      </ScrollArea>

      <ScrollArea class="h-view-scroll [grid-area:sidebar]">
        <LayoutSidebar :routes="side" />
      </ScrollArea>
    </main>
  </div>
</template>
