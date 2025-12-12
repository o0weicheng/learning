export interface ContentScroll<T = unknown> {
  list: T[]
  buffer: number
  itemHeight: number
  viewPortItemSize: number
}

export { useContentScroll } from './scrollHook'
