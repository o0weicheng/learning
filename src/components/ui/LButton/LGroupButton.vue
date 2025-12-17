<script setup lang="ts">
import { provide } from 'vue'
import { GROUP_BUTTON } from '../const'
import type { UiSize, UiType } from '../types'

const { type, size } = defineProps<{
  type?: UiType
  size?: UiSize
}>()

provide(GROUP_BUTTON, {
  isGroupButton: true,
  groupType: type,
  groupSize: size,
})
</script>

<template>
  <div class="gap-px inline-flex">
    <slot></slot>
  </div>
</template>
