<template>
  <div
    id="transitionOut"
    class="transition_out">
    <div
      class="header iconfont icon-saoma"
      @click="scanQrcode"></div>
    <div
      class="account_info"
      @click="selectAccount">
      <img
        class="account_icon"
        :src="coinInfo.icon" />
      <p class="account_name">{{ accountInfo.name }}</p>
      <div class="account_money">
        <p class="account_number">{{ accountInfo.number }}</p>
        <p class="account_price">&yen;{{ accountInfo.price.cny }} / ${{ accountInfo.price.usd }}</p>
      </div>
    </div>
    <div class="form">
      <div class="input">
        <p class="input_title">收款地址</p>
        <input
          class="input_input"
          type="text"
          placeholder="输入收款地址"
          v-model="userInput.toAddress">
        <i
          class="input_icon iconfont icon-dizhi2"
          @click="selectCommonAddress"></i>
      </div>
      <div class="input">
        <p class="input_title">转出数量</p>
        <input
          class="input_input"
          type="number"
          :placeholder="`输入${coinInfo.symbol} 数量`"
          v-model="userInput.transitionNumber">
      </div>
      <div
        class="input"
        v-if="coinInfo.symbol !== 'BTC'">
        <input
          class="input_input input_input_big"
          type="text"
          :placeholder="'备注（选填）'"
          v-model="userInput.notice">
      </div>
    </div>
    <!-- EOS没有矿工费 -->
    <div
      class="options"
      v-show="coinInfo.symbol !== 'EOS'">
      <p class="options_title">
        矿工费
        <span class="options_money">
          {{ userInput.free }}
          {{ coinInfo.contractAddress ? 'ETH' : coinInfo.symbol }}
          ≈
          &yen;
          {{ freeCny }}
        </span>
      </p>
      <p class="options_show">
        <span class="_wrap" @click="moreOptions">
          <span class="options_show_title">高级设置</span>
          <i
            class="options_show_icon iconfont icon-xiala-copy"
          :class="{'options_show_more': showMoreOptions}"></i>
        </span>
      </p>
      <div
        class="more"
        v-show="showMoreOptions">
        <div
          class="line"
          ref="poundageLineBig">
          <div
            class="line_inner"
            :style="{width: freeChangeValue}"></div>
          <img
            class="line_point"
            src="../../assets/images/free_point.png"
            :style="{left: freeChangeValue}"
            ref="freeChangeEle">
        </div>
        <p class="more_icon">
          <i class="iconfont icon-ic_directions_bike_px"></i>
          <i class="iconfont icon-huojian"></i>
        </p>
      </div>
    </div>
    <button
      class="out_submit submit-button"
      @click="submitOut">转出</button>
    <pass-box
      v-if="passShow"
      :value="userInput.pass"
      :close="() => { this.passShow = false }"
      :submit="passSubmit"></pass-box>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import passBox from '@/components/popup/password.vue';
