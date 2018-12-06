<template>
  <div id="login">
    <h1 class="title">登录</h1>
    <div class="form">
      <div class="selectInput">
        <nuxt-link tag="div" to="/users/choice_code" class="country">
          {{country.split(' ')[1]}}
          <i class="iconfont icon-triangle-down01-copy"></i>
        </nuxt-link>
        <icon-input class="intro" type="text"  inputPlaceholder="输入手机号" v-model="input.phone" />
      </div>
      <icon-input
        inputPlaceholder="输入密码"
        v-model="input.password"
        :class="{'blue_eye': inputType.password === 'text'}"
        :inputType="inputType.password"
        :iconfont="inputType.password === 'password' ? 'icon-guanbi-yanjing' : 'icon-chakanyanjingshishifenxi'"
        :iconCallback="changeInputType('password')" />
        <div class="prompt_bottom">
          <nuxt-link tag="span" to="/users/register">还没有账号，去注册</nuxt-link>
          <nuxt-link tag="span" to="/users/forget">忘记密码？</nuxt-link>
        </div>
      <button
        class="form_submit submit-button"
        @click="goLogin">登录</button>
    </div>
  </div>
</template>

<script>
import iconInput from '@/components/input/right_icon.vue';
import { mapState } from 'vuex';
export default {
  name: 'login',
  layout (context) {
    return 'back_page';
  },
  head () {
    // 返回头部信息
    return {
      title: '登录'
    };
  },
  data () {
    return {
      // input输入值
      input: {
        // 手机号
        phone: '',
        // 登录密码
        password: ''
      },
      // input输入框type值
      inputType: {
        password: 'password'
      },
      loginTo: this.$route.query.toPage
    };
  },
  computed: {
    ...mapState({
      country: state => state.country
    })
  },
  methods: {
    // 更改密码框显示
    changeInputType (type) {
      return () => {
        this.inputType[type] === 'password' ? (this.inputType[type] = 'text') : (this.inputType[type] = 'password');
      };
    },
    // 登录
    goLogin () {
      if (!this.input.phone || !this.input.password) {
        this.$global.alertOptions('您输入的手机号/密码有误，请重新输入');
      } else {
        this.$axios.post('/v1/power/signin', {
          mobile: this.input.phone,
          password: this.input.password
        })
          .then(({ data }) => {
            if (data.status === 200) {
              this.$router.replace(this.loginTo || '/wallet/');
              this.$global.successOptions(data.message);
            } else {
              this.$global.alertOptions(data.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  },
  components: {
    iconInput
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #login {
    padding: 0 50px;
    box-sizing: border-box;
    .title {
      font-size: 48px;
      line-height: 100px;
      font-weight: 500;
      padding-bottom: 30px;
      box-sizing: border-box;
    }
    .selectInput{
      display: flex;
      align-items: center;
      border-bottom: 1Px solid #eaecf1;
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
    .blue_eye {
      .input-right-icon-icon {
        color: $mainColor;
      }
    }
    .prompt_bottom{
      color: $mainColor;
      font-size: 26px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 48px 0 50px;
      box-sizing: border-box;
    }
    .form_submit {
      margin-top: 80px;
    }
  }
</style>
