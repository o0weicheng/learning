<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import type { LChartCallOptions, LChartDrawer } from '.'

defineOptions({
  name: 'LChart',
})

const { option, width, height } = defineProps<{
  option: LChartCallOptions
  width: number
  height: number
}>()

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let instance: LChartDrawer

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas-ref')

// 初始化
const initCanvas = () => {
  if (!canvasRef.value) return
  const dpr = window.devicePixelRatio || 1

  canvas = canvasRef.value
  canvas.width = width * dpr
  canvas.height = height * dpr

  ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.scale(dpr, dpr)

  const newOptions = {
    width,
    height,
    data: option.data,
    options: option.options,
  }
  const Drawer = option._fn
  instance = new Drawer!(ctx, newOptions)
  instance.draw()

  canvas.addEventListener('pointermove', chartPointermove)
}

const chartPointermove = (e: PointerEvent) => {
  const rect = canvas?.getBoundingClientRect()
  if (!rect) return
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  instance?.handlePointerMove(x, y)
}

onMounted(() => {
  initCanvas()
})
onUnmounted(() => {
  canvas?.removeEventListener('pointermove', chartPointermove)
})
</script>

<template>
  <canvas ref="canvas-ref" :style="{ height: `${height}px`, width: `${width}px` }"></canvas>
</template>
