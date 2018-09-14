import { DirectiveOptions } from 'vue';
export const autoFocus: DirectiveOptions = {
  // 插入到父节点时调用
  inserted: function(el: any, binding: any, vnode: any) {
    // 聚焦元素
    // el.focus();
    console.log('测试： 自定义指令autoFocus');
  },
};
