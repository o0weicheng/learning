<script setup lang="ts">
import {onUnmounted, ref} from "vue";
import Row from "@/components/ui/Grid/Row.vue";
import Col from "@/components/ui/Grid/Col.vue";

const count = ref(0);
const timer = (method: Function, time: number, type: 'timeout' | 'interval' = 'timeout') => {
  let start = performance.now();
  let rafId: number
  let count: number = 0
  let running: boolean = true
  const loop = () => {
    if (!running) return

    const now = performance.now()
    const elapsed = now - start

    if (type === 'timeout' && elapsed >= time) {
      cancelAnimationFrame(rafId)
      method()
      return
    }
    if (type === 'interval' && elapsed >= time) {
      count += 1
      method(count * time)
      start += time
    }
    rafId = requestAnimationFrame(loop)
  }
  rafId = requestAnimationFrame(loop)
  return {
    cancel: () => {
      running = false;
      return cancelAnimationFrame(rafId)
    },
    continue: () => {
      if (!running) {
        running = true
        rafId = requestAnimationFrame(loop)
      }
    }
  }
}

let inter = timer((now: number) => {
  count.value = now / 10
}, 10, 'interval')

const stop = () => {
  inter.cancel()
}
const onContinue = () => {
  inter.continue()
}

onUnmounted(() => inter.cancel())
</script>

<template>
  <Row :columns="3">
    <Col>
      interval: {{ count }}
    </Col>
    <Col>
      <button class="button" @click="stop">停止</button>
    </Col>
    <Col>
      <button class="button" @click="onContinue">继续</button>
    </Col>
  </Row>
</template>

<style scoped lang="scss">

</style>
