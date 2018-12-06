<template>
  <div id="siteDetail">
    <div
      class="header"
      @click="selectAccount">
      <p class="iconfont icon-zhanghu"></p>
      <p class="header_name">切换地址</p>
    </div>
    <div class="account_info">
      <div class="account_money">
        <p class="account_all">{{ accountInfo.number }} {{ coinInfo.symbol }}</p>
        <p class="account_price">&yen;{{ accountInfo.price.cny }} / ${{ accountInfo.price.usd }}</p>
      </div>
      <img
        class="account_coin_icon"
        :src="coinInfo.icon" />
    </div>
    <div class="account_type">
      <button
        class="account_type_btn"
        @click="goOutPage">
        <i class="account_type_icon iconfont icon-zhuanchu_money"></i>
        <span class="account_type_text">转&nbsp;&nbsp;出</span>
      </button>
      <button
        class="account_type_btn"
        @click="goInPage">
        <i class="account_type_icon iconfont icon-zhuanchu_money1"></i>
        <span class="account_type_text">转&nbsp;&nbsp;入</span>
      </button>
    </div>
    <div
      class="logs"
      :class="{'logs_watch': accountInfo.isWatch}">
      <p class="main_title">交易记录</p>
      <more-list-box
        class="main"
        :listArr="accountInfo.txLogs"
        :scrollBack="logScroll"
        >
        <ul class="main_txs">
          <li
            class="main_tx"
            v-for="(item, index) in accountInfo.txLogs"
            :key="index"
            @click="goTxDetail(item)">
            <p class="tx_type_number">
              <span class="tx_type">
                <i
                  class="iconfont"
                  :class="item.type === 'in' ? 'icon-zhuanchu_money1' : 'icon-zhuanchu_money'"></i>
                <b class="tx_type_text">{{ item.type === 'in' ? '转入' : '转出' }}</b>
              </span>
              <span
                class="tx_number"
                :class="{'tx_number_add': item.type === 'in'}">
                {{ item.type === 'in' ? '+' : '' }}{{ item.number }}
                {{ coinInfo.symbol }}
              </span>
            </p>
            <p class="tx_time_state">
              <span class="tx_time">{{ item.time }}</span>
              <span
                class="tx_state"
                :class="{'tx_state_finish': item.isFinish}">{{ item.step }}</span>
            </p>
            <p
              class="tx_notice"
              v-if="item.notice">备注：<span class="tx_notice_inner">{{ item.notice }}</span></p>
          </li>
        </ul>
        <noRecord
          title="暂无数据"
          type="record"
          v-if="!accountInfo.txLogs.length">
        </noRecord>
      </more-list-box>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import noRecord from '@/components/noRecord/no_record.vue';
