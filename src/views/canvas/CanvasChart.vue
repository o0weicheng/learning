<script setup lang="ts">
import { CanvasTemplate, type CanvasDrawQuery } from '@/components/canvas/canvas';

const barInfo = [16, 166, 20, 30, 154, 26]

const fixVerticalTextToComplete = (num: number) => Math.ceil(num / 10) * 10
const getLargeVerticalText = (nums: number[]) => fixVerticalTextToComplete(Math.max(...nums))

const canvasDraw = ({ ctx, canvas }: CanvasDrawQuery, dataInfo: number[]) => {

  const h = canvas.height
  const w = canvas.width
  const padding = 30

  const dh = h - padding * 2
  const dw = w - padding * 2

  const lager = getLargeVerticalText(dataInfo)
  const step = 5
  const xGap = dw / barInfo.length

  const drawAxisLines = () => {
    ctx.beginPath()
    ctx.fillStyle = '#000'
    ctx.lineWidth = 2
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, h - padding)
    ctx.lineTo(w - padding, h - padding)
    ctx.stroke()
    return draw
  }

  const drawVerticalText = () => {
    ctx.fillStyle = '#666'
    ctx.font = '12px Arial'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'

    for (let i = 0; i <= step; i++) {
      const value = Math.round((lager / step) * i)
      const yPos = (h - padding) - (value / lager) * dh

      ctx.fillText(`${value}`, padding - 5, yPos)

      if (i > 0) {
        ctx.beginPath()
        ctx.strokeStyle = '#eee'
        ctx.moveTo(padding, yPos)
        ctx.lineTo(w - padding, yPos)
        ctx.stroke()
      }
    }
    return draw
  }

  const drawBar = () => {
    barInfo.forEach((dp, i) => {
      const barH = (dp / lager) * dh

      const xPos = padding + (i * xGap) + (xGap * 0.2)
      const barW = xGap * .6
      const yPos = h - padding - barH

      ctx.fillStyle = 'hsl(145deg 50% 70%)'
      ctx.fillRect(xPos, yPos, barW, barH)
      ctx.fillStyle = 'hsl(145deg 30% 30%)'
      ctx.font = `11pt Arial`
      ctx.fillText(dp.toString(), xPos + barW / 2, yPos - 10)
    })
    return draw
  }

  const draw = {
    drawBar,
    drawAxisLines,
    drawVerticalText
  }

  return draw
}


const onBarChartDraw = ({ ctx, canvas }: CanvasDrawQuery) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const drawInfo = canvasDraw({ ctx, canvas }, barInfo)
  drawInfo.drawAxisLines().drawVerticalText().drawBar()
}
</script>

<template>
  <section>
    <CanvasTemplate class="w-full h-[300px] border-2" @draw="onBarChartDraw" />
  </section>
</template>
