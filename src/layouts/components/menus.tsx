import { Link, useLocation, type AnyRoute, type ParsedLocation } from '@tanstack/react-router'
import type { MenuProps } from '..'
import { cn } from '@/lib/utils'

export const Menus = ({ menus }: MenuProps) => {
  const location = useLocation()
  return (
    <nav className="max-h-[calc(100vh-var(--navigation-height))] overflow-y-auto pl-0.5 pr-2 sticky top-(--navigation-height) pb-12">
      <ol>
        {menus.map((menu) => {
          return <MenuItem key={menu.path} menu={menu} location={location} />
        })}
      </ol>
    </nav>
  )
}

const MenuItem = ({ menu, location }: { menu: AnyRoute; location: ParsedLocation }) => {
  const children = menu.children as AnyRoute[]
  const hasChildren = children && children.length > 0

  const active = location.pathname === menu.to

  if (hasChildren) {
    const title =
      menu.options.staticData?.title ?? menu.children?.[0]?.options.staticData?.title ?? menu.path

    return (
      <MenuLiComponent key={menu.path}>
        <div className="text-zinc-800 cursor-default font-bold">{title ?? menu.path}</div>
        <ol key={menu.path} className="px-2">
          {children
            .filter((child) => child.path)
            .map((child) => (
              <MenuItem menu={child} location={location} key={child.path} />
            ))}
        </ol>
      </MenuLiComponent>
    )
  }

  const activeClassName = active ? 'bg-input/10  border-input/80' : ''

  return (
    <MenuLiComponent
      key={menu.path}
      className={cn('border-l-4 border-transparent', activeClassName)}
    >
      <Link to={menu.to} className="text-zinc-800 hover:underline">
        {menu.options.staticData?.title ?? menu.path}
      </Link>
    </MenuLiComponent>
  )
}

const MenuLiComponent = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => <li className={cn('py-0.5 px-2 my-1', className)}>{children}</li>
