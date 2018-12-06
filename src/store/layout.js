// layout需要方法及变量
export const state = () => ({
  // backpage需要的配置变量
  backPageConfig: {
    // 标题
    title: '',
    // 底部阴影是否添加
    shadown: false
  },
  // 备份默认配置，切换使用
  backPageConfigDefault: {
    // 标题
    title: '',
    // 底部阴影是否添加
    shadown: false
  }
});

export const getters = {
};

export const mutations = {
  backPageChange (state, head) {
    // 只有标题，使用默认样式
    if (typeof head === 'string') {
      head = {
        title: head
      };
    }
    if (typeof head === 'object') {
      if (head.backShow === undefined || head.backShow === null) {
        head.backShow = true;
      }
    }
    state.backPageConfig = {
      ...state.backPageConfigDefault,
      ...head
    };
    return true;
  }
};
