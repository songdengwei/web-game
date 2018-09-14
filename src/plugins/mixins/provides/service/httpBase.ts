interface HttpBase<T> {
  result: HttpResult | any;
  targetUrl: string;
  success: boolean;
  error: string;
  unAuthorizedRequest: boolean;
  __abp: boolean;
}

interface HttpResult {
  accessToken: string;
  userId: Number;
  success: boolean;
  message: string;
  items: Array<ResultItems>;
}

interface ResultItems {
  categoryName: string; //分类名称
  children: Array<ResultItems>; //子集
  id: Number;
  isActive: boolean; //是否启用
  parentId: Number; //上级id
  pictureUrl: string; //分类图片
  sortOrder: Number; //排序
  value: Number; //本地组件字段
  label: string; //本地组件字段
}
