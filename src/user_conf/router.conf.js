// 不跳转页面的地址数组
let noAccountCanTo = [
  '/wallet/create_account',
  '/wallet/select_coins',
  '/wallet/import_account_word',
  '/wallet/user_help',
  '/wallet/account_word_coin',
  '/wallet/coins_import_list',
  '/wallet/import_coin/private_key',
  '/wallet/import_coin/word',
  '/wallet/import_coin/key_store',
  '/wallet/creact_account_site',
  '/users/register',
  '/users/service_provisions',
  '/'
];
noAccountCanTo = noAccountCanTo.concat(noAccountCanTo.map(item => item + '/'));

export default noAccountCanTo;
