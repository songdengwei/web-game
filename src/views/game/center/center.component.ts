import { Component, Vue, Inject, Model, Emit, Watch, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { USERUPDATE } from '@/store/mutation-types';
import { IHttp } from '@/plugins/mixins/provides/service';
import { BehaviorSub } from '@/plugins/mixins/provides/subject/base';
import { Subscription } from 'rxjs';
import * as PIXI from 'pixi.js';
import { Button, TabContainer, TabContainerItem } from 'mint-ui';
import { filter, map, switchMap } from 'rxjs/operators';
import { router } from '@/router';
import { locStorage } from '@/plugins/mixins/provides/service/storage';

// var TWEEN = require('tweenjs/lib/tweenjs.min.js');

const user = namespace('user'); //store-user模块

@Component({
  components: {
    mtButton: Button,
    mtTabContainer: TabContainer,
    mtTabContainerItem: TabContainerItem,
  },
})
export default class GameCenter extends Vue {
  subscribeSub!: Subscription;

  // 依赖注入
  @Inject() '$Http': IHttp;
  @Inject() '$NotificationOneSub': BehaviorSub;

  activityInfo: any = {
    SkipCount: 0,
    MaxResultCount: 100,
  }; //活动信息

  dataInfo: any = []; //我的奖品

  activityDetails: any = {}; //活动详情

  config: any = {
    name: '1',
    infoUrl: 'Game/GetGameInfo',
    queryUrl: 'Game/QueryMyPrizes', //请求接口地址
  };

  created() {
    this.activityInfo = Object.assign(this.activityInfo, locStorage.getItem('activityInfo'));
    if (router.currentRoute.query && router.currentRoute.query.name) {
      this.config.name = router.currentRoute.query.name;
    }
    console.log('看看是啥');
    // console.log(TWEEN);
    this.getData();
  }

  //获取数据
  getData() {
    //获取中奖列表
    this.$Http.api(this.config.queryUrl, this.activityInfo, 'post').then((data: HttpBase<HttpResult>) => {
      if (data.success) {
        this.dataInfo = data.result.items;
      }
    });
    //获取活动详情
    this.$Http.api(this.config.infoUrl, { id: this.activityInfo.id }, 'get').then((data: HttpBase<HttpResult>) => {
      if (data.success) {
        this.activityDetails = data.result;
      }
    });
  }

  //解绑
  beforeRouteLeave(to: any, from: any, next: any) {
    if (this.subscribeSub != undefined) {
      this.subscribeSub.unsubscribe();
    }
    next();
  }
}
