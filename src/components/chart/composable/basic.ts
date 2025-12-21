import type { Reactive } from 'vue'
import type { LChartCallFnOptions, LChartDataset, LChartOptions } from '..'

// 公共父类
// 初始化基础数据
// 所有 Chart 基于 BasicChart
export class BasicChart {
  ctx: CanvasRenderingContext2D
  options: LChartOptions
  data: Reactive<Map<number, LChartDataset['data']>>

  protected innerHeight: number
  protected innerWidth: number
  protected width: number
  protected height: number
  protected padding = 30
  protected progress: number = 0
  protected animId: number | null = null
  protected readonly duration: number = 1000

  protected colors = ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E8684A']

  constructor(ctx: CanvasRenderingContext2D, options: LChartCallFnOptions) {
    this.ctx = ctx
    this.options = options.options

    const { width, height } = options

    this.width = width
    this.height = height
    this.innerWidth = width - this.padding * 2
    this.innerHeight = height - this.padding * 2
    this.data = options.data
  }

  // 动画
  protected animate(draw: () => void) {
    const startTimer = performance.now()

    const loop = (now: number) => {
      const elapsed = now - startTimer
      let p = elapsed / this.duration

      if (p >= 1) {
        p = 1
        this.progress = 1
        draw()
        return
      }

      this.progress = 1 - Math.pow(1 - p, 3)
      draw()
      this.animId = requestAnimationFrame(loop)
    }
    this.animId = requestAnimationFrame(loop)
  }
}

// 条形图和折线图共用的父类
export class AxisChart extends BasicChart {
  #tick = 5

  protected drawAxis() {
    const { ctx } = this
    ctx.beginPath()
    ctx.strokeStyle = 'rgb(200,200,200)'
    ctx.lineWidth = 1
    ctx.moveTo(this.padding + 0.5, this.padding)
    ctx.lineTo(this.padding + 0.5, this.height - this.padding + 0.5)
    ctx.lineTo(this.width - this.padding, this.height - this.padding + 0.5)
    ctx.stroke()

    ctx.closePath()
    ctx.restore()
  }
  protected drawLabels() {
    const { ctx, options } = this

    // x 轴分段
    const stepX = this.innerWidth / options.labels.length

    ctx.save()
    ctx.fillStyle = '#666'
    ctx.font = '12px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    options.labels.forEach((label, index) => {
      const x = this.padding + index * stepX + stepX / 2

      ctx.fillText(label, x, this.height - this.padding + 15)
    })
    ctx.restore()
  }

  // 计算 y 轴绘制步长
  protected getYAxisStep(max: number) {
    if (max <= 0) return { step: 1, max: 0 }

    const roughStep = max / this.#tick // e.g., 545 / 5 = 109
    const pow = 10 ** Math.floor(Math.log10(roughStep))
    const base = roughStep / pow
    const niceSteps = [1, 1.2, 1.5, 1.6, 1.8, 2, 2.4, 2.5, 3, 4, 5, 6, 8, 10]

    let niceBase = niceSteps.find((n) => n >= base)
    if (!niceBase) niceBase = 10

    const step = niceBase * pow
    const safeStep = parseFloat(step.toPrecision(12))
    const niceMax = safeStep * this.#tick

    return {
      step: safeStep,
      max: niceMax,
    }
  }

  protected getStepAndMax() {
    const max = this.getMaxData()
    return this.getYAxisStep(max)
  }

  // 画 y 轴数字
  protected drawYAxis() {
    const { step, max } = this.getStepAndMax()
    const { ctx } = this

    ctx.save()
    ctx.fillStyle = '#666'
    ctx.font = '12px serif'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'

    // i 从 0 到 this.#tick
    for (let i = 0; i <= this.#tick; i++) {
      const currentValue = i * step
      // 根据数值比例计算 Y 像素位置
      // 注意：Canvas Y 轴向下是正方向，所以要用 height - padding - height * ratio
      const y = this.height - this.padding - (currentValue / max) * this.innerHeight

      ctx.fillText(String(currentValue), this.padding - 8, y)

      // 可选：画横向网格辅助线 (Grid lines)
      if (i > 0) {
        ctx.save()
        ctx.strokeStyle = '#eee'
        ctx.beginPath()
        ctx.moveTo(this.padding, y)
        ctx.lineTo(this.width - this.padding, y)
        ctx.stroke()
        ctx.restore()
      }
    }
    ctx.restore()
  }

  // 获取数据中的最大值
  protected getMaxData() {
    if (this.data.size === 0) return 0
    let max = -Infinity
    for (const d of this.data.values()) {
      for (const n of d) {
        if (n > max) max = n
      }
    }
    return max > 0 ? max : 0
  }
}
