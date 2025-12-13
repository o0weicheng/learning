import { useState } from 'react'
import { Button, ButtonGroup } from '@/components/common/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
  staticData: {
    title: '首页',
  },
})

function Index() {
  const [count, setCount] = useState(0)
  return (
    <div className="p-2">
      {count}
      <Button size="small" onClick={() => setCount(count + 1)}>
        按钮
      </Button>

      <Button onClick={() => setCount(count + 1)}>按钮</Button>
      <Button size="large" onClick={() => setCount(count + 1)}>
        按钮
      </Button>

      <ButtonGroup>
        <Button onClick={() => setCount(count + 1)}>按钮1</Button>
        <Button onClick={() => setCount(count + 1)}>按钮2</Button>
        <Button onClick={() => setCount(count + 1)}>按钮3</Button>
      </ButtonGroup>
    </div>
  )
}
