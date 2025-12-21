import type { BarHitArea } from '.'
import type { LChartCallFnOptions } from '..'
import { AxisChart } from './basic'

export class Bar extends AxisChart {
  #hitAreas: BarHitArea[] = []
  #hoverData: BarHitArea | null = null

  constructor(ctx: CanvasRenderingContext2D, options: LChartCallFnOptions) {
    super(ctx, options)

    this.animate(() => this.draw())
  }

  public draw() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.drawAxis()
    this.drawLabels()
    this.drawYAxis()
    this.drawBars()

    this.drawTooltip()
  }

  public handlePointerMove(x: number, y: number) {
    const found =
      this.#hitAreas.find(
        (area) => x >= area.x && x <= area.x + area.w && y >= area.y && y <= area.y + area.h,
      ) || null

    const prevIndex = this.#hoverData
      ? `${this.#hoverData.datasetIndex}-${this.#hoverData.index}`
      : null
    const nextIndex = found ? `${found.datasetIndex}-${found.index}` : null

    if (prevIndex !== nextIndex) {
      this.#hoverData = found
      this.draw()

      this.ctx.canvas.style.cursor = found ? 'pointer' : 'default'
    }
  }

  private drawBars() {
    const { ctx, options } = this

    const { max } = this.getStepAndMax()

    if (max <= 0) return

    // 每份占据主轴份额
    const stepX = this.innerWidth / options.labels.length
    // 先清空碰撞区域
    // 防止位置变化
    this.#hitAreas = []

    let datasetIndex = 0
    const dataSize = this.data.size

    // 设置间隙
    const barWidth = (stepX * 0.8) / dataSize
    const gap = stepX * 0.1

    for (const [_, dataArray] of this.data) {
      const color = this.colors[datasetIndex % this.colors.length]

      ctx.save()
      ctx.fillStyle = color!

      dataArray.forEach((value, index) => {
        if (index >= options.labels.length) return

        const barHeight = (value / max) * this.innerHeight
        const currentBarHeight = barHeight * this.progress

        const x = this.padding + index * stepX + datasetIndex * barWidth + gap
        const y = this.height - this.padding - currentBarHeight

        // 记录区域
        this.#hitAreas.push({
          x,
          y,
          w: barWidth,
          h: currentBarHeight,
          value: `${options['dataset'][datasetIndex]?.label}: ${value}`,
          label: options.labels[index] ?? value.toString(),
          datasetIndex,
          index,
        })

        const isHovered =
          this.#hoverData &&
          this.#hoverData.index === index &&
          this.#hoverData.datasetIndex === datasetIndex

        ctx.fillStyle = color!
        if (isHovered) {
          ctx.save()
          ctx.filter = 'brightness(0.8)'
        }

        ctx.beginPath()
        ctx.rect(x, y, barWidth, currentBarHeight)
        ctx.fill()

        if (isHovered) ctx.restore()
      })
      ctx.restore()
      datasetIndex++
    }
  }

  private drawTooltip() {
    if (!this.#hoverData) return

    const { ctx } = this
    const { x, y, w, value, label } = this.#hoverData

    // // 先画标题
    // ctx.save()
    // ctx.font = 'bold 14px sans-serif'

    // ctx.fillText(label, tipX + padding, tipY + tipHeight / 2)
    // ctx.restore()

    ctx.save()
    const text = value
    ctx.font = '12px sans-serif'
    const textWidth = ctx.measureText(text).width
    const padding = 6

    const tipWidth = textWidth + padding * 2
    const tipHeight = 24
    // 计算位置
    let tipX = x + w / 2 - tipWidth / 2
    let tipY = y - tipHeight - 5

    if (tipX < 0) tipX = 0
    if (tipX + tipWidth > this.width) tipX = this.width - tipWidth
    if (tipY < 0) tipY = y + 5

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(tipX, tipY, tipWidth, tipHeight)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    ctx.fillText(text, tipX + padding, tipY + tipHeight / 2)

    ctx.restore()
  }
}
