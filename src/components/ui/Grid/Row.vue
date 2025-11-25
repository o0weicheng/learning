<script setup lang="ts">
defineProps<{
  columns: number
}>()
</script>

<template>
  <div class="row" :style="{ '--columns': columns || 1 }">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.row {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
}
</style>
