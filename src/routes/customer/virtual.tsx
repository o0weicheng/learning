import { Alert } from '@/components/common/alert'
import { Virtual } from '@/components/common/virtual'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/customer/virtual')({
  component: RouteComponent,
  staticData: {
    title: '虚拟列表',
  },
})

const list: string[] = Array.from({ length: 1000 })
  .fill(0)
  .map((_, index) => `Item ${index + 1}`)

function RouteComponent() {
  return (
    <>
      <Alert type="primary" title="虚拟列表示例">
        自定义列表
      </Alert>
      <section>
        <Virtual
          height={400}
          list={list}
          itemHeight={40}
          render={({ item }) => <div>{item}</div>}
        />
      </section>
    </>
  )
}
