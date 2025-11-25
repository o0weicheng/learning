<script setup lang="ts">
import Sidebar from "./Sidebar.vue";
</script>

<template>
  <div class="layout">
    <Sidebar></Sidebar>
    <main class="main">
      <slot></slot>
    </main>
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: grid;
  grid-template-columns: 1fr 8fr;
  @include screen;
}
.main {
  padding: $spacing-sm;
}
</style>
