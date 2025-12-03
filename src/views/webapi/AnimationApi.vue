<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CirclePauseIcon, CirclePlayIcon, RefreshCcwDotIcon, Trash2Icon } from 'lucide-vue-next'
import {
  computed,
  type Directive,
  type DirectiveBinding,
  onUnmounted,
  ref,
  toRaw,
  useTemplateRef,
  watch,
} from 'vue'
import { Separator } from '@/components/ui/separator'
import { ButtonGroup } from '@/components/ui/button-group'
import { Drag, Drop } from '@/components/draggable'
import { Slider } from '@/components/ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Toggle } from '@/components/ui/toggle'
import { Input } from '@/components/ui/input'

type AnimateKeyAndOptions = [Keyframe[] | PropertyIndexedKeyframes, KeyframeAnimationOptions]
type AnimationType = 'translate' | 'rotate' | 'scale'

interface CustomAnimationItem {
  type: AnimationType
  key: CustomAnimationItem['type']
  id: string,
  label: string
  color: string
  offset: number[]
  value: number[]
}

const customAnimationOptions = ref<CustomAnimationItem[]>([])
const customAnimationItems: Omit<CustomAnimationItem, 'offset' | 'value' | 'id'>[] = [
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

const customerAnimationRef = useTemplateRef('customerAnimationRef')
const customerAnimationPlay = ref<boolean>(false)
const customerAnimationTiming = ref<number>(2)
const animationContent = computed(() => {
  const keyframes: Keyframe[] | PropertyIndexedKeyframes = [
    {
      transform: 'translateX(0%) rotate(0deg) scale(1)',
    },
  ]
  customAnimationOptions.value.forEach((item) => {
    const _animation = {
      transform: '',
    }
    switch (item.type) {
      case 'translate':
        _animation.transform += `translateX(${item.value}%) rotate(${0}deg) scale(1)`
        break
      case 'rotate':
        _animation.transform += `translateX(${0}%) rotate(${item.value}deg) scale(1)`
        break
      case 'scale': {
        let scale = item?.value[0] || 0
        if (scale === 0) {
          scale = 1
        } else if (scale > 0) {
          scale = 1 + scale * 0.01
        } else {
          scale = 1 - Math.abs(scale) * 0.01
        }
        _animation.transform += `translateX(${0}%) scale(${scale}) rotate(${0}deg)`
        break
      }
    }

    if (item.offset[0]) {
      Object.assign(_animation, { offset: (toRaw(item.offset)[0] as number) * 0.01 })
    }
    keyframes.push(_animation)
  })
  return keyframes
})

let customerAnimation: Animation | null = null
watch(
  () => customerAnimationPlay.value,
  () => {
    if (!customerAnimationRef.value) return
    if (customerAnimationPlay.value) {
      customerAnimation = customerAnimationRef.value.animate(animationContent.value, {
        duration: customerAnimationTiming.value * 1000,
        iterations: Infinity,
      })
      return
    }
    customerAnimation && customerAnimation.cancel()
  },
)
const handleAnimationTimingChange = () => (customerAnimationPlay.value = false)

const vAnimation: Directive = {
  mounted: (el: HTMLElement, binding: DirectiveBinding) => {
    try {
      const {
        value: { item, index },
      }: { value: { item: AnimateKeyAndOptions; index: number } } = binding
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
  customerAnimationPlay.value = false
  customAnimationOptions.value.push({
    ...data,
    id: crypto.randomUUID(),
    offset: [0],
    value: [0],
  })
}

const handleRemoveAnimationItem = (item: CustomAnimationItem) => {
  customerAnimationPlay.value = false
  customAnimationOptions.value = customAnimationOptions.value.filter((i) => i.id !== item.id)
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
          <AlertDescription>· 然后点击标签配置动画时间和值。</AlertDescription>
          <AlertDescription>· 动画时间不设置的时候，均分剩下的时间。</AlertDescription>
          <AlertDescription>· 配置好点击下面的按钮开启动画，每次配置自动暂停。</AlertDescription>
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
        >
          <span v-show="!customAnimationOptions.length" class="text-gray-400 text-sm"
            >拖到这里 👋</span
          >
          <template v-for="item of customAnimationOptions" :key="item.key">
            <Popover>
              <PopoverTrigger as-child>
                <div
                  :style="{ backgroundColor: item.color }"
                  class="rounded p-px text-white min-w-[100px] text-center cursor-pointer"
                >
                  {{ item.label }}
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <span>动画时间(%): </span><span>{{ item.offset }}</span>
                <Slider
                  class="my-2"
                  v-model="item.offset"
                  :default-value="[0]"
                  :max="100"
                  :step="1"
                ></Slider>
                <span>{{ item.label }}(%): </span><span>{{ item.value }}</span>
                <Slider
                  class="my-2"
                  v-model="item.value"
                  :default-value="[0]"
                  :max="item.key === 'rotate' ? 360 : 100"
                  :min="item.key === 'scale' ? -100 : 0"
                  :step="1"
                ></Slider>
                <div class="flex">
                  <Button class="ml-auto" size="sm" variant="destructive" @click="handleRemoveAnimationItem(item)">
                    <Trash2Icon />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </template>
        </Drop>
        <div class="mt-4 flex">
          <Toggle variant="outline" aria-label="Toggle play" v-model="customerAnimationPlay">
            <CirclePlayIcon class="h-4 w-4" />
          </Toggle>
          <div class="flex flex-1 pl-2 items-center">
            <label class="text-xs text-nowrap px-2" for="">动画总时间(秒)</label>
            <Input
              class="w-auto"
              type="number"
              v-model="customerAnimationTiming"
              @change="handleAnimationTimingChange"
            />
          </div>
        </div>
        <div class="mt-2">
          <div ref="customerAnimationRef" class="size-15 rounded-xl bg-red-400"></div>
        </div>
      </CardContent>
    </Card>
  </section>
</template>
