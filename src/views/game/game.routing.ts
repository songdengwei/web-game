import { RouteConfig } from 'vue-router';

// views
const Machine = () => import('@/views/game/machine/machine.component');
const Center = () => import('@/views/game/center/center.component');
const Expiry = () => import('@/views/game/expiry/expiry.component');
const routes: RouteConfig[] = [
  {
    name: 'gameMachine',
    path: 'machine',
    component: Machine,
  },
  {
    name: 'gameCenter',
    path: 'center',
    component: Center,
  },
  {
    name: 'gameExpiry',
    path: 'expiry',
    component: Expiry,
  },
];

export default routes;
