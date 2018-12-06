<template>
  <div id="selectAccount">
    <div class="title">
      <img
        class="title_icon"
        :src="coinInfo.icon">
      <span class="title_name">所有地址总览</span>
    </div>
    <ul class="accounts">
      <li
        class="account_li"
        v-for="item in coinInfo.accounts.userAccounts"
        :key="item.id"
        @click="goInner(item)">
        <div class="account_icon iconfont icon-dizhi1"></div>
        <div class="account_info">
          <p class="acccount_name">
            {{ item.name }}
            <span class="account_money">{{ item.number }} {{ coinInfo.symbol }}</span>
          </p>
          <p class="account_site">{{ item.site }}</p>
        </div>
      </li>
      <li
        class="account_li"
        v-for="item in coinInfo.accounts.watchAccounts"
        :key="item.id"
        @click="goInner(item)">
        <div class="account_icon account_icon_watch"></div>
        <div class="account_info">
          <p class="acccount_name">
            {{ item.name }}
            <span class="account_money">{{ item.number }} {{ coinInfo.symbol }}</span>
          </p>
          <p class="account_site">{{ item.site }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { setTimeout } from 'timers';
export default {
  name: 'selectAccount',
  layout: 'back_page',
  data () {
    return {
      // 币种信息
      coinInfo: {
        // 符号
        symbol: '',
        // 图标
        icon: '',
        // 地址信息
        accounts: {
          // 正常地址
          userAccounts: [
            // {
            //   id: '地址标识(币种id_地址address)',
            //   name: '地址名',
            //   number: '货币数量',
            //   site: '地址地址'
            // }
          ],
          // 观察地址
          watchAccounts: []
        }
      }
    };
  },
  computed: {
    ...mapState({
      coins: state => state.storage.coins,
      accounts: state => state.storage.userInfo.accounts,
      upPage: state => state.storage.app.fromRoute
    })
  },
  mounted () {
    if (!this.$route.query.coinType) return this.$router.go(-1);
    this.getCoinInfo();
    this.getSiteInfo();
    this.pageTitle({
      title: `我的${this.coinInfo.symbol}钱包`,
      shadown: true
    });
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 获取币种信息
    getCoinInfo () {
      // 币种ID
      const coinType = this.$route.query.coinType.split('-');
      if (coinType.length === 1) {
        // 如果是主链
        this.coins.main.map((coin) => {
          if (coin.id === this.$route.query.coinType) {
            this.coinInfo.symbol = coin.symbol;
            this.coinInfo.icon = coin.icon;
          }
        });
      } else {
        // 代币
        this.coins.other.ETH.map((coin) => {
          if (coin.id === this.$route.query.coinType) {
            this.coinInfo.symbol = coin.symbol;
            this.coinInfo.icon = coin.icon;
          }
        });
      }
    },
    // 获取地址信息
    getSiteInfo () {
      // 非观察地址
      [].concat(this.accounts[this.$route.query.selectAccount - 0].siteOfOther,
        this.accounts[this.$route.query.selectAccount - 0].siteOfWord).map(site => {
        site.userCoinsInfo.map(coin => {
          if (coin.id === this.$route.query.coinType) {
            // 如果是币种ID
            this.coinInfo.accounts.userAccounts.push({
              id: `${this.$route.query.coinType}_${site.key}`,
              name: site.siteName,
              number: coin.number,
              site: site.key
            });
          }
        });
      });
      // 观察地址
      this.accounts[this.$route.query.selectAccount - 0].siteOfWatch.map(site => {
        site.userCoinsInfo.map(coin => {
          if (coin.id === this.$route.query.coinType) {
            // 如果是币种ID
            this.coinInfo.accounts.watchAccounts.push({
              id: `${this.$route.query.coinType}_${site.key}`,
              name: site.siteName,
              number: coin.number,
              site: site.key
            });
          }
        });
      });
    },
    // 选择之后返回上一个页面
    goInner (site) {
      this.$router.go(-1);
      // 传入当前upPage，锁定
      setTimeout((upPage) => {
        this.$router.replace(upPage.replace(/key=(.*?)&/, `key=${site.site}&`));
      }, 200, this.upPage);
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #selectAccount {
    padding-left: 30px;
    .title {
      height: 104px;
      line-height: 104px;
      border-bottom: 1Px solid #eaecf1;
      .title_icon {
        width: 44px;
        height: 44px;
        vertical-align: middle;
      }
      .title_name {
        display: inline-block;
        vertical-align: middle;
        font-size: 28px;
        font-weight: 900;
        padding-left: 10px;
      }
    }
    .accounts {
      .account_li {
        padding: 25px 30px 20px 0;
        border-bottom: 1Px solid #eaecf1;
        overflow: hidden;
        .account_icon {
          float: left;
          width: 44px;
          height: 44px;
          background: #eaecf1;
          color: $gray;
          border-radius: 50%;
          text-align: center;
          line-height: 44px;
          font-size: 26px;
          margin-top: 10px;
          &.account_icon_watch {
            background-image: url('../../assets/images/watch_account_icon.png');
            background-size: 30px 20px;
            background-repeat: no-repeat;
            background-position: center center;
          }
        }
        .account_info {
          float: left;
          padding-left: 20px;
          width: calc(100% - 44px);
          box-sizing: border-box;
          .acccount_name {
            line-height: 40px;
            font-size: 28px;
            .account_money {
              float: right;
              font-size: 30px;
              font-weight: 900;
            }
          }
          .account_site {
            color: $gray;
            font-size: 26px;
            line-height: 40px;
            word-break: break-word;
          }
        }
      }
    }
  }
</style>
