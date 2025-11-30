<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CirclePauseIcon, CirclePlayIcon, RefreshCcwDotIcon } from 'lucide-vue-next'
import { type Directive, type DirectiveBinding, onUnmounted, reactive, ref, toRaw } from 'vue'
import { Separator } from '@/components/ui/separator'
import { ButtonGroup } from '@/components/ui/button-group'
import { Drag, Drop } from '@/components/draggable'
import { Slider } from '@/components/ui/slider'

type AnimateKeyAndOptions = [Keyframe[] | PropertyIndexedKeyframes, KeyframeAnimationOptions]
type AnimationType = 'translate' | 'rotate' | 'scale'

interface CustomAnimationItem {
  type: AnimationType
  key: CustomAnimationItem['type']
  label: string
  color: string
  offset: number
  value: number
}

const customAnimationOptions = ref<CustomAnimationItem[]>([])
const customAnimationItems: Omit<CustomAnimationItem, 'offset' | 'value'>[] = [
  {
    type: 'translate',
    key: 'translate',
    color: '#9a1616',
    label: '偏移',
  },
  {
    type: 'rotate',
    key: 'rotate',
    color: '#125394',
    label: '旋转',
  },
  {
    type: 'scale',
    key: 'scale',
    color: '#0d6c3d',
    label: '缩放',
  },
]
const customAnimationConfig = reactive({
  value: 0,
  label: '',
  offset: 0,
})

const items = ref<AnimateKeyAndOptions[]>([
  [
    [
      { transform: 'translateX(0%) rotate(0deg)', backgroundColor: '#ff6467' },
      { transform: 'translateX(100%) rotate(360deg)', backgroundColor: '#d3a409' },
      { transform: 'translateX(0%) rotate(0deg)', backgroundColor: '#ff6467' },
    ],
    {
      duration: 1000,
      iterations: Infinity,
    },
  ],
  [
    [
      { transform: 'translateX(0%) skewX(0deg)', backgroundColor: '#3d83d2' },
      { transform: 'translateX(200%) skewX(0deg)', backgroundColor: '#099dd3', offset: 0.4 },
      { transform: 'translateX(200%) skewX(-10deg)', backgroundColor: '#e80505', offset: 0.42 },
      { transform: 'translateX(200%) skewX(0deg)', backgroundColor: '#e80505', offset: 0.48 },
      { transform: 'translateX(0%) skewX(0deg)', backgroundColor: '#3d83d2' },
    ],
    {
      duration: 3000,
      iterations: Infinity,
    },
  ],
])
const pauseItems = ref<number[]>([])

const animationMap: Map<number, Animation> = new Map()

const vAnimation: Directive = {
  mounted: (el: HTMLElement, binding: DirectiveBinding) => {
    try {
      const {
        value: { item, index },
      }: { value: { item: AnimateKeyAndOptions; index: number } } = binding
      console.dir(toRaw(item))
      const _animate = el.animate(...toRaw(item))
      animationMap.set(index, _animate)
    } catch (e) {
      console.error(e)
    }
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

const handle_drop = (data: CustomAnimationItem) => {
  const _options = toRaw(customAnimationOptions.value) as CustomAnimationItem[]
  _options.push(<CustomAnimationItem>data)

  customAnimationOptions.value = _options.map((o, index) => {
    return {
      ...o,
      offset: (1 / _options.length) * index,
      value: o.value ?? 0,
    }
  })
}

const handle_dragover = () => {}

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
        <template v-for="(item, index) of items" :key="item">
          <div class="flex items-center">
            <div class="flex-1">
              <div v-animation="{ item, index }" class="size-15 rounded-xl bg-red-400"></div>
            </div>
            <ButtonGroup orientation="vertical">
              <Button
                variant="outline"
                @click="onSetAnimationStatus(pauseItems.includes(index) ? 'play' : 'pause', index)"
                ><CirclePlayIcon v-show="pauseItems.includes(index)" /><CirclePauseIcon
                  v-show="!pauseItems.includes(index)"
              /></Button>
              <Button variant="outline" @click="onSetAnimationStatus('reverse', index)"
                ><RefreshCcwDotIcon
              /></Button>
            </ButtonGroup>
          </div>
          <Separator class="my-4" />
        </template>
      </CardContent>
    </Card>
    <h2 class="text-2xl mt-4">配置动画</h2>
    <Card class="mt-2">
      <CardContent>
        <Alert>
          <AlertTitle>拖动标签到下面方框配置动画</AlertTitle>
          <AlertDescription>然后点击标签配置动画时间和值。</AlertDescription>
          <AlertDescription>后面动画的时间不能小于前面动画的时间，最小值 0，最大值 1。</AlertDescription>
        </Alert>
        <div class="mt-4 grid grid-cols-3 gap-2 cursor-default">
          <Drag
            class="rounded p-px text-white min-w-[100px] text-center"
            v-for="item of customAnimationItems"
            :key="item.key"
            :style="{ backgroundColor: item.color }"
            :data="item"
          >
            {{ item.label }}
          </Drag>
        </div>
        <Drop
          class="mt-2 border border-gray-300 p-3 rounded-lg min-h-[40px] grid grid-cols-5 gap-2"
          @drop="handle_drop"
          @dragover="handle_dragover"
        >
          <span v-show="!customAnimationOptions.length" class="text-gray-400 text-sm">拖到这里 👋</span>
          <div
            v-for="item of customAnimationOptions"
            :key="item.key"
            :style="{ backgroundColor: item.color }"
            class="rounded p-px text-white min-w-[100px] text-center cursor-pointer"
          >
            {{ item.label }}
          </div>
        </Drop>
        <template v-if="customAnimationOptions.length">
          <div class="border border-gray-300 p-3 rounded min-h-[40px]">
            <div class="mr-2">{{ customAnimationConfig.label }}</div>
            <div class="grid grid-flow-row-dense grid-cols-8 gap-6">
              <div>value</div>
              <div>{{ customAnimationConfig.value }}</div>
              <div class="col-span-6">
                <Slider
                  :default-value="[customAnimationConfig.value]"
                  :max="100"
                  :step="1"
                  class="w-[100%]"
                />
              </div>
              <div>offset</div>
              <div>{{ customAnimationConfig.offset }}</div>
              <div class="col-span-6">
                <Slider
                  :default-value="[customAnimationConfig.offset]"
                  :max="100"
                  :step="1"
                  class="w-[100%]"
                />
              </div>
            </div>
          </div>
        </template>
        <div class="mt-4">
          <div class="size-15 rounded-xl bg-red-400"></div>
        </div>
      </CardContent>
    </Card>
  </section>
</template>
