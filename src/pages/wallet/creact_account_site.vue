<template>
  <div id="createAccountSite">
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { setTimeout } from 'timers';
export default {
  name: 'createAccountSite',
  data () {
    return {
    };
  },
  computed: {
    ...mapState({
      createArray: state => state.createAccount.createArray,
      pass: state => state.createAccount.pass,
      privateWordBuffer: state => state.createAccount.importWord.buffer,
      lowState: state => state.createAccount,
      accountsList: state => state.storage.userInfo.accounts
    })
  },
  mounted () {
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
    this.createSite();
  },
  methods: {
    ...mapMutations({
      pushImportSite: 'createAccount/pushImportSite',
      copyLowToLong: 'storage/copyLowToLong',
      saveData: 'createAccount/accountFrist'
    }),
    // 创建地址
    createSite () {
      // 地址创建的数组
      const createSiteArr = [];
      this.createArray.map((item) => {
        // 执行创建方法
        createSiteArr.push(this[`create${['Btc', 'Eth', 'Eos'][item - 1]}`]());
      });
      this.pushImportSite(createSiteArr);
      this.copyLowToLong(this.lowState);
      // TODO: 加loading
      setTimeout(() => {
        this.$router.replace({
          path: '/wallet/copy_account',
          query: {
            id: this.accountsList.length - 1
          }
        });
      }, 1000);
    },
    // 创建比特币
    createBtc () {
      const { btcUnit: { wordToWIF, backAccount } } = require('@/assets/js/btc_func');
      // 助记词转为私钥
      const privateKey = wordToWIF(this.privateWordBuffer);
      const { ethUnit: { toBufferString, stringToKeystore } } = require('@/assets/js/eth_func');
      // 加密私钥
      const keyStore = stringToKeystore(toBufferString(privateKey), this.pass);
      // 币种地址
      const key = backAccount(privateKey);
      // 返回对象
      return {
        key,
        keyStore,
        privateKey,
        type: '1',
        siteName: 'BTC-1',
        coinsNumber: [
          {
            id: '1',
            number: '0'
          }
        ],
        import: false
      };
    },
    // 创建以太坊
    createEth () {
      const { ethUnit: { wordToPrivate, stringToKeystore, addHexPrefix } } = require('@/assets/js/eth_func');
      // 助记词转为私钥
      const privateKey = wordToPrivate(this.privateWordBuffer);
      // 加密私钥
      const keyStore = stringToKeystore(privateKey, this.pass);
      // 币种地址
      const key = addHexPrefix(keyStore.address);
      // 返回对象
      return {
        key,
        keyStore,
        privateKey,
        type: '2',
        siteName: 'ETH-1',
        coinsNumber: [
          {
            id: '2',
            number: '0'
          }
        ],
        import: false
      };
    }
  }
};
</script>

<style lang="scss">
  #createAccountSite {
  }
</style>
