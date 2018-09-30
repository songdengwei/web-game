<template>
  <div class="expiry_wrap" :style="{height:w_height}">
      <div class="expiry_box expiry_recur" v-show="config.name === 'recur'">
        <button @click="submitBox('recur')">再来一次</button>
        <p>居然没有中奖！？！？<br/>再来一次吧！还有<b>{{ config.count }}</b>次机会</p>
      </div>
      <div class="expiry_box expiry_binding" v-show="config.name === 'binding'">
        <button @click="goTo('binding')">绑定手机号</button>
        <p>恭喜您获得“ <b>{{ drawData.prizeName }}</b> ”<br/>您尚未绑定手机号，绑定之后才能领取</p>
      </div>
      <div class="expiry_box expiry_award" v-show="config.name === 'award'">
        <button @click="submitBox('award')">领取奖励</button>
        <p>恭喜您获得“ <b>{{ drawData.prizeName }}</b> ”<br/>相关信息可查看﹃<b @click="goTo('gameCenter',{ name : '2' })">我的奖品</b>”中领取</p>
      </div>
      <!-- <div class="expiry_box expiry_phone" v-show="config.name === 'phone'">
        <input type="text" v-model="config.params.phone" class="expirya_input">
        <input type="text" v-model="config.params.code" class="expirya_input expirya_code">
        <span class="expirya_span" @click="getCode()">获取验证码</span>
        <button @click="submitBox('phone')">提交信息</button>
      </div> -->
      <!-- <div class="expiry_btns flex-top-auto">
        <a href="#">我要手机</a>
        <a href="#">我要流量</a>
        <a href="#">电子券使用攻略</a>
      </div> -->
  </div>
</template>

<script>
export { default } from './expiry.component.ts';
</script>

<style lang="less" scoped>
@import url('./expiry.component.less');
</style>
