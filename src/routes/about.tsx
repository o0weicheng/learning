import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
  staticData: {
    title: '关于',
  },
})

function RouteComponent() {
  return <div>Hello "/about"!</div>
}
