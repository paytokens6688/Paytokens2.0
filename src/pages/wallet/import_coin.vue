<template>
  <div id="importCoin">
    <select-type
      :typeArr="typeList"
      v-model="listType" />
    <div class="import_main">
      <nuxt class="import_nuxt" />
      <p class="import_prompt">
        <i
          class="iconfont"
          :class="{'icon-xuanze': readTextOk, 'icon-xuanze1': !readTextOk}"
          @click="userReadText"></i>
        <span class="import_prompt_text">我已经仔细阅读并同意</span>
        <nuxt-link tag="div"
          class="import_prompt_url"
          to="/users/service_provisions">服务及隐私条款</nuxt-link>
      </p>
      <button
        class="import_button submit-button"
        @click="importSubmit">导入</button>
      <p
        class="what-faq"
        @click="goFaqPage">
        <i class="iconfont icon-iconfontquestion"></i>
        {{ faqName }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import selectType from '@/components/list/select_type.vue';
export default {
  name: 'importCoin',
  layout: 'back_page_img',
  data () {
    return {
      // type更改数组
      typeList: [
        '私钥',
        '助记词'
      ],
      // type头部第几个
      listType: 0,
      // 页面路径
      pageType: this.$route.path,
      // 页面路径数组
      pageTypeArr: [
        'private_key',
        'word'
      ],
      // 是否同意服务及隐私条款
      readTextOk: false,
      // 问题名称
      faqName: '',
      // 当前币种
      coinInfo: {},
      // 导入事件是否已经处理了
      importedSuccess: false
    };
  },
  watch: {
    '$route' (to, form) {
      this.pageTitle('导入');
      this.pageType = to.path;
      this.initTitle();
    },
    'listType' (to, form) {
      this.changePage(this.pageTypeArr[to]);
    }
  },
  computed: {
    ...mapState({
      coins: state => state.storage.coins.main,
      pass: state => state.createAccount.pass
    })
  },
  beforeMount () {
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
    this.pageTitle('导入');
    this.initTitle();
    this.pageInit();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      pushImportSite: 'createAccount/pushImportSite'
    }),
    // 页面初始化，判断币种的导入方式
    pageInit () {
      this.coins.map(item => {
        if (item.id === this.$route.query.id) {
          this.coinInfo = item;
          if (item.id === '2' || item.id === '4') {
            // 如果是万维链或以太坊，可以使用keystore
            this.typeList.splice(1, 0, 'Keystore');
            this.pageTypeArr.splice(1, 0, 'key_store');
          } else if (item.id === '1') {
            // 如果是BTC
            // this.typeList.splice(0, 1, 'WIF');
          }
        }
      });
    },
    // 切换页面
    changePage (type) {
      this.$router.replace({
        path: `/wallet/import_coin/${type}`,
        query: {
          id: this.$route.query.id
        }
      });
    },
    // 用户是否阅读条款
    userReadText () {
      this.readTextOk = !this.readTextOk;
    },
    // 点击导入账户
    importSubmit () {
      // 是否同意隐私条款
      if (!this.readTextOk) return this.$global.alertOptions('请仔细阅读并同意服务及隐私条款');
      // 找到子元素的提交事件
      this.$global.loadingOptions(true);
      setTimeout(() => {
        this.$children[1].$children[0].submitFunc();
      }, 500);
    },
    // 导入账户获取数据成功后处理函数
    importSubmitSuccess (data) {
      if (this.importedSuccess) return false;
      this.importedSuccess = true;
      this.pushImportSite({
        id: this.$route.query.id,
        ...data
      });
      this.$router.go(-1);
    },
    // 页面更改/提问标题/初始化type值
    initTitle () {
      if (this.pageType === '/wallet/import_coin/private_key') {
        this.faqName = '什么是私钥？';
      } else if (this.pageType === '/wallet/import_coin/key_store') {
        this.faqName = '什么是keystore？';
      } else if (this.pageType === '/wallet/import_coin/word') {
        this.faqName = '什么是助记词？';
      }
      const pageTypeList = this.pageType.split('/');
      this.pageTypeArr.map((item, index) => {
        if (item === pageTypeList[pageTypeList.length - 1]) {
          this.listType = index;
        }
      });
    },
    // 去提问页面
    goFaqPage () {
      let type = '';
      console.log(this.pageType);
      if (this.pageType === '/wallet/import_coin/private_key') {
        type = 'whatPrivate';
      } else if (this.pageType === '/wallet/import_coin/key_store') {
        type = 'whatKeystore';
      } else if (this.pageType === '/wallet/import_coin/word') {
        type = 'whatWord';
      }
      this.$router.push({
        path: '/wallet/user_help',
        query: {
          type: type
        }
      });
    }
  },
  components: {
    selectType
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #importCoin {
    .import_main {
      height: calc(100% - 74px - 1Px);
      overflow-y: auto;
      .import_nuxt {
        padding: 60px 50px 0;
      }
      .import_prompt {
        padding-left: 50px;
        padding-top: 30px;
        line-height: 40px;
        .iconfont {
          transition: all .3s;
          font-size: 25px;
          &.icon-xuanze {
            color: $mainColor;
          }
          &.icon-xuanze1 {
            color: #9297a5;
          }
        }
        .import_prompt_text {
          display: inline-block;
          vertical-align: middle;
          color: #3f4e62;
          font-size: 24px;
        }
        .import_prompt_url {
          display: inline-block;
          vertical-align: middle;
          font-size: 24px;
          color: #5460e9;
        }
      }
      .import_button {
        width: calc(100% - 100px);
        margin: 75px auto 0;
      }
      .what-faq {
        margin-top: 250px;
        margin-bottom: 40px;
      }
    }
  }
</style>
