<script setup lang="ts">
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CopyPlusIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const clipboardContent = ref('')
const linkString = 'https://developer.mozilla.org/zh-CN/docs/Web/API/Clipboard_API'
const onReadClipboard = () =>
  navigator.clipboard.readText().then((text) => {
    console.log('Clipboard text:', text)
    clipboardContent.value = text
  })

const onWriteClipboard = () => navigator.clipboard.writeText(linkString)
</script>

<template>
  <section>
    <Alert>
      <AlertTitle> 通过 Clipboard API 读取剪切板内容 </AlertTitle>
      <AlertDescription>
        Clipboard API
        允许网页访问系统剪切板的内容，但出于安全考虑，必须在用户交互事件（如点击按钮）中调用该 API。
      </AlertDescription>
    </Alert>
    <Alert class="mt-2">
      <AlertDescription>
        点击下面的按钮，浏览器会请求访问剪切板的权限，允许后即可读取剪切板内容并打印到控制台。
      </AlertDescription>
    </Alert>
    <Alert class="mt-2">
      <AlertDescription
        >🤔 Safari 如果不是当前站点复制的内容，需要再点一下粘贴按钮
      </AlertDescription>
    </Alert>
    <div class="flex gap-4 mt-4">
      <Input disabled v-model="linkString" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button @click="onWriteClipboard"><CopyPlusIcon /></Button>
          </TooltipTrigger>
          <TooltipContent align="center" side="right">
            <p>复制</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <div class="pt-4">
      <Button @click="onReadClipboard">获取剪切板内容</Button>
      <p v-if="clipboardContent" class="mt-2 border-2 block rounded-sm p-2">{{ clipboardContent }}</p>
    </div>
  </section>
</template>

