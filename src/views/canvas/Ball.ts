import { Alert, AlertTitle } from '@/components/ui/alert'
import { createVNode, defineComponent, nextTick, useTemplateRef } from 'vue'
import type { BallInfo } from './types'

class Ball {
  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D
  public _ball: BallInfo

  constructor(canvas: HTMLCanvasElement, ball: BallInfo) {
    this._canvas = canvas
    this._ctx = canvas.getContext('2d')!
    this._ball = ball
  }
  public draw = () => {
    const ctx = this._ctx
    const ball = this._ball

    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2) // 画圆
    ctx.fillStyle = ball.color
    ctx.fill()
    ctx.closePath()
  }

  public update = () => {
    this._ball.x += this._ball.vx
    this._ball.y += this._ball.vy

    if (this.checkBallCollision('x')) {
      this._ball.vx = -this._ball.vx
      this._ball.color = this.getBallRandomColor()
    }

    if (this.checkBallCollision('y')) {
      this._ball.vy = -this._ball.vy
      this._ball.color = this.getBallRandomColor()
    }
  }

  // 检测小球碰撞到 cnavas 边缘
  protected checkBallCollision = (direction: 'x' | 'y') => {
    if (!this._canvas) return
    const _c = this._canvas
    const _b = this._ball
    if (direction === 'x') {
      return _b.x + _b.radius >= _c?.width || _b.x - _b.radius <= 1
    }
    if (direction === 'y') {
      return _b.y + _b.radius >= _c?.height || _b.y - _b.radius <= 1
    }
  }

  protected getBallRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
}

export default defineComponent({
  setup: () => {
    const canvasRef = useTemplateRef('canvas-ball-ref')
    let canvas: null | HTMLCanvasElement = null

    const balls: Set<Ball> = new Set()

    nextTick(() => {
      canvas = canvasRef.value as HTMLCanvasElement
      if (!canvas) return
      const ctx = canvas.getContext('2d')

      balls.add(
        new Ball(canvas, {
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: 4,
          vy: 3,
          radius: 16,
          color: '#3498db',
        } as BallInfo),
      )

      balls.add(
        new Ball(canvas, {
          x: 50,
          y: 70,
          vx: -2,
          vy: 5,
          radius: 10,
          color: '#e74c3c',
        } as BallInfo),
      )

      const run = () => {
        if (!canvas) return
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
        balls.forEach((ball) => {
          ball.update()
          ball.draw()
        })
        requestAnimationFrame(run)
      }
      run()
    })
  },
  render: () =>
    createVNode('section', null, [
      createVNode(Alert, null, {
        default: () => createVNode(AlertTitle, null, { default: () => '这里有颗小球弹跳中...' }),
      }),
      createVNode('canvas', {
        ref: 'canvas-ball-ref',
        class: 'w-full h-[300]px border-2 rounded mt-4',
      }),
    ]),
})
