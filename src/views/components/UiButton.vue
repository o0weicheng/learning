<script setup lang="ts">
import { UiButton, type UiButtonProps } from '@/components/SelfButton/button';

interface ButtonSize {
  value: Required<UiButtonProps>['size']
  label: '大' | '中' | '小' | '默认'
}
const buttonSize: ButtonSize[] = [{
  value: 'large',
  label: '大'
}, {
  value: 'default',
  label: '默认'
}, {
  value: 'small',
  label: '中'
}, {
  value: 'mini',
  label: '小'
}]
const buttonTypes: Required<UiButtonProps>['type'][] = ['primary', 'danger', 'outline', 'success', 'warning']

</script>

<template>
  <section>
    <h2 class="font-bold text-2xl my-2">按钮尺寸</h2>
    <div class="flex gap-2">
      <template v-for="item of buttonSize" :key="item.label">
        <div>
          <UiButton :size="item.value">{{ item.label }}按钮</UiButton>
        </div>
      </template>
    </div>
  </section>
  <section class="mt-2">
    <h2 class="font-bold text-2xl my-2">按钮类型</h2>
    <div class="flex gap-2">
      <template v-for="item of buttonTypes" :key="item">
        <UiButton :type="item">{{ item }}</UiButton>
      </template>
    </div>

  </section>
</template>
