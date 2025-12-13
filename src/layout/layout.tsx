import { type LayoutProps } from '.'
import { Content } from './components/content'
import { Menus } from './components/menus'
import { Sidebar } from './components/sidebar'
import { Header } from './header'

export const Layout = ({ children, banner, toc, menus }: LayoutProps) => {
  return (
    <>
      <Header />

      <div className="grid grid-cols-layout mask-origin-content mask-content [grid-template-areas:'sidebar_._body_._toc'] px-2 justify-between w-screen">
        <Content banner={banner} toc={toc}>
          {children}
        </Content>
        <Sidebar>
          <Menus menus={menus!} />
        </Sidebar>
      </div>
    </>
  )
}
