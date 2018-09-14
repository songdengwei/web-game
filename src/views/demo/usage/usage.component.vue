<template>
  <div class="usage">
    <!-- <h1>{{name}}</h1> -->
    <h3>组件本地变量: localMsg: {{localMsg}}</h3>
    <h3>生命周期</h3>
    <h3>组件内导航钩子</h3>
    <h3>自定义事件</h3>
    <input type="text" v-autoFocus>
    <button @click="btnClick">点击</button>
    <p>点击次数：{{count}}</p>
    <p>{{countComputed}}</p>
    <p>{{`propA:${propA}`}}</p>

    <transition name="fade">
      <p v-if="show">hello</p>
    </transition>
  </div>
</template>

<script>
export { default } from './usage.component.ts';
</script>

<style lang="less" scoped>
@import url('./usage.component.less');
</style>
