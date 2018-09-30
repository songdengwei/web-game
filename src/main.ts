import { Component, Vue } from 'vue-property-decorator';
import App from './App.vue';
import { router } from '@/router';
import store from '@/store';
// import '@/registerServiceWorker';

import { plugins } from '@/plugins'; // 引入全局插件
import '@/assets/style/base.less';
import '@/assets/style/mixin.less';
import '@/assets/style/animate.less';
import '@/assets/style/eleme.less';

Vue.config.productionTip = false;
Vue.use(plugins);

// 注册组件内的导航钩子
Component.registerHooks(['beforeRouteEnter', 'beforeRouteLeave', 'beforeRouteUpdate']);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
