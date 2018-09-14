import { Commit } from 'vuex';
import * as types from '@/store/mutation-types';

interface Shape {
  id: number;
  quantity: number;
}

interface CheckoutFailurePayload {
  savedCartItems: Shape[];
}

export interface State {
  added: Shape[];
}

// initial state
// shape: [{ id, quantity }]
const initState: State = {
  added: [],
};

// getters
const getters = {
  getName: (state: State) => state.added,
};

// actions
const actions = {
  checkout(context: { commit: Commit; state: State }, products: any[]): void {
    const failurePayload: CheckoutFailurePayload = {
      savedCartItems: [...context.state.added],
    };
    context.commit(types.ADD_TO_CART);
  },
};

// mutations
const mutations = {
  [types.ADD_TO_CART](state: State, payload: any): void {
    const record = state.added.find((p) => p.id === payload.id);
    if (!record) {
      state.added.push({
        id: payload.id,
        quantity: 1,
      });
    } else {
      record.quantity++;
    }
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
