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
    mtButton: Button,
  },
})
export default class GameMachine extends Share {
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
  anFrame: any; //帧管理器
  audioBj: any; //摇杆音乐

  gameInfo: any = {}; //游戏详情
  isAdState: boolean = false; //首屏广告
  attentionState: any = ''; //是否关注过，没有关注就不能游戏
  isAttentionState: boolean = false; //关注开关
  isStartTime: boolean = false; //活动时间
  isStartTxt: string = ''; //活动时间

  //活动公用参数
  params: any = {
    id: Number,
    openid: '',
  };

  //抽奖结果数据
  drawData: any = {
    isBindPhone: false,
    isWin: false, //是否中奖
    prizeName: '',
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
    len: 0, //奖品总长度
    REEL_WIDTH: 100, //图片的宽度
    SYMBOL_SIZE: 100, //图片高度
    MARGIN_LEFT: 165, //左边距
    width: 750, //canvas宽度
    height: 207, //canvas高度
    reels: [], //总列数据
    tweening: [], //所有运动参数集合
  };

  //数据加载的图片
  imglist: any = [
    // require('@/assets/eggHead.png')
    // { name: '', url: '@/assets/eggHead.png' },
    // { name: '', url: '@/assets/flowerTop.png' },
    // { name: '', url: '@/assets/helmlok.png' },
    // { name: '', url: '@/assets/skully.png' },
  ];

  created() {
    //广告弹层
    let sesState: any = sesStorage.getItem('isAdState');
    if (sesState) {
      this.isAdState = false;
    } else {
      this.isAdState = true;
      sesStorage.setItem('isAdState', 'ok');
    }

    this.activityInfo = locStorage.getItem('activityInfo');
    if (router.currentRoute.query) {
      console.log(router.currentRoute.query.openid);
      this.params.id = router.currentRoute.query.id || this.activityInfo.id;
      this.params.openid = sessionStorage.getItem('openid');
      locStorage.setItem('activityInfo', this.params);
    }
    if (!this.params.openid) {
      this.isAttentionState = true;
    }
    this.w_height = window.screen.height + 'px';

    // new Vconsole(); //打开测试
  }

  //渲染完了
  mounted() {
    this.getData();
    this.audioBj = document.getElementById('lhj_audio'); //摇杆音乐
    this.audioBj.load(); //摇杆音乐加载
    this.app = new PIXI.Application(this.config.width, this.config.height, { transparent: true });
    let aa: any = document.getElementById('machineCanvas') || document.body;
    aa.innerHTML = '';
    aa.appendChild(this.app.view);
    this.anFrame = requestAnimationFrame(this.animate); //  动画更新
  }

  //获取数据
  getData() {
    //获取是否关注
    if (this.params.openid) {
      this.$Http
        .api(this.config.attentionUrl, { openid: this.params.openid }, 'get')
        .then((data: HttpBase<HttpResult>) => {
          if (data.success) {
            this.attentionState = data.result;
            this.isAttentionState = this.attentionState ? false : true;
          }
        });
      //获取抽奖次数
      this.$Http.api(this.config.countUrl, this.params, 'get').then((data: HttpBase<HttpResult>) => {
        if (data.success) {
          this.config.count = data.result;
        }
      });
    }
    //获取活动详情
    this.$Http.api(this.config.queryUrl, { id: this.params.id }, 'get').then((data: HttpBase<HttpResult>) => {
      if (data.success) {
        this.gameInfo = data.result;
        //微信分享方法调用
        super.weChatShare(this.gameInfo, window.location.origin + '/game/machine?id=' + this.params.id);
        //首屏广告
        if (this.gameInfo.adList && this.gameInfo.adList[0] && this.gameInfo.adList[0].adImg) {
        }
        //活动奖品
        if (this.gameInfo && this.gameInfo.gamePrizeList && this.gameInfo.gamePrizeList.length) {
          this.gameInfo.gamePrizeList.push({
            prize: {
              prizeName: '谢谢参与',
              prizeImg: require('@/assets/thanks_img.png'),
            },
          });
          this.imglist = this.gameInfo.gamePrizeList.map((item: any, index: Number) => ({
            name: item.prize.prizeName,
            url: item.prize.prizeImg,
            index: index,
          }));
        }
        //活动时间判断
        if (
          new Date().getTime() <= new Date(this.gameInfo.startTime).getTime() ||
          new Date().getTime() >= new Date(this.gameInfo.endTime).getTime()
        ) {
          this.isStartTime = true;
          this.isStartTxt =
            new Date().getTime() <= new Date(this.gameInfo.startTime).getTime() ? '活动还没有开始' : '活动已结束';
        }
        //初始化游戏
        this.init();
        console.log(this.gameInfo);
      }
    });
  }

