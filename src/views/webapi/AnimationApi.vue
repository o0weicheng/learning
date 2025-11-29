<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CirclePlayIcon, CirclePauseIcon, RefreshCcwDotIcon } from 'lucide-vue-next'
import { type Directive, type DirectiveBinding, onUnmounted, ref } from 'vue'
import { Separator } from '@/components/ui/separator'
import { ButtonGroup } from '@/components/ui/button-group'

const items = Array.from({ length: 4 }, (_, i) => i + 1)
const pauseItems = ref<number[]>([])

const animationMap: Map<number, Animation> = new Map()
const tumblingMap: Map<number, Keyframe[] | PropertyIndexedKeyframes> = new Map()
const timingMap: Map<number, KeyframeAnimationOptions> = new Map()

tumblingMap.set(1, [
  { transform: 'translate3d(0%, 0, 0)' },
  { transform: 'translate3d(200%, 0, 0)' },
  { transform: 'translate3d(0%, 0, 0)' },
])
timingMap.set(1, {
  duration: 2000,
  iterations: Infinity,
})
tumblingMap.set(2, [
  { transform: 'translate3d(0%, 0, 0) rotate(0)' },
  { transform: 'translate3d(100%, 0, 0) rotate(180deg)' },
  { transform: 'translate3d(200%, 0, 0) rotate(180deg)', offset: 0.3 },
  { transform: 'translate3d(0%, 0, 0) rotate(360deg)' },
])
timingMap.set(2, {
  duration: 3000,
  iterations: Infinity,
})
tumblingMap.set(3, [
  { transform: 'translate3d(0%, 0, 0)' },
  { transform: 'translate3d(20%, 10%, 0)' },
  { transform: 'translate3d(20%, 0%, 0)' },
  { transform: 'translate3d(20%, -10%, 0)' },
  { transform: 'translate3d(20%, 0%, 0)' },
  { transform: 'translate3d(20%, 0%, 0)', backgroundColor: '#bb6925' },
  { transform: 'translate3d(50%, 10%, 0)' },
  { transform: 'translate3d(50%, 0%, 0)' },
  { transform: 'translate3d(50%, -10%, 0)' },
  { transform: 'translate3d(50%, 0%, 0)' },
  { transform: 'translate3d(80%, 10%, 0)' },
  { transform: 'translate3d(80%, 0%, 0)' },
  { transform: 'translate3d(80%, -10%, 0)' },
  { transform: 'translate3d(80%, 0%, 0)' },
  { transform: 'translate3d(80%, 0%, 0)', backgroundColor: '#6ebb25' },
  { transform: 'translate3d(120%, 10%, 0)' },
  { transform: 'translate3d(120%, 0%, 0)' },
  { transform: 'translate3d(120%, -10%, 0)' },
  { transform: 'translate3d(120%, 0%, 0)' },
  { transform: 'translate3d(150%, 10%, 0)' },
  { transform: 'translate3d(150%, 0%, 0)' },
  { transform: 'translate3d(150%, -10%, 0)' },
  { transform: 'translate3d(150%, 0%, 0)' },
  { transform: 'translate3d(180%, 10%, 0)' },
  { transform: 'translate3d(180%, 0%, 0)' },
  { transform: 'translate3d(180%, -10%, 0)' },
  { transform: 'translate3d(180%, 0%, 0)' },
  { transform: 'translate3d(180%, 0%, 0)' },
  { transform: 'translate3d(180%, 10%, 0)' },
  { transform: 'translate3d(150%, -10%, 0)' },
  { transform: 'translate3d(150%, 0%, 0)' },
  { transform: 'translate3d(150%, 0%, 0)' },
  { transform: 'translate3d(150%, 10%, 0)' },
  { transform: 'translate3d(120%, -10%, 0)' },
  { transform: 'translate3d(120%, 0%, 0)' },
  { transform: 'translate3d(120%, 0%, 0)' },
  { transform: 'translate3d(120%, 10%, 0)' },
  { transform: 'translate3d(0%, 0, 0)' },
])
timingMap.set(3, {
  duration: 5000,
  iterations: Infinity,
})
tumblingMap.set(4, [
  { transform: 'translate3d(0%, 0, 0) scale(0)' },
  { transform: 'translate3d(100%, 0, 0) rotate(180deg)' },
  { transform: 'translate3d(100%, 0, 0) rotate(180deg) scale(1.5)' },
  { transform: 'translate3d(200%, 0, 0) rotate(180deg)', offset: 0.3 },
  { transform: 'translate3d(100%, 0, 0) rotate(180deg) scale(1)' },
  { transform: 'translate3d(100%, 0, 0) rotate(180deg) scale(.5)' },
  { transform: 'translate3d(0%, 0, 0) rotate(360deg) scale(0)' },
])
timingMap.set(4, {
  duration: 3000,
  iterations: Infinity,
})

const vAnimation: Directive = {
  mounted: (el: HTMLElement, binding: DirectiveBinding) => {
    const { value } = binding
    const _animate = el.animate(tumblingMap.get(value)!, timingMap.get(value)!)
    animationMap.set(value, _animate)
  },
}

const onSetAnimationStatus = (status: 'play' | 'pause' | 'reverse', value: number) => {
  const animationTarget = animationMap.get(value)
  if (!animationTarget) return
  switch (status) {
    case 'play':
      animationTarget.playbackRate = 1
      animationTarget.play()
      pauseItems.value = pauseItems.value.filter((i) => i !== value)
      break
    case 'pause':
      animationTarget.pause()
      pauseItems.value.push(value)
      break
    case 'reverse':
      animationTarget.reverse()
      pauseItems.value = pauseItems.value.filter((i) => i !== value)
      break
  }
}

onUnmounted(() => {
  Array.from(animationMap).forEach(([, an]) => an.cancel())
})
</script>

<template>
  <section>
    <Alert>
      <AlertTitle>这里将全程使用 animation api 实现动画效果</AlertTitle>
      <AlertDescription>而不是 css animation</AlertDescription>
    </Alert>
    <Card class="mt-4">
      <CardContent>
        <template v-for="item of items" :key="item">
          <div class="flex items-center">
            <div class="flex-1">
              <div v-animation="item" class="size-15 rounded-xl bg-red-400"></div>
            </div>
            <ButtonGroup orientation="vertical">
              <Button
                variant="outline"
                @click="onSetAnimationStatus(pauseItems.includes(item) ? 'play' : 'pause', item)"
                ><CirclePlayIcon v-show="pauseItems.includes(item)" /><CirclePauseIcon
                  v-show="!pauseItems.includes(item)"
              /></Button>
              <Button variant="outline" @click="onSetAnimationStatus('reverse', item)"
                ><RefreshCcwDotIcon
              /></Button>
            </ButtonGroup>
          </div>
          <Separator v-if="item !== items.length" class="my-4" />
        </template>
      </CardContent>
    </Card>
    <h2 class="text-2xl mt-4">配置动画</h2>
    <Card class="mt-2">
      <CardContent></CardContent>
    </Card>
  </section>
</template>
