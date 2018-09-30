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
export default class GameSingleDog extends Share {
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
    width: 640, //canvas宽度
    height: 1600, //canvas高度
    activate: {}, //当前活动格子对象
    reels: [], //总列数据
    path: [0, 1, 2, 5, 8, 7, 6, 3],
    speed: 3, //游戏速度
    tweening: [], //所有运动参数集合
    gameContainer: {}, //游戏容器
    stoneContainer: [], //左边石头容器
    stoneReels: [], //左边石头列表
    stoneContainer2: [], //右边石头容器
    stoneReels2: [], //右边石头列表
  };

  //数据加载的图片
  imglist: any = [
    { name: 'img_dog', url: require('@/assets/singleDog/dog_img_01.png') }, //狗狗
    { name: 'img_badge', url: require('@/assets/singleDog/dog_img_02.png') }, //徽章
    { name: 'img_bone', url: require('@/assets/singleDog/dog_img_03.png') }, //骨头
    { name: 'img_stone', url: require('@/assets/singleDog/dog_img_04.png') }, //石头
    { name: 'img_barrier_across', url: require('@/assets/singleDog/dog_img_05.png') }, //横
    { name: 'img_barrier_vertical', url: require('@/assets/singleDog/dog_img_06.png') }, //竖
  ];

  created() {
    this.w_height = window.screen.height + 'px';
    // new Vconsole(); //打开测试
  }

  //渲染完了
  mounted() {
    this.app = new PIXI.Application(this.config.width, this.config.height, { transparent: true });
    let eleCanvas: any = document.getElementById('singleDogCanvas') || document.body;
    eleCanvas.innerHTML = '';
    eleCanvas.appendChild(this.app.view);
    this.init();
    // this.getData();
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
    console.log(this.slotTextures);

    //创建dog
    this.config.gameContainer = new PIXI.Container(); //游戏场景
    this.app.stage.addChild(this.config.gameContainer);

    let dogSprite = new PIXI.Sprite(this.slotTextures[0]); //狗狗
    let badgeSprite = new PIXI.Sprite(this.slotTextures[1]); //徽章
    let boneSprite = new PIXI.Sprite(this.slotTextures[2]); //骨头

    let acrossSprite = new PIXI.Sprite(this.slotTextures[4]); //横
    let verticalSprite = new PIXI.Sprite(this.slotTextures[5]); //竖

    dogSprite.position.set((this.config.width - dogSprite.width) / 2, 320);
    this.config.gameContainer.addChild(dogSprite);

    //石头

    this.stoneCre(); //

    // Listen for animate update.
    // this.app.ticker.add((delta: any) => {

    // });

    this.updateGame();
  }

  //石头生成
  stoneCre() {
    this.config.stoneContainer = new PIXI.Container();
    this.config.stoneContainer2 = new PIXI.Container();
    this.config.gameContainer.addChild(this.config.stoneContainer);
    this.config.gameContainer.addChild(this.config.stoneContainer2);
    for (let i = 0; i < 3; i++) {
      let stoneSprite = new PIXI.Sprite(this.slotTextures[3]); //石头
      stoneSprite.x = i * 0.55 * 125 * -1;
      stoneSprite.y = i * 125;
      stoneSprite.scale.x = 1 + i * (0.45 / this.config.speed);
      stoneSprite.scale.y = 1 + i * (0.45 / this.config.speed);
      this.config.stoneContainer.addChild(stoneSprite);
      this.config.stoneReels.push(stoneSprite);
    }

    for (let i = 0; i < 3; i++) {
      let stoneSprite = new PIXI.Sprite(this.slotTextures[3]); //石头
      stoneSprite.x = i * 0.55 * 125;
      stoneSprite.y = i * 125;
      stoneSprite.scale.x = 1 + i * (0.45 / this.config.speed);
      stoneSprite.scale.y = 1 + i * (0.45 / this.config.speed);
      this.config.stoneContainer2.addChild(stoneSprite);
      this.config.stoneReels2.push(stoneSprite);
    }

    this.config.stoneContainer.x = 0;
    this.config.stoneContainer2.x = this.app.screen.width - 40;
    this.config.stoneContainer.y = 600;
    this.config.stoneContainer2.y = 600;
  }

  updateGame() {
    this.app.ticker.add((delta: any) => {
      //左边石头
      this.config.stoneReels.forEach((item: any, index: Number) => {
        item.x += 0.55 * this.config.speed;
        item.y -= 1 * this.config.speed;
        item.scale.x -= 0.012 / this.config.speed;
        item.scale.y -= 0.012 / this.config.speed;
        if (item.y <= -400) {
          item.x = 0;
          item.scale.x = 1;
          item.scale.y = 1;
          item.y = 0;
        }
      });
      //右边石头
      this.config.stoneReels2.forEach((item: any, index: Number) => {
        item.x += 0.55 * this.config.speed * -1;
        item.y -= 1 * this.config.speed;
        item.scale.x -= 0.012 / this.config.speed;
        item.scale.y -= 0.012 / this.config.speed;
        if (item.y <= -400) {
          item.x = 0;
          item.scale.x = 1;
          item.scale.y = 1;
          item.y = 0;
        }
      });
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
