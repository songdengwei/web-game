export default (store: any) => {
  // 当 store 初始化后调用
  store.subscribe((mutation: any, state: any) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
    // Object.keys(state).forEach((item, index) => {
    //   window.sessionStorage.setItem(item, JSON.stringify(state[item]));
    // });
  });
};
