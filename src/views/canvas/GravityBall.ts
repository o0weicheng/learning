import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { VolleyballIcon } from 'lucide-vue-next'
import { createVNode, defineComponent, nextTick, useTemplateRef } from 'vue'
import type { BallInfo } from './types'

const ball = (canvas: HTMLCanvasElement, detail: BallInfo) => {
  if (!canvas) return
  const ballInfo = detail
  const ctx = canvas.getContext('2d')
  let pointerId: number
  const rafId: number | null = null
  let isDiragging = false

  let lastX = 0,
    lastY = 0

  const animateConfig = {
    gravity: 0.87, // 重力加速度
    bounce: 0.7, // 弹性(剩余能量)
    friction: 0.89, // 摩擦力
  }

  const pointermove = (ev: PointerEvent) => {
    if (!isDiragging) return
    const x = ev.offsetX
    const y = ev.offsetY

    ballInfo.x = checkEdge('x', x) || x
    ballInfo.y = checkEdge('y', y) || y
    draw()
  }

  const checkEdge = (direction: 'x' | 'y', point: number) => {
    if (point <= ballInfo.radius) return ballInfo.radius
    if (direction === 'x') {
      if (point >= canvas.width - ballInfo.radius) return canvas.width - ballInfo.radius
    }
    if (direction === 'y') {
      if (point >= canvas.height - ballInfo.radius) return canvas.height - ballInfo.radius
    }
  }

  const pointerup = (ev: PointerEvent) => {
    isDiragging = false
    canvas.releasePointerCapture(pointerId)
    canvas.removeEventListener('pointermove', pointermove)
    canvas.removeEventListener('pointerup', pointerup)

    ballInfo.vx = ballInfo.x - lastX
    ballInfo.vy = ballInfo.y - lastY
    animate()
  }

  const pointerdown = (ev: PointerEvent) => {
    ev.preventDefault()

    const dx = ev.offsetX - ballInfo.x
    const dy = ev.offsetY - ballInfo.y
    if (Math.sqrt(dx * dx + dy * dy) > ballInfo.radius) return

    isDiragging = true
    if (rafId) cancelAnimationFrame(rafId)

    lastX = ballInfo.x
    lastY = ballInfo.y

    pointerId = ev.pointerId
    canvas.setPointerCapture(pointerId)
    canvas.addEventListener('pointermove', pointermove)
    canvas.addEventListener('pointerup', pointerup)
  }

  const trackVelocity = () => {
    if (isDiragging) {
      lastX = ballInfo.x
      lastY = ballInfo.y
      requestAnimationFrame(trackVelocity)
    }
  }
  const animate = () => {
    ballInfo.vy += animateConfig.gravity
    ballInfo.vy *= animateConfig.friction
    ballInfo.vx *= animateConfig.friction

    ballInfo.y += ballInfo.vy
    ballInfo.x += ballInfo.vx

    if (ballInfo.y + ballInfo.radius > canvas.height) {
      ballInfo.y = canvas.height - ballInfo.radius
    }
  }

  const draw = () => {
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.beginPath()
    ctx.arc(ballInfo.x, ballInfo.y, ballInfo.radius, 0, Math.PI * 2)
    ctx.fillStyle = ballInfo.color
    ctx.fill()
    ctx.closePath()
  }

  canvas.addEventListener('pointerdown', pointerdown)

  const run = () => {
    draw()
  }

  return {
    run,
  }
}

export default defineComponent({
  setup: () => {
    const canvasRef = useTemplateRef('ball-ref')

    nextTick(() => {
      const canvas = canvasRef.value as HTMLCanvasElement
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      const ballInfo: BallInfo = {
        x: canvas.width / 2 - 10,
        y: canvas.height - 20,
        radius: 20,
        vx: 0,
        vy: 0,
        color: '#3289ff',
      }
      const gravityBall = ball(canvas, ballInfo)
      gravityBall?.run()
    })
  },
  render: () =>
    createVNode('section', null, [
      createVNode(Alert, null, {
        default: () => [
          createVNode(VolleyballIcon, null, null),
          createVNode(AlertTitle, null, { default: () => '一个有重力的小球' }),
          createVNode(AlertDescription, null, { default: () => '用鼠标拉起它，再释放鼠标吧！' }),
        ],
      }),
      createVNode('canvas', {
        class: 'w-full h-[600px] border-2 rounded mt-4 touch-none',
        ref: 'ball-ref',
      }),
    ]),
})
