<script setup lang="ts">
import {inject} from "vue";
import {useRoute} from "vue-router";

defineProps<{
  class?: string
}>()

interface MenuItem {
  title: string
  path: string
  name: string
}

const menus = inject<MenuItem>('menus')

const route = useRoute()
</script>

<template>
  <div :class="class" class="sidebar">
    <ul class="menu">
      <li class="menu-item" :class="{'is-active': route.name === menu.name}" v-for="menu of menus" :key="menu.path">
        <router-link :to="menu.path">{{ menu.title }}</router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";

.sidebar {
  min-width: 200px;
  max-width: 280px;
  padding: $spacing-md;
  box-sizing: border-box;
  overflow-y: auto;
  .menu {
    display: flex;
    list-style: none;
    flex-direction: column;
    maring: 0;
    padding: 0;
    .menu-item {
      padding: $spacing-sm;
      border-radius: $border-radius-sm;
      margin: $spacing-xs 0;
      color: $primary-color;
      transition: all 220ms ease-out;
      a {
        color: inherit;
        display: block;
        text-decoration: none;
        transition: inherit;
      }
      &:hover {
        background-color: color.adjust($primary-color, $lightness: 33%);
      }
      &.is-active {
        color: $white;
        background-color: $primary-color;
      }
    }
  }
}
</style>
