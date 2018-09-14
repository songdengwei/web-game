// 插件类型
import { PluginObject } from 'vue';

// 全局资源
import statics from './statics'; //静态属性/方法
import directives from './directives'; // 自定义指令
import instances from './instances'; //实例属性/方法
import filters from './filters'; //实例属性/方法
import mixins from './mixins'; // 混入

export const plugins: PluginObject<any> = {
  install(Vue, options) {
    // 静态属性/方法
    Object.assign(Vue, statics);

    // 实例属性/方法
    // Object.assign(Vue.prototype, instances);

    // 自定义指令
    Object.keys(directives).forEach((key: string) => {
      Vue.directive(key, directives[key]);
      console.log('directives[key]: ', directives[key]);
    });

    // 自定义过滤器
    Object.keys(filters).forEach((key: string) => {
      Vue.filter(key, filters[key]);
    });

    // 混入
    Vue.mixin({
      ...mixins,
    });
  },
};
