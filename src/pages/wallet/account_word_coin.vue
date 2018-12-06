<template>
  <div id="AccountWordCoin">
    <div class="main">
      <div class="main_all">
        <div class="main_all_left">
          <radio-list
            class="main_all_radio"
            :callback="coinSelectChangeAll"
            v-model="allSelect" />
          全选
        </div>
      </div>
      <!-- 币种显示列表 -->
      <ul class="main_ul">
        <li
          class="main_li"
          v-for="item in coinsList"
          :key="item.id">
          <radio-list
            class="main_li_radio"
            :callback="coinSelectChange(item)"
            v-model="item.select" />
          <div class="main_li_inner">
            <div class="main_li_info">
              <img
                class="main_li_icon"
                :src="item.icon"
                :alt="item.name" />
              <div class="main_li_text">
                <p
                  class="main_li_sym"
                  :data-name-zh="`/${item.nameZh}`">
                  {{ item.symbol }}
                </p>
                <p class="main_li_name">
                  {{ item.name }}
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <button
      class="foot submit-button"
      @click="judgeSelectCoin">导入</button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import radioList from '@/components/radio/radio.vue';

export default {
  name: 'AccountWordCoin',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 是否全选
      allSelect: false,
      // 币种列表
      coinsList: []
    };
  },
  computed: {
    ...mapState({
      coins: state => state.storage.coins.main,
      pass: state => state.createAccount.pass,
      wordListStr: state => state.createAccount.importWord,
      createAccountInfo: state => state.createAccount
    })
  },
  beforeMount () {
    this.pageTitle({
      title: '选择导入币种',
      shadown: true
    });
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
    this.initPage();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      importSiteArr: 'createAccount/pushImportSite',
      copyLowToLong: 'storage/copyLowToLong'
    }),
    // 初始化页面
    initPage () {
      this.coins.map((item) => {
        this.coinsList.push({
          id: item.id,
          name: item.name,
          symbol: item.symbol,
          nameZh: item.nameZh,
          icon: item.icon,
          select: item.id !== '3'
        });
      });
    },
    // 币种全选，及全不选
    coinSelectChangeAll () {
      if (this.allSelect) {
        this.coinsList.map(item => {
          item.select = true;
        });
      } else {
        this.coinsList.map(item => {
          item.select = false;
        });
      }
    },
    // 单个币种选择方式判断是否需要全选
    coinSelectChange (coin) {
      return () => {
        if (coin.select) {
          this.typeChange();
        } else {
          this.allSelect = false;
        }
        if (coin.id === '3' && coin.select === true) {
          return this.$global.alertOptions({
            message: '请保证该助记词下拥有EOS账户，否则将会导入失败',
            callbackList: [
              {
                title: '取消选择',
                callback: () => {
                  coin.select = false;
                  this.typeChange();
                }
              },
              {
                title: '仍要选择',
                callback: () => {
                  this.typeChange();
                }
              }
            ]
          });
        }
      };
    },
    // 账户选择
    typeChange () {
      let isSelectAll = true;
      this.coinsList.map(item => {
        if (!item.select) {
          isSelectAll = false;
        }
      });
      this.allSelect = isSelectAll;
    },
    // 判断是否至少选择一个币种
    judgeSelectCoin () {
      let isSelectCoin = false;
      for (let i = 0; i < this.coinsList.length; i++) {
        if (this.coinsList[i].select) {
          isSelectCoin = true;
        }
      }
      if (!isSelectCoin) return this.$global.alertOptions('请至少选择一个币种');
      this.importWord();
    },
    // 导入币种
    importWord () {
      // 账户数组
      let coinsArr = [];
      this.$global.loadingOptions(true);
      // 因为eos而异步处理
      (new Promise((resolve, reject) => {
        // 创建变量，检测是否导入的有eos
        let importEOS = false;
        // 筛选导入的币种
        const importArr = this.coinsList.filter(item => item.select);
        // 循环币种导入
        importArr.map(async (item, index) => {
          // 如果是eos进行异步处理
          if (item.symbol === 'EOS') {
            importEOS = true;
            const eosSite = await this[`import${item.symbol}`]();
            if (eosSite) { // 如果有eos地址的话
              coinsArr.push(eosSite);
              resolve(coinsArr);
            } else { // 如果没有的话,触发失败函数
              reject(new Error('失败'));
            }
          } else {
            coinsArr.push(this[`import${item.symbol}`]());
          }
          // 如果是最后一个的话，而且没有导入eos，也触发成功
          if (index === importArr.length - 1 && !importEOS) resolve(coinsArr);
        });
      })).then(this.importSuccess).catch(() => {
        console.log('失败');
      });
    },
    // 导入成功处理函数
    importSuccess (coinsArr) {
      console.log(coinsArr);
      this.importSiteArr(coinsArr);
      // 储存账户信息
      this.copyLowToLong(this.createAccountInfo);
      this.$global.loadingOptions(false);
      this.$global.successOptions({
        message: '导入成功',
        callback: () => {
          this.$router.push('/wallet');
        }
      });
    },
    // 导入比特币
    importBTC () {
      const { btcUnit: { wordToWIF, backAccount } } = require('@/assets/js/btc_func');
      // 助记词转为私钥
      const privateKey = wordToWIF(this.wordListStr.buffer);
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
    // 导入以太坊
    importETH () {
      const { ethUnit: { wordToPrivate, stringToKeystore, addHexPrefix } } = require('@/assets/js/eth_func');
      // 助记词转为私钥
      const privateKey = wordToPrivate(this.wordListStr.buffer);
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
    },
    // 导入EOS
    importEOS () {
      const { eosUnit: { wordToPrivate, getAccount } } = require('@/assets/js/eos_func');
      // 助记词转为私钥
      const privateKey = wordToPrivate(this.wordListStr.buffer);
      // 加密私钥
      const { ethUnit: { toBufferString, stringToKeystore } } = require('@/assets/js/eth_func');
      const keyStore = stringToKeystore(toBufferString(privateKey), this.pass);
      // 获取币种地址
      this.eosIsrequest = true;
      let key = null;
      return new Promise((resolve) => {
        getAccount(privateKey).then(data => {
          this.eosIsrequest = false;
          if (!data) {
            resolve(false);
            return this.$global.alertOptions('该账户没有EOS地址，请检查后重试');
          }
          key = data;
          resolve({
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
            import: false
          });
        });
      });
    }
  },
  components: {
    radioList
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #AccountWordCoin {
    $theTopHeight: 20px;
    $theFootHeight: 98px;
    padding-top: $theTopHeight;
    box-sizing: border-box;
    .main {
      height: calc(100% - #{$theTopHeight} - #{$theFootHeight});
      overflow-y: auto;
      padding-left: 30px;
      .main_all {
        padding-top: 15px;
        line-height: 40px;
        overflow: hidden;
        padding-right: 30px;
        .main_all_left {
          float: left;
          color: $lowGray;
          font-size: 24px;
          .main_all_radio {
            float: left;
            margin-right: 30px;
          }
        }
        .main_all_right {
          float: right;
          color: $lowGray;
          font-size: 24px;
        }
      }
      .main_ul {
        padding-top: 30px;
        .main_li {
          padding-bottom: 30px;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .main_li_inner {
            background: #f3f4f8;
            width: 650px;
            overflow: hidden;
            .main_li_info {
              float: left;
              display: flex;
              align-items: center;
              padding-left: 25px;
              padding-top: 30px;
              padding-bottom: 20px;
              .main_li_icon {
                width: 44px;
                height: 44px;
                display: block;
              }
              .main_li_text {
                padding-left: 25px;
                .main_li_sym {
                  line-height: 44px;
                  font-size: 34px;
                  font-weight: 900;
                  &:after {
                    content: attr(data-name-zh);
                    font-size: 24px;
                    color: $lowGray;
                    font-weight: 500;
                    letter-spacing: 1Px;
                  }
                }
                .main_li_name {
                  font-size: 26px;
                  color: $lowGray;
                  line-height: 38px;
                }
              }
            }
          }
        }
      }
    }
    .foot {
      height: $theFootHeight;
      line-height: $theFootHeight;
      border-radius: 0;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
</style>
