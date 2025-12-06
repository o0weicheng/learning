<script setup lang="ts">
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useLayoutScrollStore } from '@/stores/layoutScrollArea'
import { onMounted } from 'vue'
import { GhostIcon } from 'lucide-vue-next'
import OnionModel from './components/OnionModel.vue'

const { scrollTo } = useLayoutScrollStore()
onMounted(() => {
  scrollTo(0)
})

</script>

<template>
  <section>
    <Alert>
      <GhostIcon />
      <AlertTitle>各种设计模式</AlertTitle>
    </Alert>
    <Separator class="my-4" />
    <OnionModel />
  </section>
</template>
