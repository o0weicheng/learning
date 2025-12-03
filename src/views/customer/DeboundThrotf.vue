<script setup lang="ts">
import { Alert, AlertTitle } from '@/components/ui/alert'
import {
  Card,
  CardAction,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from '@/components/ui/card'
import { ClockIcon, Trash2Icon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ref, useTemplateRef, watch } from 'vue'
import { useDebound } from '@/utils/debound'
import { useThrotf } from '@/utils/throtf'

type PlayType = 'debound' | 'throtf'
const player: Map<PlayType, HTMLElement> = new Map()
const animationMap: Map<PlayType, Animation> = new Map()
const deboundTimer = ref(1000)
const throtfTimer = ref(1000)
const deboundAnimationRef = useTemplateRef('deboundAnimationRef')
const throftAnimationRef = useTemplateRef('throftAnimationRef')
const debounces = ref<number[]>([])
const throtf = ref<number[]>([])

const useAnimation = (el: HTMLElement) => {
  const an = el.animate([{ let: '0' }, { left: '100%' }], {
    duration: 10000,
  })
  return an
}

const deboundCall = () => {
  const _animation = animationMap.get('debound')
  if (!_animation) return
  const current = (_animation.currentTime as number) ?? 0
  const duration = _animation.effect?.getTiming().duration! as number
  const progress = current / duration
  debounces.value.push(progress)
}
const throtfCall = () => {
  throtf.value.push(0)
  const _animation = animationMap.get('throtf')
  if (!_animation) return
  const current = (_animation.currentTime as number) ?? 0
  const duration = _animation.effect?.getTiming().duration! as number
  const progress = current / duration
  throtf.value.push(progress)
}

let debounced = useDebound(deboundCall, deboundTimer.value)
watch(
  () => deboundTimer.value,
  () => {
    debounced = useDebound(deboundCall, deboundTimer.value)
  },
)
let throtfed = useThrotf(throtfCall, throtfTimer.value)
watch(
  () => throtfTimer.value,
  () => {
    throtfed = useThrotf(throtfCall, throtfTimer.value)
  },
)

const animationRun = (type: PlayType) => {
  const _animation = animationMap.get(type)
  if (!_animation) {
    const el = player.get(type) as HTMLElement
    if (!el) return
    const animation = useAnimation(el)
    animationMap.set(type, animation)
  } else {
    _animation?.play()
  }
}

const handle_debound_run = (type: PlayType) => {
  if (type === 'debound') {
    debounced()
    player.set(type, deboundAnimationRef.value!)
  } else {
    throtfed()
    player.set(type, throftAnimationRef.value!)
  }
  animationRun(type)
}

const handle_clean = (type: PlayType) => {
  player.delete(type)
  const animate = animationMap.get(type)
  animate?.cancel()
  animationMap.delete(type)
  if (type === 'debound') {
    debounces.value = []
  } else {
    throtf.value = []
  }
}
</script>

<template>
  <section>
    <Alert>
      <ClockIcon />
      <AlertTitle>防抖截流动画演示</AlertTitle>
    </Alert>
    <Card class="mt-4">
      <CardContent>
        <Card>
          <CardHeader>
            <CardTitle>防抖</CardTitle>
            <CardDescription>只有在事件触发停止后的一段时间内没有再次触发事件时，回调函数才会执行。</CardDescription>
            <CardDescription>点击按钮开始动画</CardDescription>
            <CardAction>
              <Button variant="link" size="sm" @click="handle_clean('debound')">
                <Trash2Icon />
              </Button>
              <Button variant="default" size="sm" @click="handle_debound_run('debound')">
                点击
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div class="flex items-center gap-4">
              <label class="text-xs text-nowrap">设置防抖时间</label>
              <Input type="number" v-model="deboundTimer" />
            </div>
            <div class="mt-2 border-2 h-14 overflow-hidden relative">
              <div ref="deboundAnimationRef" class="absolute left-0 w-1.5 h-10 bg-amber-200 bottom-0"></div>
              <template v-for="(item, index) in debounces" :key="index">
                <div class="absolute left-0 w-1.5 h-10 bg-red-200 bottom-0" :style="{ left: `${item * 100}%` }"></div>
              </template>
            </div>
          </CardContent>
        </Card>
        <Card class="mt-2">
          <CardHeader>
            <CardTitle>截流</CardTitle>
            <CardDescription>在一定时间内只执行一次。即使事件触发的频率非常高，截流也只会在指定时间间隔内执行一次回调函数。</CardDescription>
            <CardDescription>点击按钮开始动画</CardDescription>
            <CardAction>
              <Button variant="link" size="sm" @click="handle_clean('throtf')">
                <Trash2Icon />
              </Button>
              <Button variant="default" size="sm" @click="handle_debound_run('throtf')">
                点击
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div class="flex items-center gap-4">
              <label class="text-xs text-nowrap">设置截流时间</label>
              <Input type="number" v-model="throtfTimer" />
            </div>
            <div class="mt-2 border-2 h-14 overflow-hidden relative">
              <div ref="throftAnimationRef" class="absolute left-0 w-1.5 h-10 bg-sky-200 bottom-0"></div>
              <template v-for="(item, index) in throtf" :key="index">
                <div class="absolute left-0 w-1.5 h-10 bg-red-200 bottom-0" :style="{ left: `${item * 100}%` }"></div>
              </template>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  </section>
</template>
