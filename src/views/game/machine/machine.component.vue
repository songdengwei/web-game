<template>
  <div class="machine" :style="{height:w_height}">
      <div id="machineCanvas"></div>
      <mt-button type="danger" @click.native="startPlay">开始游戏</mt-button>
  </div>
</template>

<script>
export { default } from './machine.component.ts';
</script>

<style lang="less" scoped>
@import url('./machine.component.less');
</style>
