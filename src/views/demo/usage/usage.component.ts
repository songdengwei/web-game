import { Component, Vue, Inject, Model, Emit, Watch, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { namespace } from 'vuex-class';
import { USERUPDATE } from '@/store/mutation-types';
import { IHttp } from '@/plugins/mixins/provides/service';
import { BehaviorSub } from '@/plugins/mixins/provides/subject/base';
import { Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

const user = namespace('user'); //store-user模块

let obj = {
  b: 33,
};
// 局部混入
@Component
export class mixinTestA extends Vue {
  public mixinValue = 'mixinTestA';
  created() {
    console.log('mixinTestA');
  }
}
@Component
class mixinTestB extends Vue {
  public mixinValue = 'mixinTestB';
  created() {
    console.log('mixinTestB');
  }
}
// 局部混入

@Component
export default class Usage extends mixins(mixinTestA, mixinTestB) {
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

  // prop属性
  @Prop({
    default: '默认值',
  })
  public propA!: string;

  // data属性
  public localMsg: string = 'localMsg';
  public count: number = 0;
  public show: boolean = false;
  public config: any = {
    queryUrl: '',
  };
  constructor() {
    super();
  }

  // 监听属性
  @Watch('count')
  onCountChanged(val: number, oldVal: number) {
    console.log('旧次数：', oldVal);
    console.log('新次数：', val);
  }

  // 计算属性
  get countComputed() {
    return '计算属性：  ' + this.count;
  }

  // 自定义方法
  btnClick() {
    this.count++;
    console.log(this.name);
    console.log(
      this.USERUPDATE({
        num: this.count,
      }).then((val: any) => {
        console.log(val);
      })
    );
  }
  created() {
    this.subscribeSub = this.$NotificationOneSub
      .getParams()
      .pipe(filter((res: any) => res !== 0))
      .subscribe((item: any) => {
        debugger;
        if (item.key == 'index') {
          console.log(item);
        }
      });
    setTimeout(() => {
      this.show = false;
    }, 1000);

    this.$Http.api('loginLog/export', { name: '111' }, 'post').then(() => {});
    console.log('$http: ', this.$Http);
    console.log(this.name);
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

  /* 生命周期 */
  // beforeCreate() {}
  // created() {}
  // beforeMount() {}
  // mounted() {}
  // beforeUpdate() {}
  // beforeDestroy() {}
  // destroyed() {}

  /* 路由导航守卫钩子 */
  // beforeRouteEnter(to: any, from: any, next: Function) {
  //   next();
  // }
  // beforeRouteUpdate(to: any, from: any, next: Function) {
  //   next();
  // }
  // beforeRouteLeave(to: any, from: any, next: Function) {
  //   next();
  // }
}
