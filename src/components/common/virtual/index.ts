import type React from 'react'

export interface VirtualProps<T = unknown> {
  render: (scope: { item: T }) => React.ReactNode
  height: number
  list: T[]
  itemHeight: number
  buffer?: number // buffer 缓冲区，额外的 item 预渲染数量
}

export { Virtual } from './virtual'
