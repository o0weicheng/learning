<script setup lang="ts" generic="T extends unknown">
import { ref, computed } from 'vue';

const { height, list, itemHeight } = defineProps<{
  height: number,
  list: T[],
  itemHeight?: number
}>()

const buffer = 15
const scrollTop = ref(0)
const virtualItemHeight = computed(() => itemHeight || 50)
const virtualHeight = computed(() => virtualItemHeight.value * list.length)
const count = computed(() => Math.ceil(height / virtualItemHeight.value))

const virtualViewList = computed(() => {
  const start = Math.floor(scrollTop.value / virtualItemHeight.value)


  const listStart = Math.max(0, start - buffer)
  const listEnd = Math.min(list.length, listStart + buffer + count.value)

  return list.slice(listStart, listEnd).map((item: T, index: number) => ({
    item,
    top: (listStart + index) * virtualItemHeight.value
  }))
})

let ticking = false
const handle_scroll = (e: Event) => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {

    const target = e.target as HTMLElement
    scrollTop.value = target?.scrollTop
    ticking = false
  })
}
</script>

<template>
  <div @scroll="handle_scroll" :style="{ height: `${height}px` }"
    class="relative direction-alternate will-change-transform overflow-y-auto" ref="virtual-dom">
    <div class="w-full h-full" :style="{ height: `${virtualHeight}px` }">
      <template v-for="item in virtualViewList" :key="item.item">
        <div class="absolute will-change-transform"
          :style="{ height: `${virtualItemHeight}px`, transform: `translate3D(0, ${item.top}px, 0)` }">
          <slot :item="item.item"></slot>
        </div>
      </template>
    </div>
  </div>
</template>
