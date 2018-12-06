// 创建账户流程储存
export const state = () => ({
  // 账户名
  accountName: '',
  // 密码
  pass: '',
  // 密码提示
  passPrompt: '',
  // 导入地址数组
  // [ id, id]
  importArray: [],
  // 创建地址数组
  // [ id, id]
  createArray: [],
  // 币种导入，私钥,币种id
  // [
  //   {
  //     id: 币种id,
  //     key: 地址key,
  //     publicKey: 地址私钥,
  //     keyStore: ,
  //   }
  // ]
  importCoins: [],
  // 暂存助记词字符串和Buffer
  importWord: {
    buffer: '',
    word: ''
  }
});

export const getters = {
  // 默认可以使用且不重名的账户名称
  canUseAccountName (state, getter, vuexRoot) {
    // 默认账户名
    const defaultName = 'Paytokens';
    // 设置返回变量，并赋值
    let name = defaultName;
    if (vuexRoot.storage.userInfo.accounts.length) {
      // 如果有创建过的账户，进行循环
      const haveTheName = (testName) => {
        // 直接赋值当前名
        name = testName;
        vuexRoot.storage.userInfo.accounts.map((item) => {
          // 如果有重名，继续处理
          if (item.accountName === testName) haveTheName(`${defaultName}${name.replace(defaultName, '') - 0 + 1}`);
        });
      };
      haveTheName(name);
    }
    return name;
  }
};

export const mutations = {
  // 创建账户第一步之后，存储账户名，密码，提示语
  accountFrist (state, data) {
    Object.assign(state, data);
  },
  // 创建账户第二步，选择导入还是创建的地址
  accountSiteType (state, { importArr, createArr }) {
    state.importArray = [].concat(importArr);
    state.createArray = [].concat(createArr);
  },
  // 创建账户第三步，导入地址，加入币种导入数组
  pushImportSite (state, data) {
    if (data instanceof Array) {
      // 判断是否有重复
      let haveDataInner = false;
      state.importCoins.map(impt => {
        data.map(inner => {
          // 如果有重复
          if (inner.type === impt.type && inner.siteName === impt.siteName) haveDataInner = true;
        });
      });
      if (haveDataInner) {
        state.importCoins = data;
      } else {
        state.importCoins = [
          ...state.importCoins,
          ...data
        ];
      }
    } else {
      state.importCoins.push(data);
    }
  },
  // 创建账户第三步，导入助记词
  importWord (state, data) {
    state.importWord = data;
  },
  // 创建完成后初始化密码
  initData (state) {
    state.pass = '';
  },
  // 创建完成后首页初始化所有数据
  initAllData (state) {
    if (state.accountName === '') return false;
    state.accountName = '';
    state.pass = '';
    state.passPrompt = '';
    state.importArray = [];
    state.createArray = [];
    state.importCoins = [];
    state.importWord = {
      buffer: '',
      word: ''
    };
  }
};
