<script setup lang="ts">
import { cn } from '@/utils'
import { onMounted, onUnmounted, ref, useTemplateRef, type HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
  thumbClass?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  scroll: [e: Event]
}>()

const viewportTemplate = useTemplateRef('scroll-viewport')

const thumbOffset = ref(0)
const thumbHeight = ref(0)
const visible = ref(false)
const isPointer = ref(false)

let pointerId: number | null = null
let startY = 0
let startThumbOffset = 0
let raf: number | null = null

const updateThumb = () => {
  const viewport = viewportTemplate.value as HTMLElement
  if (!viewport) return

  const { clientHeight, scrollHeight, scrollTop } = viewport

  // 高度不够
  // 不必要的滚动条
  if (scrollHeight <= clientHeight) {
    visible.value = false
    thumbHeight.value = 0
    thumbOffset.value = 0
    return
  }

  visible.value = true

  // 防止内容太长，滚动条过小
  const newThumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 20)
  thumbHeight.value = newThumbHeight

  // 计算滑块位置
  const maxScrollTop = scrollHeight - clientHeight
  const maxThumbOffset = clientHeight - newThumbHeight

  const newThumbOffset = maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbOffset : 0

  thumbOffset.value = newThumbOffset
}

const onViewPortScroll = (ev: Event) => {
  emits?.('scroll', ev)
  if (isPointer.value) return

  raf = requestAnimationFrame(updateThumb)
}

const onThumbPointerDown = (ev: PointerEvent) => {
  ev.preventDefault()
  ev.stopPropagation()

  isPointer.value = true
  pointerId = ev.pointerId

  const target = ev.currentTarget as HTMLElement
  target.setPointerCapture(pointerId)

  startY = ev.clientY
  startThumbOffset = thumbOffset.value
  // 防止拖动过程中选中文本
  document.body.style.userSelect = 'none'
}
const onThumbPointerUp = (ev: PointerEvent) => {
  if (!isPointer.value) return

  const target = ev.currentTarget as HTMLElement
  if (pointerId) target.releasePointerCapture(pointerId)

  isPointer.value = false
  pointerId = null
  document.body.style.userSelect = ''
}
const onThumbPointerMove = (ev: PointerEvent) => {
  if (!isPointer.value || !viewportTemplate.value) return

  const delta = ev.clientY - startY
  const { scrollHeight, clientHeight } = viewportTemplate.value

  const maxThumbOffset = clientHeight - thumbHeight.value
  if (maxThumbOffset <= 0) return
  const maxScrollTop = scrollHeight - clientHeight

  const newThumbOffset = Math.min(Math.max(0, startThumbOffset + delta), maxThumbOffset)

  const ratio = maxScrollTop / maxThumbOffset
  viewportTemplate.value.scrollTop = newThumbOffset * ratio

  thumbOffset.value = newThumbOffset
}
const onTrackPointerDown = (ev: PointerEvent) => {
  ev.stopPropagation()
  ev.preventDefault()
  if (!viewportTemplate.value) return

  const { top } = (ev.currentTarget as HTMLElement).getBoundingClientRect()

  const targetOffsetY = ev.clientY - top

  const { scrollHeight, clientHeight } = viewportTemplate.value
  const maxScrollTop = scrollHeight - clientHeight

  const ratio = targetOffsetY / clientHeight

  viewportTemplate.value.scrollTo({
    top: ratio * maxScrollTop,
    behavior: 'smooth',
  })
}

let observe: null | ResizeObserver = null
onMounted(() => {
  updateThumb()

  const viewport = viewportTemplate.value
  if (!viewport) return

  observe = new ResizeObserver(() => updateThumb())

  observe.observe(viewport)

  if (viewport.firstElementChild) {
    observe.observe(viewport.firstElementChild)
  }
})

onUnmounted(() => {
  observe?.disconnect()
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <div ref="scroll-area" :class="cn('group overflow-hidden h-full w-full relative', props.class)">
    <div
      ref="scroll-viewport"
      class="[&::-webkit-scrollbar]:hidden [scrollbar-width]:none overflow-auto h-full w-full will-change-scroll"
      @scroll="onViewPortScroll"
    >
      <slot></slot>
    </div>

    <div
      v-show="visible"
      :class="
        cn(
          'h-full w-2 overflow-hidden absolute bg-transparent top-0 right-0 touch-none select-none',
          'opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100',
          { 'opacity-100': isPointer },
        )
      "
      @pointerdown="onTrackPointerDown"
    >
      <div
        :class="
          cn(
            'rounded-full bg-zinc-400/80 w-full active:bg-zinc-500 transition-colors duration-300 ease-in-out',
            props.thumbClass,
          )
        "
        :style="{ transform: `translateY(${thumbOffset}px)`, height: `${thumbHeight}px` }"
        @pointerdown="onThumbPointerDown"
        @pointerup="onThumbPointerUp"
        @pointermove="onThumbPointerMove"
      ></div>
    </div>
  </div>
</template>