import moreListBox from '@/components/list/more_list_box.vue';
export default {
  name: 'siteDetail',
  layout: 'back_page_img_big',
  data () {
    return {
      // 账户地址
      address: this.$route.query.key,
      // 币种信息
      coinInfo: {
        // 币种id
        id: '',
        // 币种名称
        name: '',
        // 币种符号
        symbol: '',
        // 币种中文名
        nameZh: '',
        // 币种图标
        icon: '',
        // 单价
        price: {
          // 人民币
          cny: '',
          // 美元
          usd: ''
        },
        // 如果是代币增加合约地址
        contractAddress: ''
      },
      // 账户信息
      accountInfo: {
        // 是不是观察账号
        isWatch: true,
        // 币数
        number: '0.0000',
        // 价格
        price: {
          // 人民币价格
          cny: '0.00',
          // 美元价格
          usd: '0.00'
        },
        // 交易记录信息
        txLogs: [
          // {
          //   type: '转入还是转出',
          //   number: '转账数量',
          //   time: '时间',
          //   notice: '转账备注',
          //   isFinish: 是否转账完成,
          //   step: '转账进行到哪一步了',
          //   txid: '交易ID'
          // }
        ]
      },
      // 滚动页面
      page: 1,
      // 是否可以请求
      canRequest: true,
      // 币种ID
      coinType: ''
    };
  },
  computed: {
    ...mapState({
      coins: state => state.storage.coins,
      accounts: state => state.storage.userInfo.accounts,
      selectAccountIndex: state => state.storage.userInfo.selectAccount - 0
    })
  },
  beforeMount () {
    this.pageTitle('第一个账户');
    // 如果是观察账户
    if (this.$route.query.isWatch) {
      this.accountInfo.isWatch = true;
    } else {
      this.accountInfo.isWatch = false;
    }
  },
  mounted () {
    // 获取币种信息
    this.getCoinInfo();
    // 获取该地址金额
    this.getSiteInfo();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      goDetail: 'changePayLogDetailShow'
    }),
    // 获取币种信息函数
    getCoinInfo () {
      // 币种ID
      this.coinType = this.$route.query.coinType.split('-');
      // 判断是不是代币
      if (this.coinType.length === 1) {
        // 主链币种
        this.coins.main.map((coin) => {
          if (coin.id === this.coinType[0]) {
            this.coinInfo.id = coin.id;
            this.coinInfo.name = coin.name;
            this.coinInfo.symbol = coin.symbol;
            this.coinInfo.nameZh = coin.nameZh;
            this.coinInfo.icon = coin.icon;
            this.coinInfo.price = coin.price;
          }
        });
      } else {
        // 代币
        this.coins.other.ETH.map((coin) => {
          if (coin.id === this.$route.query.coinType) {
            this.coinInfo.id = coin.id;
            this.coinInfo.name = coin.name;
            this.coinInfo.symbol = coin.symbol;
            this.coinInfo.nameZh = coin.nameZh;
            this.coinInfo.icon = coin.icon;
            this.coinInfo.price = coin.price;
            this.coinInfo.contractAddress = coin.address;
          }
        });
      }
      // 获取用户转账信息
      this.getSiteTxs();
    },
    // 获取地址信息
    getSiteInfo () {
      // 账户地址，获取账户地址信息
      [].concat(this.accounts[this.selectAccountIndex].siteOfOther,
        this.accounts[this.selectAccountIndex].siteOfWatch,
        this.accounts[this.selectAccountIndex].siteOfWord).map((item) => {
        if (item.key === this.address) {
          item.userCoinsInfo.map((site) => {
            if (this.coinInfo.id === site.id) {
              this.accountInfo.number = site.number;
              this.accountInfo.price = {
                cny: (site.number * this.coinInfo.price.cny).toFixed(2),
                usd: (site.number * this.coinInfo.price.usd).toFixed(2)
              };
            }
          });
        }
      });
    },
    // 获取地址交易记录
    getSiteTxs () {
      this.canRequest = false;
      if (this.coinType.length === 1) {
        // 主链币种
        if (this.coinType[0] === '1') {
          // 比特币
          const { btcUnit: { getTransactionLog } } = require('@/assets/js/btc_func');
          getTransactionLog(this.address, this.page).then(({ data }) => {
            if (data.data.length !== 0) this.canRequest = true;
            this.page++;
            this.accountInfo.txLogs = this.accountInfo.txLogs.concat(data.data.map(item => {
              return {
                type: item.type,
                number: item.value,
                time: item.time,
                notice: item.notice,
                isFinish: item.confirmations > 5,
                step: item.confirmations <= 5 ? '转账中' : '转账完成',
                txid: item.txid,
                proto: item
              };
            }));
          });
        } else if (this.coinType[0] === '2') {
          // 以太坊
          const { ethUnit: { getTransactionLog } } = require('@/assets/js/eth_func');
          getTransactionLog(this.address, this.page).then((data) => {
            // if (data.length !== 0) this.canRequest = true;
            this.page++;
            this.accountInfo.txLogs = this.accountInfo.txLogs.concat(data.map(item => {
              return {
                type: item.type,
                number: item.value,
                time: item.time,
                notice: item.message,
                isFinish: item.finish,
                step: item.finish ? '转账完成' : '转账中',
                txid: item.hash,
                proto: item.proto
              };
            }));
          });
        } else if (this.coinType[0] === '3') {
          // EOS
          const { eosUnit: { getTransactionLog } } = require('@/assets/js/eos_func');
          getTransactionLog(this.address, this.page).then(({ data }) => {
            if (data.data.length !== 0) this.canRequest = true;
            this.page++;
            this.accountInfo.txLogs = this.accountInfo.txLogs.concat(data.data.map(item => {
              return {
                type: item.type,
                number: item.value,
                time: this.$func.formatDate(new Date(item.time)),
                notice: item.memo,
                isFinish: item.status === '已完成',
                step: item.status === '已完成' ? '转账完成' : '转账中',
                txid: item.hash,
                proto: item
              };
            }));
          });
        }
      } else {
        // 代币
        const { ethUnit: { getContractLog } } = require('@/assets/js/eth_func');
        getContractLog({
          contractAddress: this.coinInfo.contractAddress,
          address: this.address
        }).then((data) => {
          console.log(data);
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    // 切换地址
    selectAccount () {
      this.$router.push({
        path: '/wallet/select_account',
        query: {
          coinType: this.$route.query.coinType,
          selectAccount: this.selectAccountIndex.toString()
        }
      });
    },
    // 进入转出页面
    goOutPage () {
      this.$router.push({
        path: '/wallet/transition_out',
        query: {
          key: this.$route.query.key,
          coinType: this.$route.query.coinType
        }
      });
    },
    // 进入转入页面
    goInPage () {
      this.$router.push({
        path: '/wallet/transition_in',
        query: {
          key: this.$route.query.key,
          coinType: this.$route.query.coinType
        }
      });
    },
    // 进入记录详情
    goTxDetail (item) {
      this.goDetail({
        ...item.proto,
        coinType: this.coinInfo.id
      });
      this.$router.push({
        path: '/wallet/tx_detail',
        query: {
          id: this.coinInfo.id
        }
      });
    },
    // 滚动事件
    logScroll () {
      // 如果不能请求直接返回
      if (!this.canRequest) return false;
      this.getSiteTxs();
    }
  },
  components: {
    noRecord,
    moreListBox
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #siteDetail {
    overflow: initial!important;
    position: relative;
    .header {
      position: fixed;
      top: 0;
      right: 0;
      color: $gray;
      line-height: 90px;
      padding: 0 25px;
      .icon-zhanghu {
        display: inline-block;
        vertical-align: middle;
        font-size: 36px;
        font-weight: 600;
      }
      .header_name {
        display: inline-block;
        vertical-align: middle;
        font-size: 26px;
      }
    }
    .account_info {
      padding: 30px 40px;
      height: calc(420px - 90px);
      box-sizing: border-box;
      overflow: hidden;
      .account_money {
        float: left;
        width: calc(100% - 120px);
        word-wrap: break-word;
        .account_all {
          font-size: 60px;
          font-weight: 600;
          color: #fff;
          line-height: 76px;
          letter-spacing: 2px;
        }
        .account_price {
          line-height: 60px;
          color: $gray;
        }
      }
      .account_coin_icon {
        float: right;
        margin-top: 20px;
        width: 90px;
        height: 90px;
      }
    }
    .account_type {
      position: absolute;
      top: calc(420px - #{100px + 90px});
      left: 0;
      height: 100px;
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      .account_type_btn {
        float: left;
        width: 50%;
        box-sizing: border-box;
        height: 100%;
        background: none;
        color: #fff;
        position: relative;
        &:first-child {
          &::after {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            content: '';
            width: 1Px;
            height: 40px;
            background: #55596a;
          }
        }
        .account_type_icon {
          display: inline-block;
          vertical-align: middle;
          font-size: 55px;
        }
        .account_type_text {
          display: inline-block;
          vertical-align: middle;
          font-size: 30px;
        }
      }
    }
    .logs {
      height: calc(100% - #{420px - 86px});
      position: relative;
      z-index: 2;
      background: #fff;
      &.logs_watch {
        margin-top: -100px;
        height: calc(100% - #{420px - 186px});
      }
      .main_title {
        height: 86px;
        line-height: 86px;
        border-bottom: 1Px solid $listBottomGray;
        box-sizing: border-box;
        margin-left: 40px;
        color: $lowGray;
        font-size: 26px;
      }
      .main {
        height: calc(100% - 86px);
        overflow-y: scroll;
        .main_txs {
          padding-left: 40px;
          .main_tx {
            padding: 20px 30px 20px 0;
            border-bottom: 1Px solid $listBottomGray;
            .tx_type_number {
              overflow: hidden;
              line-height: 48px;
              .tx_type {
                float: left;
                .iconfont {
                  font-size: 36px;
                  display: inline-block;
                  vertical-align: middle;
                }
                .tx_type_text {
                  font-weight: 500;
                  display: inline-block;
                  vertical-align: middle;
                }
              }
              .tx_number {
                float: right;
                font-size: 30px;
                font-weight: 600;
                &.tx_number_add {
                  color: #f75434;
                }
              }
            }
            .tx_time_state {
              font-size: 24px;
              color: $gray;
              overflow: hidden;
              line-height: 44px;
              padding: 10px 0;
              .tx_state {
                float: right;
                color: $mainColor;
                &.tx_state_finish {
                  color: $gray;
                }
              }
            }
            .tx_notice {
              @extend .tx_time_state;
              background: #f3f4f8;
              padding: 0 10px;
              .tx_notice_inner {
                display: inline-block;
              }
            }
          }
        }
      }
    }
  }
</style>
