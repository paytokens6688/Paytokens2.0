<template>
  <div id="txDetail" class="tx_detail_box">
    <div class="top">
      <img
        class="top_img"
        :class="{'top_img_success': stateStep === 2}"
        :src="stateStep === 2 ? require('../../assets/images/transition_success.png') : require('../../assets/images/transfer_ing.gif')" />
      <p class="top_number">{{ transferInfo.number }} {{ coin.symbol }}</p>
      <div class="top_state">
        <div
          class="top_state_frist top_state_step"
          :class="{'top_state_show': stateStep >= 0}">
          <div class="top_state_icon">
            <img
              class="top_state_point_icon"
              src="../../assets/images/tx_detail_point.png">
          </div>
          <p class="top_state_name">已发起</p>
        </div>
        <div
          class="top_state_second top_state_step"
          :class="{'top_state_show': stateStep > 0}">
          <div class="top_state_icon">
            <img
              class="top_state_point_icon"
              src="../../assets/images/tx_detail_point.png">
          </div>
          <p class="top_state_name">打包中</p>
        </div>
        <div
          class="top_state_last top_state_step"
          :class="{'top_state_show': stateStep > 1}">
          <div class="top_state_icon">
            <img
              class="top_state_success_icon"
              src="../../assets/images/transtion_success_icon.png">
          </div>
          <p class="top_state_name">已完成</p>
        </div>
      </div>
      <p
        class="top_prompt"
        v-if="stateStep !== 2">由于节点网络拥堵或延迟，您的转账会延迟，请耐心等候。</p>
    </div>
    <div
      class="main"
      :class="{'main_big': stateStep === 2}">
      <div class="from main_box">
        <p class="title">
          <i class="title_coin iconfont icon-ren"></i>
          <span class="title_name">发款方</span>
        </p>
        <ul class="accounts_list">
          <li
            class="accounts_account"
            v-for="(account, index) in transferInfo.from"
            :key="index">
            <span
              class="accounts_index"
              v-if="transferInfo.from.length > 1">
              {{ index + 1 }}
            </span>
            <span class="accounts_site">
              {{ account }}
            </span>
          </li>
        </ul>
      </div>
      <div class="to main_box">
        <p class="title">
          <i class="title_coin iconfont icon-ren"></i>
          <span class="title_name">收款方</span>
        </p>
        <ul class="accounts_list">
          <li
            class="accounts_account"
            v-for="(account, index) in transferInfo.to"
            :key="index">
            <span
              class="accounts_index"
              v-if="transferInfo.to.length > 1">
              {{ index + 1 }}
            </span>
            <span class="accounts_site">
              {{ account }}
            </span>
          </li>
        </ul>
      </div>
      <div
        class="free main_box"
        v-if="transferInfo.free !== -1">
        <p class="title">
          <i class="title_coin iconfont icon-wakuang"></i>
          <span class="title_name">矿工费</span>
        </p>
        <ul class="accounts_list">
          <li class="accounts_account">
            <span class="accounts_site">
              {{ transferInfo.free }}
            </span>
          </li>
        </ul>
      </div>
      <div
        class="notice"
        v-if="transferInfo.notice">
        备注：{{ transferInfo.notice }}
      </div>
      <div class="other">
        <div class="info">
          <p class="info_title">交易号</p>
          <p class="info_text">{{ transferInfo.txId.replace(/^(.{10})(.*?)(.{10})$/, '$1...$3') }}</p>
          <p
            class="info_title"
            v-if="transferInfo.blockId">区块</p>
          <p class="info_text">{{ transferInfo.blockId }}</p>
          <p class="info_title">交易时间</p>
          <p class="info_text info_time">{{ transferInfo.txTime }}</p>
        </div>
        <div class="code">
          <qrcode
            class="code_img"
            :value="`${coin.url}/${transferInfo.txId}`"/>
          <button
            class="copy_code"
            :data-clipboard-text="`${coin.url}/${transferInfo.txId}`"
            onclick="">复制URL</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapMutations, mapState } from 'vuex';
