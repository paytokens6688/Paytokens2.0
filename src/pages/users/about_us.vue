<template>
  <div id="aboutUs">
    <!-- 标题 -->
    <h1 class="title">关于Paytokens</h1>
    <div class="version">
      <img class="version_img" src="@/assets/images/about_us_logo.png" alt="">
      <div>版本号 V2.0</div>
    </div>
    <div class="prompt">Paytokens是多链、跨链一站式数字资产管理钱包。</div>
    <!-- 页面跳转用户协议和隐私政策 -->
    <div class="box_shadow">
      <nuxt-link class="list" tag="span" to="/users/service_provisions">
        <span>服务及隐私条款</span>
        <i class="iconfont icon-you"></i>
      </nuxt-link>
    </div>
    <!-- 底部 -->
    <div class="bottom">Copyright © 2018 Paytokens</div>
  </div>
</template>

<script>
export default {
  name: 'about_us',
  layout (context) {
    return 'back_page';
  },
  head () {
    // 返回头部信息
    return {
      title: '关于我们'
    };
  },
  data () {
    return {
    };
  },
  methods: {
  },
  components: {
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #aboutUs {
    padding: 0 46px;
    box-sizing: border-box;
    position: relative;
    .title {
      font-size: 48px;
      line-height: 100px;
      font-weight: bold;
      padding-bottom: 50px;
      box-sizing: border-box;
    }
    .version{
      display: flex;
      align-items: center;
      font-size: 26px;
      color: #222222;
      padding-bottom: 35px;
      box-sizing: border-box;
      .version_img{
        width: 80px;
        height: 80px;
        margin-right: 25px;
      }
    }
    .prompt{
      color: #9297a5;
      font-size: 24px;
    }
    // 页面跳转用户协议和隐私政策
    .box_shadow{
      padding-top: 90px;
      box-sizing: border-box;
      .list{
        line-height: 100px;
        color: #222222;
        font-size: 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1Px solid #eaecf1;
        .iconfont{
          color: #9da2b2;
          font-size: 30px;
          margin-left: 21px;
        }
      }
    }
    // 底部
    .bottom{
      width: 100%;
      position: absolute;
      bottom: 10%;
      left: 50%;
      transform: translateX(-50%);
      color: #b7bac3;
      font-size: 24px;
      text-align: center;
      box-sizing: border-box;
    }
  }
</style>
