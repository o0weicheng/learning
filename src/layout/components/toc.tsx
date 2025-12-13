import type { LayoutComponentProps } from '..'

export const Toc = ({ children }: LayoutComponentProps) => {
  return children ? (
    <aside className="max-h-[calc(100vh-var(--navigation-height))] overflow-y-auto pl-0.5 sticky top-(--navigation-height) pb-12">
      {children ?? ''}
    </aside>
  ) : null
}
