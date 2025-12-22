<script setup lang="ts">
import { LChart, defineChart } from '@/components/chart'
import LButton from '@/components/ui/LButton/LButton.vue'

const bar = defineChart('bar', {
  labels: ['一月', '二月', '三月'] as const,
  dataset: [
    {
      label: 'A销量（件）',
      data: [20, 30, 50],
    },
    {
      label: 'B销量(件)',
      data: [40, 80, 20],
    },
    {
      label: 'C销量(件)',
      data: [16, 83, 10],
    },
    {
      label: 'D销量(件)',
      data: [120, 83, 30],
    },
    {
      label: 'E销量(件)',
      data: [10, 113, 30],
    },
    {
      label: 'F销量(件)',
      data: [10, 23, 30],
    },
  ] as const,
})

const handleChange = () => {
  bar.update('2', [210, 20, 59])
  bar.update('1', [170, 120, 109])
}
</script>

<template>
  <section class="p-2">
    <LButton @click="handleChange">更新</LButton>
    <h2>柱状图</h2>
    <LChart :width="600" :height="300" :option="bar" />
  </section>
</template>
