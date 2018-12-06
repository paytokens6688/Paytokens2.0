<template>
  <div id="createAccount">
    <h1 class="title">{{importAccount ? '助记词导入' : '创建'}}账户</h1>
    <div class="form">
      <icon-input
        inputPlaceholder="请输入账户名"
        inputType="text"
        iconfont="icon-bianji"
        v-model="input.accountName"
        :iconCallback="createAccountCallback" />
      <icon-input
        inputPlaceholder="设置交易密码(8-16位数字加字母组合)"
        v-model="input.password"
        :class="{'blue_eye': inputType.password === 'text'}"
        :inputType="inputType.password"
        :iconfont="inputType.password === 'password' ? 'icon-guanbi-yanjing' : 'icon-chakanyanjingshishifenxi'"
        :iconCallback="changeInputType('password')" />
      <icon-input
        inputPlaceholder="确认交易密码"
        v-model="input.rePassword"
        :class="{'blue_eye': inputType.rePassword === 'text'}"
        :inputType="inputType.rePassword"
        :iconfont="inputType.rePassword === 'password' ? 'icon-guanbi-yanjing' : 'icon-chakanyanjingshishifenxi'"
        :iconCallback="changeInputType('rePassword')" />
      <icon-input
        inputPlaceholder="密码提示语（选填）"
        inputType="text"
        v-model="input.prompt" />
      <button
        class="form_submit submit-button"
        @click="submitCreate">下一步</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import iconInput from '@/components/input/right_icon.vue';
export default {
  name: 'createAccount',
  layout: 'back_page',
  head () {
    // 返回头部信息
    return {
      title: '创建账户'
    };
  },
  data () {
    return {
      // input输入值
      input: {
        // 账户名
        accountName: '',
        // 交易密码
        password: '',
        // 确认交易密码
        rePassword: '',
        // 密码提示语
        prompt: ''
      },
      // input输入框type值
      inputType: {
        password: 'password',
        rePassword: 'password'
      },
      // 是不是导入账户
      importAccount: this.$route.query.import
    };
  },
  computed: {
    ...mapState({
      passError: state => state.public.passError,
      accounts: state => state.storage.userInfo.accounts
    }),
    ...mapGetters({
      accountName: 'createAccount/canUseAccountName'
    })
  },
  beforeMount () {
    // 判断是不是导入助记词
    if (this.importAccount === 'import') this.importAccount = true;
    // 初始化账户名
    this.input.accountName = this.accountName;
  },
  methods: {
    // 创建账户名框右侧事件
    createAccountCallback () {
      // // 判断长度过长，直接删除到20个字符
      // if (this.input.accountName.length > 20) {
      //   this.input.accountName = this.input.accountName.substring(0, 20);
      // }
      // if (this.input.accountName.length) {
      //   // 每次只删除一个字符
      //   this.input.accountName = this.input.accountName.substring(0, this.input.accountName.length - 1);
      //   if (this.input.accountName.length) {
      //     // 递归删除
      //     setTimeout(this.createAccountCallback, 50);
      //   }
      // }
    },
    // 更改密码框显示
    changeInputType (type) {
      return () => {
        this.inputType[type] === 'password' ? (this.inputType[type] = 'text') : (this.inputType[type] = 'password');
      };
    },
    // 解决重名问题
    getCanUseName (name) {
      if (!this.accounts) return name;
      for (let i = 0; i < this.accounts.length; i++) {
        if (this.accounts[i].accountName === name) {
          let lastNum = name.match(/\d+$/);
          if (lastNum) {
            return this.getCanUseName(`${name.substr(0, lastNum.index)}${parseFloat(lastNum[0]) + 1}`);
          } else {
            return this.getCanUseName(name + '1');
          }
        }
      }
      return name;
    },
    // 下一步
    submitCreate () {
      let oldName = this.input.accountName;
      if (!this.input.accountName) return this.$global.alertOptions('请输入账户名');
      if (!this.$func.realPayPass(this.input.password)) return this.$global.alertOptions(this.passError);
      if (this.input.password !== this.input.rePassword) return this.$global.alertOptions('两次交易密码输入不一致');
      this.input.accountName = this.getCanUseName(this.input.accountName);
      // 判断账户名是否更改
      if (oldName === this.input.accountName) {
        this.confirm();
      } else {
        this.$global.alertOptions({
          show: true,
          message: `此账户名被使用，已改为${this.input.accountName}`,
          callbackList: [
            {
              title: '知道了',
              callback: () => {
                this.confirm();
              }
            }
          ]
        });
      }
    },
    // 下一步储存账户信息，跳转页面
    confirm () {
      this.saveData({
        accountName: this.input.accountName,
        pass: this.input.password,
        passPrompt: this.input.prompt
      });
      if (this.importAccount) {
        this.$router.push({
          path: '/wallet/import_account_word',
          query: {
            importAccount: 'import'
          }
        });
      } else {
        this.$router.push('/wallet/select_coins');
      }
    },
    // 本地存储事件
    ...mapMutations({
      'saveData': 'createAccount/accountFrist'
    })
  },
  components: {
    iconInput
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #createAccount {
    padding: 0 50px;
    .title {
      font-size: 48px;
      line-height: 100px;
      font-weight: 500;
      padding-bottom: 30px;
    }
    .blue_eye {
      .input-right-icon-icon {
        color: $mainColor;
      }
    }
    .form_submit {
      margin-top: 80px;
    }
  }
</style>
