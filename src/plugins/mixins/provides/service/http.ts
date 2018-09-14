import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import { API, HOST, OPTIONS } from '@/config';
import { router } from '@/router';
import store from '@/store';
import { locStorage } from '@/plugins/mixins/provides/service/storage';

// axios默认配置
Object.assign(axios.defaults, OPTIONS);
//防止post重复呼叫
let postCount: any = {};
//不需要带请求头
let noToken: any = ['TokenAuth/Authenticate', 'Supplier/SendRegSms'];

/**
 * 请求前的参数处理
 *
 * @class Methods
 */
interface IMethods {
  /**
   * 基类
   * 请求的公共方法
   * @param {string} url 接口的标识
   * @returns {string} 实际接口地址
   * @memberof IMethods
   */
  getUrl(url: string): string;
}

class Methods implements IMethods {
  static instance: any; //单例
  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  getUrl(url: string) {
    let backendDetail: any = {};

    //获取服务信息
    API.forEach((item: any) => {
      backendDetail = item.interfaces.indexOf(url) != -1 ? item : backendDetail;
    });
    return (
      (backendDetail.test ? backendDetail.testUrl : HOST) +
      '/' +
      ((backendDetail.service ? backendDetail.service + '/' : '') + url)
    );
  }
}

export interface IHttp extends IMethods {
  /**
   *api方式请求
   *
   * @param {string} url
   * @param {object} data get、delete用的是params，post跟put用的是data
   * @param {String} method post、get、delete、put模式
   * @param {Object} headers 头部信息的配置，但是上传图片就写死了
   * @param {boolean} urlParema 为true时参数带在URL上
   * @returns {Promise<Object>}
   * @memberof IHttp
   */
  api(url: string, data: object, method: String, urlParema?: boolean, headers?: Object): Promise<any>;
}

class Http extends Methods implements IHttp {
  api(url: string, data: object, method: String, urlParema: boolean = false, headers: Object): Promise<any> {
    //表示该接口正在调用
    let httpOpts: any = {
      url: super.getUrl(url),
      method: method,
      headers: {
        ...headers,
      },
    };

    //post跟get的参数判断
    if (urlParema) {
      httpOpts.params = data;
      httpOpts.noToken = noToken.indexOf(url) !== -1 ? true : false; //不需要头部token信息
    } else if (method === 'post') {
      httpOpts.data = data;
    } else if (method === 'get') {
      httpOpts.params = data;
    } else if (method === 'delete') {
      httpOpts.params = data;
    } else if (method === 'put') {
      httpOpts.data = data;
    }

    //上传图片
    if (url === 'Upload/UploadFile') {
      httpOpts.headers = {
        'Content-Type': 'multipart/form-data',
      };
    }
    let promise = new Promise(function(resolve, reject) {
      if (postCount[url]) {
        return reject('');
      } else {
        postCount[url] = 'posting';
        axios({
          ...httpOpts,
        })
          .then((res: any) => {
            delete postCount[url];
            resolve(res);
          })
          .catch((error) => {
            delete postCount[url];
            reject(error);
          });
      }
    });
    return promise;
  }
}

// axios.defaults.baseURL = config.HOST + config.PATH;
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.timeout = 20000;
// request拦截器
axios.interceptors.request.use(
  function(config: any) {
    let local: any = locStorage.getItem('token') || '';
    if (local && !config.noToken && config.url.indexOf('TokenAuth/Authenticate') === -1) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + (store.getters['user/getUser'].accessToken || local.accessToken);
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);
// response拦截器
axios.interceptors.response.use(
  (response) => {
    if (!response || response.status !== 200) return;

    // switch (response.data.returnCode * 1) {
    //   case 1000:
    //   case 1002: // 请求成功，但列表数据为空
    //   case 2009:
    //     return response.data;
    //   case 1004:
    //     break;
    //   case 2000:
    //     break;
    //   case 1009:
    //     break;
    //   default:
    //     return response.data;
    // }
    // Message({
    //   message: response.data.message,
    //   type: 'error',
    //   duration: 3 * 1000,
    // });
    // if (response.data && response.data.code === 401) {
    //   // 401, token失效
    //   router.push({ name: 'HomeLogin', query: { type: 'login' } });
    // }
    if (response.data.success) {
      return response.data;
    } else {
      // Message({
      //   message: response.data.error.message || response.data.error.details,
      //   type: 'error',
      //   duration: 3 * 1000,
      // });
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.push({
            name: 'HomeLogin',
          });
          // 返回 401 清除token信息并跳转到登录页面
          // store.dispatch('LogOut').then(() => {
          //   router.replace({
          //     path: 'login',
          //     query: { redirect: router.currentRoute.fullPath },
          //   });
          // });
          break;
        case 403:
          router.push({
            path: '/401',
          });
          break;
        default:
          if (!!error.response.data && !!error.response.data.__abp) {
            // Message({
            //   dangerouslyUseHTMLString: true,
            //   message:
            //     error.response.data.error.details === null
            //       ? error.response.data.error.message
            //       : error.response.data.error.details,
            //   type: 'error',
            //   duration: 3 * 1000,
            // });
          } else {
            // Message({
            //   message: error.message,
            //   type: 'error',
            //   duration: 3 * 1000,
            // });
          }
      }
    }
    return Promise.reject(error);
  }
);

// const Instance: IHttp = Http.getInstance();
// export const httpGet = Instance.get;
// export const httpPost = Instance.post;
// export default Http.getInstance();
export const $Http = Http.getInstance();
console.log($Http);
