// 引入localforage
import localforage from 'localforage';
localforage.config({
  name: 'PaytokensData',
  description: 'sql of Paytokens'
});

// 本地存储内容
export const state = () => ({
  // app信息
  app: {
    // 版本号
    version: '2.0',
    // 语言版本
    language: '中文',
    // 上一个页面路由
    fromRoute: ''
  },
  // 用户私密信息（此处不可从js读取，只能通过本地内容获取）
  userInfo: {
    // 当前选择账户是第几个,>=0
    selectAccount: '0',
    // 不同的账户列表
    accounts: [
      // {
      //   accountCopyed: 账户是否已经备份了
      //   accountName: 账户名,
      //   passPrompt: 密码提示语,
      //   pass: 密码(及其不安全),
      //   word: 账户助记词(及其不安全),
      //   showMainCoins: 显示在主页的主流币种id[]
      //   siteOfWord: 助记词管理的地址,
      //    [
      //     {
      //       siteCopyed: 地址是否已经备份了
      //       type: 属于哪种主链的币，币种的id,
      //       siteName: 地址名称,
      //       key: 地址公钥,
      //       keysotre: 通过web3加密过的keystore,
      //       privateKey: 私钥,
      //       defatule: 是否默认,
      //       userCoinsInfo: 账户拥有的币种数量及交易信息,
      //       [
      //         {
      //           id: 币种id，可以是代币,
      //           number: 拥有数量,
      //           index: 在首页的展示顺序，数值越大，排序越高，更改时要检测是否重复
      //           txArray: 交易信息 [
      //             {
      //               type: 状态,0已发起，1打包中，2已完成, -1失败,
      //               from: 发款方，数组或字符串,
      //               to: '收款方，数组或字符串',
      //               free: '矿工费',
      //               value: '转账金额',
      //               notice: '备注',
      //               txid: '交易ID',
      //               block: '区块',
      //               time: '时间'
      //             }
      //           ]
      //         },
      //         {
      //           id: 币种id，可以是代币,
      //           number: 拥有数量,
      //         }
      //       ]
      //     }
      //   ]
      //   siteOfWatch: 观察地址列表,
      //    [
      //     {
      //       type: 属于哪种主链的币，币种的id
      //       siteName: 地址名称
      //       key: 地址公钥
      //       userCoinsInfo: 账户拥有的币种数量及交易信息
      //       [
      //         {
      //           id: 币种id，可以是代币
      //           number: 拥有数量
      //         },
      //         {
      //           id: 币种id，可以是代币
      //           number: 拥有数量
      //         }
      //       ]
      //     }
      //   ]
      //   siteOfOther: 非助记词管理地址,
      //    [
      //     {
      //       type: 属于哪种主链的币，币种的id
      //       siteName: 地址名称
      //       key: 地址公钥
      //       keysotre: 通过web3加密过的keystore
      //       privateKey: 私钥
      //       userCoinsInfo: 账户拥有的币种数量及交易信息
      //       [
      //         {
      //           id: 币种id，可以是代币
      //           number: 拥有数量
      //         },
      //         {
      //           id: 币种id，可以是代币
      //           number: 拥有数量
      //         }
      //       ]
      //     }
      //   ]
      // }
      // {
      //   accountCopyed: 'false',
      //   accountName: 'Paytokens',
      //   passPrompt: '这是一个隐秘的密码',
      //   pass: '6666',
      //   word: '1,2,3,4,5,6,7,8,9,10,11,12',
      //   siteOfWord: [
      //     {
      //       copyed: 'true',
      //       type: '1',
      //       siteName: 'ETH-1',
      //       key: '1231312312312',
      //       keysotre: {},
      //       privateKey: '122222',
      //       userCoinsInfo: [
      //         {
      //           id: '1',
      //           number: '20.999991',
      //           // 交易信息
      //           txArray: [
      //             {
      //               // 状态,0已发起，1打包中，2已完成, -1失败
      //               type: 0,
      //               // 发款方，数组或字符串
      //               from: '11122334556',
      //               // 收款方，数组或字符串
      //               to: '22123131',
      //               // 矿工费
      //               free: '0.0001',
      //               // 转账金额
      //               value: '10086.00',
      //               // 备注
      //               notice: '这是备注',
      //               // 交易ID
      //               txid: '152634567892315648974',
      //               // 区块
      //               block: '1008561',
      //               // 时间
      //               time: '2018/10/12 11:12:12'
      //             }
      //           ]
      //         },
      //         {
      //           id: '1-1',
      //           number: '20000.999991'
      //         }
      //       ]
      //     }
      //   ],
      //   siteOfOther: [
      //     {
      //       type: '1',
      //       siteName: 'ETH-1',
      //       key: '1231312312312',
      //       keysotre: {},
      //       privateKey: '122222',
      //       userCoinsInfo: [
      //         {
      //           id: '1',
      //           number: '20.999991'
      //         },
      //         {
      //           id: '1-1',
      //           number: '20000.999991'
      //         }
      //       ]
      //     }
      //   ],
      //   siteOfWatch: [
      //     {
      //       type: '1',
      //       siteName: 'ETH-1',
      //       key: '1231312312312',
      //       userCoinsInfo: [
      //         {
      //           id: '1',
      //           number: '20.999991'
      //         },
      //         {
      //           id: '1-1',
      //           number: '20000.999991'
      //         }
      //       ]
      //     }
      //   ]
      // }
    ]
  },
  // 显示币种对象
  coins: {
    // 主链币种
    main: [
      // {
      //   id: 币种id,
      //   name: 币种名称,
      //   symbol: 币种符号,
      //   nameZh: 币种中文名,
      //   icon: 币种图标,
      //   price: 单个价格 {
      //     cny: 人民币,
      //     usd: 美元
      //   },
      //   canCreate: 是否可以创建账户,
      //   webLink: 区块链浏览器,
      //   isShowIndex: 是否在首页显示
      // }
      {
        id: '1',
        name: 'Bitcoin',
        symbol: 'BTC',
        nameZh: '比特币',
        icon: require('@/assets/images/coins_icon/btc.png'),
        price: {
          cny: '',
          usd: ''
        },
        // 区块链浏览器
        webLink: 'https://www.btc.com',
        canCreate: true
      },
      {
        id: '2',
        name: 'Ethereum',
        symbol: 'ETH',
        nameZh: '以太坊',
        icon: require('@/assets/images/coins_icon/eth.png'),
        price: {
          cny: '',
          usd: ''
        },
        // 区块链浏览器
        webLink: 'https://www.btc.com',
        canCreate: true
      },
      {
        id: '3',
        name: 'EOSIO',
        symbol: 'EOS',
        nameZh: '柚子',
        icon: require('@/assets/images/coins_icon/eos.png'),
        price: {
          cny: '',
          usd: ''
        },
        // 区块链浏览器
        webLink: 'https://www.btc.com',
        canCreate: false
      }
    ],
    // 代币币种
    other: {
      // 比特币代币
      'BTC': [
      ],
      // 以太坊代币
      'ETH': [
        // {
        //   id: 币种id,
        //   name: '币种名称',
        //   symbol: '币种符号',
        //   nameZh: '币种中文名',
        //   icon: 币种图标,
        //   address: 合约地址,
        //   dec: 保留小数点后几位
        // }
      ],
      // EOS代币
      'EOS': [
      ]
    },
    // 人民币转为美元的价格5.5cny=1usd
    cnyToUsd: ''
  },
  // 行情币种显示
  marketLine: {
    show: [],
    hidden: []
  },
  // 用户后台信息存储
  accountInfo: {
    // 账号
    account: '',
    // 头像
    headPic: '',
    // 结算方式,滚存(1)还是周结(2)
    balanceType: '1',
    // 首页总额显示方式
    homeUserAllMoneyType: 'CNY',
    // 是否登录
    isLogin: false
  },
  // 常用地址存储
  alsoUseSite: [
    // {
    //   coinsId: 币种id,
    //   siteList: 地址列表 [
    //     {
    //       site: 账户地址,
    //       siteName: 账户名字,
    //       id: 地址id, 币种id加下划线加数字
    //     }
    //   ]
    // }
  ],
  // 用户站内消息
  appNews: {
    // 资产转出
    out: [
      {
        // 币种类型/可以是代币
        type: '1',
        // 交易id
        txid: '123456789264165489'
        // 其他信息根据txid去交易记录里面获取
      }
    ],
    // 资产转入
    in: [
      {
        // 币种类型/可以是代币
        type: '1',
        // 交易id
        txid: '123456789264165489'
        // 其他信息根据txid去交易记录里面获取
      }
    ],
    // ai交易
    ai: [
      {
        // 数量及单位
        msg: '',
        // 时间
        time: '2018/11/21 11:22:21'
      }
    ]
  }
});

