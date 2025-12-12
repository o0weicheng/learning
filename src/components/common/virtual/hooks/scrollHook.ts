import { useState, useMemo } from 'react'
import type { ContentScroll } from '.'

export const useContentScroll = <T = unknown>({
  list,
  buffer,
  itemHeight,
  viewPortItemSize,
}: ContentScroll<T>) => {
  const [scrollTop, setScrollTop] = useState(0)

  let { renderList, offsetY } = useMemo(() => {
    const startNode = Math.floor(scrollTop / itemHeight)
    const startSlice = Math.max(0, startNode - buffer)
    const endSlice = Math.min(list.length, startSlice + viewPortItemSize + buffer * 2)

    const offsetY = startSlice * itemHeight

    const newSliceList = list.slice(startSlice, endSlice)

    return {
      renderList: newSliceList,
      offsetY,
    }
  }, [scrollTop, list, buffer, itemHeight, viewPortItemSize])

  return [renderList, offsetY, setScrollTop] as const
}
