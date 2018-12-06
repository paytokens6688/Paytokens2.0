<template>
  <div id="deleteAccount">
    <!-- 头部 -->
    <div class="delete_head">
      <button
        class="iconfont icon-fanhui"
        @click="back">
      </button>
      <h2 class="head_text">
        {{title === 'account' ? '删除账户' : '删除地址'}}
      </h2>
    </div>
    <!-- 主体 -->
    <div class="delete_con">
      <div class="con_warn">
        <div class="iconfont icon-point"></div>
        <p class="warn_title">
          注意
        </p>
        <p class="warn_assets">
          您当前{{ title === 'address' ? '地址' : '账户' }}{{ title === 'address' ? (parseFloat(assets_num) === 0 ? '资产为0' : '暂有资产') : (accountHaveMoney ? '暂有资产' : '资产为0') }}
        </p>
        <p class="warn_test">
          {{title === 'account' ? '删除账户' : '删除地址'}}前，请务必确认已备份好{{title === 'account' ? '账户助记词' : '私钥或Keystore'}}<br>若没有进行备份直接删除{{title === 'account' ? '账户' : '地址'}}，<br>将丢失您的{{title === 'account' ? '账户' : ''}}资产且无法找回。
        </p>
      </div>
      <button
        class="delete_btn"
        @click="continu">
        知道了，继续
      </button>
      <button
        class="delet_btn_white"
        @click="goBackup">
        <span class="btn_text">
          去备份
        </span>
        <span class="iconfont icon-xiangyou"></span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { setTimeout } from 'timers';
export default {
  name: 'deleteAccount',
  data () {
    return {
      // title type
      title: this.$route.query.type,
      // 资产
      assets_num: '0.00',
      // 交易密码弹框
      passShow: false,
      // pass
      password: '',
      selectAccount: '',
      publicKey: '',
      // 删除地址的index
      deleteSiteIndex: 0,
      // 删除地址的数组名字
      deleteSiteArrName: '',
      // 账户是否有余额
      accountHaveMoney: false
    };
  },
  computed: {
    ...mapState({
      accounts: state => state.storage.userInfo.accounts
    })
  },
  beforeMount () {
    this.selectAccount = this.$route.query.selectAccount;
    if (this.title === 'address') {
      this.publicKey = this.$route.query.key;
      // 如果时删除地址
      this.deleteAddressInit();
    }
    if (this.title === 'account') {
      // 删除账户
      this.deleteAccountInit();
    }
  },
  methods: {
    ...mapMutations({
      deleteSiteFunc: 'storage/deleteSite',
      deleteAccountFunc: 'storage/deleteAccount'
    }),
    // 返回上一页
    back () {
      this.$router.go(-1);
    },
    // 继续删除账户
    continu () {
      this.$global.alertOptions({
        show: true,
        message: `确定要删除该${this.title === 'account' ? '账户' : '地址'}吗？`,
        callbackList: [
          {
            title: '取消'
          },
          {
            title: '确定',
            callback: () => {
              this.confirm();
            }
          }
        ]
      });
    },
    // 确定删除
    confirm () {
      // 删除地址
      if (this.title === 'address') {
        this.deleteSiteFunc({
          accountIndex: this.selectAccount - 0,
          siteIndex: this.deleteSiteIndex,
          arrName: this.deleteSiteArrName
        });
      } else {
        // 删除账户
        this.$router.go(-1);
        setTimeout(() => {
          this.$router.go(-1);
          this.$nextTick(() => {
            this.deleteAccountFunc({
              accountIndex: this.selectAccount - 0
            });
          });
        }, 50);
      }
      this.$global.successOptions('删除成功');
    },
    // 备份账户或地址
    goBackup () {
      this.$router.go(-1);
    },
    deleteAddressInit () {
      const account = this.accounts[this.selectAccount - 0];
      account.siteOfWord.map((site, index) => {
        if (site.key === this.publicKey) {
          this.assets_num = site.userCoinsInfo[0].number;
          this.deleteSiteIndex = index;
          this.deleteSiteArrName = 'siteOfWord';
        }
      });
      account.siteOfOther.map((site, index) => {
        if (site.key === this.publicKey) {
          this.assets_num = site.userCoinsInfo[0].number;
          this.deleteSiteIndex = index;
          this.deleteSiteArrName = 'siteOfOther';
        }
      });
    },
    deleteAccountInit () {
      const account = this.accounts[this.selectAccount - 0];
      let accountMoney = 0;
      [].concat(account.siteOfWord, account.siteOfOther).map(site => {
        accountMoney += site.userCoinsInfo[0].number - 0;
      });
      this.accountHaveMoney = (accountMoney !== 0);
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #deleteAccount{
    .delete_head{
      height: 90px;
      position: fixed;
      width:100%;
      background:linear-gradient(135deg, #fe5353, #ef2b2b);
      .icon-fanhui{
        position: absolute;
        top: 0;
        left: 0;
        width: 78px;
        height: 90px;
        text-align: center;
        font-size: 34px;
        background: none;
        color: #fff;
      }
      .head_text {
        text-align: center;
        width: 100%;
        line-height: 90px;
        font-size: 32px;
        font-weight: 500;
        color:#fff;
      }
    }
    .delete_con{
      text-align:center;
      .con_warn{
        height:775px;
        width:100%;
        background:url('../../../assets/images/delete_account_bg.png');
        background-size:100% 100%;
        padding-top:130px;
        .icon-point{
          width:152px;
          height:152px;
          background-color:#fff;
          border-radius: 50%;
          margin:0 auto;
          font-size:130px;
          line-height:152px;
          text-align:center;
          color:#ee2828;
        }
      }
      .warn_title{
        font-size:40px;
        color:#fff;
        line-height:74px;
        margin-top:22px;
      }
      .warn_assets{
        color:#fff;
        font-size:30px;
        line-height:66px;
      }
      .warn_test{
        font-size:26px;
        color:#f9d9d9;
        line-height:48px;
        margin-top:30px;
      }
    }
    .delete_btn{
      width:calc(100% - 60px);
      height:88px;
      background-color:#fff;
      border-radius: 10px;
      font-size:30px;
      margin-top:50px;
      @include eleBottomShadown();
    }
    .delet_btn_white{
      background-color:#fff;
      margin-top:50px;
      padding: 10px;
      font-size:30px;
      color:#9297a5;
      .iconfont{
        color:#9297a5;
        font-size:35px;
      }
    }
  }
</style>
