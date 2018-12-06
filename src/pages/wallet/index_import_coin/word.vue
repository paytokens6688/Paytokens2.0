<template>
  <div id="importCoinWord">
    <word-list v-model="wordListArr" />
  </div>
</template>

<script>
import wordList from '@/components/input/word_list.vue';
export default {
  name: 'importCoinWord',
  data () {
    return {
      // 助记词列表
      wordListArr: [],
      // 助记词字符串
      wordListStr: '',
      // EOS是否在请求
      eosIsrequest: false,
      // 密码
      pass: this.$parent.$parent.selectAccount.pass
    };
  },
  beforeMount () {
    // 重置助记词列表
    for (let i = 0; i < 12; i++) {
      this.wordListArr.push('');
    }
  },
  methods: {
    // 提交事件
    submitFunc () {
      // 如果没有输入助记词
      if (this.wordListArr.length !== 12) {
        this.$global.alertOptions('请输入12位助记词');
        this.$global.loadingOptions(false);
        return false;
      }
      // 判断是否是助记词
      const { btcUnit: { isMnemonic, wordStrToBuffer } } = require('@/assets/js/btc_func');
      this.wordListStr = this.wordListArr.join(' ');
      if (!isMnemonic(this.wordListStr)) {
        this.$global.alertOptions('助记词输入有误');
        this.$global.loadingOptions(false);
        return false;
      }
      // 转化成buffer
      this.wordListStr = wordStrToBuffer(this.wordListStr);
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
    // 导入比特币
    importBtc () {
      const { btcUnit: { wordToWIF, backAccount } } = require('@/assets/js/btc_func');
      // 助记词转为私钥
      const privateKey = wordToWIF(this.wordListStr);
      const { ethUnit: { toBufferString, stringToKeystore } } = require('@/assets/js/eth_func');
      // 加密私钥
      const keyStore = stringToKeystore(toBufferString(privateKey), this.pass);
      // 币种地址
      const key = backAccount(privateKey);
      // 返回对象
      this.$parent.$parent.importSubmitSuccess({
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
        import: true
      });
    },
    // 导入以太坊
    importEth () {
      const { ethUnit: { wordToPrivate, stringToKeystore, addHexPrefix } } = require('@/assets/js/eth_func');
      // 助记词转为私钥
      const privateKey = wordToPrivate(this.wordListStr);
      // 加密私钥
      const keyStore = stringToKeystore(privateKey, this.pass);
      // 币种地址
      const key = addHexPrefix(keyStore.address);
      // 返回对象
      this.$parent.$parent.importSubmitSuccess({
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
        import: true
      });
    },
    // 导入EOS
    importEos () {
      const { eosUnit: { wordToPrivate, getAccount } } = require('@/assets/js/eos_func');
      // 助记词转为私钥
      const privateKey = wordToPrivate(this.wordListStr);
      // 加密私钥
      const { ethUnit: { toBufferString, stringToKeystore } } = require('@/assets/js/eth_func');
      const keyStore = stringToKeystore(toBufferString(privateKey), this.pass);
      // 获取币种地址
      this.eosIsrequest = true;
      let key = null;
      getAccount(privateKey).then(data => {
        this.eosIsrequest = false;
        if (!data) {
          this.$global.alertOptions('该账户没有EOS地址，请检查后重试');
          this.$global.loadingOptions(false);
          return false;
        }
        key = data;
        this.$parent.$parent.importSubmitSuccess({
          key,
          keyStore,
          privateKey,
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
  },
  components: {
    wordList
  }
};
</script>

<style lang="scss">
  #importCoinWord {
  }
</style>
