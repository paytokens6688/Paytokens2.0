<template>
  <div id='systemSetup' >
    <p class="kong"></p>
    <!-- 第一块 -->
    <div class="first_box">
      <div class="common_box" v-for="(item, index) in firstNav" :key="index" @click="goDetail(item.path)">
        <span class="common_title">{{item.title}}</span>
        <span class="iconfont icon-you"></span>
      </div>
    </div>
    <!-- 第二块 -->
    <div class="second">安全设置</div>
    <div class="second_box">
      <div class="common_box" v-for="(item, index) in saveList" :key="index" @click="goContent(item.path)">
        <span class="common_title">{{item.title}}</span>
        <div class="right">
          <span class="status" :class="{'green_style' : item.status === 1}">{{item.status === 1 ? '已开启' : (item.status === 2 ? '未开启' : (item.status === 3 ? '暂未开放' : ''))}}</span>
          <span class="iconfont icon-you" v-if="item.status !== 3"></span>
        </div>
      </div>
    </div>
    <!-- 第三块 -->
    <div class="third_box">
      <!-- 语言 -->
      <div class="common_box" @click="() => {this.langModal = true}">
        <span class="common_title">语言版本</span>
        <div class="right">
          <span class="status">{{lang}}</span>
          <span class="iconfont icon-you"></span>
        </div>
      </div>
      <!-- 语音 -->
      <div class="common_box">
        <span class="common_title">消息语音提示</span>
        <div class="btn_img_wrap" @click="() => {this.$global.notOpenOptions()}">
          <img src="./../../assets/images/open.png" alt="" class="open_btn_img" v-if="open">
          <img src="./../../assets/images/close.png" alt="" class="close_btn_img" v-else>
        </div>
      </div>
    </div>
    <!-- 退出按钮 -->
    <div class="out_login" @click="quit">安全退出</div>
    <!-- 语言弹框 -->
    <div id="modal_wrap" v-if="langModal">
      <div class="message">
        <div class="title_box">
          <span class="title_txt">选择语言</span>
          <span class="iconfont icon-guanbi1" @click="() => {this.langModal = false}"></span>
        </div>
        <!-- 国家列表 -->
        <ul class="area_list">
          <li class="area_item" v-for="(item, index) in areaList" :key="index" @click="selectLang(item.name)">
            <img :src="item.iconImg" alt="" class="country_img">
            <span class="areaName">{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'systemSetup',
  layout () {
    return 'back_page';
  },
  data () {
    return {
      firstNav: [
        {
          title: '个人信息',
          path: 'personal_info'
        },
        {
          title: '登录密码修改',
          path: 'edit_login'
        }
      ],
      saveList: [
        {
          title: '手势密码',
          status: 2, // 1已开启， 2未开启，3暂未开放
          path: ''
        },
        {
          title: '指纹验证',
          status: 2, // 1已开启， 2未开启，3暂未开放
          path: ''
        },
        {
          title: '人脸识别',
          status: 3, // 1已开启， 2未开启，3暂未开放
          path: ''
        }
      ],
      lang: '中文', // 当前语言
      open: false, // 语音开启
      langModal: false, // 语言弹框
      dropModal: false, // 退出登录弹框
      areaList: [
        {
          iconImg: require('./../../assets/images/guoqi-.png'),
          name: '中文'
        },
        {
          iconImg: require('./../../assets/images/meiguo.png'),
          name: 'English'
        },
        {
          iconImg: require('./../../assets/images/hanguo.png'),
          name: '한국어'
        },
        {
          iconImg: require('./../../assets/images/riben.png'),
          name: '日本語'
        },
        {
          iconImg: require('./../../assets/images/deguo.png'),
          name: 'Deutsch'
        },
        {
          iconImg: require('./../../assets/images/faguo.png'),
          name: 'Le français'
        },
        {
          iconImg: require('./../../assets/images/malaixiya.png'),
          name: 'Melayu'
        },
        {
          iconImg: require('./../../assets/images/xibanya.png'),
          name: 'Español'
        }
      ]
    };
  },
  beforeMount () {
    this.pageTitle({ title: '系统设置', shadown: true });
  },
  mounted () {
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 第一块去详情
    goDetail (path) {
      this.$router.push(path);
    },
    // 第二块去详情
    goContent (path) {
      if (path) {
        this.$router.push(path);
      } else {
        this.$global.notOpenOptions();
      }
    },
    // 选择语言
    selectLang (name) {
      if (name === '中文') {
        this.lang = name;
        this.langModal = false;
      } else {
        this.$global.notOpenOptions();
        this.langModal = false;
      }
    },
    quit () {
      this.$global.alertOptions({
        show: true,
        message: '您确认要退出该账号吗？',
        callbackList: [
          {
            title: '取消',
            callback: () => {}
          },
          {
            title: '确认',
            callback: () => {
              this.$axios.get('/v1/user/signout')
                .then(({ data }) => {
                  if (data.status === 200) {
                    this.$router.replace('/users/login');
                    this.$global.successOptions(data.message);
                  } else {
                    this.$global.alertOptions(data.message);
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            }
          }
        ]
      });
    }
  }
};
</script>

<style lang='scss' scoped>
  @import '@/assets/scss/public.scss';
  #systemSetup {
    background: #fafafc;
    position: relative;
    .kong {
      height: 30px;
      background: linear-gradient(180deg, #f4f5fa, #fafafc);
    }
    // 相同样式
    .common_box {
      box-sizing: border-box;
      padding: 0 38px;
      height: 100px;
      width: 100%;
      background: #fff;
      border-bottom: 1Px solid #eaecf1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .common_title {
        font-size: 28px;
        color: #222222;
      }
      .icon-you {
        font-size: 30px;
        color: #9da2b2;
      }
      .right {
        width: 40%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .icon-you {
          padding-left: 20px;
        }
        .status {
          font-size: 26px;
          color: #b7bac3;
          &.green_style {
            color: #2fd460;
          }
        }
      }
      // 语音图片开关
      .btn_img_wrap {
        width: 86px;
        height: 46px;
        overflow: hidden;
        margin-right: 38px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    // 第一块
    .first_box {
      position: relative;
      height: 230px;
      .common_box {
        &:last-child {
          border-bottom: none;
        }
      }
    }
    // 第二块
    .second {
      height: 90px;
      background: #fafafc;
      padding: 0 38px;
      font-size: 26px;
      color: #a0a9c4;
      line-height: 90px;
    }
    .second_box {
      margin-bottom: 30px;
      .common_box {
        &:last-child {
          border-bottom: none;
        }
      }
    }
    // 第三块
    .third_box {
      margin-bottom: 123px;
      .common_box {
        &:last-child {
          border-bottom: none;
          padding-right: 0px;
        }
        // 滑块
        .icon {
          width: 180px;
          height: 110px;
          fill: currentColor;
          overflow: hidden;
        }
      }
    }
    // 退出
    .out_login {
      width: 92%;
      height: 88px;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0px 0px 10px 5px #edeff7;
      margin: 0 auto;
      margin-bottom: 55px;
      text-align: center;
      font-size: 30px;
      color: #9297a5;
      line-height: 88px;
    }
    // 语言modal弹框
    #modal_wrap {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 50;
      background: rgba(0, 0, 0, 0.6);
      .message {
        box-sizing: border-box;
        width: 92%;
        background: #fff;
        border-radius: 8px;
        margin: 0 auto;
        .title_box {
          height: 90px;
          line-height: 90px;
          padding: 0 40px;
          border-bottom: 1Px solid #eaecf1;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title_txt {
            font-size: 26px;
            color: 222222;
          }
          .icon-guanbi1 {
            font-size: 40px;
            color: #9297a5;
          }
        }
        .area_list {
          box-sizing: border-box;
          padding-left: 40px;
          .area_item {
            height: 120px;
            border-bottom: 1Px solid #eaecf1;
            display: flex;
            align-items: center;
            &:last-child {
              border: none;
            }
            .country_img {
              width: 68px;
              height: 45px;
            }
            .areaName {
              padding-left: 23px;
            }
          }
        }
      }
    }
    // 退出弹框
    #drop_wrap {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 50;
      background: rgba(0, 0, 0, 0.6);
      .message {
        box-sizing: border-box;
        width: 76%;
        background: #fff;
        border-radius: 8px;
        margin: 0 auto;
        .content {
          width: 100%;
          height: 206px;
          border-bottom: 1Px solid #eaecf1;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 28px;
          color: #222222;
        }
        .bottom {
          height: 110px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          .btn {
            flex: 1;
            text-align: center;
            line-height: 110px;
            font-size: 30px;
            color: #9297a5;
            &:last-child {
              color: #2a53fd;
              border-left: 1Px solid #eaecf1;
            }
          }
        }
      }
    }
  }
</style>
