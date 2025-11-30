<script setup lang="ts">

import { useAttrs } from 'vue'
import { cn } from '@/lib/utils.ts'

defineOptions({
  inheritAttrs: false,
})

const emit = defineEmits<{
  (e: 'dragover', ev: DragEvent): void,
  (e: 'drop', ev: unknown): void,
}>()

const attrs = useAttrs()

const handle_dragover = (ev: DragEvent) => {
  ev.preventDefault()
  emit('dragover', ev)
}

const handle_drop = (ev: DragEvent) => {
  ev.preventDefault()
  const data = ev.dataTransfer?.getData('application/json')
  if (!data) {
    throw new Error('data is required')
  }
  emit('drop', JSON.parse(data))
}
</script>

<template>
  <div :class="cn('', attrs.class as string)" @drop="handle_drop" @dragover="handle_dragover" v-bind="$attrs">
    <slot></slot>
  </div>
</template>

