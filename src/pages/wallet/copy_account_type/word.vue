<template>
  <div id="copyAccountTypeWord">
    <p class="prompt">助记词用于恢复账户或重置账户密码，请将它准确的抄写到纸上，并存放在只有你知道的安全地方。Paytokens不储存用户助记词，无法提供找回功能。</p>
    <word-list
      class="wrod_list"
      :dataDisable="true"
      v-model="wordListArr" />
    <button
      class="submit_step submit-button"
      @click="thenStep">下一步</button>
    <p
      class="what-faq faq"
      @click="goFaqPage">
      <i class="iconfont icon-iconfontquestion"></i>
      什么是助记词
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import wordList from '@/components/input/word_list.vue';
export default {
  name: 'copyAccountTypeWord',
  data () {
    return {
      wordListArr: []
    };
  },
  computed: {
    ...mapState({
      wordList: state => state.storage.userInfo.accounts
    })
  },
  beforeMount () {
    // 重置助记词列表
    this.wordListArr = this.wordList[this.$route.query.id - 0].word.split(' ');
  },
  beforeDestroy () {
    this.$global.alertOptions(false);
  },
  mounted () {
    this.$global.alertOptions({
      message: `
        <h4 class="alert-box-title">请勿截图</h4>
        <p class="copy_account_type_alert_message">任何人获取你的助记词，将直接获取你的资产！</p>
      `,
      callbackList: [
        {
          title: '确认'
        }
      ]
    });
  },
  methods: {
    // 下一步
    thenStep () {
      this.$router.push({
        path: '/wallet/verification_word',
        query: {
          id: this.$route.query.id
        }
      });
    },
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

<style lang="scss" scoped>
  #copyAccountTypeWord {
    .prompt {
      color: #babac0;
      font-size: 24px;
      line-height: 48px;
    }
    .wrod_list {
      margin-top: 40px;
    }
    .submit_step {
      margin-top: 80px;
    }
    .faq {
      margin-top: 160px;
      margin-bottom: 20px;
    }
  }
</style>
