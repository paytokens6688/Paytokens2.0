<template>
  <div id="rollOut">
    <div
      class="roll_address"
      @click="selectAccount">
      <div class="address_info">
        <span class="iconfont icon-dizhi1"></span>
        <span class="info_name">
          {{intoAccount.address_name}}
        </span>
        <span
          class="info_default"
          v-show="intoAccount.isDefault">
          默认地址
        </span>
      </div>
      <div class="address_right">
        <span class="right_text">
          变更
        </span>
        <span class="iconfont icon-you"></span>
      </div>
    </div>
    <!-- <div
      class="roll_address"
      @click="selectAccount"
      v-show="intoAccount.type === 2">
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
    </div> -->
    <div
      class="roll_address"
      @click="selectAiAccount">
      <div class="address_info">
        <span class="iconfont icon-zhanghu"></span>
        <div class="info_names">
          <div class="info_name">
            {{outAccount.typeText}}
          </div>
          <div class="info_nper">
            {{outAccount.out_nper}}
          </div>
        </div>
      </div>
      <div class="address_right">
        <span class="right_num">
          {{outAccount.canRoll}} {{type}}
        </span>
        <span class="iconfont icon-you"></span>
      </div>
    </div>
    <label
      class="roll_inputs"
      for="rollNum">
      <input
        class="roll_input"
        type="text"
        id="rollNum"
        placeholder="输入转出数量"
        v-model="rollNum">
        <span
          class="input_right"
          @click="allRoll">
          全部转出
        </span>
    </label>
    <p class="roll_code_title">
      <span class="title">
        短信验证 发送至
      </span>
      <span class="info">
        {{phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')}}
      </span>
    </p>
    <label
      class="roll_inputs"
      for="code">
      <input
        class="roll_input"
        type="text"
        id="code"
        placeholder="输入验证码"
        v-model="code">
        <span
          class="input_right"
          :class="{'gray': !isSend}"
          @click="countDown">
          {{codeTime === 61 ? '发送' : codeTime + 's'}}
        </span>
    </label>
    <button
      class="roll_submit"
      @click="submit">
      申请转出
    </button>
    <button
      class="roll_rule"
      @click="seeRule">
      查看转出规则
    </button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'rollOut',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 选择账户
      selectAccountIndex: '',
      // 选择地址
      selectSiteKey: '',
      // 币种
      type: this.$route.query.type,
      // 账户信息
      intoAccount: {
        // 地址名称
        address_name: '',
        // 币种地址
        address: '',
        // 接收账户类型 1：基础币种账户 2： 收益账户
        type: 1,
        // 是否为默认地址
        isDefault: false
      },
      outAccount: {
        // 转出的账户类型 默认为收益账户
        type: 1,
        // 转出的账户类型 默认为收益账户
        typeText: '收益账户',
        // 可转
        canRoll: '0',
        // 本金账户的期数
        out_nper: '',
        // 如果选择本金账户，本金账户的期数ID
        intoCapitalID: ''
      },
      // 本金转出最低数量
      minMoney: 0,
      // 转出数量
      rollNum: '',
      // 手机号
      phone: '',
      // 是否可以发送验证码
      isSend: true,
      // 验证码
      code: '',
      // 倒计时
      codeTime: 61,
      // 是否可以点击确认按钮
      submitState: true
    };
  },
  computed: {
    ...mapState({
      // 账户列表
      accountsList: state => state.storage.userInfo.accounts,
      // 默认选择账户
      defaultSelectAccount: state => state.storage.userInfo.selectAccount
    })
  },
  beforeMount () {
    // 头部
    this.pageTitle({ title: '转出', shadown: true });
    // 获取选择的接收账户类型
    let intoType = JSON.parse(localStorage.getItem('out'));
    if (intoType) {
      this.intoAccount.type = intoType.accountType;
    }
    // 获取选择转出的账户类型
    let outType = JSON.parse(localStorage.getItem('accountType'));
    if (outType) {
      this.outAccount.type = outType.type;
      this.outAccount.intoCapitalID = outType.id;
    }
    this.getInfo();
    this.initAccount();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 获取当前账户
    initAccount () {
      // 初始化选择的账户
      this.selectAccountIndex = this.$route.query.selectAccountIndex || this.defaultSelectAccount;
      // 默认账户
      if (this.selectAccountIndex === this.defaultSelectAccount) this.intoAccount.isDefault = true;
      // 是否有选择的地址名
      this.selectSiteKey = this.$route.query.key;
      // 币种id
      const coinType = this.type === 'BTC' ? '1' : '2';
      const account = this.accountsList[this.selectAccountIndex - 0];
      let selectAccount = ''; // 当情选择的账户
      [].concat(account.siteOfOther, account.siteOfWord).map((site) => {
        // 如果有地址选择
        if (this.selectSiteKey && this.selectSiteKey === site.key) {
          this.intoAccount.address_name = site.siteName;
          this.intoAccount.address = site.key;
        } else if (selectAccount === '' && site.type === coinType) { // 如果没有选择地址，使用第一个
          this.intoAccount.address_name = site.siteName;
          this.intoAccount.address = site.key;
        }
      });
    },
    // 选择账户
    selectAccount () {
      this.$router.replace({
        path: '/ai/roll_select_account',
        query: {
          type: 'out',
          coin: this.$route.query.type
        }
      });
    },
    // 选择ai账户
    selectAiAccount () {
      this.$router.push({
        path: '/ai/select_account',
        query: {
          type: this.type
        }
      });
    },
    // 全部转出按钮
    allRoll () {
      this.rollNum = Number(this.outAccount.canRoll);
    },
    // 获取验证码
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
        type: 4,
        mobile: this.phone
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
    // 申请转出
    submit () {
      if (!this.rollNum) return this.$global.alertOptions('请输入正确的转出数量');
      if (!Number(this.rollNum)) return this.$global.alertOptions('请输入正确的转出数量');
      if (Number(this.rollNum) > Number(this.outAccount.canRoll)) return this.$global.alertOptions(`${this.outAccount.type === 1 ? '收益' : '本金'}账户可转出余额不足`);
      if (!this.code) return this.$global.alertOptions('请输入验证码');
      // 从本金转出判断是否小于最低转出数量
      if (this.outAccount.type === 2 && Number(this.rollNum) < Number(this.minMoney)) return this.$global.alertOptions(`本金账户最低转出数量为${this.minMoney}`);
      if (!this.submitState) return false;
      this.submitState = false;
      if (this.outAccount.type === 1) {
        this.confirm();
      } else {
        this.$global.alertOptions({
          show: true,
          message: '<span style="color:#f00">您正在进行转出操作，若本期交易结算后出现浮亏状态，系统将会从转出金额中扣除亏损的金额。</span>',
          callbackList: [
            {
              title: '取消',
              callback: () => {}
            },
            {
              title: '确认转出',
              callback: () => {
                this.confirm();
              }
            }
          ]
        });
      }
    },
    // confirm
    confirm () {
      // 从收益账户转出
      if (this.outAccount.type === 1) {
        this.$axios.post('/v1/ai/withdraw/profit', {
          number: this.rollNum,
          code: this.code,
          address: this.intoAccount.address,
          class: this.type === 'BTC' ? 1 : 2
        })
          .then(({ data }) => {
            this.submitState = true;
            if (data.status === 200) {
              this.$global.successOptions({
                show: true,
                message: '申请提交成功',
                callback: () => {
                  this.$router.go(0);
                }
              });
            } else {
              this.$global.successOptions(data.message);
            }
          });
      } else {
        // 从本金账户转出
        this.$axios.post('/v1/ai/withdraw/capital', {
          invest_id: this.outAccount.intoCapitalID,
          number: this.rollNum,
          code: this.code,
          address: this.intoAccount.address
        })
          .then(({ data }) => {
            if (data.status === 200) {
              this.$global.successOptions({
                show: true,
                message: '申请提交成功',
                callback: () => {
                  this.$router.go(0);
                }
              });
            } else {
              this.$global.successOptions(data.message);
            }
          });
      }
    },
    // 查看转出规则
    seeRule () {
      this.$router.push('/ai/roll_out_rule');
    },
    // 获取用户手机号
    getInfo () {
      this.$axios.get('/v1/user/info')
        .then(({ data }) => {
          if (data.status === 200) {
            this.phone = data.data.mobile;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      // 获取本金
      this.$axios.get('/v1/ai/enter/capital', {
        params: {
          class: this.type === 'BTC' ? 1 : 2
        }
      })
        .then(({ data }) => {
          if (data.status === 200) {
            if (this.outAccount.type === 2) {
              for (let i = 0; i < data.data.length; i++) {
                if (data.data[i].invest_id === this.outAccount.intoCapitalID) {
                  this.outAccount.typeText = '本金账户';
                  this.outAccount.out_nper = data.data[i].invest;
                  this.outAccount.canRoll = data.data[i].number;
                }
              }
            }
          }
        });
      // 获取收益账户余额
      this.$axios.get('/v1/ai/profit_balance')
        .then(({ data }) => {
          if (data.status === 200) {
            if (this.outAccount.type === 1) {
              if (this.type === 'BTC') {
                this.outAccount.canRoll = data.data.btc;
              } else {
                this.outAccount.canRoll = data.data.eth;
              }
            }
          }
        });
      // 获取本金转出最低数量
      this.$axios.get('/v1/ai/withdraw/min_money', {
        params: {
          class: this.type === 'BTC' ? 1 : 2
        }
      })
        .then(({ data }) => {
          this.minMoney = data.data;
        });
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #rollOut{
    height:100%;
    padding:40px 30px 0;
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
        .info_names{
          .info_nper{
            font-size:24px;
            color:$gray;
          }
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
      padding:0 30px;
      height:130px;
      @include eleBottomShadown();
      display:flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 10px;
      position: relative;
      &:before{
        content:'';
        position:absolute;
        display:block;
        width:2px;
        height:28px;
        background-color:$mainColor;
        left:30px;
        top:50%;
        margin-top:-14px;
      }
      .roll_input{
        padding-left:30px;
        width:70%;
      }
      .input_right{
        color:$mainColor;
        font-size:26px;
        &.gray{
          color:$gray;
        }
      }
    }
    .roll_code_title{
      line-height:114px;
      font-size:26px;
      .title{
        color:#9da2b2;
      }
    }
    .roll_submit{
      width:100%;
      height:88px;
      background-color:$mainColor;
      @include eleBottomShadown();
      color:#fff;
      font-size:30px;
      border-radius: 10px;
      margin-top:80px;
    }
    .roll_rule{
      width:100%;
      height:88px;
      @include eleBottomShadown();
      color:#9297a5;
      font-size:30px;
      background-color:#fff;
      border-radius: 10px;
      margin-top:40px;
    }
  }
</style>
