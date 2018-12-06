<template>
  <div id="rollInto">
    <div
      class="roll_address"
      @click="selectAccount"
      v-show="account_type === 1">
      <div class="address_info">
        <span class="iconfont icon-dizhi1"></span>
        <span class="info_name">
          {{account.address_name}}
        </span>
        <span
          class="info_default"
          v-show="account.isDefault">
          默认账户
        </span>
      </div>
      <div class="address_right">
        <span class="right_text">
          变更
        </span>
        <span class="iconfont icon-you"></span>
      </div>
    </div>
    <div
      class="roll_address"
      @click="selectAccount"
      v-show="account_type === 2">
      <div class="address_info">
        <img
          class="info_img"
          src="../../assets/images/icon_ai.png">
        <span class="info_name">
          收益账户
        </span>
      </div>
      <div class="address_right">
        <span class="right_text">
          变更
        </span>
        <span class="iconfont icon-you"></span>
      </div>
    </div>
    <div class="roll_inputs">
      <label
        for="rollNum"
        class="roll_input">
        <input
          class="inputs"
          type="number"
          id="rollNum"
          placeholder="输入转入数量"
          v-model="account.rollNum">
        <span
          class="input_btn"
          @click="intoNumAll">
            全部转入
        </span>
      </label>
      <div class="balance">
        余额：{{account.canRoll}} {{type}}
      </div>
    </div>
    <div
      class="options"
      v-show="account_type === 1">
      <p class="options_title">
        矿工费
        <span class="options_money">
          {{ free }}
          {{ type }}
          ≈
          &yen;
          {{ freeCny }}
        </span>
      </p>
      <p class="options_show" @click="moreOptions">
        <span class="options_show_title">高级设置</span>
        <i
          class="options_show_icon iconfont icon-xiala-copy"
          :class="{'options_show_more': showMoreOptions}"></i>
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
    <div
      class="settlement_set"
      v-show="openAi">
      <div class="set_title">
        结算方式
      </div>
      <div class="set_lists">
        <div
          class="set_list"
          @click="selectSet(0)">
          <span
            class="iconfont"
            :class="{'icon-xuanze': setSelectIndex === 0, 'icon-xuanze1': setSelectIndex === 1}"></span>
          <span class="list_text">
            滚存
          </span>
        </div>
        <div
          class="set_list"
          @click="selectSet(1)">
          <span
            class="iconfont"
            :class="{'icon-xuanze': setSelectIndex === 1, 'icon-xuanze1': setSelectIndex === 0}"></span>
          <span class="list_text">
            周结
          </span>
        </div>
      </div>
    </div>
    <div
      class="pass_word"
      v-show="account_type === 1">
      <p class="pass_title">
        交易密码
      </p>
      <label
        for="password"
        class="pass_inputs">
        <input
          class="pass_input"
          type="password"
          id="password"
          placeholder="输入交易密码"
          v-model="password">
          <!-- <span
            class="pass_btn"
            @click="forgetPass">
            忘记密码 ?
          </span> -->
      </label>
    </div>
    <div
      class="send_code"
      v-show="account_type === 2">
      <div class="code_title">
        短信验证码发送至 {{account.phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')}}
      </div>
      <label
        for="code"
        class="code_inputs">
        <input
          class="code_input"
          type="number"
          id="code"
          v-model="code"
          placeholder="输入短信验证码">
        <button
          class="code_btn"
          :class="{'gray': !isSend}"
          @click="countDown">
          {{codeTime === 61 ? '发送' : codeTime + 's'}}
        </button>
      </label>
    </div>
    <div class="agreement">
      <span
        class="iconfont"
        :class="{'icon-xuanze1': !agreement, 'icon-xuanze': agreement}"
        @click="agreeToggle"></span>
      <span class="agree_texts">
        <span class="agree_text">
          我已经仔细阅读并同意
        </span>
        <nuxt-link tag="span"
          class="agree"
          to="/users/service_provisions">服务及隐私条款</nuxt-link>
      </span>
    </div>
    <button
      class="roll_btn"
      @click="submit">
      确认
    </button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'rollInto',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 选择账户
      selectAccountIndex: '',
      // 选择地址
      selectSiteKey: '',
      // 当前选择的地址对象
      selectSiteObj: {
        // 地址
        address: '',
        // keysotre
        keystore: {},
        // 密码
        pass: ''
      },
      // 币种
      type: this.$route.query.type,
      // 选择的账户类型 默认常规账户
      account_type: this.$route.query.into === 'ai' ? 2 : 1,
      // 接收的投资地址
      intoAddress: '',
      // 最低投资额度
      min_num: this.$route.query.min,
      // 账户信息
      account: {
        // 地址名称
        address_name: '',
        // 币种地址
        address: '',
        // eth nonce值
        ethNonce: '',
        // 是否为默认地址
        isDefault: false,
        // 可转
        canRoll: '',
        // 转入数量
        rollNum: '',
        // 手机号
        phone: ''
      },
      // 手续费
      free: '0.0000',
      // 交易密码
      password: '',
      // 是否可以发送验证码
      isSend: true,
      // 验证码
      code: '',
      // 倒计时
      codeTime: 61,
      // 手续费约等于的人民币
      freeCny: '0.00',
      // 是否展开高级设置
      showMoreOptions: false,
      // 手续费选择条占比
      freeChangeValue: '0%',
      // 手续费更改时的left值
      screenLeft: 0,
      // 手续费开启滑动
      poundageMoveStart: false,
      // 是否同意用户协议
      agreement: false,
      // 是否开启AI
      openAi: false,
      // 选择的结算方式。默认 第一个 0
      setSelectIndex: 0,
      // 是否可以点击按钮
      submitState: true,
      // 币种转化为人民币的价格
      priceToCny: '',
      // 如果是eth，的limet数量
      ethFree: {
        limet: 100000,
        price: 0
      }
    };
  },
  computed: {
    ...mapState({
      // 账户列表
      accountsList: state => state.storage.userInfo.accounts,
      // 默认选择账户
      defaultSelectAccount: state => state.storage.userInfo.selectAccount,
      mainCoinsList: state => state.storage.coins.main
    })
  },
  watch: {
    freeChangeValue (to) {
      this.free = this.freeMax * parseFloat(to) / 100;
      if (this.free.toString().length > 10) {
        this.free = parseFloat(this.free.toFixed(10));
      }
      this.freeCny = (this.free * this.priceToCny).toFixed(2);
    }
  },
  beforeMount () {
    this.initPage();
    // 头部
    this.pageTitle({ title: '转入', shadown: true });
    this.getInfo();
  },
  mounted () {
    this.initPoundageEmit();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 初始化页面
    initPage () {
      // 初始化选择的账户
      this.selectAccountIndex = this.$route.query.selectAccountIndex || this.defaultSelectAccount;
      // 默认账户
      if (this.selectAccountIndex === this.defaultSelectAccount) this.account.isDefault = true;
      // 是否有选择的地址名
      this.selectSiteKey = this.$route.query.key;
      // 获取当前账户
      this.initAccount();
      // 获取币种信息
      this.initCoin();
    },
    // 获取当前账户
    initAccount () {
      // 币种id
      const coinType = this.type === 'BTC' ? '1' : '2';
      const account = this.accountsList[this.selectAccountIndex - 0];
      let selectAccount = ''; // 当情选择的账户
      [].concat(account.siteOfOther, account.siteOfWord).map((site) => {
        // 如果有地址选择
        if (this.selectSiteKey && this.selectSiteKey === site.key) {
          this.account.address_name = site.siteName;
          this.account.address = site.key;
          this.selectSiteObj.address = site.key;
          this.selectSiteObj.keystore = site.keysotre;
          this.selectSiteObj.pass = account.pass;
          site.userCoinsInfo.map(coin => {
            if (coin.id === coinType) this.account.canRoll = coin.number;
          });
        } else if (selectAccount === '' && site.type === coinType) { // 如果没有选择地址，使用第一个
          this.account.address_name = site.siteName;
          this.account.address = site.key;
          this.selectSiteObj.address = site.key;
          this.selectSiteObj.keystore = site.keysotre;
          this.selectSiteObj.pass = account.pass;
          site.userCoinsInfo.map(coin => {
            if (coin.id === coinType) this.account.canRoll = coin.number;
          });
        }
      });
    },
    initCoin () {
      this.mainCoinsList.map(item => {
        if (item.symbol === this.type) this.priceToCny = item.price.cny;
      });
    },
    // 选择账户
    selectAccount () {
      this.$router.replace({
        path: '/ai/roll_select_account',
        query: {
          type: 'into',
          coin: this.$route.query.type
        }
      });
    },
    // 全部转入
    intoNumAll () {
      this.account.rollNum = this.account.canRoll;
    },
    // 忘记密码
    forgetPass () {
      this.$router.push('../wallet/account/account_detail');
    },
    // 发送验证码倒计时
    countDown () {
      if (!this.isSend) return false;
      this.isSend = false;
      this.codeTime--;
      this.sendCode();
      this.timer = setInterval(() => {
        this.codeTime--;
        if (this.codeTime <= 0) {
          clearInterval(this.timer);
          this.isSend = true;
          this.codeTime = 61;
        }
      }, 1000);
    },
    // 发送验证码
    sendCode () {
      this.$axios.post('v1/sms/to_send', {
        type: 3,
        mobile: this.account.phone
      })
        .then(({ data }) => {
          if (data.status !== 200) {
            this.$global.alertOptions(data.message);
            clearInterval(this.timer);
            this.isSend = true;
            this.codeTime = 61;
          }
        });
    },
    // 选择的结算方式
    selectSet (index) {
      if (this.setSelectIndex === index) return false;
      this.setSelectIndex = index;
      this.$axios.put('/v1/ai/method/update', {
        method: this.setSelectIndex + 1
      })
        .then(({ data }) => {
        });
    },
    // 同意用户协议
    agreeToggle () {
      this.agreement = !this.agreement;
    },
    // submit
    submit () {
      // TODO: 最低转入没写
      if (!this.account.rollNum) return this.$global.alertOptions('请输入正确的转入数量');
      if (Number(this.account.rollNum) < Number(this.min_num)) return this.$global.alertOptions(`最低转入数量为${this.min_num}`);
      if (Number(this.account.rollNum) > Number(this.account.canRoll)) return this.$global.alertOptions('余额不足');
      if (this.account_type === 1) {
        if (!this.password) return this.$global.alertOptions('请输入交易密码');
      } else {
        if (!this.code) return this.$global.alertOptions('请输入短信验证码');
      }
      if (!this.agreement) return this.$global.alertOptions('请仔细阅读并同意服务及隐私条款');
      this.confirm();
    },
    // 确认提交接口
    confirm () {
      // 使用收益账户转入
      this.$global.loadingOptions(true);
      if (this.account_type === 2) {
        if (!this.submitState) return false;
        this.submitState = false;
        this.$axios.post('/v1/ai/enter/profit', {
          number: this.account.rollNum,
          invest_id: Number(this.$route.query.id),
          code: this.code
        }).then(({ data }) => {
          this.submitState = true;
          if (data.status === 200) {
            this.$global.successOptions({
              show: true,
              message: '转入成功',
              callback: () => {
                this.$router.go(-1);
              }
            });
            this.$global.loadingOptions(false);
          } else {
            this.$global.alertOptions(data.message);
            this.$global.loadingOptions(false);
          }
        });
      } else {
        // 从常规地址币种转入
        // 从BTC转入
        if (this.type === 'BTC') {
          this.btcSubmit();
        } else if (this.type === 'ETH') {
          this.ethSubmit();
        }
      }
    },
    // 比特币转入
    btcSubmit () {
      if (!this.intoAddress) return this.$global.alertOptions('数据加载中，请稍后重试');
      const { btcUnit: { transace } } = require('@/assets/js/btc_func');
      transace({
        keystore: this.selectSiteObj.keystore,
        pass: this.password,
        from: this.selectSiteObj.address,
        to: this.intoAddress,
        value: this.account.rollNum,
        free: this.free
      }).then((data) => {
        this.$axios.post('/v1/ai/enter/btc', {
          number: this.account.rollNum,
          enter_address: this.intoAddress,
          address: this.account.address,
          hash: data,
          invest_id: this.$route.query.id
        }).then(({ data }) => {
          this.submitState = true;
          this.$global.loadingOptions(false);
          if (data.status === 200) {
            this.$global.successOptions({
              show: true,
              message: data.message,
              callback: () => {
                this.$router.go(-1);
              }
            });
          } else {
            this.$global.alertOptions(data.message);
            this.$global.loadingOptions(false);
          }
        });
      }).catch((err) => {
        this.$global.alertOptions(err.message);
        this.$global.loadingOptions(false);
      });
    },
    // 以太坊转入
    ethSubmit () {
      if (!this.account.ethNonce) return this.$global.alertOptions('数据加载中，请稍后重试');
      const { ethUnit: { transace } } = require('@/assets/js/eth_func');
      transace({
        keystore: this.selectSiteObj.keystore,
        pass: this.password,
        from: this.selectSiteObj.address,
        to: this.intoAddress,
        value: this.account.rollNum,
        notice: 'Paytokens AI转入',
        gasPrice: (this.ethFree.price * parseFloat(this.freeChangeValue) / 50),
        gasLimet: this.ethFree.limet,
        nonce: this.account.ethNonce
      }).then((data) => {
        this.$axios.post('/v1/ai/enter/eth', {
          number: this.account.rollNum,
          enter_address: this.intoAddress,
          address: this.account.address,
          hash: data,
          invest_id: this.$route.query.id,
          nonce: this.account.ethNonce
        }).then(({ data }) => {
          this.$global.loadingOptions(false);
          this.submitState = true;
          if (data.status === 200) {
            this.$global.successOptions({
              show: true,
              message: data.message,
              callback: () => {
                this.$router.go(-1);
              }
            });
          } else {
            this.$global.loadingOptions(false);
            this.$global.alertOptions(data.message);
          }
        });
      }).catch((err) => {
        this.$global.alertOptions(err.message);
        this.$global.loadingOptions(false);
      });
    },
    // 高级设置
    moreOptions () {
      this.showMoreOptions = !this.showMoreOptions;
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
    // 获取数据
    getInfo () {
      // 获取用户手机号 和是否开启AI
      this.$axios.get('/v1/user/info')
        .then(({ data }) => {
          if (data.status === 200) {
            this.account.phone = data.data.mobile;
            if (data.data.open_ai === 2) {
              this.openAi = true;
            } else if (data.data.status === 1) {
              this.openAi = false;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (this.account_type === 2) {
        // 获取收益账户余额
        this.$axios.get('/v1/ai/profit_balance')
          .then(({ data }) => {
            if (data.status === 200) {
              if (this.type === 'BTC') {
                this.account.canRoll = data.data.btc;
              } else {
                this.account.canRoll = data.data.eth;
              }
            }
          });
      } else {
        // 获取投资地址
        this.$axios.get('/v1/ai/invest/address', {
          params: {
            invest_id: this.$route.query.id
          }
        })
          .then(({ data }) => {
            if (data.status === 200) {
              this.intoAddress = data.data;
            }
          });
        // 获取ETH的nonce值
        if (this.type === 'ETH') {
          this.$axios.get('/v1/api/coin/eth_nonce_by_address', {
            params: {
              address: this.account.address
            }
          })
            .then(({ data }) => {
              if (data.status === 200) {
                this.account.ethNonce = data.data;
              }
            });
        }
        this.getFree();
      }
    },
    // 获取手续费
    getFree () {
      if (this.type === 'BTC') {
        // 如果是比特币
        const { btcUnit: { getFree } } = require('@/assets/js/btc_func');
        getFree().then((data) => {
          this.freeMax = data.info.relayfee * 4;
          this.freeChangeValue = '50%';
        });
      } else if (this.type === 'ETH') {
        // 如果是以太坊
        const { ethUnit: { getFree } } = require('@/assets/js/eth_func');
        getFree().then((data) => {
          this.freeMax = data * this.ethFree.limet * 4;
          this.ethFree.price = data;
          this.freeChangeValue = '50%';
        });
      }
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #rollInto{
    height:100%;
    padding:40px 30px;
    box-sizing: border-box;
    .roll_address{
      @include eleBottomShadown();
      border-radius: 10px;
      height:130px;
      padding:0 30px;
      display:flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom:20px;
      .address_info{
        display:flex;
        align-items: center;
        .info_img{
          height:44px;
          width:44px;
          margin-right:25px;
        }
        .iconfont{
          height:44px;
          width:44px;
          display:inline-block;
          border-radius: 50%;
          background-color:#eaecf1;
          color:#9297a5;
          font-size:25px;
          line-height:44px;
          text-align:center;
          margin-right:25px;
        }
        .info_name{
          margin-right:30px;
        }
        .info_default{
          font-size:24px;
          color:$mainColor;
        }
      }
      .address_right{
        display:flex;
        align-items: center;
        .right_text{
          font-size:24px;
          color:#b7bac3;
          margin-right:20px;
        }
        .right_num{
          font-size:26px;
          color:#e9362e;
          margin-right:20px;
        }
        .icon-you{
          font-size:30px;
          color:#b7bac3;
        }
      }
    }
    .roll_inputs{
      width:100%;
      height:130px;
      // @include eleBottomShadown();
      border-radius: 10px;
      position:relative;
      margin-bottom:64px;
      &:after{
        position:absolute;
        content:'';
        display:block;
        width:2PX;
        height:28px;
        left:30px;
        top:50%;
        margin-top:-14px;
        background-color:$mainColor;
        z-index: 3;
      }
      .roll_input{
        position:absolute;
        width:100%;
        height:100%;
        border-radius: 10px;
        padding-left:50px;
        z-index: 2;
        box-sizing: border-box;
        @include eleBottomShadown();
        background-color:#fff;
        display:flex;
        justify-content: space-between;
        align-items: center;
        padding-right:30px;
        .input_btn{
          color:$mainColor;
          font-size:26px;
        }
      }
      .balance{
        height:85px;
        width:100%;
        box-sizing: border-box;
        padding:21px 30px 0;
        line-height:64px;
        position:absolute;
        left:0;
        bottom:-64px;
        background-color:#f5f6fa;
        color:#9297a5;
        font-size:26px;
        z-index:1;
        border-radius: 10px;
      }
    }
    .options {
      width:100%;
      padding: 30px 30px 30px 0;
      border-bottom:1PX solid $listBottomGray;
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
    .settlement_set{
      .set_title{
        line-height:86px;
        font-size:26px;
        color:$gray;
      }
      .set_lists{
        height:176px;
        width:100%;
        @include eleBottomShadown();
        border-radius: 10px;
        .set_list{
          height:88px;
          display:flex;
          align-items: center;
          padding-left:30px;
          &:first-child{
            border-bottom:1Px solid $listBottomGray;
          }
          .iconfont{
            font-size:30px;
            color:#9297a5;
            margin-right:30px;
            &.icon-xuanze{
              color:$mainColor;
            }
          }
          .list_text{
            letter-spacing: 20px;
          }
        }
      }
    }
    .pass_word{
      .pass_title{
        line-height:86px;
        font-size:26px;
        color:#9da2b2;
      }
      .pass_inputs{
        display:flex;
        justify-content: space-between;
        align-items: center;
        padding:0 30px;
        width:100%;
        box-sizing: border-box;
        height:130px;
        border-radius: 10px;
        @include eleBottomShadown();
        position:relative;
        &:after{
          position:absolute;
          content:'';
          display:block;
          width:2PX;
          height:28px;
          left:30px;
          top:50%;
          margin-top:-14px;
          background-color:$mainColor;
        }
        .pass_input{
          padding-left:20px;
        }
        .pass_btn{
          color:$mainColor;
        }
      }
    }
    .send_code{
      width:100%;
      padding: 30px 30px 0 0;
      border-bottom:1PX solid $listBottomGray;
      .code_title{
        line-height:60px;
      }
      .code_inputs{
        height:96px;
        display:flex;
        justify-content: space-between;
        align-items: center;
        .code_btn{
          box-sizing: border-box;
          width:120px;
          height:60px;
          color:$mainColor;
          background-color:#e9edff;
          border: 1PX solid $mainColor;
          border-radius: 10px;
          font-size:26px;
          &.gray{
            color:$gray;
            border-color: $gray;
            background-color:$listBottomGray;
          }
        }
      }
    }
    .agreement{
      height:122px;
      display:flex;
      align-items: center;
      font-size:24px;
      color:#3f4e62;
      .iconfont{
        font-size:30px;
        margin-right:15px;
        transition: all 0.5s ease;
        &.icon-xuanze1{
          color:#9297a5;
        }
        &.icon-xuanze{
          color:$mainColor;
        }
      }
      .agree{
        color:$mainColor;
      }
    }
    .roll_btn{
      width:100%;
      height:88px;
      background-color:$mainColor;
      color:#fff;
      font-size:30px;
      border-radius: 10px;
      @include eleBottomShadown();
      margin-top:40px;
      transition: all 0.5s ease;
      &.gray{
        background-color:$lowGray;
      }
    }
  }
</style>
