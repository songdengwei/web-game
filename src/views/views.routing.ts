// views
import { RouteConfig } from 'vue-router';
import demoModule from '@/views/demo/demo.routing';
import gameModule from '@/views/game/game.routing';

const routes: RouteConfig[] = [
  {
    name: '',
    path: '',
    redirect: 'game/machine',
  },
  {
    name: 'demo',
    path: 'demo',
    children: demoModule,
  },
  {
    name: 'game',
    path: 'game',
    children: gameModule,
  },
  {
    path: '*',
    redirect: 'home',
  },
];

export default routes;
