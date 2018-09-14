import * as types from '@/store/mutation-types';
import { Commit } from 'vuex';
import { resolve } from 'path';
export interface State {
  accessToken: string;
  userId: Number;
}
const state: State = {
  accessToken: '',
  userId: 0,
};
const getters = {
  getUser: (state: State) => {
    return state;
  },
};
const mutations = {
  [types.USER](state: State, payload: any): void {
    Object.assign(state, payload);
  },
};
const actions = {
  [types.USER](context: { commit: Commit; state: State }, payload: any): Promise<any> {
    return new Promise(
      (resolve, reject): void => {
        console.log('actions1');
        setTimeout(() => {
          context.commit(types.USER, payload);
          resolve();
        }, 0);
        console.log('actions2');
      }
    );
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
