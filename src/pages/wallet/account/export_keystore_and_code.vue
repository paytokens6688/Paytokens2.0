<template>
  <div id="exportKeyStore">
    <selectNav
      :typeArr="navs"
      v-model="navIndex"></selectNav>
    <!-- <div class="export_navs">
      <div
        class="export_nav"
        :class="{'active': index === navIndex}"
        v-for="(item, index) in navs"
        :key="index"
        @click="navToggle(index)">
        {{item}}
      </div>
    </div> -->
    <div
      class="export_keystore"
      v-if="navIndex === 0">
      <div class="keystore_rule">
        <p class="rule_title">
          离线保存
        </p>
        <p class="rule_text">
          请复制粘贴 Keystore 文件到安全、离线的地方保存。切勿保存至邮箱、记事本、网盘、聊天工具等，非常危险。
        </p>
        <p class="rule_title">
          请勿使用网络传输
        </p>
        <p class="rule_text">
          请勿通过网路工具传输 Keystore 文件，一旦被黑客获取将造成不可挽回的资产损失。建议离线设备通过扫二维码方式传输。
        </p>
        <p class="rule_title">
          密码保险箱保存
        </p>
        <p class="rule_text">
          如需在线保存，则建议使用安全等级更高的 1Password 等密码保管软件保存 Keystore。
        </p>
      </div>
      <div
        class="keystore_text">
        {{keystore}}
        </div>
      <button
        class="copy_btn"
        :data-clipboard-text='keystore'
        onclick="">
        复制keystore
      </button>
    </div>
    <div
      class="export_code"
      v-if="navIndex === 1">
      <div class="code_rule">
        <p class="rule_title">
          仅供直接扫描
        </p>
        <p class="rule_text">
          二维码禁止保存、截图、以及拍照。仅供用户在安全环境下直接扫描来方便的导入钱包。
        </p>
        <p class="rule_title">
          在安全环境下使用
        </p>
        <p class="rule_text">
          请确保四周无人及无摄像头的情况下使用。二维码一旦被他人获取将造成不可挽回的资产损失。
        </p>
      </div>
      <div class="code_con">
        <div
          class="code_btn"
          v-show="!codeIsShow">
          <img
            class="code_icon"
            src="../../../assets/images/icon_ camera.png"
            alt="icon">
            <p class="code_text">
              确认周围无人及摄像头
            </p>
            <button
              class="code_con_btn"
              @click="codeShow">
              显示二维码
            </button>
        </div>
        <qrcode
          v-if="codeIsShow"
          class="qrcode"
          :value="keystore"
          :options="{ size: 300 }"></qrcode>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueQrcode from '@xkeshi/vue-qrcode';
import { mapMutations, mapState } from 'vuex';
import selectNav from '@/components/list/select_type.vue';
Vue.component(VueQrcode.name, VueQrcode);
export default {
  name: 'exportKeyStore',
  layout (context) {
    return 'back_page_img_big';
  },
  data () {
    return {
      // 选中的导航（默认第一个）
      navIndex: 0,
      // 导航
      navs: ['Keystore', '二维码'],
      // 二维码显示与否 (默认隐藏)
      codeIsShow: false,
      // keystore
      keystore: '',
      publicKey: '',
      selectAccount: ''
    };
  },
  computed: {
    ...mapState({
      accounts: state => state.storage.userInfo.accounts
    })
  },
  beforeMount () {
    this.pageTitle('导出');
    this.publicKey = this.$route.query.key;
    this.selectAccount = this.$route.query.selectAccount;
    const account = this.accounts[this.selectAccount - 0];
    [].concat(account.siteOfWord, account.siteOfWatch, account.siteOfOther).map(site => {
      if (site.key === this.publicKey) {
        this.keystore = JSON.stringify(site.keysotre);
      }
    });
  },
  mounted () {
    this.copyInit();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      copyTextFunc: 'copyTextFunc'
    }),
    // 导航切换
    navToggle (index) {
      this.navIndex = index;
    },
    // 复制初始化
    copyInit () {
      this.copyTextFunc({
        ele: '.copy_btn',
        self: this
      });
    },
    // 显示二维码
    codeShow () {
      this.codeIsShow = true;
    }
  },
  components: {
    selectNav
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #exportKeyStore{
    height:100%;
    .export_navs{
      width:100%;
      height:78px;
      display:flex;
      line-height:78px;
      border-bottom:1PX solid #2c345b;
      .export_nav{
        flex:1;
        text-align:center;
        font-size:26px;
        color:#9297a5;
        &.active{
          color:#fff;
          position:relative;
          &:after{
            position:absolute;
            content:'';
            display:block;
            width:80px;
            height:6px;
            background-color:$mainColor;
            border-radius: 3px;
            bottom:0;
            left:50%;
            margin-left:-40px;
          }
        }
      }
    }
    .export_keystore{
      padding: 40px 50px 100px;
      height:calc(100% - 90px);
      box-sizing: border-box;
      overflow-y: auto;
      .keystore_rule{
        width:100%;
        padding: 20px 30px;
        margin-top:30px;
        box-sizing: border-box;
        background-color:#fff;
        border-radius: 10px;
        @include eleBottomShadown();
        .rule_title{
          font-size:26px;
          line-height:52px;
          font-weight: 600;
        }
        .rule_text{
          font-size:24px;
          line-height:50px;
          color:#5e6476;
        }
      }
      .keystore_text{
        width:100%;
        min-height:240px;
        @include eleBottomShadown();
        margin-top:30px;
        box-sizing: border-box;
        padding: 25px 45px;
        font-size:24px;
        line-height:40px;
        color:#5e6476;
        border-radius: 10px;
        word-wrap: break-word;
        word-break:break-all;
        background: #fff;
      }
      .copy_btn{
        position:fixed;
        bottom:0;
        left:0;
        width:100%;
        height:88px;
        background-color:$mainColor;
        color:#fff;
        @include eleBottomShadown();
        margin-top:80px;
        font-size:30px;
      }
    }
    .export_code{
      padding: 40px 50px 100px;
      height:calc(100% - 90px);
      box-sizing: border-box;
      overflow-y: auto;
      .code_rule{
        width:100%;
        padding: 20px 30px;
        margin-top:30px;
        box-sizing: border-box;
        background-color:#fff;
        border-radius: 10px;
        @include eleBottomShadown();
        .rule_title{
          font-size:26px;
          line-height:52px;
          font-weight: 600;
        }
        .rule_text{
          font-size:24px;
          line-height:50px;
          color:#5e6476;
        }
      }
      .code_con{
        width:100%;
        height:600px;
        box-sizing: border-box;
        background-color:#fff;
        border-radius: 10px;
        @include eleBottomShadown();
        margin-top:30px;
        overflow: hidden;
        display:flex;
        align-items: center;
        justify-content: center;
        .code_btn{
          text-align:center;
          margin-top:-30px;
          .code_icon{
            width:92px;
            height:117px;
          }
          .code_text{
            color:#5e6476;
            font-size:28px;
            line-height:90px;
          }
          .code_con_btn{
            width:200px;
            height:60px;
            box-sizing: border-box;
            border:1PX solid $mainColor;
            border-radius: 10px;
            background-color:#fff;
            color:$mainColor;
            font-size:26px;
            margin-top:50px;
          }
        }
        .qrcode{
          display:block;
        }
      }
    }
  }
</style>
