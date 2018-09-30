<template>
  <div class="speed" :style="{height:w_height}">
      <Music :src="'bg.mp3'"></Music>
      <div id="speedCanvas"></div>
  </div>
</template>

<script>
export { default } from './speed.component.ts';
</script>

<style lang="less" scoped>
@import url('./speed.component.less');
</style>
