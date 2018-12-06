export const state = () => ({
  // 是否第一次进入页面
  fristShowPage: true,
  // 助记词导入账户是否是第一次进入
  importAccountWordFrist: true,
  // 默认区号
  country: ' +86',
  // 交易记录暂存
  payLogDetailShow: {},
  // 注册信息
  registerInfo: {
    phone: '',
    code: '',
    password: '',
    repassword: ''
  }
});

export const getters = {
};

export const mutations = {
  // 更改也买呢进入次数
  fristShowPageChange (state) {
    state.fristShowPage = false;
  },
  // 更改导入账户进入次数
  importAccountWordFristChange (state) {
    state.importAccountWordFrist = false;
  },
  // 区号修改
  chooseTel: (state, data) => {
    state.country = data;
  },
  // 拷贝事件函数
  copyTextFunc (state, { ele, self }) {
    // 复制板事件
    const Clipboard = require('clipboard');
    const clipboard = new Clipboard(ele);
    clipboard.on('success', () => {
      self.$global.successOptions('复制成功');
    });
    clipboard.on('error', () => {
      self.$global.successOptions('复制成功');
    });
  },
  // 初始更改数据事件
  initChangeDataOfUser (state, data) {
    state.storage = Object.assign(state.storage, data);
  },
  // 更改交易记录
  changePayLogDetailShow (state, data) {
    state.payLogDetailShow = data;
  },
  // 记住注册信息
  getRegisterInfo (state, data) {
    state.registerInfo.phone = data.phone;
    state.registerInfo.code = data.code;
    state.registerInfo.password = data.password;
    state.registerInfo.repassword = data.repassword;
  }
};

export const actions = {
};
