<script setup lang="ts">
import { LChart, defineChart } from '@/components/chart'

const bar = defineChart('bar', {
  labels: ['一月', '二月', '三月'] as const,
  dataset: [
    {
      label: 'A销量（件）',
      data: [20, 30, 50],
      color: ['', '', ''],
    },
    {
      label: 'B销量(件)',
      data: [40, 80, 20],
      color: ['', '', ''],
    },
    {
      label: 'C销量(件)',
      data: [16, 83, 10],
      color: ['', '', ''],
    },
    {
      label: 'D销量(件)',
      data: [120, 83, 30],
      color: ['', '', ''],
    },
    {
      label: 'E销量(件)',
      data: [10, 113, 30],
      color: ['', '', ''],
    },
    {
      label: 'F销量(件)',
      data: [10, 23, 30],
      color: ['', '', ''],
    },
  ],
})
</script>

<template>
  <section class="p-2">
    <h2>柱状图</h2>
    <LChart :width="600" :height="300" :option="bar" />
  </section>
</template>
