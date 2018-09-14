import { Component, Vue, Inject, Model, Emit, Watch, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { USERUPDATE } from '@/store/mutation-types';
import { IHttp } from '@/plugins/mixins/provides/service';
import { BehaviorSub } from '@/plugins/mixins/provides/subject/base';
import { Subscription } from 'rxjs';
import * as PIXI from 'pixi.js';
import { Button } from 'mint-ui';
import { filter, map, switchMap } from 'rxjs/operators';

const user = namespace('user'); //store-user模块

@Component({
  components: {
    mtButton: Button,
  },
})
export default class GameMachine extends Vue {
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

  app: any;
  html: any;
  w_height: any;
  running: boolean = false;

  config: any = {
    queryUrl: 'aaa',
    REEL_WIDTH: 50,
    SYMBOL_SIZE: 50,
    width: 750,
    height: 100,
    reels: [],
    tweening: [],
  };

  init() {
    PIXI.loader
      .add(require('@/assets/eggHead.png'), require('@/assets/eggHead.png'))
      .add(require('@/assets/flowerTop.png'), require('@/assets/flowerTop.png'))
      .add(require('@/assets/helmlok.png'), require('@/assets/helmlok.png'))
      .add(require('@/assets/skully.png'), require('@/assets/skully.png'))
      .load(this.onAssetsLoaded);
  }

  //加载完后运行
  onAssetsLoaded() {
    let slotTextures = [
      PIXI.Texture.fromImage(require('@/assets/eggHead.png')),
      PIXI.Texture.fromImage(require('@/assets/flowerTop.png')),
      PIXI.Texture.fromImage(require('@/assets/helmlok.png')),
      PIXI.Texture.fromImage(require('@/assets/skully.png')),
    ];

    var reelContainer = new PIXI.Container();
    for (var i = 0; i < 3; i++) {
      var rc = new PIXI.Container();
      rc.x = i * this.config.REEL_WIDTH + i * 22 + 80;
      rc.y = -20;
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
      for (var j = 0; j < 4; j++) {
        let symbol: any = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
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
            s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
            s.scale.x = s.scale.y =
              Math.min(this.config.SYMBOL_SIZE / s.texture.width, this.config.SYMBOL_SIZE / s.texture.height) * 0.9;
            s.x = Math.round((this.config.SYMBOL_SIZE - s.width) / 2);
          }
        }
      }
    });

    this.updateGame();
  }

  //开始
  //Function to start playing.
  startPlay() {
    if (this.running) return;
    this.running = true;

    for (var i = 0; i < this.config.reels.length; i++) {
      var r = this.config.reels[i];
      var extra = Math.floor(Math.random() * 3);
      this.tweenTo(
        r,
        'position',
        r.position + 10 + i * 5 + extra,
        2500 + i * 600 + extra * 600,
        this.backout(0.6),
        null,
        i == this.config.reels.length - 1 ? (this.running = false) : null
      );
    }
  }

  tweenTo(object: any, property: any, target: any, time: any, easing: any, onchange: any, oncomplete: any) {
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
      }
    });
  }

  created() {
    this.w_height = window.screen.height + 'px';
    console.log(this.w_height);
  }

  //渲染完了
  mounted() {
    this.app = new PIXI.Application(this.config.width, this.config.height, { transparent: true });
    let aa: any = document.getElementById('machineCanvas') || document.body;
    aa.appendChild(this.app.view);
    // document.body.appendChild(this.app.view);

    this.init();
  }

  //获取数据
  getData() {
    this.$Http.api(this.config.queryUrl, {}, 'post').then((data: HttpBase<HttpResult>) => {
      if (data.success) {
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
