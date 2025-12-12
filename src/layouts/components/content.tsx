import { Banner, type LayoutContentProps } from '..'
import { Toc } from './toc'

export const Content = ({ banner, toc, children }: LayoutContentProps) => {
  return (
    <>
      <main className="contents">
        <div className="[grid-area:banner]">
          <Banner>{banner}</Banner>
        </div>
        <aside className="[grid-area:toc] sticky max-h-[calc(100vh-var(--navigation-height))] top-(--navigation-height) overflow-y-auto pl-0.5 flex gap-2 justify-between flex-wrap items-start content-start">
          <Toc>{toc}</Toc>
        </aside>
        <div className="[grid-area:body] pb-12">{children}</div>
      </main>
    </>
  )
}
