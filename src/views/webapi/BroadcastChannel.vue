<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { LightbulbIcon, MoveRightIcon } from 'lucide-vue-next'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'vue-sonner'

interface MessageItem {
  id: string
  message: string
  dateTime: number
}

const route = useRoute()
const uuid = crypto.randomUUID()

const message = ref('')
const messageItems = reactive<MessageItem[]>([])
const bc = new BroadcastChannel('My-BroadcastChannel')

bc.onmessage = (event) => {
  messageItems.push(event.data)
}

const sendMessage = () => {
  bc.postMessage({
    id: uuid,
    message: message.value,
    dateTime: Date.now(),
  } as MessageItem)
  toast.success('消息已发送，请到其它标签页查看。')
  message.value = ''
}

const handleOpenNewTag = () => {
  window.open(route.fullPath, '_blank')
}
</script>

<template>
  <section>
    <div class="flex">
      <div class="ml-auto">
        <Button variant="link" @click="handleOpenNewTag">
          <MoveRightIcon />
          打开标签页</Button
        >
      </div>
    </div>
    <Alert>
      <LightbulbIcon />
      <AlertTitle>要体验此功能，需要在浏览器中打开多个标签页。</AlertTitle>
      <AlertDescription
        >每个标签页都会收到消息。点击“发送”按钮，所有打开的标签页都会收到消息。</AlertDescription
      >
    </Alert>
    <Field class="mt-4">
      <FieldLabel for="message-box">传输信息</FieldLabel>
      <Input v-model="message" id="message-box" />
      <FieldDescription>当前UUID：{{ uuid }}</FieldDescription>
      <Button @click="sendMessage">发送</Button>
    </Field>
    <div v-if="messageItems.length" class="mt-4">
      <template v-for="m of messageItems" :key="m.id">
        <Card class="mb-2">
          <CardHeader>
            <CardTitle>{{ m.message }}</CardTitle>
            <CardDescription>消息来自: {{ m.id }}</CardDescription>
            <CardDescription>发送时间: {{ new Date(m.dateTime) }}</CardDescription>
          </CardHeader>
        </Card>
      </template>
    </div>
  </section>
</template>
