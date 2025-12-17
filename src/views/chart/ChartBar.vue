<script setup lang="ts">
import { LChart, defineChart } from '@/components/chart'

const bar = defineChart('bar', {
  labels: ['一月', '二月', '三月'] as const,
  dataset: [
    {
      label: '苹果销量（件）',
      data: [20, 30, 50],
      color: ['', '', ''],
    },
    {
      label: '香蕉销量(件)',
      data: [40, 80, 20],
      color: ['', '', ''],
    },
    {
      label: '梨销量(件)',
      data: [10, 83, 10],
      color: ['', '', ''],
    },
  ],
})
</script>

<template>
  <section class="p-2">
    <h2>柱状图</h2>
    <LChart :width="800" :height="400" :option="bar" />
  </section>
</template>