export const getters = {
};

export const mutations = {
  // 储存路由页面
  saveRoutePage (state, data) {
    state.app.fromRoute = data.fullPath;
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 头像选择
  pickHeaderImg (state, id) {
    state.accountInfo.headPic = id;
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 更改首页总额显示方式
  changeHomeUserAllMoneyType (state) {
    if (state.accountInfo.homeUserAllMoneyType === 'CNY') {
      state.accountInfo.homeUserAllMoneyType = 'USD';
    } else {
      state.accountInfo.homeUserAllMoneyType = 'CNY';
    }
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 导入或创建账户时，将暂存账户信息，复制到长期存储内
  copyLowToLong (state, data) {
    // 导入账户数组
    let importArr = [];
    // 创建账户数组
    let createArr = [];
    // 显示的主流币种
    let showMainCoins = state.coins.main.map(item => item.id);
    data.importCoins.map(item => {
      if (item.import) {
        importArr.push({
          type: item.type,
          siteName: item.siteName,
          privateKey: item.privateKey,
          keysotre: item.keyStore,
          key: item.key,
          copyed: true,
          userCoinsInfo: item.coinsNumber.map(item => {
            item.txArray = [];
            return item;
          })
        });
      } else {
        createArr.push({
          type: item.type,
          siteName: item.siteName,
          privateKey: item.privateKey,
          keysotre: item.keyStore,
          key: item.key,
          copyed: false,
          userCoinsInfo: item.coinsNumber.map(item => {
            item.txArray = [];
            return item;
          })
        });
      }
    });
    const userAccount = {
      accountCopyed: false,
      accountName: data.accountName,
      pass: data.pass,
      passPrompt: data.passPrompt,
      word: data.importWord.word,
      siteOfWord: createArr,
      siteOfWatch: [],
      siteOfOther: importArr,
      showMainCoins: showMainCoins
    };
    state.userInfo.accounts.push(userAccount);
    state.userInfo.selectAccount = (state.userInfo.accounts.length - 1) + '';
    // 初始化创建缓存账户
    this.commit('createAccount/initData');
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 首页选择导入币种页面处理函数
  indexImportCoin (state, { selectAccount, data }) {
    state.userInfo.accounts[selectAccount - 0].siteOfOther.push({
      type: data.type,
      siteName: data.siteName,
      privateKey: data.privateKey,
      keysotre: data.keyStore,
      key: data.key,
      copyed: true,
      userCoinsInfo: data.coinsNumber.map(item => {
        item.txArray = [];
        return item;
      })
    });
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 账户助记词成备份完成
  accountCopySuccess (state, id) {
    state.userInfo.accounts[id - 0].accountCopyed = true;
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 账户单个地址备份完成
  accountSiteCopySuccess (state, { accountIndex, siteIndex }) {
    state.userInfo.accounts[accountIndex].siteOfWord[siteIndex].copyed = true;
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 更改账户余额
  changeAccontsBalance (state, data) {
    state.userInfo.accounts[state.userInfo.selectAccount][data.siteType][data.accountIndex].userCoinsInfo.map(item => {
      if (item.id === data.coinsId) item.number = data.balance;
    });
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 更改主要币种价格
  getMaincoin (state, data) {
    state.coins.main.map(item => {
      let dataName = item.name.toLocaleLowerCase();
      if (dataName === 'eosio') dataName = 'eos';
      if (!data[dataName]) return false;
      item.price = {
        cny: data[dataName][0],
        usd: data[dataName][1]
      };
    });
    state.coins.other.ETH.map(item => {
      let dataName = item.name.toLocaleLowerCase();
      if (!data[dataName]) return false;
      item.price = {
        cny: data[dataName][0],
        usd: data[dataName][1]
      };
    });
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 人民币转美元
  getUnitExchange (state, data) {
    state.coins.cnyToUsd = data;
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 修改账户地址名称
  changeSiteName (state, { selectAccount, key, newName }) {
    const account = state.userInfo.accounts[selectAccount - 0];
    [].concat(account.siteOfWord, account.siteOfWatch, account.siteOfOther).map(site => {
      if (site.key === key) site.siteName = newName;
    });
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 删除地址
  deleteSite (state, { accountIndex, siteIndex, arrName }) {
    state.userInfo.accounts[accountIndex][arrName].splice(siteIndex, 1);
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 更改默认账户
  changeDetaultAccount (state, index) {
    state.userInfo.selectAccount = index + '';
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 更改账户名称
  changeAccountName (state, { accountIndex, newName }) {
    state.userInfo.accounts[accountIndex - 0].accountName = newName;
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 修改账户密码
  changeAccountPass (state, { accountIndex, pass }) {
    const account = state.userInfo.accounts[accountIndex];
    // 循环修改
    [].concat(account.siteOfOther, account.siteOfWord).map(item => {
      const { ethUnit: { toBufferString, stringToKeystore } } = require('@/assets/js/eth_func');
      if (item.type === '1') { // 比特币
        const { btcUnit: { keystoreToPrivatekey } } = require('@/assets/js/btc_func');
        const key = keystoreToPrivatekey(item.keysotre, account.pass);
        const keyStore = stringToKeystore(toBufferString(key), pass);
        item.keysotre = keyStore;
      } else if (item.type === '2') { // 以太坊
        const { ethUnit: { keystoreToPrivatekey } } = require('@/assets/js/eth_func');
        const key = keystoreToPrivatekey(item.keysotre, account.pass);
        const keyStore = stringToKeystore(key, pass);
        item.keysotre = keyStore;
      } else if (item.type === '3') { // EOS
        const { eosUnit: { keystoreToPrivatekey } } = require('@/assets/js/eos_func');
        const key = keystoreToPrivatekey(item.keysotre, account.pass);
        const keyStore = stringToKeystore(toBufferString(key), pass);
        item.keysotre = keyStore;
      }
    });
    account.pass = pass;
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 删除账户
  deleteAccount (state, { accountIndex }) {
    state.userInfo.accounts.splice(accountIndex, 1);
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 增加常用地址
  addalsoUseSite (state, { coinId, site }) {
    let haveId = false;
    state.alsoUseSite.map(item => {
      if (item.coinsId === coinId) {
        haveId = true;
        item.siteList.push(site);
      }
    });
    if (!haveId) {
      state.alsoUseSite.push({
        coinsId: coinId,
        siteList: [
          site
        ]
      });
    }
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 删除常用地址
  deleteUseSite (state, { coinId, siteId }) {
    state.alsoUseSite.map(coin => {
      if (coin.coinsId === coinId) {
        coin.siteList.map((site, index) => {
          if (site.id === siteId) coin.siteList.splice(index, 1);
        });
      }
    });
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 修改常用地址
  editUseSite (state, siteObj) {
    state.alsoUseSite.map(coin => {
      if (coin.coinsId === siteObj.type) {
        coin.siteList.map((site) => {
          if (site.id === siteObj.id) {
            site.site = siteObj.addresss;
            site.siteName = siteObj.name;
          }
        });
      }
    });
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 更改登录状态
  changeLoginStatus (state, status) {
    state.accountInfo.isLogin = status;
    // 更改后储存,如果是客户端
    if (global.document) this.dispatch('storage/saveUserInfo');
  },
  // 代币添加
  async addFalseCoin (state, coin) {
    // 添加代币信息
    let haveTheCoin = false;
    state.coins.other.ETH.map(item => {
      if (item.id === coin.id) haveTheCoin = true;
    });
    if (!haveTheCoin) state.coins.other.ETH.push(coin);
    // 账户里添加代币信息
    const account = state.userInfo.accounts[state.userInfo.selectAccount - 0];
    [].concat(account.siteOfOther, account.siteOfWord).map(item => {
      // 如果是以太坊的
      if (item.type === '2') {
        item.userCoinsInfo.push({
          id: coin.id,
          number: '0.0000',
          txArray: []
        });
      }
    });
    // 请求价格接口
    await this.dispatch('storage/getCoinsPriceData');
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 代币移除
  removeFalseCoin (state, id) {
    // 账户里添加代币信息
    const account = state.userInfo.accounts[state.userInfo.selectAccount - 0];
    [].concat(account.siteOfOther, account.siteOfWord).map(item => {
      // 如果是以太坊的
      if (item.type === '2') {
        item.userCoinsInfo.map((coin, index) => {
          if (coin.id === id) item.userCoinsInfo.splice(index, 1);
        });
      }
    });
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 主链币种添加
  addMainCoin (state, id) {
    const account = state.userInfo.accounts[state.userInfo.selectAccount - 0];
    account.showMainCoins.push(id);
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 主链币种移除
  removeMainCoin (state, id) {
    const account = state.userInfo.accounts[state.userInfo.selectAccount - 0];
    account.showMainCoins.map((item, index) => {
      if (item === id) account.showMainCoins.splice(index, 1);
    });
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 首页币种置顶
  coinToTop (state, id) {
    const account = state.userInfo.accounts[state.userInfo.selectAccount - 0];
    let needToIndex = 1;
    // 指针接受对象
    let changeObg = {};
    [].concat(account.siteOfOther, account.siteOfWord).map(item => {
      // 如果是以太坊的
      item.userCoinsInfo.map((coin) => {
        if (coin.id === id) changeObg = coin;
        if (coin.index >= needToIndex && coin.id !== id) needToIndex = coin.index + 1;
      });
    });
    changeObg.index = needToIndex;
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  },
  // 更改账户备份状态
  changeAccountCopyStatus (state, accountIndex) {
    state.userInfo.accounts[accountIndex].accountCopyed = true;
    // 更改后储存
    this.dispatch('storage/saveUserInfo');
  }
};

export const actions = {
  // 储存用户数据内容
  saveUserInfo ({ state }, data) {
    if (!data) {
      data = {};
      data.type = 'payInfo';
      data.data = state;
    }
    // 将对象字符串化，对中文转码后，加密
    return localforage.setItem(data.type, window.btoa(window.encodeURIComponent(JSON.stringify(data.data))));
  },
  // 获取用户数据内容
  getUserInfo (context, type = 'payInfo') {
    return (new Promise((resolve) => {
      localforage.getItem(type).then((data) => {
        if (data) {
          try {
            data = JSON.parse(window.decodeURIComponent(window.atob(data)));
          } catch (err) {
            console.log('没有本地数据');
          }
        }
        resolve(data);
      });
    }));
  },
  // 获取币种价格数据
  getCoinsPriceData ({ state, commit }) {
    const $axios = require('@/user_conf/axios.conf').default;
    return $axios.get('/v1/api/coin/exchange', {
      params: {
        ticker: state.coins.other.ETH.map(item => item.name).join(',')
      }
    }).then(({ data }) => {
      if (data.status === 200) commit('getMaincoin', data.data);
    }).catch((err) => {
      console.log(err);
    });
  },
  // 获取用户币种数量
  getUserCoinsNumber ({ state, commit }, selectAccount) {
    if (!state.userInfo.accounts.length) return false;
    if (!state.userInfo.accounts[selectAccount - 0]) commit('changeDetaultAccount', '0');
    if (selectAccount === undefined) selectAccount = state.userInfo.selectAccount;
    // 转化类型
    const account = state.userInfo.accounts[selectAccount - 0];
    // 循环回调函数
    const backFunc = (site, accountIndex, siteType) => {
      if (site.type === '1') {
        // 请求数据
        const { btcUnit: { getAccountNumber } } = require('@/assets/js/btc_func');
        // 如果是比特币
        site.userCoinsInfo.map((item) => {
          getAccountNumber(site.key).then((data) => {
            if (item.id === '1') {
              commit('changeAccontsBalance', {
                accountIndex,
                siteType,
                coinsId: item.id,
                balance: data.balance
              });
            }
          });
        });
      } else if (site.type === '2') {
        // 如果是以太坊
        const { ethUnit: { getAccountNumber, getContractBalance } } = require('@/assets/js/eth_func');
        site.userCoinsInfo.map((item) => {
          if (item.id === '2') {
            getAccountNumber(site.key).then((data) => {
              commit('changeAccontsBalance', {
                accountIndex,
                siteType,
                coinsId: item.id,
                balance: data
              });
            });
          } else {
            // 获取代币余额
            let addressToken = '';
            state.coins.other.ETH.map(contract => {
              if (contract.id === item.id) addressToken = contract.address;
            });
            getContractBalance({
              address: site.key,
              addressToken: addressToken
            }).then((data) => {
              commit('changeAccontsBalance', {
                accountIndex,
                siteType,
                coinsId: item.id,
                balance: data
              });
            });
          }
        });
      } else if (site.type === '3') {
        // EOS
        const { eosUnit: { getAccountNumber } } = require('@/assets/js/eos_func');
        site.userCoinsInfo.map((item) => {
          if (item.id === '3') {
            getAccountNumber(site.key).then((data) => {
              commit('changeAccontsBalance', {
                accountIndex,
                siteType,
                coinsId: item.id,
                balance: data
              });
            });
          }
        });
      }
    };
    try {
      account.siteOfWord.map((item, index) => {
        backFunc(item, index, 'siteOfWord');
      });
      account.siteOfOther.map((item, index) => {
        backFunc(item, index, 'siteOfOther');
      });
      account.siteOfWatch.map((item, index) => {
        backFunc(item, index, 'siteOfWatch');
      });
    } catch (err) {}
  }
};
