import { RouteConfig } from 'vue-router';

// views
const Usage = () => import('@/views/demo/usage/usage.component');
const routes: RouteConfig[] = [
  {
    name: 'demoUsage',
    path: 'usage',
    component: Usage,
  },
];

export default routes;
