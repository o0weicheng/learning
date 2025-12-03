<script lang="ts" setup>
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { timer } from '@/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import type { TimerInterval } from '@/utils/timer';

const time1 = ref(0)
const time2 = ref(0)

let interval_1: TimerInterval | null = null
const startTime1 = () => {
  interval_1 = timer.interval(() => {
    time1.value++
  }, 200)
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
        <Button @click="startTime1">开始</Button>
        {{ time1 }}
      </CardContent>
    </Card>
  </section>
</template>
