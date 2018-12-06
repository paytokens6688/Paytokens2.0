<template>
  <div id="privateKey">
    <textarea
      class="private_key_text"
      name="privateKey"
      placeholder="输入私钥"
      v-model="userPrivateKey"></textarea>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import { setTimeout } from 'timers';
export default {
  name: 'privateKey',
  data () {
    return {
      userPrivateKey: '',
      // EOS是否在请求中
      eosIsrequest: false
    };
  },
  computed: {
    ...mapState({
      pass: state => state.createAccount.pass
    })
  },
  beforeMount () {
  },
  methods: {
    // 提交事件
    submitFunc () {
      // 如果没有输入私钥
      if (!this.userPrivateKey) return this.$global.alertOptions('请输入您的私钥');
      // 如果没有密码
      if (!this.$func.realPayPass(this.pass)) {
        return this.$global.alertOptions({
          message: '您的创建账户信息因您退出而清除，请重新填写',
          callbackList: [
            {
              title: '知道了',
              callback: () => {
                this.$router.replace('/wallet/create_account');
              }
            }
          ]
        });
      }
      // TODO:
      // 这里需要判断账户是否已经添加
      // 通过父子关系找到页面对象
      if (this.$parent.$parent.coinInfo.id === '1') {
        // 如果是比特币
        this.importBtc();
      } else if (this.$parent.$parent.coinInfo.id === '2') {
        // 如果是以太坊
        this.importEth();
      } else if (this.$parent.$parent.coinInfo.id === '3') {
        // 如果是EOS
        this.importEos();
      }
    },
    // 导入币种BTC
    importBtc () {
      const { btcUnit: { backAccount, isBtcWIF } } = require('@/assets/js/btc_func');
      // 私钥输入错误
      if (!isBtcWIF(this.userPrivateKey)) {
        this.$global.loadingOptions(false);
        this.$global.alertOptions('比特币私钥输入错误，请检查后重试');
        return false;
      }
      const { ethUnit: { toBufferString, stringToKeystore } } = require('@/assets/js/eth_func');
      // 加密私钥
      const keyStore = stringToKeystore(toBufferString(this.userPrivateKey), this.pass);
      // 币种地址
      const key = backAccount(this.userPrivateKey);
      // 私钥是正确的
      this.$parent.$parent.importSubmitSuccess({
        key,
        keyStore,
        publicKey: this.userPrivateKey,
        type: '1',
        siteName: 'BTC-1',
        coinsNumber: [
          {
            id: '1',
            number: '0'
          }
        ],
        import: true
      });
    },
    // 导入币种ETH
    importEth () {
      const { ethUnit: { stringToKeystore, addHexPrefix } } = require('@/assets/js/eth_func');
      // 加密私钥
      const keyStore = stringToKeystore(this.userPrivateKey, this.pass);
      // 如果返回false，说明私钥有误
      if (!keyStore) {
        this.$global.loadingOptions(false);
        this.$global.alertOptions('ETH私钥输入错误，请检查后重试');
        return false;
      }
      // 币种地址
      const key = addHexPrefix(keyStore.address);
      // 私钥是正确的
      this.$parent.$parent.importSubmitSuccess({
        key,
        keyStore,
        publicKey: this.userPrivateKey,
        type: '2',
        siteName: 'ETH-1',
        coinsNumber: [
          {
            id: '2',
            number: '0'
          }
        ],
        import: true
      });
    },
    // 导入币种EOS
    importEos () {
      // 如果在请求中
      if (this.eosIsrequest) return false;
      const { eosUnit: { isValidPrivate, getAccount } } = require('@/assets/js/eos_func');
      // 判断是否是一个EOS私钥
      if (!isValidPrivate(this.userPrivateKey)) {
        this.$global.loadingOptions(false);
        this.$global.alertOptions('EOS私钥输入错误，请检查后重试');
        return false;
      }
      // 加密私钥
      const { ethUnit: { toBufferString, stringToKeystore } } = require('@/assets/js/eth_func');
      const keyStore = stringToKeystore(toBufferString(this.userPrivateKey), this.pass);
      // 获取币种地址
      this.eosIsrequest = true;
      let key = null;
      getAccount(this.userPrivateKey).then(data => {
        this.eosIsrequest = false;
        if (!data) {
          this.$global.loadingOptions(false);
          this.$global.alertOptions('该账户没有EOS地址，请检查后重试');
          return false;
        }
        key = data;
        // 私钥是正确的
        this.$parent.$parent.importSubmitSuccess({
          key,
          keyStore,
          publicKey: this.userPrivateKey,
          type: '3',
          siteName: 'EOS-1',
          coinsNumber: [
            {
              id: '3',
              number: '0'
            }
          ],
          import: true
        });
      });
    }
  }
};
</script>

<style lang="scss">
  #privateKey {
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
  }
</style>
