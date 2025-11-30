<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils.ts'

const { data = null } = defineProps<{
  data: any | null
}>()

defineOptions({
  inheritAttrs: false,
})

const emit = defineEmits<(e: 'dragstart', ev: DragEvent) => void>()

const attrs = useAttrs()

const handle_dragstart = (ev: DragEvent): void => {
  ev.dataTransfer?.setData('application/json', JSON.stringify(data))
  emit('dragstart', ev)
}
</script>

<template>
  <div
    draggable="true"
    @dragstart="handle_dragstart"
    v-bind="$attrs"
    :class="cn('', attrs.class as string)"
  >
    <slot></slot>
  </div>
</template>
