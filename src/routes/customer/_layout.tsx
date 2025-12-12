import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/customer/_layout')({
  component: () => <Outlet />,
  staticData: {
    title: '自定义',
  },
})
