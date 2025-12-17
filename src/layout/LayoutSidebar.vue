<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { LayoutSidebarItem } from '.'
import LayoutSidebarMenu from './components/LayoutSidebarMenu.vue'

const { routes } = defineProps<{
  routes: LayoutSidebarItem[]
}>()

const route = useRoute()
</script>

<template>
  <aside>
    <nav
      class="max-h-[calc(100vh-var(--navigation-height))] pl-0.5 sticky top-(--navigation-height) pb-12"
    >
      <ol>
        <LayoutSidebarMenu
          v-for="r of routes"
          :key="r.path"
          :item="r"
          :active="r.path === route.path"
        >
          <template v-if="r.children && r.children.length > 0" #default>
            <ol class="pl-4">
              <LayoutSidebarMenu
                v-for="child of r.children"
                :key="child.path"
                :item="child"
                :active="child.path === route.path"
              />
            </ol>
          </template>
        </LayoutSidebarMenu>
      </ol>
    </nav>
  </aside>
</template>
