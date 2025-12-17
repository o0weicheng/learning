import { reactive } from 'vue'
import type {
  LChartType,
  LChartCallOptions,
  LChartDataset,
  LChartOptionsWithLabels,
  LChartOptions,
  LChartCallDrawMap,
} from '..'
import { Bar } from './bar'

const drawMap: LChartCallDrawMap<LChartType> = {
  bar: Bar,
}

export const defineChart = <L extends readonly string[]>(
  type: LChartType,
  options: LChartOptionsWithLabels<L>,
): LChartCallOptions => {
  const _options = options as unknown as LChartOptions
  const _mapData = reactive(new Map())

  options.dataset.forEach((data, index) => {
    _mapData.set(index, data.data)
  })

  const update = (index: number, newData: LChartDataset['data']) => {
    _mapData.set(index, newData)
  }

  return {
    data: _mapData,
    options: _options,
    update,
    _fn: drawMap[type],
  }
}
