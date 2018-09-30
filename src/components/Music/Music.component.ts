import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Music extends Vue {
  @Prop() private src!: string;

  audioBj: any; //背景音乐
  isClass: boolean = false;

  created() {}

  //渲染完成后
  mounted() {
    let taht = this;
    this.audioBj = document.getElementById('bg_audio'); //背景音乐
    this.audioBj.load(); //背景音乐加载
    this.audioBj.volume = 0.5; //音量大小
    if (/MicroMessenger/i.test(navigator.userAgent.toLowerCase())) {
      document.addEventListener('WeixinJSBridgeReady', function() {
        taht.isClass = false;
        taht.audioBj.play();
      });
    } else {
      taht.isClass = true;
    }

    this.audioBj.addEventListener('play', () => {
      this.isClass = false;
    });
    this.audioBj.addEventListener('pause', () => {
      this.isClass = true;
    });
  }

  onStart() {
    if (this.audioBj.paused) {
      this.audioBj.play();
    } else {
      this.audioBj.pause();
    }
  }
}
