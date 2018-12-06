<template>
  <div id='editLogin'>
    <h1 class="login_title">登录密码修改</h1>
    <div class="form">
      <div class="common_box">
        <input type="text" :value="phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')" class="common_input" readonly>
      </div>
      <!-- 验证码不要了 -->
      <!-- <div class="selectInput">
        <icon-input
          inputPlaceholder="输入短信验证码"
          v-model="input.code" class="intro"
          type="number"/>
        <span class="get_code" @click="getCode" :disabled="isSend"
          :class="{'send-sms' : isSend, 'no-send-sms': isSend}">{{btntxt}}</span>
      </div> -->
      <!-- 换成旧的登录密码 -->
      <icon-input
        inputPlaceholder="输入旧的登录密码"
        v-model="input.oldpassword"
        :class="{'blue_eye': inputType.oldpassword === 'text'}"
        :inputType="inputType.oldpassword"
        :iconfont="inputType.oldpassword === 'password' ? 'icon-guanbi-yanjing' : 'icon-chakanyanjingshishifenxi'"
        :iconCallback="changeInputType('oldpassword')" />
      <icon-input
        inputPlaceholder="输入新的登录密码(6-20位数字加字母组合)"
        v-model="input.password"
        :class="{'blue_eye': inputType.password === 'text'}"
        :inputType="inputType.password"
        :iconfont="inputType.password === 'password' ? 'icon-guanbi-yanjing' : 'icon-chakanyanjingshishifenxi'"
        :iconCallback="changeInputType('password')" />
      <icon-input
        inputPlaceholder="再次确认新密码"
        v-model="input.repassword"
        :class="{'blue_eye': inputType.rePassword === 'text'}"
        :inputType="inputType.rePassword"
        :iconfont="inputType.rePassword === 'password' ? 'icon-guanbi-yanjing' : 'icon-chakanyanjingshishifenxi'"
        :iconCallback="changeInputType('rePassword')" />
      <button
      class="form_submit submit-button"
      @click="submitCreate">确认</button>
    </div>
  </div>
</template>

<script>
import iconInput from '@/components/input/right_icon.vue';
import { mapMutations } from 'vuex';
export default {
  name: 'editLogin',
  components: {
    iconInput
  },
  layout () {
    return 'back_page';
  },
  head () {
    // 返回头部信息
    return {
      title: '登录密码修改'
    };
  },
  data () {
    return {
      phone: '',
      // 是否可以点击获取验证码按钮
      isSend: false,
      // 获取的按钮
      btntxt: '获取',
      // 倒计时的时间
      sendSMSTime: 0,
      // input输入值
      input: {
        // 手机号
        phone: '',
        // 短信验证码
        code: '',
        // 旧的登录密码
        oldpassword: '',
        // 登录密码
        password: '',
        // 确认登录密码
        repassword: ''
      },
      // input输入框type值
      inputType: {
        oldpassword: 'password',
        password: 'password',
        rePassword: 'password'
      }
    };
  },
  beforeMount () {
    this.pageTitle({ title: '', shadown: false });
  },
  mounted () {
    this.getInfo();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 更改密码框显示
    changeInputType (type) {
      return () => {
        this.inputType[type] === 'password' ? (this.inputType[type] = 'text') : (this.inputType[type] = 'password');
      };
    },
    // 获取验证码
    // getCode () {
    //   if (this.isSend) {
    //     return false;
    //   } else {
    //     this.sendSMSTime = 60;
    //     this.isSend = true;
    //     this.timer();
    //   }
    // },
    // 倒计时
    // timer () {
    //   if (this.sendSMSTime > 0) {
    //     this.sendSMSTime--;
    //     this.btntxt = `${this.sendSMSTime}s后重试`;
    //     setTimeout(() => {
    //       this.timer();
    //     }, 1000);
    //   } else {
    //     this.sendSMSTime = 0;
    //     this.btntxt = '获取';
    //     this.isSend = false;
    //   }
    // },
    // 注册成功，跳转登录页面
    submitCreate () {
      let regPas = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
      if (!this.input.oldpassword) {
        this.$global.alertOptions('请输入您旧的登录密码');
      } else if (!this.input.password) {
        this.$global.alertOptions('请输入您新的登录密码');
      } else if (!regPas.test(this.input.password)) {
        this.$global.alertOptions('请输入6-20位数字加字母组合的登录密码');
      } else if (!this.input.repassword) {
        this.$global.alertOptions('请您再次确认新密码');
      } else if (this.input.password !== this.input.repassword) {
        this.$global.alertOptions('两次输入的密码不一致');
      } else {
        this.doEdit(); // 执行修改接口
      }
    },
    // 获取手机号
    getInfo () {
      this.$axios.get('/v1/user/info').then(({ data }) => {
        if (data.status === 200) {
          this.phone = data.data.mobile;
        } else {
          this.$global.alertOptions(data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    // 修改登录密码接口
    doEdit () {
      this.$axios.put('/v1/user/password/update', {
        old_password: this.input.oldpassword, // 旧的登录密码
        password: this.input.password, // 新的登录密码
        two_password: this.input.repassword // 确认密码
      }).then(({ data }) => {
        if (data.status === 200) {
          this.$global.successOptions({
            message: '登录密码修改成功',
            callback: () => {
              this.$router.go(-1);
            }
          });
        } else {
          this.$global.alertOptions(data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }
};
</script>

<style lang='scss'>
  @import '@/assets/scss/public.scss';
  #editLogin{
    padding: 0 48px;
    box-sizing: border-box;
    .login_title {
      height: 105px;
      font-size: 40px;
      line-height: 105px;
      color: #222222;
      font-weight: 600;
    }
    .common_box {
      height: 102px;
      border-bottom: 1Px solid #eaecf1;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .common_input {
        width: 70%;
        height: 100%;
        line-height: 60px;
        font-size: 28px;
        color: #222;
        &::placeholder {
          font-size: 28px;
          color: #b7bac3;
        }
      }
    }
    .blue_eye {
      .input-right-icon-icon {
        color: $mainColor;
      }
    }
    .selectInput{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1Px solid #eaecf1;
      .intro {
        padding-top: 0;
        height: 100px;
      }
      .get_code{
        width: 170px;
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
    .intro{
      border: none;
      width: 70%;
    }
    .form_submit {
      margin-top: 80px;
    }
  }
</style>
