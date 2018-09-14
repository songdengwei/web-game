import { RouteConfig } from 'vue-router';

// views
const Machine = () => import('@/views/game/machine/machine.component');
const routes: RouteConfig[] = [
  {
    name: 'gameMachine',
    path: 'machine',
    component: Machine,
  },
];

export default routes;
