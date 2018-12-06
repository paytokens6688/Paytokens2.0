<template>
  <div id="exportPrivateKey">
    <div class="export_title">
      导出私钥
    </div>
    <div class="export_key_rule">
      <p class="rule_title">
        离线保存
      </p>
      <p class="rule_text">
        切勿保存至邮箱、记事本、网盘、聊天工具等，非常危险。
      </p>
      <p class="rule_title">
        请勿使用网络传输
      </p>
      <p class="rule_text">
        请勿通过网络工具传输，一旦被黑客获取将造成不可挽回的资产损失。建议离线设备通过扫二维码方式传输。
      </p>
      <p class="rule_title">
        密码管理工具保存
      </p>
      <p class="rule_text">
        Paytokens 建议使用密码管理工具管理。
      </p>
    </div>
    <textarea
      class="key_text"
      readonly="readonly"
      v-model="key"></textarea>
    <button
      class="copy_btn"
      :data-clipboard-text='key'
      onclick="">
      复制私钥
    </button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'exportPrivateKey',
  layout (context) {
    return 'back_page_img_big';
  },
  data () {
    return {
      key: '',
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
    this.publicKey = this.$route.query.key;
    this.selectAccount = this.$route.query.selectAccount;
    const account = this.accounts[this.selectAccount - 0];
    [].concat(account.siteOfWord, account.siteOfWatch, account.siteOfOther).map(site => {
      if (site.key === this.publicKey) {
        if (site.type === '1') {
          // 比特币
          const { btcUnit: { keystoreToPrivatekey } } = require('@/assets/js/btc_func');
          this.key = keystoreToPrivatekey(site.keysotre, account.pass);
        } else if (site.type === '2') {
          // ETH
          const { ethUnit: { keystoreToPrivatekey } } = require('@/assets/js/eth_func');
          this.key = keystoreToPrivatekey(site.keysotre, account.pass);
        } else if (site.type === '3') {
          // EOS
          const { eosUnit: { keystoreToPrivatekey } } = require('@/assets/js/eos_func');
          this.key = keystoreToPrivatekey(site.keysotre, account.pass);
        }
      }
    });
  },
  mounted () {
    this.copyTextFunc({
      ele: '.copy_btn',
      self: this
    });
  },
  methods: {
    ...mapMutations({
      copyTextFunc: 'copyTextFunc'
    })
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #exportPrivateKey{
    padding:0 50px;
    .export_title{
      font-size:40px;
      color:#fff;
      line-height:93px;
    }
    .export_key_rule{
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
    .key_text{
      width:100%;
      height:240px;
      @include eleBottomShadown();
      margin-top:30px;
      box-sizing: border-box;
      padding: 25px 45px;
      font-size:30px;
      line-height:50px;
      color:#5e6476;
      resize:none;
      border-radius: 10px;
    }
    .copy_btn{
      width:100%;
      height:88px;
      background-color:$mainColor;
      color:#fff;
      border-radius: 10px;
      @include eleBottomShadown();
      margin-top:80px;
      font-size:30px;
      margin-bottom: 80px;
    }
  }
</style>
