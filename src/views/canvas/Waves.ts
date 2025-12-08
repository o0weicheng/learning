import { CanvasTemplate, type CanvasDrawQuery } from '@/components/canvas/canvas'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { createVNode, defineComponent, onUnmounted } from 'vue'

export default defineComponent(() => {
  let canvasSize_1: [number, number] = [0, 0]
  let canvasSize_2: [number, number] = [0, 0]
  let rafID: number | null = null

  const draw_waves = (ctx: CanvasDrawQuery['ctx']) => {
    ctx.fillStyle = 'hsl(200 90% 50%)'
    ctx.beginPath()
    ctx.moveTo(0, 50)
    ctx.bezierCurveTo(200, 200, 159, -40, canvasSize_1[0], 50)
    ctx.lineTo(canvasSize_1[0], canvasSize_1[1])
    ctx.lineTo(0, canvasSize_1[1])
    ctx.closePath()
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = 'hsl(210 100% 40%)'
    ctx.stroke()
  }

  const onDraw = ({ ctx, canvas }: CanvasDrawQuery) => {
    canvasSize_1 = [canvas.width, canvas.height]
    draw_waves(ctx)
  }

  const waveConfig = {
    waveL: 0.02,
    waveH: 20,
    speed: 0.1,
    offset: 0,
  }
  const draw_animate_waves = (ctx: CanvasDrawQuery['ctx']) => {
    const animate = () => {
      ctx.clearRect(0, 0, canvasSize_2[0], canvasSize_2[1])
      ctx.fillStyle = 'hsl(200 80% 60%)'
      ctx.beginPath()

      for (let x = 0; x < canvasSize_2[0]; x++) {
        const y =
          waveConfig.waveH * Math.sin(x * waveConfig.waveL + waveConfig.offset) +
          canvasSize_2[1] / 2

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.lineTo(canvasSize_2[0], canvasSize_2[1])
      ctx.lineTo(0, canvasSize_2[1])
      ctx.closePath()
      ctx.fill()

      waveConfig.offset += waveConfig.speed
      rafID = requestAnimationFrame(animate)
    }
    animate()
  }

  const onAnimateDraw = ({ ctx, canvas }: CanvasDrawQuery) => {
    if (rafID) cancelAnimationFrame(rafID)
    canvasSize_2 = [canvas.width, canvas.height]
    draw_animate_waves(ctx)
  }

  onUnmounted(() => {
    if (rafID) cancelAnimationFrame(rafID)
  })

  return () =>
    createVNode('section', null, [
      createVNode(Alert, null, {
        default: () => [createVNode(AlertTitle, null, { default: () => '先画一个大波浪' })],
      }),
      createVNode(
        CanvasTemplate,
        {
          class: 'w-full h-[200px]',
          onDraw: onDraw,
        },
        null,
      ),
      createVNode(
        Alert,
        { class: 'mt-4' },
        {
          default: () => [createVNode(AlertTitle, null, { default: () => '再让它动起来' })],
        },
      ),

      createVNode(
        CanvasTemplate,
        {
          class: 'w-full h-[300px]',
          onDraw: onAnimateDraw,
        },
        null,
      ),
    ])
})
