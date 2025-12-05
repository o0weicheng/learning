<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { VirtualList } from '@/components/virtual';

const list = Array.from({ length: 100000 }).map((_, i) => `这是虚拟列表：${i}`)
</script>

<template>
  <section>
    <Alert>
      <AlertTitle>这个页面有 10 万条数据</AlertTitle>
      <AlertDescription>用虚拟列表来完成渲染</AlertDescription>
    </Alert>
    <Card class="mt-4">
      <CardContent>
        <VirtualList :list="list" :height="500">
          <template v-slot="{ item }">
            <p>{{ item }}</p>
          </template>
        </VirtualList>
      </CardContent>
    </Card>
  </section>
</template>

<style scoped></style>
