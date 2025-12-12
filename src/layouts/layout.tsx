import type { LayoutProps } from '.'
import { Content } from './components/content'
import { Menus } from './components/menus'
import { Sidebar } from './components/sidebar'

export const Layout = ({ children, banner, toc, menus }: LayoutProps) => {
  return (
    <div className="grid grid-cols-layout mask-origin-content mask-content [grid-template-areas:'sidebar_._banner_._toc'_'sidebar_._body_._toc'] px-(--layout-side-padding) justify-between w-screen">
      <Content banner={banner} toc={toc}>
        {children}
      </Content>
      <Sidebar>
        <Menus menus={menus!} />
      </Sidebar>
    </div>
  )
}
