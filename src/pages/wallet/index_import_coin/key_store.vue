<template>
  <div id="keyStore">
    <textarea
      class="private_key_text"
      name="privateKey"
      placeholder="输入keystore"
      v-model="keystore"></textarea>
    <button
      class="scan_code"
      @click="scaning">
      <i class="iconfont icon-saoma"></i>
      <span class="scan_code_name">扫描二维码</span>
    </button>
    <icon-input
      inputPlaceholder="输入原密码"
      v-model="passwrod"
      :class="{'blue_eye': inputType === 'text'}"
      :inputType="inputType"
      :iconfont="inputType === 'password' ? 'icon-guanbi-yanjing' : 'icon-chakanyanjingshishifenxi'"
      :iconCallback="changeInputType" />
  </div>
</template>

<script>
import iconInput from '@/components/input/right_icon.vue';
export default {
  name: 'keyStore',
  data () {
    return {
      // keystore
      keystore: '',
      // 密码
      passwrod: '',
      // 输入框方式
      inputType: 'password'
    };
  },
  methods: {
    changeInputType () {
      if (this.inputType === 'password') {
        this.inputType = 'text';
      } else {
        this.inputType = 'password';
      }
    },
    // 扫描二维码
    scaning () {
      this.$global.notOpenOptions();
    },
    // 提交事件
    submitFunc () {
      // 如果输入的keystore正确
      let keystore = {};
      try {
        keystore = JSON.parse(this.keystore);
      } catch (err) {
        this.$global.alertOptions('请输入正确keystore');
        this.$global.loadingOptions(false);
      }
      // 判断是否输入了密码
      if (this.passwrod === '') {
        this.$global.alertOptions('请输入正确密码');
        this.$global.loadingOptions(false);
        return false;
      }
      // TODO:
      // 这里需要判断账户是否已经添加
      // TODO: 消耗cpu，需要时间，可以添加loading
      // 解密keystore
      const { ethUnit: { keystoreToPritive, addHexPrefix } } = require('@/assets/js/eth_func');
      const account = keystoreToPritive(keystore, this.passwrod);
      if (!account) {
        this.$global.alertOptions('keystore或密码输入错误，请检查后重试');
        this.$global.loadingOptions(false);
        return false;
      }
      // 私钥正确
      this.$parent.$parent.importSubmitSuccess({
        key: addHexPrefix(account.address),
        keyStore: keystore,
        publicKey: account.privateKey,
        type: this.$parent.$parent.coinInfo.id,
        siteName: this.$parent.$parent.coinInfo.symbol + '-1',
        coinsNumber: [
          {
            id: this.$parent.$parent.coinInfo.id,
            number: '0'
          }
        ],
        import: true
      });
    }
  },
  components: {
    iconInput
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #keyStore {
    .private_key_text {
      background: #fff;
      width: 100%;
      resize: none;
      border-radius: 10px;
      padding: 20px 30px;
      box-sizing: border-box;
      height: 300px;
      box-shadow: 0 0 18px 3px rgba(27, 55, 173, 0.1);
    }
    .scan_code {
      width: 100%;
      height: 80px;
      line-height: 80px;
      display: block;
      margin-top: 20px;
      background: #fff;
      color: #0d1334;
      box-shadow: 0 0 18px 3px rgba(27, 55, 173, 0.1);
      .icon-saoma {
        font-size: 32px;
        padding-right: 10px;
        display: inline-block;
        vertical-align: middle;
      }
      .scan_code_name {
        font-size: 28px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .blue_eye {
      .input-right-icon-icon {
        color: $mainColor;
      }
    }
  }
</style>
