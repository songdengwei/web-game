<template>
  <div class="singleDog" :style="{height:w_height}">
      <Music :src="'bg.mp3'"></Music>
      <div id="singleDogCanvas"></div>
  </div>
</template>

<script>
export { default } from './singleDog.component.ts';
</script>

<style lang="less" scoped>
@import url('./singleDog.component.less');
</style>
