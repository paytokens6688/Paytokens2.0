<template>
  <div id="verificationWord">
    <h2 class="title">验证钱包助记词</h2>
    <p class="explain">请根据你记下的助记词，按顺序点击，验证你备份的助记词正确无误。</p>
    <div class="word_show">
      <p
        class="words"
        v-for="(item, index) in textAreaList"
        :key="index">{{ item }}</p>
    </div>
    <div class="word_list">
      <p
        class="words"
        v-for="(item, index) in wordList"
        :key="index"
        :class="{'words_select': item.select !== -1}"
        @click="changeWord(item)">
        {{ item.word }}
      </p>
    </div>
    <button
      class="submit-button submit_word"
      @click="submit">验证</button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'verificationWord',
  layout: 'back_page_img_big',
  data () {
    return {
      // 显示的数组
      textAreaList: [],
      // 助记词选择数组
      wordList: [
        // {
        //   word: 助记词,
        //   select: 第几个选择助记词,默认-1
        // }
      ],
      // 真实助记词列表
      wordListReal: [],
      selectAccount: this.$route.query.selectAccount
    };
  },
  computed: {
    ...mapState({
      accounts: state => state.storage.userInfo.accounts
    })
  },
  beforeMount () {
    this.wordListReal = this.accounts[this.selectAccount - 0];
    this.initPage();
  },
  methods: {
    // 更改本地储存成功
    ...mapMutations({
      changeAccountCopyStatus: 'storage/changeAccountCopyStatus'
    }),
    // 助记词排序
    initPage () {
      this.wordList = this.wordListReal.word.split(' ').sort().map((item) => {
        return {
          word: item,
          select: -1
        };
      });
    },
    // 选择助记词
    changeWord (type) {
      if (type.select === -1) {
        type.select = this.textAreaList.length;
        this.textAreaList.push(type.word);
      } else {
        type.select = -1;
        this.textAreaList.map((item, index) => {
          if (item === type.word) this.textAreaList.splice(index, 1);
        });
      }
    },
    // 提交
    submit () {
      if (this.textAreaList.join(' ') !== this.wordListReal.word) {
        this.$global.alertOptions({
          message: `
            <h4 class="alert-box-title">验证错误</h4>
            <p>请检查助记词顺序，重新验证</p>
          `,
          callbackList: [
            {
              title: '确认'
            }
          ]
        });
      } else {
        this.changeAccountCopyStatus(this.selectAccount - 0);
        this.$global.successOptions({
          message: '助记词验证成功',
          callback: () => {
            this.$router.go(-1);
            setTimeout(() => {
              this.$router.go(-1);
            }, 20);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #verificationWord {
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
    .word_show {
      width: 100%;
      height: 300px;
      background: #fff;
      border-radius: 10px;
      box-sizing: border-box;
      padding: 30px 40px;
      line-height: 50px;
      color: #5e6476;
      font-size: 30px;
      box-shadow: 0 0 20px 0 rgba(27, 55, 173, 0.1);
      .words {
        float: left;
        padding-right: 10px;
      }
    }
    .word_list {
      padding-top: 40px;
      overflow: hidden;
      width: calc(100% + 20px);
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .words {
        line-height: 50px;
        height: 50px;
        background: #f3f4f8;
        color: $gray;
        margin-right: 20px;
        padding: 0 25px;
        margin-bottom: 25px;
        border: 1Px solid #f3f4f8;
        &.words_select {
          background: #e9edff;
          color: $mainColor;
          border-color: $mainColor;
        }
      }
    }
    .submit_word {
      margin-top: 60px;
    }
  }
</style>
