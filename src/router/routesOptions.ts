import { RouterOptions } from 'vue-router';

export const routesOptions: RouterOptions = {
  base: '/',
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    // ...
  },
};
