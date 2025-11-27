<script setup lang="ts">
import type { RouteRecordNameGeneric } from 'vue-router'
import type { SidebarItem } from '.'
import { ref } from 'vue'

defineProps<{
  items: SidebarItem[]
  activeId: string | RouteRecordNameGeneric
}>()

const subItemsShowMap = ref(new Map<string, boolean>())

const handleOpenSubItems = (id: string) => {
  subItemsShowMap.value.set(id, !subItemsShowMap.value.get(id))
}
</script>

<template>
  <div class="grid">
    <template v-for="item in items" :key="item.id">
      <component
        :is="item.children ? 'div' : 'RouterLink'"
        :to="item.path"
        :class="item.children && 'cursor-pointer'"
        @click.prevent="item.children && handleOpenSubItems(item.id)"
      >
        <span :class="activeId === item.id ? 'text-black font-bold' : 'text-gray-600'">{{
          item.label
        }}</span>
        <template v-if="item.children">
          <div v-show="!subItemsShowMap.get(item.id)" class="grid pl-2">
            <template v-for="sub in item.children" :key="sub.id">
              <RouterLink
                class="before:content-['─'] relative after:content-['⎸'] after:absolute after:scale-y-150 after:-left-px after:top-0 last:after:-top-[30%] last:after:scale-y-80"
                @click.stop
                :to="`${item.path}/${sub.path}`"
              >
                <span :class="activeId === sub.id ? 'text-black font-bold' : 'text-gray-600'">{{
                  sub.label
                }}</span>
              </RouterLink>
            </template>
          </div>
        </template>
      </component>
    </template>
  </div>
</template>

<style scoped></style>
