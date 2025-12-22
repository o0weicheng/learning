import type { BarHitArea } from '.'
import type { LChartCallFnOptions, LChartDataset } from '..'
import { AxisChart } from './basic'

interface BarVisualState {
  height: number
  value: number
}

export class Bar<
  D extends readonly LChartDataset[] = readonly LChartDataset[],
> extends AxisChart<D> {
  #hitAreas: BarHitArea[] = []
  #hoverData: BarHitArea | null = null

  #prevData: Map<string, BarVisualState> = new Map()
  #nextData: Map<string, BarVisualState> = new Map()

  constructor(ctx: CanvasRenderingContext2D, options: LChartCallFnOptions<D>) {
    super(ctx, options)

    this.transition()
  }

  public draw() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.drawAxis()
    this.drawLabels()
    this.drawYAxis()
    this.drawBars()

    super.drawToolTip()
  }

  public handlePointerMove(x: number, y: number) {
    const found =
      this.#hitAreas.find(
        (area) => x >= area.x && x <= area.x + area.w && y >= area.y && y <= area.y + area.h,
      ) || null

    if (found) {
      this.setTootip({
        x: found.x,
        y: found.y,
        w: found.w,
        h: found.h,
        title: found.label,
        value: found.value,
      })
    } else {
      this.setTootip(null)
    }
  }

  private drawBars() {
    this.#nextData.clear()

    const { ctx, options } = this
    const { max } = this.getStepAndMax()

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

        const key = `${datasetIndex}-${index}`
        const startData = this.#prevData.get(key) ?? { height: 0, value: 0 }
        const targetHeight = max > 0 ? (value / max) * this.innerHeight : 0
        const currentHeight = startData.height + (targetHeight - startData.height) * this.progress
        const currentValue = startData.value + (value - startData.value) * this.progress

        this.#nextData.set(key, {
          height: currentHeight,
          value: currentValue,
        })

        const x = this.padding + index * stepX + datasetIndex * barWidth + gap
        const y = this.height - this.padding - currentHeight

        // 记录区域
        this.#hitAreas.push({
          x,
          y,
          w: barWidth,
          h: currentHeight,
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
        ctx.rect(x, y, barWidth, currentHeight)
        ctx.fill()

        if (isHovered) ctx.restore()
      })
      ctx.restore()
      datasetIndex++
    }
  }

  // 在 update 触发动画重置前，把当前画面上的值存为“旧值”
  protected captureState() {
    this.#prevData = new Map(this.#nextData)
  }
}
