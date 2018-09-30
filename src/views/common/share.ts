import { Vue } from 'vue-property-decorator';
export class Share extends Vue {
  //微信分享方法
  weChatShare(obj: any, url: string) {
    ShareData.title = obj.shareTitle;
    ShareData.desc = obj.shareContent;
    ShareData.imgUrl = obj.shareImg;
    ShareData.link = url;
    this.creatScript('https://res.wx.qq.com/open/js/jweixin-1.0.0.js');
    this.creatScript('https://weixin.vpclub.cn/api/weixinbase/get?id=2005');
  }

  //加载微信文件
  creatScript(src: string) {
    let jsNode = document.createElement('script');
    jsNode.setAttribute('type', 'text/javascript');
    jsNode.setAttribute('src', src);
    document.getElementsByTagName('body')[0].appendChild(jsNode);
    console.log('创建script成功');
  }
}
