<template>
  <div id="copyPrivate">
    <h2 class="title">{{ title }}私钥备份</h2>
    <div class="user_private">
      {{ userPrivate }}
    </div>
    <button
      class="submit-button copy_button"
      :data-clipboard-text="userPrivate"
      onclick="">复制私钥</button>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'copyPrivate',
  layout: 'back_page_img_big',
  data () {
    return {
      title: '',
      userPrivate: '',
      theSiteIndex: 0
    };
  },
  computed: {
    ...mapState({
      account: state => state.storage.userInfo.accounts,
      coins: state => state.storage.coins.main
    })
  },
  beforeMount () {
    try {
      const queryType = this.$route.query.id.split('-');
      this.account[queryType[0] - 0].siteOfWord.map((item, index) => {
        if (item.type === queryType[1]) this.theSiteIndex = index;
      });
      this.userPrivate = this.account[queryType[0] - 0].siteOfWord[this.theSiteIndex].privateKey;
      let symbol = this.coins[this.account[queryType[0] - 0].siteOfWord[this.theSiteIndex].type - 1].symbol;
      this.title = symbol;
    } catch (err) {
      console.log('传入有误');
    }
  },
  mounted () {
    this.copyInit();
  },
  methods: {
    ...mapMutations({
      accountSiteCopySuccess: 'storage/accountSiteCopySuccess'
    }),
    copyInit () {
      let clipboard = new ClipboardJS('.copy_button');
      clipboard.on('success', () => {
        this.$global.successOptions('复制成功');
        this.accountSiteCopySuccess({
          accountIndex: this.$route.query.id.split('-')[0],
          siteIndex: this.theSiteIndex
        });
      });
      clipboard.on('error', () => {
        this.$global.successOptions('复制成功');
        this.accountSiteCopySuccess({
          accountIndex: this.$route.query.id.split('-')[0],
          siteIndex: this.theSiteIndex
        });
      });
    }
  }
};
</script>

<style lang="scss">
  #copyPrivate {
    position: relative;
    padding: 0 50px;
    .title {
      font-size: 40px;
      line-height: 90px;
      color: #fff;
      font-weight: 500;
    }
    .user_private {
      margin-top: 30px;
      background: #fff;
      width: 100%;
      box-sizing: border-box;
      word-wrap: break-word;
      padding: 20px 45px;
      border-radius: 10px;
      line-height: 50px;
      color: #5e6476;
      height: 240px;
      overflow-y: auto;
      box-shadow: 0 0 20px 0 rgba(27, 55, 173, 0.1);
    }
    .copy_button {
      margin-top: 80px;
    }
  }
</style>
