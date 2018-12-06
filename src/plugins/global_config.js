import noAccountCanTo from '@/user_conf/router.conf';
import $axios from '@/user_conf/axios.conf';
// 页面全局配置
export default async function (context) {
  // 读取完文件
  await context.store.dispatch('storage/getUserInfo').then((data) => {
    if (data) {
      context.store.commit('initChangeDataOfUser', data);
    }
    // 如果没有账户数据，返回首页
    if ((!data ||
        data.userInfo.accounts.length === 0) &&
        noAccountCanTo.indexOf(context.route.path) === -1) {
      context.redirect('/wallet/create_account');
    }
  });
  // 主要币种价格请求接口
  await context.store.dispatch('storage/getCoinsPriceData');
  // 人民币转美元的接口
  await $axios.get('/v1/api/coin/dollar_to_rmb').then(({ data }) => {
    if (data.status === 200) context.store.commit('storage/getUnitExchange', data.data);
  }).catch((err) => {
    console.log(err);
  });
  // 全局链接wocket
  const initWs = () => {
    let timer;
    global.$ws = new WebSocket('ws:' + window.backUrl + '/v1/webSocket/pt');
    // global.$ws = new WebSocket('wss:' + window.backUrl + '/v1/webSocket/pt');
    global.$ws.onopen = (evt) => {
      console.log('socket open....');
      let obj = { type: 'ping' };
      timer = setInterval(() => {
        global.$ws.send(JSON.stringify(obj));
      }, 30000);
    };
    global.$ws.onclose = (evt) => {
      clearInterval(timer);
      setTimeout(() => {
        initWs();
      }, 2000);
    };
  };
  initWs();
}
