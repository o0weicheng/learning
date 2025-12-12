import type { LayoutComponentProps } from '..'

export const Sidebar = ({ children }: LayoutComponentProps) => {
  return <aside className="[grid-area:sidebar]">{children}</aside>
}
