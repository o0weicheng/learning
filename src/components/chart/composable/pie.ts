import type { LChartCallFnOptions, LChartDataset } from '..'
import { BasicChart } from './basic'

interface PieVisualState {
  startAngle: number
  endAngle: number
  value: number
}

interface PieHitArea {
  index: number
  value: string
  label: string
  startAngle: number
  endAngle: number
  color: string
}

export class Pie<D extends readonly LChartDataset[]> extends BasicChart<D> {
  #hitAreas: PieHitArea[] = []
  #hoverData: PieHitArea | null = null

  #prevData: Map<number, PieVisualState> = new Map()
  #nextData: Map<number, PieVisualState> = new Map()

  #radius: number = 0
  #centerX: number = 0
  #centerY: number = 0

  constructor(ctx: CanvasRenderingContext2D, options: LChartCallFnOptions<D>) {
    super(ctx, options)
    this.transition()
  }
  public draw(): void {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.drawPie()
    this.drawToolTip()
  }

  public captureState(): void {
    this.#prevData = new Map(this.#nextData)
  }

  protected drawPie() {
    this.#nextData.clear()
    this.#hitAreas = []

    const { ctx, options } = this
    // 计算最小直径
    const diameter = Math.min(this.innerWidth, this.innerHeight)
    this.#radius = diameter / 2
    this.#centerX = this.width / 2
    this.#centerY = this.height / 2

    // 逻辑复杂，仅做单层饼图
    const datasetKey = this.data.keys().next().value
    if (datasetKey === undefined) return

    const dataArray = this.data.get(datasetKey)
    if (!dataArray) return

    const total = dataArray.reduce((acc, cur) => acc + cur, 0)
    if (total === 0) return

    let currentAngle = 0

    dataArray.forEach((value, index) => {
      if (index >= options.labels.length) return

      const color = this.colors[index % this.colors.length]

      const ratio = value / total
      const sliceAngle = ratio * Math.PI * 2

      const targetStartAngle = currentAngle
      const targetEndAngle = currentAngle + sliceAngle

      const prev = this.#prevData.get(index) ?? {
        startAngle: 0,
        endAngle: 0,
        value: 0,
      }

      const currentStartAngle =
        prev.startAngle + (targetStartAngle - prev.startAngle) * this.progress
      const currentEndAngle = prev.endAngle + (targetEndAngle - prev.endAngle) * this.progress
      const currentValue = prev.value + (value - prev.value) * this.progress

      currentAngle += sliceAngle

      this.#nextData.set(index, {
        startAngle: currentStartAngle,
        endAngle: currentEndAngle,
        value: currentValue,
      })

      this.#hitAreas.push({
        index,
        value: `${options['dataset'][0]?.label}: ${value}`,
        label: options.labels[index] ?? '',
        startAngle: currentStartAngle,
        endAngle: currentEndAngle,
        color: color!,
      })

      ctx.beginPath()
      ctx.moveTo(this.#centerX, this.#centerY)

      let drawRadius = this.#radius
      const isHover = this.#hoverData && this.#hoverData.index === index

      if (isHover) {
        drawRadius += 2
      }

      ctx.arc(this.#centerX, this.#centerY, drawRadius, currentStartAngle, currentEndAngle)

      ctx.closePath()

      ctx.fillStyle = color!
      ctx.fill()

      ctx.lineWidth = 2
      ctx.strokeStyle = '#fff'
      ctx.stroke()

      if (isHover) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)'
        ctx.fill()
      }
    })
  }

  public handlePointerMove(x: number, y: number) {
    const dist = Math.sqrt((x - this.#centerX) ** 2 + (y - this.#centerY) ** 2)

    if (dist > this.#radius) {
      this.#hoverData = null
      this.setTootip(null)
      this.ctx.canvas.style.cursor = 'default'
      if (this.progress >= 1) this.draw()
      return
    }

    let angle = Math.atan2(y - this.#centerY, x - this.#centerX)
    if (angle < 0) angle += Math.PI * 2

    const found =
      this.#hitAreas.find((area) => angle >= area.startAngle && angle <= area.endAngle) || null

    this.#hoverData = found

    if (found) {
      const midAngle = (found.startAngle + found.endAngle) / 2
      const anchorX = this.#centerX + Math.cos(midAngle) * this.#radius
      const anchorY = this.#centerY + Math.sin(midAngle) * this.#radius

      this.setTootip({
        x: anchorX,
        y: anchorY,
        w: 0,
        h: 0,
        title: found.label,
        value: found.value.toString(),
      })
      this.ctx.canvas.style.cursor = 'pointer'
    } else {
      this.setTootip(null)
      this.ctx.canvas.style.cursor = 'default'
    }

    if (this.progress >= 1) this.draw()
  }
}
