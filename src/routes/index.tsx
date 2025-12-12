import { useState } from 'react'
import { Button } from '@/components/common/button'
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
      <Button onClick={() => setCount(count + 1)}>click</Button>
    </div>
  )
}
