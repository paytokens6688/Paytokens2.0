<template>
  <div id="rollSelectAccount">
    <div class="no_back">
    </div>
    <div class="account_lists">
      <div
        class="account_list"
        :class="{'default': item.isDefault}"
        v-for="(item, index) in accounts"
        :key="index"
        @click="selectAccount(item, index)">
        <div class="list_info">
          <span class="iconfont icon-zhanghu"></span>
          <span class="info_name">
            {{item.name}}
          </span>
        </div>
        <div
          class="list_default"
          v-if="item.isDefault">
          <span class="iconfont icon-xuanze"></span>
          <span class="default_text">
            默认账户
          </span>
        </div>
      </div>
      <div
        class="ai_account"
        @click="selectEarnAccount"
        v-show="type === 'into'">
        <div class="account_img">
          <img
            src="../../assets/images/icon_ai.png"
            alt="">
        </div>
        <span class="account_name">
          收益账户
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'rollSelectAccount',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // type
      type: this.$route.query.type,
      // 账户列表
      accounts: [
        // {
        //   name: 'Paytokens-2',
        //   isDefault: true,
        //   id: 1
        // }
      ],
      // 选择的账户
      selectAccountIndex: 0
    };
  },
  computed: {
    ...mapState({
      // 账户列表
      accountsList: state => state.storage.userInfo.accounts,
      // 默认选择账户
      defaultSelectAccount: state => state.storage.userInfo.selectAccount,
      // 上一个页面
      prvpPage: state => state.storage.app.fromRoute
    })
  },
  beforeMount () {
    // 头部
    let title = '';
    if (this.type === 'into') {
      title = '转入';
    } else {
      title = '转出';
    }
    this.pageTitle({ title: title, shadown: true });
    this.initPage();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 初始化页面
    initPage () {
      this.selectAccountIndex = this.$route.query.selectAccount || this.defaultSelectAccount;
      let coinType = '';
      if (this.$route.query.coin === 'BTC') {
        coinType = '1';
      } else {
        coinType = '2';
      }
      this.accounts = this.accountsList.map((item, index) => {
        return {
          name: item.accountName,
          isDefault: this.selectAccountIndex - 0 === index,
          isShow: (() => {
            let isType = false;
            item.siteOfOther.concat(item.siteOfWord).map((item1, index1) => {
              if (item1.type === coinType) {
                isType = true;
              }
            });
            return isType;
          })(),
          id: index
        };
      }).sort((prvp, after) => {
        return after.isDefault - prvp.isDefault;
      });
    },
    // 选择账户
    selectAccount (item, index) {
      if (!item.isShow) return this.$global.alertOptions(`当前账户没有${this.$route.query.coin}币种，请选择其他账户`);
      const prevPage = this.prvpPage.replace('&into=ai', '');
      if (prevPage.match('selectAccountIndex')) {
        this.$router.replace(prevPage.replace(/selectAccountIndex=(\d+)/, 'selectAccountIndex=' + item.id));
      } else {
        this.$router.replace(prevPage + '&selectAccountIndex=' + item.id);
      }
    },
    // 选择收益账户
    selectEarnAccount () {
      if (this.prvpPage.match('into=ai')) {
        this.$router.replace(this.prvpPage);
      } else {
        this.$router.replace(this.prvpPage + '&into=ai');
      }
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #rollSelectAccount{
    .no_back {
      position: fixed;
      top: 0;
      left: 0;
      width: 90px;
      height: 90px;
      z-index: 10;
      background: #fff;
    }
    .account_lists{
      padding:40px 40px 0;
      .account_list{
        height:160px;
        border-radius: 10px;
        margin-bottom:30px;
        display:flex;
        align-items: center;
        justify-content: space-between;
        padding:0 60px 0 40px;
        background:url('../../assets/images/account_bg.jpg');
        background-size:100% 100%;
        @include eleBottomShadown();
        &.default{
          background-image: url('../../assets/images/account_defalut_bg.jpg');
          .list_info{
            .iconfont{
              background-color:#4c6bfa;
              color:#cad3fe;
            }
            .info_name{
              color:#fff;
            }
          }
        }
        .list_info{
          display:flex;
          align-items: center;
          .iconfont{
            width:60px;
            height:60px;
            display:inline-block;
            line-height:60px;
            text-align:center;
            background-color:#f0f2ff;
            font-size:35px;
            color:#acb2d0;
            border-radius: 50%;
            margin-right:30px;
          }
          .info_name{
            font-size:30px;
          }
        }
        .list_default{
          .iconfont{
            color:#fff;
          }
          .default_text{
            font-size:24px;
            color:#a4b4ff;
          }
        }
      }
      .ai_account{
        height:160px;
        @include eleBottomShadown();
        border-radius: 10px;
        display:flex;
        align-items: center;
        padding-left:40px;
        .account_img{
          width:60px;
          height:60px;
          border-radius: 50%;
          margin-right:30px;
          img{
            width:100%;
            height:100%;
          }
        }
        .account_name{
          font-size:30px;
        }
      }
    }
  }
</style>
