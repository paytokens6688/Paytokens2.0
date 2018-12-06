// 公用方法及变量
export const state = () => ({
  // 交易密码输入错误
  passError: '请输入包含数字和字母的8-16位密码',
  // 头像数组
  headImg: [
    {
      image: require('@/assets/images/header_img1.png'),
      id: 1
    },
    {
      image: require('@/assets/images/header_img2.png'),
      id: 2
    },
    {
      image: require('@/assets/images/header_img3.png'),
      id: 3
    },
    {
      image: require('@/assets/images/header_img4.png'),
      id: 4
    }
  ]
});

export const getters = {
};

export const mutations = {
};

export const actions = {
};
