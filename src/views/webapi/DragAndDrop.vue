<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { reactive } from 'vue'

const items_a = reactive<number[]>(Array.from({ length: 4 }, (_, i) => i))
const items_b = reactive<number[]>([])

const vDraggable = {
  mounted: (el: HTMLElement) => {
    const children = el.children
    Array.from(children).forEach((c, i) => {
      c.setAttribute('draggable', 'true')
      c.dataset.idx = i
    })
  },
}

const handleDragStart = (ev: DragEvent) => {
  if (!ev) return
  ev.dataTransfer?.setData('text/plain', ev.target.dataset.idx)
  ev.dataTransfer.dropEffect = 'move'
}

const handleDragover = (ev: DragEvent) => {
  ev.preventDefault()
  ev.dataTransfer.dropEffect = 'move'
}

const handleDrop = (ev: DragEvent) => {
  ev.preventDefault()
  const data = Number(ev.dataTransfer?.getData('text/plain'))
  if (!data && data !== 0) return
  items_b.push(items_a[data]!)
}
</script>

<template>
  <div class="grid grid-cols-2 gap-5" v-draggable>
    <Card v-for="item of items_a" :key="item" @dragstart="handleDragStart">
      <CardContent>
        <p>This element is draggable.</p>
        <span>index: {{ item }}</span>
      </CardContent>
    </Card>
  </div>
  <Card class="mt-4">
    <CardHeader>
      <CardTitle>可以放到这里</CardTitle>
    </CardHeader>
    <CardContent>
      <div
        class="grid grid-cols-3 gap-3 min-h-[200px]"
        @drop="handleDrop"
        @dragover="handleDragover"
      >
        <Card v-for="item of items_b" :key="item">
          <CardContent>
            <p>This element is draggable.</p>
            <span>index: {{ item }}</span>
          </CardContent>
        </Card>
      </div>
    </CardContent>
  </Card>
</template>
