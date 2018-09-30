import { Component, Inject } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { USERUPDATE } from '@/store/mutation-types';
import { Share } from '@/views/common/share.ts';
import { IHttp } from '@/plugins/mixins/provides/service';
import Music from '@/components/Music/Music.component.vue';
import { BehaviorSub } from '@/plugins/mixins/provides/subject/base';
import { Subscription } from 'rxjs';
import * as PIXI from 'pixi.js';
import { locStorage, sesStorage } from '@/plugins/mixins/provides/service/storage';
import { Button, Indicator, Toast, MessageBox } from 'mint-ui';
import { filter, map, switchMap } from 'rxjs/operators';
import { router } from '@/router';
import filters from '../../../plugins/filters/index';
import { cloneObj } from '../../../plugins/mixins/provides/service/cloneObj';
import Vconsole from 'vconsole';

const TWEEN = require('@tweenjs/tween.js'); //感觉不是那个库

const user = namespace('user'); //store-user模块

@Component({
  components: {
    Music,
  },
})
export default class GameSpeed extends Share {
  subscribeSub!: Subscription;

  // 依赖注入
  @Inject() '$Http': IHttp;
  @Inject() '$NotificationOneSub': BehaviorSub;

  // store属性/方法
  public name!: any;
  @user.State((state) => state)
  @user.Getter('getName')
  public getName!: Function;
  @user.Mutation(USERUPDATE) public mutationUSERUPDATE!: Function;
  @user.Action(USERUPDATE) public USERUPDATE!: Function;

  activityInfo: any = {}; //活动信息

  app: any; //canvas应用
  w_height: any; //屏幕高度
  running: boolean = false; //游戏开关
  slotTextures: Array<any> = [];
  // anFrame: any; //帧管理器

  //活动公用参数
  params: any = {
    id: Number,
    openid: '',
  };
  gameInfo: any = {}; //游戏详情

  //抽奖结果数据
  drawData: any = {
    isBindPhone: false,
    isWin: true, //是否中奖
    prizeName: 'img_6',
  };

  //游戏，接口配置
  config: any = {
    queryUrl: 'Game/GetGameInfo', //获取活动详情
    countUrl: 'Game/GetLotteryCount', //获取抽奖次数
    lotteryUrl: 'Game/Lottery', //抽奖
    attentionUrl: 'Game/IsAttention', //是否关注公众号
    imgName: 'pixi_img_', //存取图片的key名后面会跟索引
    count: 0, //总次数
    select: 1, //选中的第几个，一般默认是谢谢参与，这里的索引是下面图片的顺序
    len: 0, //图片总长度
    beginValue: 0, // 转动起步的个格子
    REEL_WIDTH: 200, //图片的宽度
    REEL_HEIGHT: 200, //图片高度
    MARGIN: 5, //左边距
    width: 610, //canvas宽度
    height: 610, //canvas高度
    activate: {}, //当前活动格子对象
    reels: [], //总列数据
    path: [0, 1, 2, 5, 8, 7, 6, 3],
    tweening: [], //所有运动参数集合
  };

  //数据加载的图片
  imglist: any = [];

  created() {
    this.w_height = window.screen.height + 'px';
    // new Vconsole(); //打开测试
  }

  //渲染完了
  mounted() {
    this.app = new PIXI.Application(this.config.width, this.config.height, { transparent: true });
    let eleCanvas: any = document.getElementById('speedCanvas') || document.body;
    eleCanvas.innerHTML = '';
    eleCanvas.appendChild(this.app.view);
    this.getData();
    // this.anFrame = requestAnimationFrame(this.animate); //  动画更新
  }

