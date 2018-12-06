<template>
  <div id="copyAccount">
    <h1 class="title">
      备份账户
      <img
        class="title_icon"
        :src="require('@/assets/images/copy_account_icon.png')">
    </h1>
    <div class="keep_out"></div>
    <div class="main">
      <ul class="text_list">
        <li class="text_li">您应自行承担妥善保管移动设备、钱包密码、私钥、助记词等信息的责任。Paytokens不存储用户的任何资产信息。
        <li class="text_li">因您遗失移动设备、主动或被动泄露、遗忘账户密码、私钥、助记词或遭受他人攻击、诈骗等所引起的一切风险、责任、损失、费用应由您自行承担。</li>
      </ul>
      <button
        class="submit-button"
        @click="copyNow">立即备份</button>
      <nuxt-link
        class="what-faq"
        to="/wallet">我先看看，稍后再说</nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'copyAccount',
  layout: 'back_page_img',
  data () {
    return {
    };
  },
  computed: {
    ...mapState({
      importWord: state => state.createAccount.importWord.word
    })
  },
  beforeMount () {
    // 如果不是创建的账户无法进入这个页面
    if (!this.importWord) this.$router.replace('/wallet');
    // 头部
    this.pageTitle({
      title: ' ',
      backShow: false
    });
  },
  mounted () {
    this.$global.loadingOptions(false);
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    copyNow () {
      this.$router.push({
        path: '/wallet/copy_account_type/word',
        query: {
          id: this.$route.query.id
        }
      });
    }
  }
};
</script>

<style lang="scss">
  #copyAccount {
    padding: 20px 30px 0;
    box-sizing: border-box;
    .title {
      line-height: 240px;
      color: #fefefe;
      font-size: 60px;
      letter-spacing: 1Px;
      position: relative;
      .title_icon {
        position: absolute;
        bottom: -50px;
        right: 10px;
        width: 300px;
      }
    }
    .keep_out{
      position:fixed;
      left:0;
      top:0;
      width:80px;
      height:80px;
      background:transparent;
    }
    .main {
      height: calc(100% - 240px);
      box-sizing: border-box;
      padding-top: 45px;
      overflow-y: auto;
      .text_list {
        color: #5e6476;
        font-size: 26px;
        line-height: 54px;
        .text_li {
          padding-left: 25px;
          position: relative;
          word-break: break-word;
          &:before {
            content: '';
            width: 12px;
            height: 12px;
            background: #6c7181;
            position: absolute;
            top: 22px;
            left: 3px;
            border-radius: 50%;
          }
        }
      }
      .submit-button {
        margin-top: 120px;
      }
      .what-faq {
        display: block;
        margin-top: 250px;
        margin-bottom: 40px;
      }
    }
  }
</style>
