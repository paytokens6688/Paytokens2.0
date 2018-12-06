<template>
  <div id="importAccountWord">
    <h2 class="title">助记词导入账户</h2>
    <p class="explain">按照顺序依次填写相对应的助记词。</p>
    <word-list v-model="wordListArr" />
    <button
      class="submit-button submit"
      @click="submit">立即导入</button>
    <p
      class="what-faq"
      @click="goFaqPage">
      <i class="iconfont icon-iconfontquestion"></i>
      什么是助记词？
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import wordList from '@/components/input/word_list.vue';
export default {
  name: 'importAccountWord',
  layout (context) {
    return 'back_page_img';
  },
  data () {
    return {
      // 助记词列表
      wordListArr: [],
      // 助记词字符串
      wordListStr: ''
    };
  },
  computed: {
    ...mapState({
      pass: state => state.createAccount.pass
    })
  },
  beforeMount () {
    // 重置助记词列表
    for (let i = 0; i < 12; i++) {
      this.wordListArr.push('');
    }
  },
  mounted () {
    // 如果没有密码
    if (!this.$func.realPayPass(this.pass)) {
      return this.$global.alertOptions({
        message: '您的创建账户信息因您退出而清除，请重新填写',
        callbackList: [
          {
            title: '知道了',
            callback: () => {
              this.$router.replace('/wallet/create_account');
            }
          }
        ]
      });
    }
    // 判断是否是第一次进入该页面，如果是的话显示
    if (this.$store.state.importAccountWordFrist) {
      this.$global.alertOptions('使用助记词导入账户，可以一键导入该助记词下所有账户。');
      this.$store.commit('importAccountWordFristChange');
    }
  },
  beforeDestroy () {
    this.$global.alertOptions(false);
  },
  methods: {
    // 立即导入
    submit () {
      // 如果没有输入助记词
      if (this.wordListArr.length !== 12) return this.$global.alertOptions('请输入12位助记词');
      // 判断是否是助记词
      const { btcUnit: { isMnemonic } } = require('@/assets/js/btc_func');
      this.wordListStr = this.wordListArr.join(' ');
      if (!isMnemonic(this.wordListStr)) return this.$global.alertOptions('助记词输入有误');
      // 助记词字符串转成buffer
      const { btcUnit: { wordStrToBuffer } } = require('@/assets/js/btc_func');
      const wordListStrBuffer = wordStrToBuffer(this.wordListStr);
      // 暂存助记词
      this.$store.commit('createAccount/importWord', {
        buffer: wordListStrBuffer,
        word: this.wordListStr
      });
      this.$router.push('/wallet/account_word_coin');
    },
    // 是么是助记词
    goFaqPage () {
      this.$router.push({
        path: '/wallet/user_help',
        query: {
          type: 'whatWord'
        }
      });
    }
  },
  components: {
    wordList
  }
};
</script>

<style lang="scss">
  #importAccountWord {
    position: relative;
    padding: 0 50px;
    .title {
      font-size: 40px;
      line-height: 90px;
      color: #fff;
      font-weight: 500;
    }
    .explain {
      color: #babac0;
      line-height: 50px;
      font-size: 26px;
      padding-bottom: 40px;
    }
    .submit {
      margin-top: 80px;
    }
    .what-faq {
      margin-top: 250px;
      margin-bottom: 40px;
    }
  }
</style>