  //得奖后的处理
  fulfillHandle() {
    this.$NotificationOneSub.pushParams({
      key: 'game',
      value: this.drawData, //抽奖返回的结果
      state: {
        count: this.config.count, //剩余的次数
      },
    });
    router.push({ name: 'gameExpiry' });
  }

  //跳转
  goTo(name: string, query: any) {
    router.push({ name, query });
  }

  //开始
  //Function to start playing.
  startPlay(name: string = '') {
    //活动时间限制
    if (this.isStartTime) {
      MessageBox('提示', this.isStartTxt);
      return;
    }
    //判断次数
    if (this.config.count <= 0) {
      Toast({
        message: '没有次数了！',
        position: 'bottom',
        duration: 2000,
      });
      return;
    }
    //是否关注微信公众号
    if (!this.params.openid) {
      this.isAttentionState = true;
    }
    if (this.attentionState == '') {
      return;
    }
    if (!this.attentionState) {
      this.isAttentionState = true;
      return;
    }
    //重复开关
    if (this.running) return;
    Indicator.open('加载中...');

    //请求接口
    // setTimeout(() => {
    //   this.linkData();
    //   // Indicator.close();
    // }, 500);

    // //转起来
    // for (var i = 0; i < this.config.reels.length; i++) {
    //   var r = this.config.reels[i];
    //   var extra = Math.floor(Math.random() * 3);
    //   this.tweenTo(
    //     r,
    //     'position',
    //     r.position + this.config.len * 20 + i * this.config.len,
    //     10000 + i * 600,
    //     this.backout(0.5),
    //     null,
    //     i == this.config.reels.length - 1 ? this.reelsComplete : null
    //   );
    // }

    //抽奖
    this.audioBj.play(); //播放音乐
    this.$Http.api(this.config.lotteryUrl, this.params, 'get').then((data: HttpBase<HttpResult>) => {
      if (data.success) {
        this.running = true;
        this.drawData = data.result;
        Indicator.close();
        //动画
        if (name === 'btn1') {
          this.btnAnime(name); //动画
        }

        if (this.drawData.isWin) {
          //是否中奖，返回中奖名称
          console.log(this.imglist);
          let obj = this.imglist.filter((res: any) => res.name === this.drawData.prizeName);
          if (obj && obj.length) {
            this.config.select = +obj[0].index;
          }
        } else {
          this.config.select = this.config.len - 1;
        }
        console.log('看看第几个');
        console.log(this.config.select);
        console.log(this.slotTextures);
        console.log(this.slotTextures[this.config.select].baseTexture.imageUrl);
        //转起来
        for (var i = 0; i < this.config.reels.length; i++) {
          var r = this.config.reels[i];
          var extra = Math.floor(Math.random() * 3);
          this.tweenTo(
            r,
            'position',
            r.position + this.config.len * 15 + i * this.config.len,
            5500 + i * 600,
            this.backout(0.3),
            null,
            i == this.config.reels.length - 1 ? this.reelsComplete : null
          );
        }
        this.config.count -= 1;
      } else {
        Indicator.close();
      }
    });

    //模拟请求接口拿到数据
    // setTimeout(() => {
    //   // this.linkData();

    // }, 300);
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
    console.log('加载的图片');
    console.log(this.slotTextures);

    this.config.len = this.slotTextures.length;

    var reelContainer = new PIXI.Container();
    for (var i = 0; i < 3; i++) {
      var rc = new PIXI.Container();
      rc.x = i * this.config.REEL_WIDTH + i * 40 + this.config.MARGIN_LEFT;
      rc.y = -40;
      reelContainer.addChild(rc);

      var reel: any = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new PIXI.filters.BlurFilter(),
      };
      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      rc.filters = [reel.blur];

      //Build the symbols
      for (var j = 0; j < this.config.len; j++) {
        let symbol: any = new PIXI.Sprite(this.slotTextures[j]);
        // let symbol: any = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
        //Scale the symbol to fit symbol area.
        symbol.y = j * this.config.SYMBOL_SIZE;
        symbol.scale.x = symbol.scale.y =
          Math.min(this.config.SYMBOL_SIZE / symbol.width, this.config.SYMBOL_SIZE / symbol.height) * 0.9;
        symbol.x = Math.round((this.config.SYMBOL_SIZE - symbol.width) / 2);
        reel.symbols.push(symbol);
        rc.addChild(symbol);
      }
      this.config.reels.push(reel);
    }

