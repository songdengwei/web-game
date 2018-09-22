import { Component, Vue, Inject, Model, Emit, Watch, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { USERUPDATE } from '@/store/mutation-types';
import { IHttp } from '@/plugins/mixins/provides/service';
import { BehaviorSub } from '@/plugins/mixins/provides/subject/base';
import { Subscription } from 'rxjs';
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
export default class GameExpiry extends Vue {
  subscribeSub!: Subscription;

  // 依赖注入
  @Inject() '$Http': IHttp;
  @Inject() '$NotificationOneSub': BehaviorSub;

  active: string = 'tab1';
  w_height: any; //屏幕高度

  activityInfo: any = {}; //活动信息

  drawData: any = {};

  config: any = {
    count: '',
    name: 'recur',
  };

  created() {
    this.activityInfo = locStorage.getItem('activityInfo');
    this.w_height = window.screen.height + 'px';
    // console.log(TWEEN);
    this.getData();
  }

  //跳转
  goTo(name: any, query: any) {
    if (name == 'binding') {
      window.location.href = 'http://www.wxnnyd.com/nn-ticket/register/loginPre?openid=' + this.activityInfo.openid;
    } else {
      router.push({ name, query });
    }
  }

  //获取数据
  getData() {
    this.subscribeSub = this.$NotificationOneSub
      .getParams()
      .pipe(filter((res: any) => res !== 0 && res.key == 'game'))
      .subscribe((data: any) => {
        this.drawData = data.value;
        this.config.count = data.state.count;
        this.config.name = data.value.isWin ? (data.value.isBindPhone ? 'award' : 'binding') : 'recur';

        console.log(this.config.name);
        // if( data.value.isWin ){  //中奖
        //   if( data.value.isBindPhone ){  //绑定手机号
        //     this.config.name === 'award';
        //   }else{
        //     this.config.name === 'binding'
        //   }
        // }else{
        //   //没有中奖
        //   this.config.name === 'recur'
        // }
      });
  }

  //获取验证码
  getCode() {
    console.log(111);
  }

  //总体提交
  submitBox(name: string) {
    console.log(name);
    switch (name) {
      case 'recur': //再来一次
        router.push({ name: 'gameMachine' });
        break;
      case 'binding': //绑定手机号
        break;
      case 'award': //领取奖励
        break;
      case 'phone': //提交手机号
        break;
    }
  }

  //解绑
  beforeRouteLeave(to: any, from: any, next: any) {
    if (this.subscribeSub != undefined) {
      this.subscribeSub.unsubscribe();
    }
    next();
  }
}
