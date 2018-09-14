import Vue from 'vue';
import Router from 'vue-router';
import { routesOptions } from './routesOptions';
import routes from './router';
Vue.use(Router);

export const router = new Router({
  ...routesOptions,
  routes,
});