    this.app.stage.addChild(reelContainer);

    // Listen for animate update.
    this.app.ticker.add((delta: any) => {
      //Update the slots.
      for (var i = 0; i < this.config.reels.length; i++) {
        var r = this.config.reels[i];
        //Update blur filter y amount based on speed.
        //This would be better if calculated with time in mind also. Now blur depends on frame rate.
        r.blur.blurY = (r.position - r.previousPosition) * 8;
        r.previousPosition = r.position;

        //Update symbol positions on reel.
        for (var j = 0; j < r.symbols.length; j++) {
          var s = r.symbols[j];
          var prevy = s.y;
          s.y = ((r.position + j) % r.symbols.length) * this.config.SYMBOL_SIZE - this.config.SYMBOL_SIZE;
          if (s.y < 0 && prevy > this.config.SYMBOL_SIZE) {
            //Detect going over and swap a texture.
            //This should in proper product be determined from some logical reel.
            // s.texture = slotTextures[j];
            s.texture = this.slotTextures[
              // j == 2 ? +this.config.select : j
              j == 2 ? +this.config.select : Math.floor(Math.random() * this.slotTextures.length)
            ];
            // s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
            s.scale.x = s.scale.y =
              Math.min(this.config.SYMBOL_SIZE / s.texture.width, this.config.SYMBOL_SIZE / s.texture.height) * 0.9;
            s.x = Math.round((this.config.SYMBOL_SIZE - s.width) / 2);
          }
        }
      }
    });

    this.updateGame();
  }

  updateGame() {
    this.app.ticker.add((delta: any) => {
      var now = Date.now();
      var remove = [];
      for (var i = 0; i < this.config.tweening.length; i++) {
        var t = this.config.tweening[i];
        var phase = Math.min(1, (now - t.start) / t.time);
        t.object[t.property] = this.lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase == 1) {
          t.object[t.property] = t.target;
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

  //衔接--sdw
  linkData() {
    if (this.config.tweening && this.config.tweening.length) {
      this.config.tweening.forEach((item: any, index: number) => {
        item.time = Date.now() - item.start + 3000;
      });
    }
  }

  //按钮动画
  btnAnime(name: string) {
    let that = this;
    var coords = { x: 0, y: 0, s: 1 };
    var coords2 = { x: 0, y: 0, s: 1 };
    //按钮开始
    var tweenA = new TWEEN.Tween(coords)
      .to({ y: 3, s: 0.96 }, 200)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function() {
        (<any>that.$refs[name]).style.setProperty(
          'transform',
          'translateY(' + coords.y + 'px) scale( ' + coords.s + ' )'
        );
      });
    // 按钮结束
    var tweenB = new TWEEN.Tween(coords)
      .to({ y: 0, s: 1 }, 200)
      .easing(TWEEN.Easing.Quintic.Out)
      .onUpdate(function() {
        (<any>that.$refs[name]).style.setProperty(
          'transform',
          'translateY(' + coords.y + 'px) scale( ' + coords.s + ' )'
        );
      });
    //遥感开始
    var tweenC = new TWEEN.Tween(coords2)
      .to({ x: 5, y: 40, s: 0.8 }, 300)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function() {
        (<any>that.$refs['pole']).style.setProperty(
          'transform',
          'translate(' + coords2.x + 'px, ' + coords2.y + 'px) scaleY( ' + coords2.s + ' )'
        );
      });
    //遥感结束
    var tweenD = new TWEEN.Tween(coords2)
      .to({ x: 0, y: 0, s: 1 }, 200)
      .easing(TWEEN.Easing.Quintic.Out)
      .onUpdate(function() {
        (<any>that.$refs['pole']).style.setProperty(
          'transform',
          'translate(' + coords2.x + 'px, ' + coords2.y + 'px) scaleY( ' + coords2.s + ' )'
        );
      });

    tweenA.chain(tweenB);
    tweenC.chain(tweenD);
    tweenA.start();
    tweenC.delay(20);
    tweenC.start();
  }

  reelsComplete() {
    this.running = false;
  }
  tweenTo(object: any, property: string, target: any, time: any, easing: any, onchange: any, oncomplete: any) {
    var tween = {
      object: object,
      property: property,
      propertyBeginValue: object[property],
      target: target,
      easing: easing,
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
    cancelAnimationFrame(this.anFrame); //清理原生的监听
    if (this.subscribeSub != undefined) {
      this.subscribeSub.unsubscribe();
    }
    next();
  }
}
