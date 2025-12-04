<script lang="ts" setup>
import { nextTick, ref, toRaw, useTemplateRef } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { timer } from '@/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import type { TimerInterval, TimerIntervalCall } from '@/utils/timer';
import { ButtonGroup } from '@/components/ui/button-group';
import { Trash2Icon } from 'lucide-vue-next'
import { toast } from 'vue-sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

const scrollArea = useTemplateRef('scrollArea')
const time1 = ref<string[]>([])
const time1_duration = ref(800)

let interval_1: TimerInterval | null = null
let lock: TimerIntervalCall | null = null

const interval_1_run_map: Map<TimerIntervalCall, () => void> = new Map()
const interval_1_run_abort = () => {
  time1.value.push('==== 结束定时任务 ====')
  interval_1?.abort()
  interval_1 = null
}
const interval_1_run_pause = () => {
  time1.value.push('==== 暂停定时任务 ====')
  interval_1?.pause()
}
const interval_1_run_default = () => {
  let count = 0
  if (interval_1) { interval_1.resume(); return }
  time1.value.push('==== 开始定时任务 ====')
  count = 0
  interval_1 = timer.interval(() => {
    time1.value.push(`执行定时任务${++count}...`)
    scrollToBotton()
  }, time1_duration.value)
}
interval_1_run_map.set('abort', interval_1_run_abort)
interval_1_run_map.set('pause', interval_1_run_pause)
interval_1_run_map.set('resume', interval_1_run_default)


const interval_1_run = (type: TimerIntervalCall) => {
  if (lock === type) {
    toast.warning('重复的操作')
    return
  }
  interval_1_run_map.get(type ?? '')!()
  lock = type ?? null
}
const on_interval_clean = () => {
  if (interval_1 !== null) {
    toast.warning('先结束定时任务后再执行清除工作')
    return
  }
  time1.value = []
}
const scrollToBotton = async () => {
  await nextTick()
  const componentInstance = scrollArea.value
  if (!componentInstance) return
  const rootElement = componentInstance.$el as HTMLElement

  const viewport = rootElement.querySelector('[data-reka-scroll-area-viewport]') as HTMLElement

  if (viewport) {
    viewport.scrollTop = viewport.scrollHeight
  }
}

</script>

<template>
  <section>
    <Alert>
      <AlertTitle>自定义计时器，定时器</AlertTitle>
      <AlertDescription>相较于原生 setInterval/setTimeout 更精准的计时</AlertDescription>
    </Alert>
    <Card class="mt-4">
      <CardContent>
        <div class="flex justify-between gap-6">
          <ButtonGroup>
            <Button @click="interval_1_run('resume')">开始/继续</Button>
            <Button @click="interval_1_run('pause')">暂停</Button>
            <Button @click="interval_1_run('abort')">结束</Button>
          </ButtonGroup>
          <Input v-model="time1_duration" max="10000" min="10" type="number" />
          <Button @click="on_interval_clean">
            <Trash2Icon />
          </Button>
        </div>
        <ScrollArea ref="scrollArea" class="border-2 p-2 rounded mt-2 h-[300px]">
          <p v-for="item of time1" :key="item" class="text-gray-800">
            {{ item }}
          </p>
        </ScrollArea>
      </CardContent>
    </Card>
  </section>
</template>
