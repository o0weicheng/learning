<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { reactive, ref } from 'vue'
import { TorusIcon } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { onion_model } from '@/utils/script-models/inedx'
import { ButtonGroup } from '@/components/ui/button-group'
import { ScrollArea } from '@/components/ui/scroll-area'


const onionModel = onion_model()
const count = ref<number>(0)
const runTasks = reactive<string[]>([])

const onAddTask = () => {
  count.value += 1
  const startStr = `任务 ${count.value} 开始`
  const endStr = `任务 ${count.value} 结束`

  onionModel.add(async (next) => {
    runTasks.push(startStr)
    await new Promise((resolve) => setTimeout(() => {
      resolve(null)
    }, 1000))
    await next()
    runTasks.push(endStr)

  })
}

const onTaskRun = () => {
  onionModel.run()

}
</script>

<template>
  <Alert>
    <TorusIcon />
    <AlertTitle>洋葱模型</AlertTitle>
    <AlertDescription>
      拦截和链式控制
      <p class="text-sky-800">权限校验 | 日志打印 | 参数解析</p>
      <p class="text-green-800">响应包装 | 错误处理 | 缓存写回</p>
    </AlertDescription>
  </Alert>
  <Card class="mt-2">
    <CardContent>
      <div class="flex gap-4 items-center pb-2">
        <ButtonGroup>
          <Button size="sm" @click="onAddTask">添加任务</Button>
          <Button size="sm" @click="onTaskRun">执行任务</Button>
        </ButtonGroup>
        <p class="flex-1">当前已添加任务数量: {{ count }}</p>
      </div>
      <ScrollArea class="h-[100px] rounded-2xl border-2 p-3">
        <div v-for="task in runTasks" :key="task">
          {{ task }}
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
</template>