import VueQrcode from '@xkeshi/vue-qrcode';
Vue.component(VueQrcode.name, VueQrcode);
export default {
  name: 'txDetail',
  layout: 'back_page',
  data () {
    return {
      // 币种信息
      coin: {
        // 符号
        symbol: '',
        // 区块链浏览器链接
        url: ''
      },
      // 转账步骤 0,1,2 send已发起，pack打包中，success已完成
      stateStep: -1,
      // 转账信息
      transferInfo: {
        // 转账状态, send已发起，pack打包中，success已完成
        state: '',
        // 转账数量
        number: '',
        // 发送方
        from: [],
        // 收款方
        to: [],
        // 矿工费用
        free: '',
        // 备注
        notice: '',
        // 交易id
        txId: '',
        // 区块号
        blockId: '',
        // 交易时间
        txTime: ''
      }
    };
  },
  computed: {
    ...mapState({
      getDetail: 'payLogDetailShow'
    })
  },
  beforeMount () {
    this.pageTitle('交易详情');
    if (this.$route.query.id !== this.getDetail.coinType) return this.$router.go(-1);
    this.initPage(this.getDetail);
  },
  mounted () {
    this.copyUrl();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      copyTextFunc: 'copyTextFunc'
    }),
    initPage (detail) {
      // 页面赋值
      if (detail.coinType === '1') {
        // 比特币
        this.coin.symbol = 'BTC';
        this.coin.url = 'https://btc.com';
        this.stateStep = detail.confirmations < 6 ? 1 : 2;
        this.transferInfo.state = detail.confirmations < 6 ? 'pack' : 'success';
        this.transferInfo.number = (detail.type === 'in' ? '+' : '') + detail.value;
        this.transferInfo.from = detail.vin.map(item => item.address);
        this.transferInfo.to = detail.vout.map(item => item.address);
        this.transferInfo.free = detail.fees;
        this.transferInfo.notice = '';
        this.transferInfo.txId = detail.txid;
        this.transferInfo.blockId = detail.block_height;
        this.transferInfo.txTime = detail.time;
      } else if (detail.coinType === '2') {
        // ETH
        this.coin.symbol = 'ETH';
        this.coin.url = 'https://etherscan.io/tx';
        this.stateStep = detail.confirmations - 0 < 12 ? 1 : 2;
        this.transferInfo.state = detail.confirmations - 0 < 12 ? 'pack' : 'success';
        this.transferInfo.number = (detail.type === 'in' ? '+' : '-') + detail.value;
        this.transferInfo.from = typeof detail.vin === 'string' ? [detail.vin] : detail.vin;
        this.transferInfo.to = typeof detail.vout === 'string' ? [detail.vout] : detail.vout;
        this.transferInfo.free = detail.fees;
        this.transferInfo.notice = detail.message;
        this.transferInfo.txId = detail.hash;
        this.transferInfo.blockId = detail.block_height;
        this.transferInfo.txTime = detail.time;
      } else if (detail.coinType === '3') {
        // EOS
        this.coin.symbol = 'EOS';
        this.coin.url = 'https://eospark.com/MainNet/tx';
        this.stateStep = 2;
        this.transferInfo.state = 'success';
        this.transferInfo.number = (detail.type === 'in' ? '+' : '-') + detail.value;
        this.transferInfo.from = typeof detail.input === 'string' ? [detail.input] : detail.input;
        this.transferInfo.to = typeof detail.out === 'string' ? [detail.out] : detail.out;
        this.transferInfo.free = -1;
        this.transferInfo.notice = detail.memo;
        this.transferInfo.txId = detail.hash;
        this.transferInfo.blockId = detail.block_height;
        this.transferInfo.txTime = detail.time;
      } else if (detail.coinType.match('1-')) {
        // 以太坊代币
      }
      console.log(detail);
    },
    // url复制
    copyUrl () {
      this.copyTextFunc({
        ele: '.copy_code',
        self: this
      });
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #txDetail.tx_detail_box {
    background: #2a53fd;
    margin-top: -90px;
    height: 100%;
    background-image: url('../../assets/images/top_transparent_bg.jpg');
    background-size: 100% auto;
    background-repeat: no-repeat;
    box-sizing: border-box;
    padding: 90px 30px 0;
    .top {
      text-align: center;
      color: #fff;
      .top_img {
        height: 190px;
        display: block;
        margin: 0 auto;
        overflow: hidden;
        &.top_img_success {
          height: 114px;
          margin: #{(190px - 114px) / 2} auto;
        }
      }
      .top_number {
        font-size: 48px;
        font-weight: 700;
        line-height: 66px;
      }
      .top_state {
        padding-top: 35px;
        overflow: hidden;
        .top_state_step {
          float: left;
          opacity: 0.4;
          transition: opacity .3s;
          &.top_state_show {
            opacity: 1;
          }
          .top_state_icon {
            height: 6px;
            background: rgba(255, 255, 255, 0.8);
            width: 100%;
            position: relative;
            .top_state_point_icon {
              position: absolute;
              top: -9px;
              left: -12px;
              width: 24px;
              height: 24px;
            }
            .top_state_success_icon {
              position: absolute;
              top: -9px;
              right: -9px;
              width: 18px;
              height: 24px;
            }
          }
          .top_state_name {
            padding-top: 20px;
            line-height: 40px;
            font-size: 24px;
            padding-bottom: 20px;
          }
          &.top_state_frist {
            width: 21.4%;
            .top_state_icon {
              width: 80%;
              margin-left: 20%;
            }
            .top_state_name {
              text-align: left;
            }
          }
          &.top_state_second {
            width: 57.2%;
            .top_state_icon {
              .top_state_point_icon {
                left: 50%;
                margin-left: -12px;
              }
            }
          }
          &.top_state_last {
            width: 21.4%;
            .top_state_icon {
              width: 80%;
              margin-right: 20%;
            }
            .top_state_name {
              text-align: right;
            }
          }
        }
      }
      .top_prompt {
        padding: 18px;
        line-height: 30px;
        font-size: 24px;
        color: #cfd5e7;
        background: rgba(255, 255, 255, 0.1);
        border: 1Px solid rgba(255, 255, 255, 0.6);
        margin-bottom: 30px;
      }
    }
    .main {
      background: #fff;
      border-radius: 10px;
      padding: 10px 30px;
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100% - 550px);
      &.main_big {
        height: calc(100% - 450px);
      }
      .title {
        color: $gray;
        line-height: 52px;
        .title_coin {
          font-size: 30px;
          display: inline-block;
          vertical-align: middle;
        }
        .title_name {
          font-size: 26px;
          vertical-align: middle;
        }
      }
      .main_box {
        padding-bottom: 10px;
        &.from, &.to, &.free {
          border-bottom: 1Px solid #eaecf1;
        }
        .accounts_list {
          .accounts_account {
            line-height: 50px;
            font-size: 26px;
            .accounts_index {
              display: inline-block;
              width: 50px;
              height: 50px;
              background: #ea492f;
              border-radius: 50%;
              text-align: center;
              font-size: 36px;
              color: #fff;
              transform: scale(0.5);
              transform-origin: left center;
              vertical-align: middle;
              margin-right: -20px;
            }
            .accounts_site {
              display: inline-block;
              vertical-align: middle;
              word-wrap: break-word;
              word-break: break-word;
            }
          }
        }
      }
      .notice {
        background: #f3f4f8;
        padding: 10px;
        color: $gray;
        font-size: 24px;
      }
      .other {
        overflow: hidden;
        padding-bottom: 20px;
        .info {
          float: left;
          width: 400px;
          .info_title {
            color: $gray;
            font-size: 24px;
            padding-top: 20px;
            line-height: 50px;
          }
          .info_text {
            color: $mainColor;
            font-size: 26px;
            &.info_time {
              color: #5e6476;
            }
          }
        }
        .code {
          float: right;
          width: 200px;
          padding: 30px 10px 0;
          height: 100%;
          .code_img {
            display: block;
            width: 200px;
            height: 200px;
            margin-bottom: 40px;
          }
          .copy_code {
            display: block;
            background: #eaecf1;
            color: $gray;
            width: 180px;
            height: 48px;
            border-radius: 10px;
            margin: 20px auto 0;
          }
        }
      }
    }
  }
</style>
