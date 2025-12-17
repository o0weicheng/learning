<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { LayoutSidebarItem } from '..'
import { cn } from '@/utils'

defineProps<{
  item: LayoutSidebarItem
  active?: boolean
}>()
</script>

<template>
  <li
    :class="
      cn(
        'pl-4 py-1 mt-2 border-l-4 border-transparent',
        active ? 'font-bold bg-sky-900/20 border-sky-950' : '',
      )
    "
  >
    <component :is="!$slots.default ? RouterLink : 'div'" :to="item.path" class="hover:underline">{{
      item.title
    }}</component>
    <slot> </slot>
  </li>
</template>
