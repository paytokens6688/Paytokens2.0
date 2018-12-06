<template>
  <div id='editEmail' >
    <h4 class="title">当前已绑定邮箱{{email}}</h4>
    <p class="please_txt">请输入新的邮箱账号</p>
    <p class="notice">请注意邮箱格式是否正确</p>
    <input type="text" v-model="inputNum" class="_input" v-focus>
    <!-- 下一步 -->
    <div class="next_btn" @click="next">下一步</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'editEmail',
  layout () {
    return 'back_page';
  },
  data () {
    return {
      inputNum: '',
      email: '123456789@qq.com'
    };
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      }
    }
  },
  beforeMount () {
    this.pageTitle({ title: '邮箱更换', shadown: true });
  },
  mounted () {
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 下一步
    next () {
      if (!this.inputNum) {
        this.$global.alertOptions('请输入邮箱账号');
      } else {
        this.$router.replace('/users/email_sms');
      }
    }
  }
};
</script>

<style lang='scss' scoped>
  @import '@/assets/scss/public.scss';
  #editEmail{
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
    .please_txt {
      font-size: 28px;
      color: #222222;
      text-align: center;
      padding-bottom: 30px;
    }
    .notice {
      font-size: 24px;
      color: #b7bac3;
      text-align: center;
    }
    ._input {
      box-sizing: border-box;
      display: block;
      width: 100%;
      height: 90px;
      background: #f5f6fa;
      border-radius: 8px;
      font-size: 30px;
      color: 222;
      margin: 54px 0 60px;
      padding: 0 20px;
      &::-webkit-scrollbar {
        width: 0;
      }
    }
    .next_btn {
      width: 100%;
      height: 88px;
      line-height: 88px;
      background: #b7bac3;
      font-size: 30px;
      color: #fff;
      border-radius: 8px;
      text-align: center;
    }
  }
</style>
