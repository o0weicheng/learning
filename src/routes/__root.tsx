import { Header, Layout } from '@/layouts'
import { NotFound } from '@/pages/NotFound'
import { createRootRoute, Outlet, useRouter, type AnyRoute } from '@tanstack/react-router'

const RootLayout = () => {
  const router = useRouter()

  const routes = router.routeTree

  const menus: AnyRoute[] = Array.isArray(routes.children) ? routes.children : []

  return (
    <>
      <Header />
      <Layout menus={menus}>
        <Outlet />
      </Layout>
    </>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})