  //获取数据
  getData() {
    //模拟数据
    setTimeout(() => {
      // super.weChatShare(this.gameInfo, window.location.origin + '/game/machine?id=' + this.params.id);
      //最后添加一个开始游戏的图片
      let arr = [
        { name: 'img_1', url: require('@/assets/speed/speed_img_01.jpg') },
        { name: 'img_2', url: require('@/assets/speed/speed_img_02.jpg') },
        { name: 'img_3', url: require('@/assets/speed/speed_img_03.jpg') },
        { name: 'img_4', url: require('@/assets/speed/speed_img_04.jpg') },
        { name: 'img_6', url: require('@/assets/speed/speed_img_06.jpg') },
        { name: 'img_7', url: require('@/assets/speed/speed_img_07.jpg') },
        { name: 'img_8', url: require('@/assets/speed/speed_img_08.jpg') },
        { name: 'img_9', url: require('@/assets/speed/speed_img_09.jpg') },
        // { name: '', url: require('@/assets/speed/speed_img_05.jpg') },
      ];
      arr.splice(4, 0, { name: 'img_start', url: require('@/assets/speed/speed_img_05.png') });
      this.imglist = arr.map((item: any, index: Number) => ({
        name: item.name,
        url: item.url,
        index: index,
      }));
      this.init();
    }, 1000);
    // this.$Http.api(this.config.queryUrl, { id: this.params.id }, 'get').then((data: HttpBase<HttpResult>) => {

    // })
  }

  //得奖后的处理
  fulfillHandle() {
    // this.$NotificationOneSub.pushParams({
    //   key: 'game',
    //   value: this.drawData, //抽奖返回的结果
    //   state: {
    //     count: this.config.count, //剩余的次数
    //   },
    // });
    // router.push({ name: 'gameExpiry' });
  }

  //跳转
  goTo(name: string, query: any) {
    router.push({ name, query });
  }

  //开始
  //Function to start playing.
  startPlay(name: string = '') {
    //活动时间限制

    //判断次数
    // if (this.config.count <= 0) {
    //   Toast({
    //     message: '没有次数了！',
    //     position: 'bottom',
    //     duration: 2000,
    //   });
    //   return;
    // }

    // //重复开关
    if (this.running) return;
    // Indicator.open('加载中...');

    //抽奖请求
    // this.$Http.api(this.config.lotteryUrl, this.params, 'get').then((data: HttpBase<HttpResult>) => {
    //   if (data.success) {
    //     this.running = true;
    //     this.drawData = data.result;
    //     Indicator.close();

    //     if (this.drawData.isWin) {
    //       //是否中奖，返回中奖名称
    //       console.log(this.imglist);
    //       let obj = this.imglist.filter((res: any) => res.name === this.drawData.prizeName);
    //       if (obj && obj.length) {
    //         this.config.path.forEach((name: any, index: Number) => {
    //           if (name == +obj[0].index) {
    //             this.config.select = index;
    //           }
    //         });
    //       }
    //     } else {
    //       //没有中奖选择最后一个
    //       this.config.select = this.config.len - 1;
    //     }
    //   }
    // });

    //测试
    if (this.drawData.isWin) {
      this.running = true;
      //是否中奖，返回中奖名称
      console.log(this.imglist);
      let obj = this.imglist.filter((res: any) => res.name === this.drawData.prizeName);
      if (obj && obj.length) {
        this.config.path.forEach((name: any, index: Number) => {
          if (name == +obj[0].index) {
            this.config.select = index;
          }
        });
      }
    } else {
      //没有中奖选择最后一个
      this.config.select = this.config.len - 1;
    }

    //抽奖
    this.tweenTo(this.config.activate, 56 + this.config.select, 6000, this.backout(0.3), null, this.reelsComplete);
  }

  //游戏的逻辑
  //返回图片列表
  setImgs(): Array<any> {
    let arr: any = [];
    if (Object.keys(PIXI.loader.resources).length) {
      let keys = Object.keys(PIXI.loader.resources);
      keys.forEach((item: any, index: number) => {
        arr.push(PIXI.loader.resources[this.config.imgName + index + ''].texture);
      });
    }
    return arr;
  }

  //初始化
  init() {
    if (!Object.keys(PIXI.loader.resources).length) {
      //加载图片
      this.imglist.forEach((item: any, index: number) => {
        // require(item.url)
        PIXI.loader.add(this.config.imgName + index + '', item.url, { crossOrigin: 'anonymous' });
        if (index + 1 >= this.imglist.length) {
          PIXI.loader.load(this.onAssetsLoaded);
        }
      });
    } else {
      //读取缓存
      this.onAssetsLoaded();
    }
  }

