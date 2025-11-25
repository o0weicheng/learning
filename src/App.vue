<script setup lang="ts">
import layout from '@/Layout/index.vue'
import { routes } from "@/router";
import {provide} from "vue";

const menus = routes.map(r => ({
  path: r.path,
  title: r.meta?.title,
  name: r.name
}))

provide("menus", menus);
</script>

<template>
  <layout>
    <router-view></router-view>
  </layout>
</template>

<style scoped lang="scss">
</style>
