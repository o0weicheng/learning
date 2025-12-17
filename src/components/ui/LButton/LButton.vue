<script setup lang="ts">
import { cn } from '@/utils'
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { GROUP_BUTTON } from '../const'
import type { UiSize, UiType } from '../types'

const router = useRouter()

const { isGroupButton, groupType, groupSize } = inject(GROUP_BUTTON, {
  isGroupButton: false,
  groupType: null,
  groupSize: null,
})

const { type, size, to, block } = defineProps<{
  type?: UiType
  size?: UiSize
  to?: string
  block?: boolean
}>()

const emit = defineEmits<{
  click: [event: Event]
}>()

const checkSizeStyle = (type?: UiSize) => {
  switch (type) {
    case 'small':
      return ' text-xs px-4 py-1 rounded'
    case 'large':
      return ' text-lg px-10 py-2'
    default:
      return ' text-base px-6 py-1'
  }
}

const checkTypeStyle = (type?: UiType) => {
  switch (type) {
    case 'danger':
      return ' bg-danger/80 hover:danger/70 ring-danger active:ring-danger/80'
    case 'warning':
      return ' bg-warning/80 hover:bg-warning/70 ring-warning active:ring-warning/80'
    case 'outline':
      return ' bg-transparent hover:bg-zinc-200/50 ring-zinc-600 active:ring-zinc-600 text-zinc-800'
    default:
      return ' bg-basic/80 hover:bg-basic/70 ring-basic active:ring-basic/80 '
  }
}

const buttonStyleSheet = computed(() => {
  let style = checkTypeStyle(groupType ?? type)
  style += checkSizeStyle(groupSize ?? size)
  if (block && !isGroupButton) {
    style += ' w-full'
  }
  if (isGroupButton) {
    style += ' rounded-none first-of-type:rounded-l last-of-type:rounded-r'
  }
  return style
})

const handleButtonClick = (ev: Event) => {
  if (to) {
    router.push(to)
    return
  }
  emit('click', ev)
}
</script>

<template>
  <button
    :class="
      cn(
        'inline-flex items-center justify-center rounded-md transition text-white whitespace-nowrap border-transparent active:ring-3',
        buttonStyleSheet,
      )
    "
    @click.prevent="handleButtonClick"
  >
    <slot></slot>
  </button>
</template>
