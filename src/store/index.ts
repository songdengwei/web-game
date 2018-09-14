import Vue from 'vue';
import Vuex from 'vuex';

import plugins from '@/store/plugins';

import user, { State as UserState } from '@/store/modules/user';
import car from '@/store/modules/car';

Vue.use(Vuex);

// export interface State {
//   user: UserState;
// }

export default new Vuex.Store({
  plugins: [plugins],
  modules: {
    user,
    car,
  },
});
