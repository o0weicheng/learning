<script lang="ts" setup>
const bc = new BroadcastChannel('test_channel')
bc.postMessage('hello world!')

bc.onmessage = (event) => {
  console.log(event)
}
</script>

<template>
  <div>Interval</div>
</template>
