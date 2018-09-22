<template>
  <div class="machine" :style="{height:w_height}">
      <div id="machineCanvas"></div>
      <span class="machine_time">{{ config.count }}</span>
      <span class="machine_pole" ref="pole"></span>
      <button class="machine_btn machine_btn1"  ref="btn1" type="button" @click="startPlay('btn1')">开始游戏</button>
      <button class="machine_btn machine_btn2"  type="button" @click="goTo('gameCenter',{ name: '1' })">游戏规则</button>
      <button class="machine_btn machine_btn3"  type="button" @click="goTo('gameCenter',{ name: '2' })">领取奖品</button>
      <audio controls ref="lhj_audio" id="lhj_audio" style="display: none;">
        <source src="@/assets/audio/lhj.mp3" type="audio/mpeg">
      </audio>
      <div class="attention_bg" v-if="isAttentionState">
        <div class="attention_layer">
            <span @click="isAttentionState = false">X</span>
            <img src="@/assets/qrcode.jpg" alt="">
            <p>关注“南宁移动”公众号才能参与游戏</p>
        </div>
      </div>
  </div>
</template>

<script>
export { default } from './machine.component.ts';
</script>

<style lang="less" scoped>
@import url('./machine.component.less');
</style>
