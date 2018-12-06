import noAccountCanTo from '@/user_conf/router.conf';
import $axios from '@/user_conf/axios.conf';
const noLoginList = [ // 不需要登录的页面
  '/users/login', '/users/forget', '/users/register', '/users/choice_code',
  '/users/user', '/users/find', '/users/common_address', '/users/add_address', '/users/blockchain_browser',
  '/users/help_center', '/users/about_us', '/users/contact_us', '/users/link_headline', '/users/headline_detail',
  '/wallet', '/notice/notice_list', '/notice/notice_detail', '/users/service_provisions',
  '/wallet/account/account_manage', '/wallet/account/account_detail', '/wallet/account/address_manage', '/wallet/account/address_detail', '/wallet/account/add_observe_address', '/wallet/account/delete_account', '/wallet/account/change_password', '/wallet/account/export_keystore_and_code', '/wallet/account/export_private_key', '/wallet/copy_account_type/coins', '/wallet/copy_account_type/word', '/wallet/account_word_coin', '/wallet/coin_import_list', '/wallet/coins_search', '/wallet/copy_account_type', '/wallet/copy_account_word', '/wallet/copy_account', '/wallet/copy_private', '/wallet/create_account_site', '/wallet/create_account', '/wallet/create_account_word', '/wallet/import_coin', '/wallet/select_account', '/wallet/select_coins', '/wallet/site_detail', '/wallet/transition_in', '/wallet/transition_out', '/wallet/tx_detail', '/wallet/user_help', '/wallet/verification_word', '/wallet/import_account_word', '/wallet/coins_import_list', '/wallet/creact_account_site', '/wallet/import_coin/key_store', '/wallet/import_coin/private_key', '/wallet/import_coin/word', '/wallet/index_import_coin/key_store', '/wallet/index_import_coin/private_key', '/wallet/index_import_coin/word', '/wallet/index_create_coin', '/wallet/verification_word_inner', '/market/market', '/market/market_detail', '/market/market_search', '/market/market_manage', '/market/market_sort', '/'
];
// 页面全局配置
export default async function (context) {
  // 保存上一个页面
  if (context.from) context.store.commit('storage/saveRoutePage', context.from);
  // 如果有状态，切本地账户没有数据，进入创建账户页面
  // 且不是第一次进入页面/在页面路由
  if (!context.store.state.fristShowPage &&
      context.store.state.storage &&
      context.store.state.storage.userInfo.accounts.length === 0 &&
      noAccountCanTo.indexOf(context.route.path) === -1) {
    // 读取本地储存，如果也没有的话，进入创建账户页面
    await context.store.dispatch('storage/getUserInfo').then((data) => {
      if (data) {
        context.store.commit('initChangeDataOfUser', data);
      }
      // 如果没有账户数据，返回首页
      if ((!data || data.userInfo.accounts.length === 0)) {
        context.redirect('/wallet/create_account');
      }
    });
  }
  // TODO: 请求需要优化
  if (noAccountCanTo.indexOf(context.route.path) === -1) { // 如果在可以没有账户进入的页面，可以不用请求
    // 触发获取账户余额事件
    context.store.dispatch('storage/getUserCoinsNumber', context.store.state.storage.userInfo.selectAccount);
    // 判断是否登录接口
    try {
      const loginData = await $axios.get('/v1/api/service/is_login');
      if (loginData.data.status === 200) { // 已经是登录状态直接进去
        context.store.commit('storage/changeLoginStatus', true);
      } else if (loginData.data.status === 2000 && (noLoginList.includes(context.route.path) || noLoginList.includes(context.route.path.replace(/\/$/, '')))) { // 非登陆状态但可以进去的
        context.store.commit('storage/changeLoginStatus', false);
      } else if (loginData.data.status === 2000 && !noLoginList.includes(context.route.path)) { // 非登陆状态不能进去的
        context.store.commit('storage/changeLoginStatus', false);
        setTimeout(() => {
          context.store.$router.replace({
            path: '/users/login',
            query: {
              toPage: context.route.fullPath
            }
          });
        }, 50);
      }
    } catch (err) {}
  }
}
