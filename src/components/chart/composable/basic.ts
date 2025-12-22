import type { Reactive } from 'vue'
import type { Index, LChartCallFnOptions, LChartDataset, LChartOptions } from '..'

// 定义 Tooltip 信息
interface ToolTipState {
  x: number
  y: number
  w: number
  h: number
  opacity: number
}

export interface TooltipTargetInfo {
  x: number
  y: number
  w: number
  h: number
  title: string
  value: string
}

// 公共父类
// 初始化基础数据
// 所有 Chart 基于 BasicChart
export abstract class BasicChart<D extends readonly LChartDataset[]> {
  ctx: CanvasRenderingContext2D
  options: LChartOptions
  data: Reactive<Map<Index<D>, LChartDataset['data']>>

  protected innerHeight: number
  protected innerWidth: number
  protected width: number
  protected height: number
  protected padding = 30
  protected progress: number = 0
  protected animId: number | null = null
  protected readonly duration: number = 1000

  // tip 当前状态
  #tipCurrent: ToolTipState = { x: 0, y: 0, w: 0, h: 0, opacity: 0 }
  // tip 目标状态
  #tipTarget: ToolTipState = { x: 0, y: 0, w: 0, h: 0, opacity: 0 }
  // tip 内容
  #tipActiveContent: { title: string; value: string } | null = null
  // tip 动画 ID
  #tipAnimId: number | null = null
  // 是否首次显示 tip
  #isTipFirstShow: boolean = true

  // 默认颜色
  protected colors = ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E8684A']

  constructor(ctx: CanvasRenderingContext2D, options: LChartCallFnOptions<D>) {
    this.ctx = ctx
    this.options = options.options

    const { width, height } = options

    this.width = width
    this.height = height
    this.innerWidth = width - this.padding * 2
    this.innerHeight = height - this.padding * 2
    this.data = options.data
  }

  abstract draw(): void
  // 记录数据变化前的数据
  protected abstract captureState(): void

  // 动画
  protected animate() {
    const startTimer = performance.now()

    if (this.animId !== null) cancelAnimationFrame(this.animId)
    const loop = (now: number) => {
      const elapsed = now - startTimer
      let p = elapsed / this.duration

      if (p >= 1) {
        p = 1
        this.progress = 1
        this.draw()
        return
      }

      this.progress = 1 - Math.pow(1 - p, 3)
      this.draw()
      this.animId = requestAnimationFrame(loop)
    }
    this.animId = requestAnimationFrame(loop)
  }

  // 过渡动画
  public transition() {
    this.captureState()
    // 重置进度
    this.progress = 0
    this.animate()
  }

  protected setTootip(target: TooltipTargetInfo | null) {
    // target === null，鼠标移出
    if (!target) {
      this.#tipTarget.opacity = 0
      this.#startTipAnimation()
      return
    }

    const { ctx } = this
    const { x, y, w, title, value } = target

    this.#tipActiveContent = { title, value }

    ctx.save()
    ctx.font = 'bold 14px sans-serif'
    const titleW = ctx.measureText(title).width
    ctx.font = '12px sans-serif'
    const valueW = ctx.measureText(value).width
    ctx.restore()

    const padding = 10
    const gap = 6
    const titleH = 14
    const valueH = 12

    const targetTipW = Math.max(titleW, valueW) + padding * 2
    const targetTipH = titleH + valueH + gap + padding * 2

    let targetTipX = x + w / 2
    let targetTipY = y - targetTipH / 2

    // 边界检查
    // 左半边显示在右边
    // 右半边显示在左边
    if (x > this.width / 2) targetTipX = x + w / 2 - targetTipW
    if (targetTipY < 0) targetTipY = y + 10

    // 设置目标状态
    this.#tipTarget = {
      x: targetTipX,
      y: targetTipY,
      w: targetTipW,
      h: targetTipH,
      opacity: 1,
    }

    if (this.#isTipFirstShow) {
      this.#tipCurrent = { ...this.#tipTarget, opacity: 0 }
      this.#isTipFirstShow = false
    }

    this.#startTipAnimation()
  }

  #startTipAnimation() {
    if (this.#tipAnimId !== null) return

    const loop = () => {
      let needUpdate = false
      const factor = 0.2
      const threshold = 0.1

      const lerp = (c: number, t: number) => {
        if (Math.abs(t - c) < threshold) return t
        needUpdate = true
        return c + (t - c) * factor
      }

      const current = this.#tipCurrent
      const target = this.#tipTarget

      current.x = lerp(current.x, target.x)
      current.y = lerp(current.y, target.y)
      current.w = lerp(current.w, target.w)
      current.h = lerp(current.h, target.h)

      if (Math.abs(target.opacity - current.opacity) > 0.01) {
        current.opacity += (target.opacity - current.opacity) * 0.35
        needUpdate = true
      } else {
        current.opacity = target.opacity
      }

      this.drawTrigger()

      if (needUpdate || current.opacity > 0) {
        this.#tipAnimId = requestAnimationFrame(loop)
      } else {
        this.#tipAnimId = null
      }
    }
    this.#tipAnimId = requestAnimationFrame(loop)
  }

  private drawTrigger() {
    if (typeof this.draw === 'function') {
      this.draw?.()
    }
  }

  protected drawToolTip() {
    const { x, y, h, w, opacity } = this.#tipCurrent
    if (opacity <= 0.01 || !this.#tipActiveContent) return

    const { ctx } = this
    const { title, value } = this.#tipActiveContent

    ctx.save()
    ctx.globalAlpha = opacity

    ctx.fillStyle = 'rgba(0, 0, 0, 0.64)'
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, 6)
    ctx.fill()

    // 文字
    ctx.fillStyle = '#fff'
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    const p = 10
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText(title, x + p, y + p)

    ctx.font = '12px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillText(value, x + p, y + p + 20)

    ctx.restore()
  }
}

// 条形图和折线图共用的父类
export abstract class AxisChart<
  D extends readonly LChartDataset[] = readonly LChartDataset[],
> extends BasicChart<D> {
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
