<template>
  <div id="copyAccountWord">
    <p class="word_rule">
      助记词用于恢复账户或重置账户密码，请将它准确的抄写到纸上，并存放在只有你知道的安全地方。Paytokens不储存用户助记词，无法提供找回功能。
    </p>
    <word-list
      class="word_list"
      :dataDisable="true"
      v-model="wordListArr" />
    <button
      class="submit submit-button"
      @click="submit">备份验证</button>
      <p
        class="what_word"
        @click="goFaqPage">
        <span class="iconfont icon-iconfontquestion"></span>
        <span class="word_text">
          什么是助记词？
        </span>
      </p>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import wordList from '@/components/input/word_list.vue';
export default {
  name: 'copyAccountWord',
  layout: 'back_page_img',
  data () {
    return {
      // 助记词列表
      wordListArr: []
    };
  },
  computed: {
    ...mapState({
      accountsList: state => state.storage.userInfo.accounts
    })
  },
  beforeMount () {
    this.pageTitle({
      title: '备份助记词',
      shadown: true
    });
    this.wordListArr = this.accountsList[this.$route.query.selectAccount - 0].word.split(' ');
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    submit () {
      this.$router.push({
        path: '/wallet/verification_word_inner',
        query: {
          selectAccount: this.$route.query.selectAccount
        }
      });
    },
    // 什么是助记词
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
  #copyAccountWord {
    padding: 20px 50px 30px;
    box-sizing: border-box;
    .word_rule{
      color:#babac0;
      font-size:24px;
      line-height:48px;
    }
    .word_list {
      margin-top: 30px;
    }
    .submit {
      margin-top: 80px;
    }
    .what_word{
      font-size:28px;
      color:#9297a5;
      margin-top:200px;
      display:flex;
      align-items: center;
      justify-content: center;
      .iconfont{
        font-size:30px;
        margin-right:5px;
      }
    }
  }
</style>
