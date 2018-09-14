import { RouteConfig } from 'vue-router';
import { CreateElement } from 'vue';
// views
import routing from '@/views/views.routing';

const routerView = {
  render(h: CreateElement) {
    return h('router-view');
  },
};

const routes: RouteConfig[] = [
  {
    path: '/',
    component: routerView,
    children: routing.map((item) =>
      Object.assign(item, {
        component: routerView,
      })
    ),
  },
];

export default routes;
