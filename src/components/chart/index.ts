import type { Reactive } from 'vue'

// 柱状图 ｜ 条形图 ｜ 气泡图 ｜环形图 ｜ 饼图
export type LChartType = 'bar' | 'line' | 'dubble' | 'doughnut' | 'pie'

// Chart Database 设置内容
export interface LChartDataset {
  label: string
  data: number[]
  color: string[]
}

// 实现 LChartDataset['data'] 和 LChartOptions['labels'] 长度一致
// 但外部实现的时候， labels 需转换类型，加上 as const
export interface LChartDatasetWithLen<Len extends number> extends Omit<LChartDataset, 'data'> {
  data: { length: Len } & number[]
}

// defineChart 接收的参数
export interface LChartOptions {
  labels: string[]
  dataset: LChartDataset[]
}

// 实现 LChartDataset['data'] 和 LChartOptions['labels'] 长度一致
// 但外部实现的时候， labels 需转换类型，加上 as const
export interface LChartOptionsWithLabels<Labels extends readonly string[]> {
  labels: Labels
  dataset: LChartDatasetWithLen<Labels['length']>[]
}

export interface LChartCallFnOptions {
  width: number
  height: number
  data: Reactive<Map<number, LChartDataset['data']>>
  options: LChartOptions
}

// defineChart 放回的方法格式
export interface LChartDrawer {
  draw(): void
  handlePointerMove(x: number, y: number): void
}

// defineChart 放回的方法格式
export type LChartDrawerCtor = new (
  ctx: CanvasRenderingContext2D,
  options: LChartCallFnOptions,
) => LChartDrawer

// defineChart 返回的方法映射表
export type LChartCallDrawMap<T extends LChartType> = {
  [K in T]?: LChartDrawerCtor
}

// defineChart 返回的内容
// 可通过 update 修改数据
export interface LChartCallOptions {
  data: Reactive<Map<number, LChartDataset['data']>>
  options: LChartOptions
  update: (index: number, newData: LChartDataset['data']) => void
  _fn: LChartCallDrawMap<LChartType>[LChartType]
}

export { default as LChart } from './chart.vue'
export { defineChart } from './composable/defineChart'
