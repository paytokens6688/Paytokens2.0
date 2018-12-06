<template>
  <div id="guidePage">
    <div class="container">
      <!-- 网页端 -->
      <div v-if="webpage === true">
        <img class="images" src="@/assets/images/guide_page.png"/>
        <div class="title">您需要去官网进行下载 Paytokens</div>
        <div class="prompt">请直接点击下方“进入官网”按钮打开链接下载</div>
        <div class="prompt">Paytokens是多链、跨链一站式数字资产管理钱包。 </div>
      </div>
      <!-- 微信端 -->
      <div v-if="wechat === true">
        <img class="images" src="@/assets/images/guide_page.png"/>
        <div class="title">点击复制链接</div>
        <div class="title"> 去浏览器中下载 Paytokens</div>
        <div class="prompt">Paytokens是多链、跨链一站式数字资产管理钱包。</div>
      </div>
    </div>
    <!-- 网页版的进入官网 -->
    <button v-if="webpage === true"
      class="form_submit submit-button"
      @click="goLogin">进入官网</button>
    <!-- 微信端的复制链接 -->
    <button v-if="wechat === true"
      class="form_submit submit-button copy_button"
      :data-clipboard-text="qrCode"
      onclick="">复制链接</button>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard';
export default {
  name: 'guide_page',
  head () {
    // 返回头部信息
    return {
      title: '引导页'
    };
  },
  data () {
    return {
      // 网页版的引导页
      webpage: true,
      // 微信端的引导页
      wechat: false
    };
  },
  mounted () {
    this.copyInit();
  },
  methods: {
    // 进入官网
    goLogin () {
    },
    // 复制
    copyInit () {
      let clipboard = new ClipboardJS('.copy_button');
      clipboard.on('success', () => {
        this.$global.successOptions('复制成功');
      });
      clipboard.on('error', () => {
        this.$global.successOptions('复制成功');
      });
    }
  },
  components: {
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #guidePage {
    width: 100%;
    height: 100%;
    padding: 90px 50px 0;
    box-sizing: border-box;
    position: relative;
    .container{
      padding: 0 29px;
      box-sizing: border-box;
      .images{
        width: 526px;
        height: 526px;
        display: block;
        margin: 0 auto;
        margin-bottom: 84px;
      }
      .title{
        color: #222222;
        font-size: 30px;
        font-weight: bold;
        padding-bottom: 14px;
        box-sizing: border-box;
      }
      .prompt{
        font-size: 24px;
        color: #9297a5;
        padding-top: 14px;
        box-sizing: border-box;
      }
    }
    .form_submit{
      width: 90%;
      position: absolute;
      bottom: 6%;
      left: 50%;
      transform: translateX(-50%);
      // font-size: 24px;
    }
  }
</style>
