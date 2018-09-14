import { $Http } from './service';
import subjectList from './subject';
// // 混入全局方法-依赖注入
export default {
  provide: {
    $Http,
    ...subjectList,
  },
};
