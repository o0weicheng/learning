import { reactive } from 'vue'
import type {
  LChartType,
  LChartCallOptions,
  LChartDataset,
  LChartOptionsWithLabels,
  LChartOptions,
  LChartCallDrawMap,
  Index,
} from '..'
import { Bar } from './bar'

const drawMap: LChartCallDrawMap<LChartType> = {
  bar: Bar,
}

export const defineChart = <L extends readonly string[], D extends readonly LChartDataset[]>(
  type: LChartType,
  options: LChartOptionsWithLabels<L> & { dataset: D },
): LChartCallOptions<D> => {
  const _options = options as unknown as LChartOptions
  const _mapData = reactive(new Map<Index<D>, LChartDataset['data']>())

  options.dataset.forEach((data, index) => {
    _mapData.set(index.toString() as Index<D>, data.data)
  })

  const update = (index: Index<D>, newData: LChartDataset['data']) => {
    _mapData.set(index, newData)
  }

  return {
    data: _mapData,
    options: _options,
    update,
    _fn: drawMap[type],
  }
}
