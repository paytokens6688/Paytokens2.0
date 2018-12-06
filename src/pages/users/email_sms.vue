<template>
  <div id='emailSms' >
    <h4 class="title">请输入验证码</h4>
    <p class="notice">验证码已发送至 {{email}} 邮箱中请注意查收。</p>
    <!-- 密码 -->
    <!-- 支付密码弹框 -->
    <div class="pass_content">
      <div class="password_content">
        <label for="password"></label>
        <ul>
          <li class="box"
            :class="{'is_focus': (index === passValue.length) && isFocus, 'no_focus': (index) !== passValue.length, 'hide': hideJumpLine}"
            v-for="(item, index) in [0, 1, 2, 3, 4, 5]"
            :key="index">
            {{ passValue.substr(index, 1) }}
          </li>
        </ul>
        <input
          type="number"
          maxlength="6"
          id="password"
          :value="passValue"
          @input="showPassNum"
          @focus="() => { this.isFocus = true; }"
          v-focus
        />
      </div>
    </div>
    <!-- 完成按钮 -->
    <div class="finish" @click="doFinish">完成</div>
    <!-- 发送状态 -->
    <p class="send_status">没收到验证码？<span @click="sendCode">重新发送 {{sendText}}</span></p>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'emailSms',
  layout () {
    return 'back_page';
  },
  data () {
    return {
      email: '123456789@qq.com',
      passValue: '',
      isFocus: false,
      timeout: null,
      sendText: '',
      isSend: false,
      codeTime: 60,
      hideJumpLine: false // input聚焦时候跳动的条件
    };
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      }
    }
  },
  watch: {
    isFocus () {
      this.doSettimeout();
    }
  },
  computed: {
  },
  beforeMount () {
    this.pageTitle({ title: '邮箱绑定', shadown: true });
  },
  mounted () {
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // input事件
    showPassNum (e) {
      e.target.value = e.target.value.substr(0, 6);
      this.passValue = e.target.value;
    },
    // 完成倒计时
    doFinish () {
      if (!this.passValue) {
        this.$global.alertOptions('请输入验证码');
      } else if (this.passValue.length < 6) {
        this.$global.alertOptions('请输入完整验证码');
      } else {
        this.$router.go(-1); // 这里请求完成验证码接口
      }
    },
    // 发送验证码
    sendCode () {
      if (this.isSend) {
        return false;
      } else {
        this.isSend = true;
        this.timer();
      }
    },
    // 倒计时
    timer () {
      if (this.codeTime > 0) {
        this.codeTime--;
        this.sendText = `${this.codeTime}s`;
        setTimeout(this.timer, 1000);
      } else {
        this.codeTime = 60;
        this.sendText = '';
        this.isSend = false;
      }
    },
    doSettimeout () {
      if (this.isFocus) {
        this.timeout = setTimeout(() => {
          this.hideJumpLine = !this.hideJumpLine;
          clearTimeout(this.timeout);
          this.doSettimeout();
        }, 600);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
  @import '@/assets/scss/public.scss';
  #emailSms{
    box-sizing: border-box;
    padding: 46px 50px 0;
    .title {
      font-size: 28px;
      color: #222222;
      height: 88px;
      line-height: 88px;
      text-align: center;
      font-weight: normal;
    }
    .notice {
      width: 78%;
      margin: 0 auto;
      font-size: 24px;
      color: #b7bac3;
      text-align: center;
      line-height: 37px;
    }
    // 密码
    .pass_content{
      padding: 45px 0px 60px;
      position: relative;
      .password_content{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        label{
          width: 100%;
          height: 92px;
          z-index: 99;
          position: absolute;
          top: 0px;
          left: 0;
        }
        ul{
          width: 100%;
          display: flex;
          justify-content: space-between;
          li{
            min-width: 92px;
            height: 92px;
            line-height: 92px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f5f6fa;
            margin-left: -1px;
            border-radius: 8px;
            font-size: 28px;
            color: #222;
            &:nth-last-child(1){
              margin-right: 0;
            }
            &.is_focus{
              position: relative;
              &.hide{
                &:before{
                  display: none;
                }
              }
              &:before{
                content: '';
                display: block;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background-color: #333;
                height: 40px;
                width: 2px;
                z-index: 9;
              }
            }
          }
        }
        input{
          width: 200%;
          height: 92px;
          left: -500px;
          position: absolute;
          z-index: 90;
          top: 0px;
          opacity: 0;
        }
      }
    }
    // 完成按钮
    .finish {
      height: 88px;
      width: 100%;
      background: #b7bac3;
      border-radius: 8px;
      text-align: center;
      line-height: 88px;
      font-size: 30px;
      color: #fff;
    }
    // 倒计时状态
    .send_status {
      height: 102px;
      font-size: 24px;
      color: #9297a5;
      line-height: 102px;
    }
  }
</style>
