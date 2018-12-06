// 引入qs
import Qs from 'qs';
import Axios from 'axios';
let setCookies = '';
window.backUrl = '//192.168.0.120:3000';
// window.backUrl = '//api.paytokens.net';

const $axios = Axios.create({
  baseURL: window.backUrl,
  timeout: 20000,
  withCredentials: true,
  // 这时候我们通过Qs.stringify转换为表单查询参数
  transformRequest: [function (data) {
    data = Qs.stringify(data);
    return data;
  }],
  // 设置Content-Type
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

$axios.interceptors.request.use(async function (config) {
  // 在请求发送之前做一些事
  if (global.$nuxt) {
    // 如果是客户端
    global.$nuxt.$global.loadingOptions({ time: 500 });
    if (!setCookies && global.$nuxt.$store.state.storage.accountInfo.isLogin) {
      // 如果没有cookies且已经登陆了,获取当前储存Cookies
      const data = await global.$nuxt.$store.dispatch('storage/getUserInfo', 'Cookies');
      if (data) setCookies = data;
    }
  }
  if (setCookies) {
    config.headers.common['Cookies'] = setCookies;
  }
  return config;
}, function (error) {
  // 当出现请求错误是做一些事
  if (global.$nuxt) global.$nuxt.$global.loadingOptions(false);
  return Promise.reject(error);
});

// 对返回的数据进行一些处理 (艳艳写 露霜注释，在router-middle.js中有判断)
$axios.interceptors.response.use(config => {
  if (global.$nuxt) global.$nuxt.$global.loadingOptions(false);
  // 如果有返回值的话
  if (config.headers['set-cookies']) {
    setCookies = config.headers['set-cookies'].split('=')[1];
    // 储存用户登录信息
    if (global.$nuxt) {
      global.$nuxt.$store.dispatch('storage/saveUserInfo', {
        type: 'Cookies',
        data: setCookies
      });
    }
  }
  return config; // 返回值
}, error => {
  if (global.$nuxt) global.$nuxt.$global.loadingOptions(false);
  return Promise.reject(error);
});

export default $axios;
