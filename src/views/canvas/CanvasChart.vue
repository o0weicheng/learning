<script setup lang="ts">
import { CanvasTemplate, type CanvasDrawQuery } from '@/components/canvas/canvas';

const barInfo = [16, 68, 20, 30, 54]
const onBarChartDraw = ({ ctx, canvas }: CanvasDrawQuery) => {
  const h = canvas.height
  const w = canvas.width
  const x = w / barInfo.length
  for (let i = 0; i < barInfo.length; i++) {
    const dp = barInfo[i]!
    ctx.fillStyle = 'hsl(45deg 60% 40%)'
    ctx.fillRect(x * i + x / 2, h - dp, x / 3, dp)
    ctx.fillStyle = 'hsl(0 0 0)'
    ctx.fillText(dp.toString(), x * i + x / 2, h - dp)
  }
}
</script>

<template>
  <section>
    <CanvasTemplate class="w-full h-[300px]" @draw="onBarChartDraw" />
  </section>
</template>
