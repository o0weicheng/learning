<script setup lang="ts">
import { LChart, defineChart } from '@/components/chart'
import LButton from '@/components/ui/LButton/LButton.vue'

const bar = defineChart('pie', {
  labels: ['一月', '二月', '三月'] as const,
  dataset: [
    {
      label: 'A销量（件）',
      data: [20, 30, 50],
    },
  ] as const,
})

const handleChange = () => {
  bar.update('0', [270, 20, 79])
}
</script>

<template>
  <section class="p-2">
    <LButton @click="handleChange">更新</LButton>
    <h2>柱状图</h2>
    <LChart :width="600" :height="300" :option="bar" />
  </section>
</template>
