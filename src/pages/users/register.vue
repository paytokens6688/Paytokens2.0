<template>
  <div id="register">
    <h1 class="title">注册</h1>
    <div class="form">
      <div class="selectInput">
        <nuxt-link
          tag="div"
          to="/users/choice_code"
          class="country">
          {{country.split(' ')[1]}}
          <i class="iconfont icon-triangle-down01-copy"></i>
        </nuxt-link>
        <icon-input
          class="intro"
          type="text"
          inputPlaceholder="输入手机号"
          v-model="input.phone"
          :iconCallback="() => {}" />
      </div>
      <div class="selectInput">
        <icon-input
          inputPlaceholder="输入短信验证码"
          v-model="input.code"
          class="intro"
          :iconCallback="() => {}"
          type="number"/>
        <span
          class="get_code"
          @click="getCode"
          :disabled="isSend"
          :class="{'send-sms' : isSend, 'no-send-sms': isSend}"
          >
          {{btntxt}}
        </span>
      </div>
      <icon-input
        inputPlaceholder="输入登录密码(6-20位数字加字母组合)"
        v-model="input.password"
        :class="{'blue_eye': inputType.password === 'text'}"
        :inputType="inputType.password"
        :iconfont="inputType.password === 'password' ? 'icon-guanbi-yanjing' : 'icon-chakanyanjingshishifenxi'"
        :iconCallback="changeInputType('password')" />
      <icon-input
        inputPlaceholder="再次确认登录密码"
        v-model="input.repassword"
        :class="{'blue_eye': inputType.rePassword === 'text'}"
        :inputType="inputType.rePassword"
        :iconfont="inputType.rePassword === 'password' ? 'icon-guanbi-yanjing' : 'icon-chakanyanjingshishifenxi'"
        :iconCallback="changeInputType('rePassword')" />
        <div class="is_already" @click="isAlready">
          <span class="iconfont" :class="is_already ? 'icon-xuanze' : 'icon-xuanze1'"></span>
          <span>我已经仔细阅读并同意</span>
          <span
            class="serve"
            @click.stop="goService">服务及隐私条款</span>
        </div>
      <button
        class="form_submit submit-button"
        @click="submitCreate">注册</button>
      <div class="prompt_bottom">
        <nuxt-link tag="span" to="/users/login" v-show="isFlicking">已有账号，去登录</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import iconInput from '@/components/input/right_icon.vue';