  //加载完后运行
  onAssetsLoaded() {
    this.slotTextures = this.setImgs();
    this.config.len = this.slotTextures.length;
    var reelContainer = new PIXI.Container();
    //绘制九宫格
    for (var i = 0; i < this.config.len; i++) {
      let img = new PIXI.Sprite(this.slotTextures[i]);
      img.x = this.config.REEL_WIDTH * (i % 3) + this.config.MARGIN * (i % 3);
      img.y = this.config.REEL_WIDTH * Math.floor(i / 3) + this.config.MARGIN * Math.floor(i / 3);
      img.width = this.config.REEL_WIDTH;
      img.height = this.config.REEL_WIDTH;
      if (i == 4) {
        //给中间格子添加事件
        img.interactive = true;
        img.buttonMode = true;
        // img.on('touchstart', this.startPlay);
        img.on('touchmove', (event: any) => {
          console.log('移动' + event.data.global.x + '||' + event.data.global.y);
        });
        img.on('touchend', (event: any) => {
          console.log('结束' + event.data.global.x + '||' + event.data.global.y);
        });
      }
      reelContainer.addChild(img);
      this.config.reels.push(img);
      console.log(this.config.reels);
    }
    //绘制当前选中
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0xff9409, 1);
    graphics.beginFill(0x000000, 0.5);
    graphics.drawRoundedRect(2, 2, 196, 196, 58);
    graphics.endFill();
    this.config.activate = graphics;
    reelContainer.addChild(graphics);

    this.app.stage.addChild(reelContainer);

    // Listen for animate update.
    // this.app.ticker.add((delta: any) => {

    // });

    this.updateGame();
  }

  updateGame() {
    this.app.ticker.add((delta: any) => {
      var now = Date.now();
      var remove = [];
      for (var i = 0; i < this.config.tweening.length; i++) {
        var t = this.config.tweening[i];
        var phase = Math.min(1, (now - t.start) / t.time);
        let inow = this.lerp(this.config.beginValue, t.target, t.easing(phase));
        console.log(inow);
        this.config.activate.x = this.config.reels[this.config.path[Math.floor(inow) % 8]].x;
        this.config.activate.y = this.config.reels[this.config.path[Math.floor(inow) % 8]].y;
        if (t.change) t.change(t);
        if (phase == 1) {
          this.config.beginValue = Math.floor(inow) % 8;
          if (t.complete) t.complete(t);
          remove.push(t);
        }
      }
      for (var i = 0; i < remove.length; i++) {
        this.config.tweening.splice(this.config.tweening.indexOf(remove[i]), 1);
        if (this.config.tweening.length == 0) {
          console.log('看看是不是执行了一次');
          this.fulfillHandle();
        }
      }
    });
  }

  //按钮动画
  btnAnime(name: string) {}

  reelsComplete() {
    console.log('运动完成');
    this.running = false;
  }
  //缓动算法
  tweenTo(object: any, target: any, time: any, easing: any, onchange: any, oncomplete: any) {
    var tween = {
      object: object,
      easing: easing,
      target: target,
      time: time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    };

    this.config.tweening.push(tween);
    return tween;
  }
  lerp(a1: any, a2: any, t: any) {
    return a1 * (1 - t) + a2 * t;
  }
  backout(amount: any) {
    return function(t: any) {
      return --t * t * ((amount + 1) * t + amount) + 1;
    };
  }

  //更新库
  animate(time: any) {
    requestAnimationFrame(this.animate);
    TWEEN.update(time);
  }

  //解绑
  beforeRouteLeave(to: any, from: any, next: any) {
    this.app.destroy(true, { children: true }); //清理pixijs动画帧监听，但是没有清理图片缓存
    // cancelAnimationFrame(this.anFrame); //清理原生的监听
    if (this.subscribeSub != undefined) {
      this.subscribeSub.unsubscribe();
    }
    next();
  }
}
