<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRouter, type RouteRecordRaw } from 'vue-router'
import { LayoutBasic, LayoutSidebar, type SidebarItem } from '@/components/layout'
import { Toaster } from '@/components/ui/sonner'

import { routes } from './router'

const router = useRouter()
const activeId = computed(() => router.currentRoute.value.name)

const createSidebarItem = (rs: RouteRecordRaw[]): SidebarItem[] =>
  rs.map((r) => {
    const item = Object.create({
      id: r.name,
      label: r.meta?.title ?? '',
      path: r.path,
      children: r.children ? createSidebarItem(r.children) : undefined,
    }) as SidebarItem

    return item
  })

const sidebarItems = createSidebarItem(routes)
</script>

<template>
  <LayoutBasic>
    <template #header>
      <LayoutSidebar :items="sidebarItems" :active-id="activeId" />
    </template>
    <RouterView />
  </LayoutBasic>
  <Toaster />
</template>
