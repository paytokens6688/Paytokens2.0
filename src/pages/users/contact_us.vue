<template>
  <div id="contactUs">
    <!-- 蓝色背景 -->
    <div class="blue_bg"></div>
      <div class="_wrap">
        <!-- 白色背景 -->
        <div class="white_bg">
          <div class="qrcode_box_wrap">
            <div class="qrcode_box" v-for="(item, index) in qrcodeList" :key="index">
              <!-- 类型 -->
              <div class="type_box">
                <div class="circle">{{index+1}}</div>
                <span class="type_txt">官方客服微信{{index+1 === 1 ? '一' :
                  (index+1 === 2 ? '二' : (
                  index+1 === 3 ? '三' : (
                  index+1 === 4 ? '四' : (
                  index+1 === 5 ? '五' : ''
                  ))))}}</span>
              </div>
              <!-- 二维码背景 -->
              <div class="qrcode_wrap">
                <img :src="item" alt="" class="qrcode_img">
              </div>
            </div>
            <!-- 提示语 -->
            <p class="notice">扫一扫，联系我们</p>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'contactUs',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      qrcode: require('./../../assets/images/qrcode.png'),
      qrcodeList: []
    };
  },
  beforeMount () {
    // 头部
    this.pageTitle({ title: '联系我们', shadown: false });
  },
  mounted () {
    this.getInfo();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 客服微信接口
    getInfo () {
      this.$axios.get('/v1/api/service/qrcode').then(({ data }) => {
        if (data.status === 200) {
          var arr = data.data.split(',');
          this.qrcodeList = arr;
        } else {
          this.$global.alertOptions(data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }
};
</script>

<style lang='scss' scoped>
  @import '@/assets/scss/public.scss';
  #BackPage #contactUs {
    margin-top: -90px;
    // height: initial;
    overflow: hidden;
    height: 100%;
    width: 100%;
    // 蓝色背景
    .blue_bg {
      width: 100%;
      height: 293px;
      background: url('../../assets/images/contact_bg.jpg') no-repeat;
      background-size: 100% 100%;
    }
    ._wrap {
      width: 93.33%;
      height: calc(100% - 100px);
      box-sizing: border-box;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      overflow: hidden;
      background: #fff;
      margin: 0 auto;
      margin-top: -145px;
      // 白色背景
      .white_bg {
        box-sizing: border-box;
        width: 100%;
        // height: 850px;
        height: calc(100% - 10px);
        padding-bottom: 20px;
        border: 1Px solid #eaecf1;
        border-image: linear-gradient( #eaecf1, #f7f7f9, #fafbfc) 1 1;
        background: #fff;
        border-bottom: none;
        .qrcode_box_wrap {
          width: 100%;
          height: 100%;
          overflow-y: scroll;
          &::-webkit-scrollbar {
            width: 0;
          }
        }
        // 类型
        .type_box {
          height: 120px;
          padding-top: 33px;
          display: flex;
          justify-content: center;
          align-items: center;
          .circle {
            width: 44px;
            height: 44px;
            background: linear-gradient(180deg, #2d55fd, #4e7bfd);
            text-align: center;
            line-height: 44px;
            color: #fff;
            border-radius: 50%;
            margin-right: 20px;
            font-size: 22px;
          }
          .type_txt {
            font-size: 28px;
            color: #222222;
          }
        }
        // 二维码背景
        .qrcode_wrap {
          width: 400px;
          height: 400px;
          background: #fff;
          box-shadow: 0px 0px 20px 10px #f0f2fa;
          margin: 0 auto;
          border-radius: 5px;
          box-sizing: border-box;
          padding: 40px;
          overflow: hidden;
          .qrcode_img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
    // 提示语
    .notice {
      font-size: 24px;
      color: #b7bac3;
      text-align: center;
      padding: 80px 0;
    }
  }
</style>