import { mapState } from 'vuex';
export default {
  name: 'register',
  layout (context) {
    return 'back_page';
  },
  head () {
    // 返回头部信息
    return {
      title: '注册'
    };
  },
  data () {
    return {
      // 是否可以点击获取验证码按钮
      isSend: false,
      // 获取的按钮
      btntxt: '获取',
      // 倒计时的时间
      sendSMSTime: 0,
      // 是否阅读并同意条款
      is_already: false,
      // input输入值
      input: {
        // 手机号
        phone: '',
        // 短信验证码
        code: '',
        // 登录密码
        password: '',
        // 确认登录密码
        repassword: ''
      },
      // input输入框type值
      inputType: {
        password: 'password',
        rePassword: 'password'
      },
      // 是否是扫码进来的
      isFlicking: true,
      fPhone: this.$route.query.code // 推广码
    };
  },
  computed: {
    ...mapState(['country'])
  },
  beforeMount () {
    this.input.phone = this.$store.state.registerInfo.phone; // 注册记住信息
    this.input.code = this.$store.state.registerInfo.code; // 注册记住信息
    this.input.password = this.$store.state.registerInfo.password; // 注册记住信息
    this.input.repassword = this.$store.state.registerInfo.repassword; // 注册记住信息
  },
  mounted () {
    if (this.$route.query.code) {
      this.isFlicking = false;
    }
  },
  methods: {
    // 更改密码框显示
    changeInputType (type) {
      return () => {
        this.inputType[type] === 'password' ? (this.inputType[type] = 'text') : (this.inputType[type] = 'password');
      };
    },
    // 获取验证码
    getCode () {
      let regTel = /^(1[3-9])\d{9}$/;
      if (!this.input.phone) {
        this.$global.alertOptions('手机号码不能为空');
      } else if (!regTel.test(this.input.phone)) {
        this.$global.alertOptions('您的手机号码格式输入不正确');
      } else if (this.isSend === true) {
        return false;
      } else {
        // 发送验证码
        this.submitCode();
      }
    },
    submitCode () {
      this.$axios.post('/v1/sms/to_send', {
        type: 1,
        mobile: this.input.phone
      })
        .then(({ data }) => {
          if (data.status === 200) {
            this.sendSMSTime = 60;
            this.isSend = true;
            this.timer();
          } else {
            this.$global.alertOptions(data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 倒计时
    timer () {
      if (this.sendSMSTime > 0) {
        this.sendSMSTime--;
        this.btntxt = `${this.sendSMSTime}s后重试`;
        setTimeout(() => {
          this.timer();
        }, 1000);
      } else {
        this.sendSMSTime = 0;
        this.btntxt = '获取';
        this.isSend = false;
      }
    },
    // 查看服务和隐私条款
    goService () {
      this.$router.push('/users/service_provisions');
      this.$store.commit('getRegisterInfo', this.input); // 向vuex传值
    },
    // 是否阅读并同意条款
    isAlready () {
      this.is_already = !this.is_already;
    },
    // 注册成功，跳转登录页面
    submitCreate () {
      let regTel = /^(1[3-9])\d{9}$/;
      let regPas = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
      if (!this.input.phone) {
        this.$global.alertOptions('请输入您的手机号');
      } else if (!regTel.test(this.input.phone)) {
        this.$global.alertOptions('您输入的手机号码格式不正确');
      } else if (!this.input.code) {
        this.$global.alertOptions('请输入您的短信验证码');
      } else if (!this.input.password) {
        this.$global.alertOptions('请输入您的登录密码');
      } else if (!regPas.test(this.input.password)) {
        this.$global.alertOptions('请输入6-20位数字加字母组合的登录密码');
      } else if (!this.input.repassword) {
        this.$global.alertOptions('请您再次确认登录密码');
      } else if (this.input.password !== this.input.repassword) {
        this.$global.alertOptions('两次输入的密码不一致');
      } else if (this.is_already === false) {
        this.$global.alertOptions('请阅读并同意服务及隐私条款');
      } else {
        // 请求注册
        this.submitRegister();
      }
    },
    submitRegister () {
      this.$axios.post('/v1/power/signup', {
        mobile: this.input.phone, //  手机号
        password: this.input.password, // 密码
        mobile_area: this.country.split('+')[1], // 区号
        two_password: this.input.repassword, // 确认密码
        code: this.input.code, // 验证码
        push_code: this.fPhone // 推荐码
      })
        .then(({ data }) => {
          if (data.status === 200) {
            this.$router.go(-1);
            this.$global.successOptions(data.message);
          } else {
            this.$global.alertOptions(data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  components: {
    iconInput
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #register {
    padding: 0 50px;
    box-sizing: border-box;
    .title {
      font-size: 48px;
      line-height: 100px;
      font-weight: 500;
      padding-bottom: 30px;
      box-sizing: border-box;
    }
    .blue_eye {
      .input-right-icon-icon {
        color: $mainColor;
      }
    }
    .selectInput{
      display: flex;
      align-items: center;
      border-bottom: 1Px solid #eaecf1;
      .intro{
        padding-top: 0;
        height: 100px;
      }
      &.selectInput:first-child {
        .intro{
          height: 80px;
          padding-top: 16px;
        }
      }
      .get_code{
        width: 190px;
        padding-right: 14px;
        box-sizing: border-box;
        text-align: right;
        color: $mainColor;
        &.send-sms {
          text-align: center;
        }
        &.no-send-sms {
          color: #9da2b2;
        }
      }
    }
    .country{
      width: 159px;
      line-height: 84px;
      height: 40px;
      margin-bottom: -16px;
      color: #9da2b2;
      font-size: 28px;
      border-right: 1Px solid #eaecf1;
      display: flex;
      align-items: center;
      margin-right: 24px;
      .iconfont{
        font-size: 40px;
        margin-top: 4px;
      }
    }
    .intro{
      border: none;
    }
    .is_already{
      color: #3f4e62;
      font-size: 24px;
      display: flex;
      align-items: center;
      padding-top: 40px;
      box-sizing: border-box;
      .iconfont{
        color: #cdcfd5;
        margin-right: 14px;
        font-size:25px;
        &.icon-xuanze{
          color: $mainColor;
        }
      }
      .serve{
        color: $mainColor;
        margin-left: 14px;
      }
    }
    .prompt_bottom{
      color: $mainColor;
      font-size: 26px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 45px 0 0;
      box-sizing: border-box;
    }
    .form_submit {
      margin-top: 90px;
    }
  }
</style>
