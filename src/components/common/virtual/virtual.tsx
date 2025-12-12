import { useEffect, useRef } from 'react'
import type { VirtualProps } from '.'
import { useContentScroll } from './hooks'

export const Virtual = <T,>({ render, height, list, itemHeight, buffer = 5 }: VirtualProps<T>) => {
  const [renderList, viewPortScrollTop, setScrollTop] = useContentScroll<T>({
    list,
    buffer,
    itemHeight,
    viewPortItemSize: Math.max(0, height / itemHeight),
  })
  const ticking = useRef(false)
  const rafID = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (rafID.current) cancelAnimationFrame(rafID.current)
    },
    [],
  )

  if (!height) throw new Error('虚拟列表需要一个固定高度!')
  if (!list.length) return null
  const contentHeight = itemHeight * list.length

  const HandleContentScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget
    if (!ticking.current) {
      rafID.current = requestAnimationFrame(() => {
        setScrollTop(scrollTop)
        ticking.current = false
      })
    }
    ticking.current = true
  }

  return (
    <div
      className="overflow-y-scroll w-full relative"
      style={{ height: `${height}px` }}
      onScroll={HandleContentScroll}
    >
      <div
        className="absolute w-full top-0 left-0 -z-10 pointer-events-none"
        style={{ height: `${contentHeight}px` }}
      ></div>
      <div
        className="will-change-transform"
        style={{ transform: `translateY(${viewPortScrollTop}px)` }}
      >
        {renderList.map((item, index) => (
          <div
            className="grid justify-items-stretch"
            style={{ height: `${itemHeight}px` }}
            key={index}
          >
            {render({ item })}
          </div>
        ))}
      </div>
    </div>
  )
}
