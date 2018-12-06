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
      pass: '',
      privateWordBuffer: ''
    };
  },
  computed: {
    ...mapState({
      accountsList: state => state.storage.userInfo.accounts
    })
  },
  mounted () {
    this.$global.loadingOptions(true);
    this.pass = this.accountsList[this.$route.query.selectAccount - 0].pass;
    // 助记词字符串转成buffer
    setTimeout(() => {
      const { btcUnit: { wordStrToBuffer } } = require('@/assets/js/btc_func');
      this.privateWordBuffer = wordStrToBuffer(this.accountsList[this.$route.query.selectAccount - 0].word);
      this.createSite();
    }, 500);
  },
  beforeDestroy () {
    this.$global.loadingOptions(false);
    this.$global.alertOptions('创建成功');
  },
  methods: {
    ...mapMutations({
      indexImportCoin: 'storage/indexImportCoin'
    }),
    // 创建地址
    createSite () {
      // 地址创建
      this.indexImportCoin({
        selectAccount: this.$route.query.selectAccount,
        data: this[`create${['Btc', 'Eth', 'Eos'][this.$route.query.id - 1]}`]()
      });
      this.$router.go(-1);
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
