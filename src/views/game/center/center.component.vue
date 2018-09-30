<template>
  <div class="game_center" >
      <div class="tab_title clearfix">
        <span :class="{ active: config.name == '1' }" @click="config.name = '1'">活动说明</span>
        <span :class="{ active: config.name == '2' }"  @click="config.name = '2'">我的奖品</span>
      </div>
      <div class="gamec_ad" v-if="activityDetails.adList && activityDetails.adList.length > 1">
        <a v-if="activityDetails.adList[1].adUrl" :href="activityDetails.adList[1].adUrl">
          <img :src="activityDetails.adList[1].adImg" alt="">
        </a>
        <a v-if="!activityDetails.adList[1].adUrl" href="javascript:;">
          <img :src="activityDetails.adList[1].adImg" alt="">
        </a>
      </div>
      <div class="tab_cont">
        <mt-tab-container v-model="config.name">
          <mt-tab-container-item id="1">
            <div class="tabc_one">
              <div class="tabc_tit">
                <span>活动奖品</span>
              </div>
              <div class="tabc_txt">
                <p v-for="(item , index) in activityDetails.gamePrizeList" :key="index">{{ item.prize.prizeName }}</p>
              </div>
              <div class="tabc_tit">
                <span>活动时间</span>
              </div>
              <div class="tabc_txt">
                <p>{{ activityDetails.startTime }} - {{  activityDetails.endTime }}</p>
              </div>
              <div class="tabc_tit">
                <span>活动规则</span>
              </div>
              <div class="tabc_txt">
                <p>{{ activityDetails.activityRule }}</p>
              </div>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item id="2">
            <div class="tabc_two">
              <ul>
                <li v-for="(item, index ) in this.dataInfo" :key="index">
                  <span class="flex-vertical-center"><small><img :src="item.prizeImg" alt=""></small></span>
                  <div class="tabc_line flex-vertical-center">
                    <!-- <b>100</b> -->
                    <small>{{ item.prizeName }}</small>
                  </div>
                </li>
              </ul>
            </div>
          </mt-tab-container-item>

        </mt-tab-container>
      </div>
  </div>
</template>

<script>
export { default } from './center.component.ts';
</script>

<style lang="less" scoped>
@import url('./center.component.less');
</style>
