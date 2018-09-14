// axios默认参数
import { AxiosRequestConfig } from 'axios';
let baseURL = '';
let Authorization = '';
console.log(process.env);
if (process.env.NODE_ENV === 'development') {
  baseURL = `${window.location.origin}`;
  // Authorization = "dev";
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://api-prod.douban.com';
  // Authorization = "prod";
}

export const OPTIONS: AxiosRequestConfig = Object.freeze({
  baseURL,
  headers: {
    common: {
      Authorization,
    },
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  // transformRequest(data: any) {
  //   return JSON.stringify(data);
  // },
  proxy: {
    host: 'localhost',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l',
    },
  },
});
