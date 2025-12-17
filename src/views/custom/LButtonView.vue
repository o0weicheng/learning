<script setup lang="ts">
const handleClick = () => {
  console.log('按钮被点击了')
}
</script>

<template>
  <LGroupButton>
    <LButton @click="handleClick">按钮1</LButton>
    <LButton @click="handleClick">按钮2</LButton>
    <LButton @click="handleClick">按钮3</LButton>
  </LGroupButton>
  <br />
  <LButton @click="handleClick">按钮4</LButton>
</template>