export default {
  name: 'transitionOut',
  layout: 'back_page',
  data () {
    return {
      // 密码显示框
      passShow: false,
      // 币种信息
      coinInfo: {
        // 币种符号
        symbol: '',
        // 币种图标
        icon: '',
        // 一个币可以兑换的价格
        priceTo: {
          // 人民币价格
          cny: '0.00',
          // 美元价格
          usd: '0.00'
        },
        // 如果是代币,合约地址
        contractAddress: '',
        // 代币的小数点后位数
        dec: '0'
      },
      // 账户信息
      accountInfo: {
        // 账户标识(币种id_账户id)
        id: '',
        // 账户名
        name: '',
        // 币数
        number: '0.0000',
        // 价格
        price: {
          // 人民币价格
          cny: '0.00',
          // 美元价格
          usd: '0.00'
        },
        // 账户地址
        address: this.$route.query.key,
        // 密码
        pass: '',
        // keysotre
        keysotre: {}
      },
      // 用户输入信息
      userInput: {
        // 转入地址
        toAddress: '',
        // 转出数量
        transitionNumber: '',
        // 备注
        notice: '',
        // 手续费
        free: '0.0000',
        // 输入的密码
        pass: ''
      },
      // 手续费约等于的人民币
      freeCny: '0.00',
      // 是否展开高级设置
      showMoreOptions: false,
      // 手续费选择条占比
      freeChangeValue: '0%',
      // 最高手续费
      freeMax: '0.00',
      // 手续费更改时的left值
      screenLeft: 0,
      // 手续费开启滑动
      poundageMoveStart: false,
      // 币种ID
      coinType: '',
      // 如果是eth，的limet数量
      ethFree: {
        limet: 100000,
        price: 0
      }
    };
  },
  computed: {
    ...mapState({
      coins: state => state.storage.coins,
      accounts: state => state.storage.userInfo.accounts,
      selectAccountIndex: state => state.storage.userInfo.selectAccount - 0
    })
  },
  watch: {
    freeChangeValue (to) {
      this.userInput.free = this.freeMax * parseFloat(to) / 100;
      if (this.userInput.free.toString().length > 10) {
        this.userInput.free = parseFloat(this.userInput.free.toFixed(10));
      }
      if (this.coinInfo.contractAddress) {
        // 如果是代币
        this.freeCny = (this.userInput.free * this.coins.main[1].price.cny).toFixed(2);
      } else {
        this.freeCny = (this.userInput.free * this.coinInfo.priceTo.cny).toFixed(2);
      }
    }
  },
  beforeMount () {
    this.pateTitle({
      title: '转出',
      shadown: true
    });
    this.getCommonAddress();
  },
  mounted () {
    // 初始化数据
    this.initPage();
  },
  beforeDestroy () {
    localStorage.removeItem('commonAddress');
  },
  methods: {
    ...mapMutations({
      pateTitle: 'layout/backPageChange'
    }),
    // 初始化数据
    initPage () {
      // 初始化滑动条
      this.initPoundageEmit();
      // 获取地址/币种数据
      this.getCoinInfo();
      this.getSiteInfo();
      // 获取手续费
      this.getFree();
    },
    // 获取选择对的常用地址
    getCommonAddress () {
      if (localStorage.getItem('commonAddress')) {
        this.userInput.toAddress = localStorage.getItem('commonAddress');
      }
    },
    // 获取币种信息
    getCoinInfo () {
      // 币种ID
      this.coinType = this.$route.query.coinType.split('-');
      // 判断是不是代币
      if (this.coinType.length === 1) {
        // 主链币种
        this.coins.main.map((coin) => {
          if (coin.id === this.coinType[0]) {
            this.coinInfo.symbol = coin.symbol;
            this.coinInfo.icon = coin.icon;
            this.coinInfo.priceTo = coin.price;
          }
        });
      } else {
        // 代币
        this.coins.other.ETH.map((coin) => {
          if (coin.id === this.$route.query.coinType) {
            this.coinInfo.symbol = coin.symbol;
            this.coinInfo.icon = coin.icon;
            this.coinInfo.priceTo = coin.price;
            this.coinInfo.contractAddress = coin.address;
            this.coinInfo.dec = coin.dec;
          }
        });
      }
    },
    // 获取地址信息
    getSiteInfo () {
      // 账户地址，获取账户地址信息
      [].concat(this.accounts[this.selectAccountIndex].siteOfOther,
        this.accounts[this.selectAccountIndex].siteOfWatch,
        this.accounts[this.selectAccountIndex].siteOfWord).map((item) => {
        if (item.key === this.accountInfo.address) {
          item.userCoinsInfo.map((site) => {
            this.accountInfo.id = `${site.id}_${this.accountInfo.address}`;
            this.accountInfo.name = item.siteName;
            this.accountInfo.number = site.number;
            this.accountInfo.pass = this.accounts[this.selectAccountIndex].pass;
            this.accountInfo.keysotre = item.keysotre;
            this.accountInfo.price = {
              cny: (site.number * this.coinInfo.priceTo.cny).toFixed(2),
              usd: (site.number * this.coinInfo.priceTo.usd).toFixed(2)
            };
          });
        }
      });
    },
    // 扫码事件
    scanQrcode () {
      this.$global.notOpenOptions('功能建设中');
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
    // 选择常用地址
    selectCommonAddress () {
      this.$router.push({
        path: '/users/common_address',
        query: {
          type: 'out'
        }
      });
    },
    // 高级设置
    moreOptions () {
      this.showMoreOptions = !this.showMoreOptions;
    },
    // 转出事件
    submitOut () {
      if (!this.userInput.toAddress) return this.$global.alertOptions('请输入收款地址');
      if (!this.userInput.transitionNumber) return this.$global.alertOptions('请输入转账数量');
      this.passShow = true;
    },
    // 初始化矿工费切换点事件
    initPoundageEmit () {
      const Hammer = require('hammerjs');
      const hammer = new Hammer(this.$refs.freeChangeEle);
      hammer.on('panstart', (e) => {
        this.screenLeft = e.center.x;
        this.poundageMoveStart = true;
      });
      hammer.on('panmove', (e) => {
        if (!this.poundageMoveStart) return false;
        let willWith = (e.center.x - this.$refs.poundageLineBig.offsetLeft) / this.$refs.poundageLineBig.clientWidth;
        if (willWith > 1 || willWith < 0) return false;
        this.freeChangeValue = Math.round(willWith * 100) + '%';
      });
      hammer.on('panend', (e) => {
        this.poundageMoveStart = false;
      });
    },
    // 获取手续费
    getFree () {
      if (this.coinType[0] === '1') {
        // 如果是比特币
        const { btcUnit: { getFree } } = require('@/assets/js/btc_func');
        getFree().then((data) => {
          this.freeMax = data.info.relayfee * 4;
          this.freeChangeValue = '50%';
        });
      } else if (this.coinType[0] === '2') {
        // 如果是以太坊
        const { ethUnit: { getFree } } = require('@/assets/js/eth_func');
        getFree().then((data) => {
          this.freeMax = data * this.ethFree.limet * 4;
          this.ethFree.price = data;
          this.freeChangeValue = '50%';
        });
      }
    },
    // 提交密码
    passSubmit (pass) {
      this.passShow = false;
      if (!pass) return this.$global.alertOptions('请输入交易密码');
      if (pass !== this.accountInfo.pass) this.$global.alertOptions('密码输入错误');
      if (this.coinType[0] === '1' && this.coinType.length === 1) {
        // 如果是比特币
        this.btcSubmit(pass);
      } else if (this.coinType[0] === '2' && this.coinType.length === 1) {
        // 如果是ETH
        this.ethSubmit(pass);
      } else if (this.coinType[0] === '3' && this.coinType.length === 1) {
        // 如果是EOS
        this.eosSubmit(pass);
      } else if (this.coinType[0] === '2') {
        // 如果是代币转账
        console.log(999);
        this.contractSubmit(pass);
      }
    },
    // BTC转账
    btcSubmit (pass) {
      const { btcUnit: { transace } } = require('@/assets/js/btc_func');
      transace({
        keystore: this.accountInfo.keysotre,
        pass: pass,
        from: this.accountInfo.address,
        to: this.userInput.toAddress,
        value: this.userInput.transitionNumber,
        free: this.userInput.free
      }).then((data) => {
        console.log(data);
        this.$global.successOptions('发起成功，等待打包确认');
      }).catch((err) => {
        this.$global.alertOptions(err.message);
      });
    },
    // EOS转账
    eosSubmit (pass) {
      const { eosUnit: { transace } } = require('@/assets/js/eos_func');
      transace({
        keystore: this.accountInfo.keysotre,
        pass: pass,
        from: this.accountInfo.address,
        to: this.userInput.toAddress,
        value: this.userInput.transitionNumber,
        notice: this.userInput.notice
      }).then((data) => {
        console.log(data);
        this.$global.successOptions('发起成功，等待打包确认');
      }).catch((err) => {
        this.$global.alertOptions(err.message);
      });
    },
    // ETH转账
    ethSubmit (pass) {
      const { ethUnit: { transace } } = require('@/assets/js/eth_func');
      transace({
        keystore: this.accountInfo.keysotre,
        pass: pass,
        from: this.accountInfo.address,
        to: this.userInput.toAddress,
        value: this.userInput.transitionNumber,
        notice: this.userInput.notice,
        gasPrice: (this.ethFree.price * parseFloat(this.freeChangeValue) / 50),
        gasLimet: this.ethFree.limet
      }).then((data) => {
        this.$global.successOptions('发起成功，等待打包确认');
      }).catch((err) => {
        console.log(err);
        this.$global.alertOptions(err.message);
      });
    },
    // 代币转账
    contractSubmit (pass) {
      const { ethUnit: { transaceContract } } = require('@/assets/js/eth_func');
      transaceContract({
        keystore: this.accountInfo.keysotre,
        pass: pass,
        from: this.accountInfo.address,
        to: this.userInput.toAddress,
        value: this.userInput.transitionNumber,
        notice: this.userInput.notice,
        gasPrice: (this.ethFree.price * parseFloat(this.freeChangeValue) / 50),
        gasLimet: this.ethFree.limet,
        contractAddress: this.coinInfo.contractAddress,
        dec: this.coinInfo.dec
      }).then((data) => {
        console.log(data);
        this.$global.successOptions('发起成功，等待打包确认');
      }).catch((err) => {
        console.log(err);
        console.log(222);
        this.$global.alertOptions(err.message);
      });
    }
  },
  components: {
    passBox
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #transitionOut.transition_out {
    .header {
      position: absolute;
      top: 0;
      right: 0;
      width: 120px;
      height: 90px;
      line-height: 90px;
      text-align: center;
      font-size: 38px;
    }
    .account_info {
      padding: 25px 30px 25px 24px;
      box-sizing: border-box;
      margin: 40px 30px;
      border-radius: 10px;
      box-shadow: 0 0 18px 3px rgba(27, 55, 173, 0.1);
      &:after {
        content: '';
        display: block;
        clear: both;
      }
      .account_icon {
        float: left;
        width: 84px;
        height: 84px;
      }
      .account_name {
        float: left;
        font-size: 34px;
        font-weight: 900;
        line-height: 40px;
        padding: 22px 0 22px 24px;
      }
      .account_money {
        float: right;
        text-align: right;
        .account_number {
          font-size: 34px;
          line-height: 44px;
          font-weight: 900;
          letter-spacing: 1px;
        }
        .account_price {
          font-size: 26px;
          line-height: 40px;
          color: $gray;
        }
      }
    }
    .form {
      padding-left: 30px;
      .input {
        border-bottom: 1Px solid #eaecf1;
        padding-top: 44px;
        padding-bottom: 16px;
        overflow: hidden;
        height: 64px;
        line-height: 64px;
        .input_title {
          float: left;
          width: 180px;
        }
        .input_input {
          float: left;
          height: 64px;
          width: 440px;
          &.input_input_big {
            width: 95%;
            color: $gray;
          }
        }
        .input_icon {
          float: right;
          width: calc(100% - 180px - 440px);
          text-align: center;
          font-size: 34px;
        }
      }
    }
    .options {
      padding: 30px;
      .options_title {
        line-height: 64px;
        .options_money {
          float: right;
          color: #f75434;
        }
      }
      .options_show {
        text-align: right;
        font-size: 26px;
        color: $gray;
        line-height: 46px;
        .options_show_title {
          display: inline-block;
          vertical-align: middle;
        }
        .options_show_icon {
          font-size: 18px;
          display: inline-block;
          vertical-align: middle;
          transform: rotateZ(180deg);
          &.options_show_more {
            transform: rotateZ(0deg);
          }
        }
      }
      .more {
        padding-top: 32px;
        .line {
          background: #f3f3fb;
          width: 100%;
          height: 9px;
          position: relative;
          .line_inner {
            position: absolute;
            top: 0;
            left: 0;
            height: 9px;
            background: $mainColor;
          }
          .line_point {
            position: absolute;
            top: -14px;
            width: 32px;
            margin-left: -16px;
          }
        }
        .more_icon {
          padding-top: 25px;
          line-height: 50px;
          color: $gray;
          overflow: hidden;
          .iconfont {
            font-size: 42px;
            &.icon-ic_directions_bike_px {
              float: left;
            }
            &.icon-huojian {
              float: right;
            }
          }
        }
      }
    }
    .out_submit {
      margin: 60px 30px 0;
      width: calc(100% - 60px);
    }
  }
</style>
