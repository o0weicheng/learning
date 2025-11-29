<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowDownToLineIcon } from 'lucide-vue-next'

const items = new Array(12)
const itemSize = 65
const gapSize = 32
const colors = [
  '#4d9c72',
  '#902e1b',
  '#c885e3',
  '#74dfa9',
  '#399158',
  '#1c3f9a',
  '#1b3334',
  '#20173f',
  '#e35a9b',
  '#27c4fa',
  '#a40498',
  '#9a44b1',
] as const

const ioTarget = useTemplateRef('io-target')
const scrollAreaEl = document.querySelector('[data-slot="scroll-area-viewport"]')

const offset = ref(0)
const thresholds = Array.from({ length: 101 }, (_, i) => i / 100)
const obOptions: IntersectionObserverInit = {
  root: scrollAreaEl || null,
  threshold: thresholds,
}

const posX = (index: number) => {
  const totalCols = items.length / 2
  const col = index % totalCols

  const distFromCenter = col - 2.5

  return distFromCenter * (itemSize + gapSize)
}
const posY = (index: number) => {
  const totalCols = items.length / 2
  const row = Math.floor(index / totalCols)

  const distFromCenter = row - 0.5

  return distFromCenter * (itemSize + gapSize)
}

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.target === ioTarget.value) {
      const rect = entry.boundingClientRect
      const rootHeight = entry.rootBounds?.height || window.innerHeight

      const progress = 1 - (rect.top / rootHeight)
      requestAnimationFrame(() => {
        offset.value = Math.min(1, Math.max(0, progress))
      })
    }
  })
}, obOptions)

onMounted(() => {
  if (!ioTarget.value) return
  io.observe(ioTarget.value)
})

onUnmounted(() => ioTarget.value && io.unobserve(ioTarget.value))
</script>

<template>
  <section>
    <div class="min-h-[100vh]">
      <Alert>
        <AlertTitle><ArrowDownToLineIcon /></AlertTitle>
        <AlertDescription><span>内容在下面</span></AlertDescription>
      </Alert>
    </div>
    <div class="min-h-[200vh] bg-gray-400">
      <div class="flex h-[50vh] top-[25vh] sticky bg-red-400">
        <div class="m-auto grid grid-cols-6 gap-8" :style="{'--offset': offset, '--un-offset': 1 - offset, '--item-size': itemSize + 'px'}">
          <div
            class="rounded-2xl size-(--item-size) bg-(--bg-color)"
            :style="{ '--bg-color': colors[index], opacity: offset, transform: `translate(${-posX(index)*(1-offset)}px, ${-posY(index)*(1-offset)}px)`}"
            v-for="(item, index) of items"
            :key="item"
          ></div>
        </div>
      </div>
      <div ref="io-target" class="h-[125vh] mt-[20vh]"></div>
    </div>
    <div class="h-[200vh]"></div>
  </section>
</template>
