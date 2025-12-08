import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { VolleyballIcon } from 'lucide-vue-next'
import { createVNode, defineComponent, nextTick, useTemplateRef } from 'vue'
import type { BallInfo } from './types'

const ball = (canvas: HTMLCanvasElement, detail: BallInfo) => {
  if (!canvas) return
  const ballInfo = detail
  const ctx = canvas.getContext('2d')
  let pointerId: number
  let rafId: number | null = null
  let isDiragging = false

  const animateConfig = {
    gravity: 0.98, // 重力加速度
    bounce: 0.7, // 弹性(剩余能量)
    friction: 0.86, // 摩擦力
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

  const pointerup = () => {
    isDiragging = false
    canvas.releasePointerCapture(pointerId)
    canvas.removeEventListener('pointermove', pointermove)
    canvas.removeEventListener('pointerup', pointerup)

    animate()
  }

  const pointerdown = (ev: PointerEvent) => {
    ev.preventDefault()

    const dx = ev.offsetX - ballInfo.x
    const dy = ev.offsetY - ballInfo.y
    if (Math.sqrt(dx * dx + dy * dy) > ballInfo.radius) return

    isDiragging = true
    if (rafId) cancelAnimationFrame(rafId)

    pointerId = ev.pointerId
    canvas.setPointerCapture(pointerId)
    canvas.addEventListener('pointermove', pointermove)
    canvas.addEventListener('pointerup', pointerup)
  }

  const animate = () => {
    ballInfo.vy += animateConfig.gravity
    ballInfo.vy *= animateConfig.friction
    ballInfo.vx *= animateConfig.friction

    ballInfo.y += ballInfo.vy
    ballInfo.x += ballInfo.vx

    // 检查底部碰撞
    if (ballInfo.y + ballInfo.radius > canvas.height) {
      ballInfo.y = canvas.height - ballInfo.radius

      ballInfo.vy *= -animateConfig.bounce

      if (Math.abs(ballInfo.vy) < animateConfig.gravity) {
        ballInfo.vy = 0
      }
    }
    //顶部
    if (ballInfo.y - ballInfo.radius <= 1) {
      ballInfo.y = ballInfo.radius
      ballInfo.vy *= -animateConfig.bounce
    }
    // 右边
    if (ballInfo.x + ballInfo.radius >= canvas.width - 1) {
      ballInfo.x = canvas.width - ballInfo.radius
      ballInfo.vx *= -animateConfig.bounce
    }
    // 左边
    if (ballInfo.x - ballInfo.radius <= 1) {
      ballInfo.x = ballInfo.radius
      ballInfo.vx *= -animateConfig.bounce
    }

    draw()

    if (
      Math.abs(ballInfo.vx) < 0.1 &&
      Math.abs(ballInfo.vy) < 0.1 &&
      ballInfo.y > canvas.height - ballInfo.radius - 1
    ) {
      return
    }
    rafId = requestAnimationFrame(animate)
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
    animate()
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
