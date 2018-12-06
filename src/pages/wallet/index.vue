<template>
  <div
    id="index"
    :class="{'index_show_more': pageShowMore}">
    <!-- 正常页面 -->
    <div class="index_page">
      <div
        class="index_page_shadown"
        v-if="pageShowMore"
        @click="showRightMore(false)"></div>
      <div
        class="index_page_inner"
        ref="indexPage"
        @scroll="pageScroll">
        <header class="header">
          <div
            class="top"
            :class="{'top_scrolled': indexScrolled}">
            <div
              class="top_bg"
              ref="topBg"></div>
            <p
              class="top_money"
              ref="topMoney">
              {{ userInfoMoney[userInfoMoneyType] }} {{ userInfoMoneyType }}
            </p>
            <p
              class="admin"
              @click="showRightMore()">
              <i class="iconfont icon-shenglve"></i>
              <span class="admin_text">管理</span>
            </p>
          </div>
          <div class="user_info">
            <p
              class="price"
              ref="topPrice">
              <b class="user_price">{{ userInfoMoney[userInfoMoneyType] }} {{ userInfoMoneyType }}</b>
            </p>
            <p
              class="change_price"
              ref="showPrice">
              总 资 产
              <button
                class="user_price_btn"
                @click="changeAllBalanceShow">
                {{ userInfoMoneyType === 'CNY' ? 'USD' : 'CNY' }}
              </button>
            </p>
            <button
              class="add-wallet-btn iconfont icon-tianjia2"
              @click="addWallet"></button>
          </div>
        </header>
        <main class="main">
          <div
            class="notices"
            v-if="unreadNews.show"
            @click="goNoticeDetail">
            <p
              class="ad_title_style"
              :data-time="unreadNews.time">
              {{ unreadNews.title }}
            </p>
            <p class="ad_desc">
              {{ unreadNews.desc }}
            </p>
            <button class="ad_show">
              查看详情&nbsp;&gt;&gt;
              </button>
            <button class="ad_voice iconfont icon-gonggao"></button>
          </div>
          <ul
            class="coins_list"
            :class="{'anima': unreadNews.show}">
            <li
              class="coins_li"
              v-for="(coins, index) in coinsList"
              :key="coins.id">
              <div
                class="coins_li_inner"
                :class="{'coins_li_show_btns': coins.showBtns}">
                <div class="coins_li_shows">
                  <div
                    class="coins_box"
                    v-goLeft="listGoLeft(coins, index)"
                    v-goRight="listGoRight(coins, index)"
                    @click="showMore(coins)">
                    <img
                      class="coins_icon"
                      :src="coins.icon"
                      :alt="coins.name" />
                    <div class="coins_info">
                      <p class="coins_sym" :data-zh="`/${coins.nameZh}`">
                        {{ coins.symbol }}
                      </p>
                      <p class="coins_name">{{ coins.name }}</p>
                    </div>
                    <div class="coins_money">
                      <p class="coins_number">{{ coins.number }}</p>
                      <p class="coins_price">
                        &yen;{{ coins.price.cny }}
                        /
                        ${{ coins.price.usd }}
                      </p>
                    </div>
                    <div
                      class="coins_more iconfont icon-xiala"
                      :class="{'show_more': coins.showMore}">
                    </div>
                  </div>
                  <ul
                    class="coins_accounts"
                    v-if="coins.showMore && coins.accounts && (coins.accounts.userAccounts || coins.accounts.watchAccounts)">
                    <li
                      class="coins_account"
                      v-for="accounts in coins.accounts.userAccounts"
                      :key="accounts.id"
                      @click="toSiteDetail(accounts)">
                      <p class="account_name">
                        {{ accounts.name }}：
                      </p>
                      <div class="account_money">
                        <p class="account_number">{{ accounts.number }}</p>
                        <p class="account_price">
                          &yen;{{ accounts.price.cny }}
                          /
                          ${{ accounts.price.usd }}
                        </p>
                      </div>
                    </li>
                    <li
                      class="coins_account"
                      v-for="accounts in coins.accounts.watchAccounts"
                      :key="accounts.id"
                      @click="toSiteDetail(accounts, 'observe')">
                      <p class="account_name">
                        <img
                          class="watch_icon"
                          src="../../assets/images/watch_account_icon.png">
                        {{ accounts.name }}：
                      </p>
                      <div class="account_money">
                        <p class="account_number">{{ accounts.number }}</p>
                        <p class="account_price">
                          &yen;{{ accounts.price.cny }}
                          /
                          ${{ accounts.price.usd }}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="coins_li_admin">
                  <button
                    class="coins_li_btn"
                    @click="coinToTop(coins)">置顶</button>
                  <button
                    class="coins_li_btn"
                    @click="coinDelete(coins, index)">删除</button>
                </div>
              </div>
            </li>
          </ul>
        </main>
      </div>
      <footerTmpl :index="0" />
    </div>
    <!-- 右侧弹窗 -->
    <div class="index_more">
      <div
        class="index_more_type"
        @click="toAddressManage">
        <div class="index_more_icon">
          <img
            class="index_more_img"
            src="../../assets/images/index_right_site.png">
        </div>
        <p class="index_more_name">地址管理</p>
      </div>
      <div
        class="index_more_type"
        @click="toAccountManage">
        <div class="index_more_icon">
          <img
            class="index_more_img"
            src="../../assets/images/index_right_assets.png">
          </div>
        <p class="index_more_name">账户管理</p>
      </div>
      <div
        class="index_more_type"
        @click="toNotice">
        <div class="index_more_icon">
          <img
            class="index_more_img"
            src="../../assets/images/index_right_notice.png">
          </div>
        <p class="index_more_name">系统公告</p>
      </div>
    </div>
  </div>
</template>

<script>
import footerTmpl from '@/components/fixed/footer.vue';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'index',
  data () {
    return {
      // 页面第几次初始化
      pageInitIndex: 0,
      // 页面显示更多
      pageShowMore: false,
      // 是否进行了滚动
      indexScrolled: false,
      // 账户总额
      userInfoMoney: {
        // 人民币
        CNY: '0.00',
        // 美元
        USD: '0.00'
      },
      // 未读消息
      unreadNews: {
        // 标题
        title: '',
        // 时间
        time: '',
        // 缩略信息
        desc: '',
        // 消息id
        id: '',
        // 是否显示
        show: false
      },
      // 币种列表
      coinsList: [
        // {
        //   id: 币种id,
        //   name: '币种名称',
        //   symbol: '币种符号',
        //   nameZh: '币种中文名',
        //   icon: 币种图标,
        //   number: '货币数量',
        //   price: 货币价格 {
        //     cny: '人民币',
        //     usd: '美元'
        //   },
        //   showMore: 显示更多,
        //   showBtns: 显示按钮,
        //   accounts: 账户信息 {
        //     userAccounts: 正常账户 [
        //       {
        //         id: '账户标识(币种id_账户id)',
        //         name: '账户名',
        //         number: '货币数量',
        //         price: 货币价格 {
        //           cny: '人民币',
        //           usd: '美元'
        //         }
        //       }
        //     ],
        //     watchAccounts: 观察账户 [
        //       {
        //         id: '账户标识(币种id_账户id)',
        //         name: '账户名',
        //         number: '货币数量',
        //         price: 货币价格 {
        //           cny: '人民币',
        //           usd: '美元'
        //         }
        //       }
        //     ]
        //   }
        // }
      ]
    };
  },
  computed: {
    ...mapState({
      // 总额显示方式
      userInfoMoneyType: state => state.storage.accountInfo.homeUserAllMoneyType,
      // 账户列表
      accounts: state => state.storage.userInfo.accounts,
      // 选择的第几个账户
      selectAccount: state => state.storage.userInfo.selectAccount,
      // 主流币种
      mainCoins: state => state.storage.coins.main,
      // 代币
      otherCoins: state => state.storage.coins.other,
      // 人民币转成美元价格
      cnyToUsd: state => state.storage.coins.cnyToUsd
    })
  },
  beforeMount () {
    // 是否出现引导页
    try {
      android.guidePage(); // 安卓
    } catch (error) {
      try {
        window.webkit.messageHandlers.guidePage.postMessage(null); // ios
      } catch (error) {
        // this.$global.alertOptions('');
      }
    }
    try {
      // 初始化创建账户信息
      this.initAllCreateAccountData();
      // 初始化创建账户信息
      this.initPage();
    } catch (err) {
      console.log(err);
    }
  },
  mounted () {
    // 赋值给头部显示高度
    this.showClientTop = this.$refs.showPrice.offsetTop;
    try {
      this.getNotice();
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    ...mapMutations({
      changeHomeUserAllMoneyType: 'storage/changeHomeUserAllMoneyType',
      initAllCreateAccountData: 'createAccount/initAllData',
      // 移除主链币种
      removeMainCoin: 'storage/removeMainCoin',
      // 移除主链币种
      removeFalseCoin: 'storage/removeFalseCoin',
      coinToTopFunc: 'storage/coinToTop'
    }),
    // 初始化页面
    initPage () {
      // 更改加载次数
      this.pageInitIndex++;
      // 当前账户
      let newSelectAccount = this.accounts[this.selectAccount - 0];
      this.getCoinsList(newSelectAccount);
    },
    // 获取币种列表,以及价格
    getCoinsList (newSelectAccount) {
      const wordSiteCNY = newSelectAccount.siteOfWord.map((item) => {
        return this.getSiteListFunc({
          coin: item,
          newSelectAccount
        });
      });
      const otherSiteCNY = newSelectAccount.siteOfOther.map((item) => {
        return this.getSiteListFunc({
          coin: item,
          newSelectAccount
        });
      });
      const watchSiteCNY = newSelectAccount.siteOfWatch.map((item) => {
        return this.getSiteListFunc({
          coin: item,
          isWatch: 'watch',
          newSelectAccount
        });
      });
      // 计算余额
      this.userInfoMoney.CNY = (
        this.$func.arrSum(wordSiteCNY) +
        this.$func.arrSum(otherSiteCNY) +
        this.$func.arrSum(watchSiteCNY)).toFixed(2);
      this.userInfoMoney.USD = (this.userInfoMoney.CNY / this.cnyToUsd).toFixed(2);
      // 添加没有账户但需要显示主链的币种
      newSelectAccount.showMainCoins.filter((id) => {
        let haveTheCoin = true;
        this.coinsList.map(item => {
          if (item.id === id) haveTheCoin = false;
        });
        return haveTheCoin;
      }).map((id) => {
        let coinObj = {};
        this.mainCoins.map((mainCoin) => {
          if (mainCoin.id === id) {
            // 根据id添加基础信息
            coinObj.id = mainCoin.id;
            coinObj.name = mainCoin.name;
            coinObj.symbol = mainCoin.symbol;
            coinObj.nameZh = mainCoin.nameZh;
            coinObj.icon = mainCoin.icon;
          }
        });
        coinObj.cny = 0;
        coinObj.usd = 0;
        coinObj.price = {
          cny: '0.00',
          usd: '0.00'
        };
        coinObj.showBtns = false;
        coinObj.showMore = false;
        coinObj.accounts = {
          userAccounts: [],
          watchAccounts: []
        };
        this.coinsList.push(coinObj);
      });
      // 删除有账户但不需要显示的主链币种
      this.coinsList = this.coinsList.filter((coin) => {
        // 如果是代币，直接显示
        if (coin.id.split('-').length > 1) return true;
        let haveTheCoin = false;
        newSelectAccount.showMainCoins.map((id) => {
          if (coin.id === id) haveTheCoin = true;
        });
        return haveTheCoin;
      });
      // 列表排序
      this.coinsList = this.coinsList.sort((prev, after) => {
        return (after.index || 0) - (prev.index || 0);
      });
    },
    // 获取地址列表后循环处理函数
    getSiteListFunc ({ coin, isWatch, newSelectAccount }) {
      // 所有账户余额
      let allBalanceCny = 0;
      coin.userCoinsInfo.map(coinInfo => {
        // 判断是否已经添加有该币种
        let theCoinIndex = -1; // -1代表没有，>=0代表币种index
        this.coinsList.map((item, index) => {
          if (item.id === coinInfo.id) theCoinIndex = index;
        });
        // 如果已经添加币种，找到币种对象，否则新建对象
        let coinObj = {}; // 币种对象
        if (theCoinIndex === -1) {
          coinObj = {
            accounts: {
              userAccounts: [],
              watchAccounts: []
            },
            price: {
              cny: 0,
              usd: 0
            },
            id: '',
            name: '',
            symbol: '',
            nameZh: '',
            icon: '',
            showMore: false,
            showBtns: false,
            cny: 0,
            usd: 0
          };
        } else {
          coinObj = this.coinsList[theCoinIndex];
        }
        coinObj.index = coinInfo.index;
        // 币种type切割，长度为1是主链，否则是代币
        let coinsArr = coinInfo.id.split('-');
        // 如果是第一次加载，进行数据更新，如果不是，只进行排序
        if (this.pageInitIndex === 1) {
          // 主流币种添加
          if (coinsArr.length === 1) {
            this.mainCoins.map((mainCoin) => {
              // 该币种总价格
              const coinPrice = {
                cny: 0,
                usd: 0
              };
              if (mainCoin.id === coinInfo.id) {
                // 根据id添加基础信息
                coinObj.id = mainCoin.id;
                coinObj.name = mainCoin.name;
                coinObj.symbol = mainCoin.symbol;
                coinObj.nameZh = mainCoin.nameZh;
                coinObj.icon = mainCoin.icon;
                // 币种账户信息
                const accountCoinInfo = {
                  id: `${mainCoin.id}_${coin.key}`,
                  name: coin.siteName,
                  number: coinInfo.number,
                  price: {
                    cny: (coinInfo.number * mainCoin.price.cny).toFixed(2),
                    usd: (coinInfo.number * mainCoin.price.usd).toFixed(2)
                  }
                };
                if (isWatch) {
                  // 是观察账户
                  coinObj.accounts.watchAccounts.push(accountCoinInfo);
                } else {
                  // 不是观察账户
                  coinObj.accounts.userAccounts.push(accountCoinInfo);
                  coinPrice.cny += coinInfo.number * mainCoin.price.cny;
                  coinPrice.usd += coinInfo.number * mainCoin.price.usd;
                  allBalanceCny += coinInfo.number * mainCoin.price.cny;
                }
                coinPrice.cny = coinPrice.cny.toFixed(2);
                coinPrice.usd = coinPrice.usd.toFixed(2);
                coinObj.price = coinPrice;
              }
            });
          } else if (coinsArr.length === 2 && coinsArr[0] === '2') {
            // ETH代币添加
            this.otherCoins['ETH'].map((mainCoin) => {
              // 该币种总价格
              const coinPrice = {
                cny: 0,
                usd: 0
              };
              if (mainCoin.id === coinInfo.id) {
                // 根据id添加基础信息
                coinObj.id = mainCoin.id;
                coinObj.name = mainCoin.name;
                coinObj.symbol = mainCoin.symbol;
                coinObj.nameZh = mainCoin.nameZh;
                coinObj.icon = mainCoin.icon;
                // 币种账户信息
                const accountCoinInfo = {
                  id: `${mainCoin.id}_${coin.key}`,
                  name: coin.siteName,
                  number: coinInfo.number,
                  price: {
                    cny: (coinInfo.number * mainCoin.price.cny).toFixed(2),
                    usd: (coinInfo.number * mainCoin.price.usd).toFixed(2)
                  }
                };
                if (isWatch) {
                  // 是观察账户
                  coinObj.accounts.watchAccounts.push(accountCoinInfo);
                } else {
                  // 不是观察账户
                  coinObj.accounts.userAccounts.push(accountCoinInfo);
                  coinPrice.cny += coinInfo.number * mainCoin.price.cny;
                  coinPrice.usd += coinInfo.number * mainCoin.price.usd;
                  allBalanceCny += coinInfo.number * mainCoin.price.cny;
                }
                coinPrice.cny = coinPrice.cny.toFixed(2);
                coinPrice.usd = coinPrice.usd.toFixed(2);
                coinObj.price = coinPrice;
              }
            });
          }
        }
        if (theCoinIndex === -1) this.coinsList.push(coinObj);
      });
      return allBalanceCny;
    },
    // 页面管理更多
    showRightMore (type = !this.pageShowMore) {
      this.pageShowMore = type;
    },
    // 进入地址管理
    toAddressManage () {
      this.$router.push({
        path: '/wallet/account/address_manage',
        query: {
          selectAccount: this.selectAccount
        }
      });
    },
    // 进入账户管理
    toAccountManage () {
      this.$router.push({ path: '/wallet/account/account_manage' });
    },
    // 获取公告数据
    getNotice () {
      this.$axios.get('/v1/api/article/new_notice')
        .then(({ data }) => {
          if (data.status === 200) {
            this.unreadNews.title = data.data.article.title;
            this.unreadNews.time = this.$func.setTimeToPersonRead(data.data.article.create_time);
            this.unreadNews.desc = data.data.article.description;
            this.unreadNews.id = data.data.article.id;
            this.unreadNews.show = data.data.display;
          }
        });
    },
    // 进入公告
    toNotice () {
      this.$router.push({ path: '/notice/notice_list' });
    },
    // 查看公告详情
    goNoticeDetail () {
      this.$router.push({
        path: '/notice/notice_detail',
        query: {
          id: this.unreadNews.id
        }
      });
    },
    // 页面币种滚动事件
    pageScroll (event) {
      if (this.showClientTop - event.target.scrollTop >= 0) {
        // 控制透明度
        let scrollProportion = (this.showClientTop - event.target.scrollTop) / this.showClientTop;
        this.$refs.topBg.style.opacity = 1 - scrollProportion.toFixed(1);
        this.$refs.topMoney.style.opacity = 1 - scrollProportion.toFixed(1) - 0.5;
        this.$refs.topPrice.style.transform = `scale(${0.52 + (scrollProportion * 0.48)})`;
      } else {
        this.$refs.topBg.style.opacity = 1;
        this.$refs.topMoney.style.opacity = 1;
      }
    },
    // 添加资产列表
    addWallet () {
      this.$router.push('/wallet/coins_search');
    },
    // 更改总资产显示
    changeAllBalanceShow () {
      this.changeHomeUserAllMoneyType();
    },
    // 币种显示更多
    showMore (coins) {
      // 判断是否有更多账户
      if (coins.accounts && (coins.accounts.userAccounts.length || coins.accounts.watchAccounts.length)) {
        coins.showMore = !coins.showMore;
      } else {
        this.alertNoSite(coins);
      }
    },
    // 列表左滑事件
    listGoLeft (coins, index) {
      return () => {
        coins.showMore = false;
        coins.showBtns = true;
      };
    },
    // 列表右滑事件
    listGoRight (coins, index) {
      return () => {
        coins.showBtns = false;
      };
    },
    // 进入账户详情事件
    toSiteDetail (account, isWatch) {
      const selectType = account.id.split('_');
      this.$router.push({
        path: '/wallet/site_detail',
        query: {
          // 是否是观察账户
          isWatch: isWatch,
          // 币种地址
          key: selectType[1],
          // 币种ß
          coinType: selectType[0]
        }
      });
    },
    // 弹窗显示导入或创建地址
    alertNoSite (coin) { // 传入type值是币种name
      // 创建变量判断是否是EOS
      const coinId = coin.id.split('-')[0];
      const isEOS = (coin.name === 'EOSIO');
      return this.$global.alertOptions({
        message: `您的${coin.symbol}还没有钱包地址，您可以选择${isEOS ? '' : '创建或'}导入地址。`,
        noClose: coin.name !== 'EOSIO',
        callbackList: [
          {
            title: isEOS ? '取消' : '导入',
            callback: () => {
              if (!isEOS) {
                return this.$router.push({
                  path: '/wallet/index_import_coin/private_key',
                  query: {
                    id: coinId,
                    selectAccount: this.selectAccount
                  }
                });
              }
            }
          },
          {
            title: isEOS ? '导入' : '创建',
            callback: () => {
              if (isEOS) {
                return this.$router.push({
                  path: '/wallet/index_import_coin/private_key',
                  query: {
                    id: coinId,
                    selectAccount: this.selectAccount
                  }
                });
              } else {
                return this.$router.push({
                  path: '/wallet/index_create_coin',
                  query: {
                    id: coinId,
                    selectAccount: this.selectAccount
                  }
                });
              }
            }
          }
        ]
      });
    },
    // 置顶
    coinToTop (coin) {
      // 如果没有账户
      if (!(coin.accounts.userAccounts.length || coin.accounts.watchAccounts.length)) {
        return this.$global.alertOptions('请先添加该币种账户，才能进行币种置顶操作');
      }
      coin.showBtns = false;
      this.coinToTopFunc(coin.id);
      this.initPage();
    },
    coinDelete (coin, index) {
      this.$global.alertOptions({
        message: '是否从首页移除该币种？',
        callbackList: [
          {
            title: '取消'
          },
          {
            title: '确定',
            callback: () => {
              this.deleteTheCoin(coin, index);
            }
          }
        ]
      });
    },
    // 移除币种
    deleteTheCoin (coin, index) {
      if (coin.id.split('-').length === 1) {
        // 主链
        this.removeMainCoin(coin.id);
      } else {
        // 代币
        this.removeFalseCoin(coin.id);
      }
      this.coinsList.splice(index, 1);
      this.initPage();
    }
  },
  components: {
    footerTmpl
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #index {
    height: 100%;
    width: 150%;
    position: absolute;
    top: 0;
    left: 0;
    transition: left .1s;
    &.index_show_more {
      left: -50%;
    }
    .index_page {
      height: 100%;
      width: 66.68%;
      overflow: hidden;
      transform: translate(0px, 0px);
      float: left;
      box-sizing: border-box;
      padding-bottom: 98px;
      .index_page_shadown {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 6;
        background: rgba(0, 0, 0, 0.3);
      }
      .index_page_inner {
        height: 100%;
        overflow-y: auto;
      }
      .header {
        height: 400px;
        color: #fff;
        background: url('../../assets/images/wallet_top_bg.jpg');
        padding: 0 30px;
        padding-top: 90px;
        box-sizing: border-box;
        .top {
          height: 90px;
          line-height: 90px;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          box-sizing: border-box;
          padding: 0 30px;
          overflow: hidden;
          z-index: 5;
          .top_bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: url('../../assets/images/wallet_top_bg.jpg');
            opacity: 0;
          }
          .top_money {
            float: left;
            font-size: 32px;
            padding-top: 5px;
            opacity: 0;
          }
          .admin {
            float: right;
            .icon-shenglve {
              display: inline-block;
              width: 50px;
              text-align: center;
              font-size: 44px;
              vertical-align: middle;
            }
            .admin_text {
              display: inline-block;
              vertical-align: middle;
              font-size: 26px;
            }
          }
        }
        .user_info {
          padding-top: 30px;
          position: relative;
          .price {
            font-size: 60px;
            line-height: 66px;
            transform-origin: center left;
          }
          .change_price {
            padding-top: 30px;
            color: #b7bac3;
            font-size: 24px;
            line-height: 40px;
            .user_price_btn {
              box-sizing: border-box;
              margin-left: 30px;
              height: 40px;
              padding: 0 20px;
              background: none;
              color: #5e6476;
              border: 1Px solid #5e6476;
              border-radius: 10px;
            }
          }
          .add-wallet-btn {
            position: absolute;
            width: 68px;
            height: 68px;
            top: 33px;
            right: 3px;
            color: #fff;
            border: 2Px solid #fff;
            border-radius: 10px;
            font-size: 32px;
            background: rgba(255, 255, 255, 0.2);
          }
        }
      }
      .main {
        padding-right: 30px;
        margin-top: -100px;
        padding-left: 30px;
        .notices {
          background: #fff;
          margin-bottom: 30px;
          border-radius: 10px;
          padding: 20px 25px;
          box-shadow: 0 0 20px 0 rgba(27, 55, 173, 0.1);
          overflow: hidden;
          position: relative;
          animation: myShow 0.5s ;
          @keyframes myShow {
            0% {
              opacity:0;
              transform: scale(0.8);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              opacity:1;
              transform: scale(1);
            }
          }
          .ad_title_style {
            line-height: 56px;
            color: $gray;
            font-size: 24px;
            &:after {
              content: attr(data-time);
              color: #b7bac3;
              padding-left: 20px;
            }
          }
          .ad_desc {
            line-height: 44px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #5e6476;
            font-size: 26px;
          }
          .ad_show {
            display: block;
            color: $mainColor;
            background: none;
            font-size: 24px;
            margin-top: 15px;
            height: 46px;
          }
          .ad_voice {
            position: absolute;
            top: 0;
            right: 0px;
            width: 0;
            height: 0;
            background: none;
            border: 95px solid $mainColor;
            border-top-width: 0px;
            border-top-color: transparent;
            border-left-color: transparent;
            border-bottom-color: transparent;
            z-index: 2;
            &:before {
              position: absolute;
              top: 0;
              right: -95px;
              width: 50px;
              height: 95px;
              line-height: 70px;
              font-size: 30px;
              color: #fff;
              text-align: center;
              font-weight: 700;
            }
          }
        }
        .coins_list {
          position: relative;
          z-index: 2;
          &.anima{
            animation: mymove 0.5s;
            @keyframes mymove {
              0% {
                padding-top:0px;
              }
              50% {
                padding-top:30px;
              }
              100% {
                padding-top:0px;
              }
            }
          }
          .coins_li {
            background: #fff;
            border-radius: 10px;
            margin-bottom: 30px;
            box-sizing: border-box;
            width: 100%;
            overflow: hidden;
            box-shadow: 0 0 20px 0 rgba(27, 55, 173, 0.1);
            .coins_li_inner {
              width: 142%;
              transition: margin .3s;
              &.coins_li_show_btns {
                margin-left: -42%;
              }
              &:after {
                content: '';
                display: block;
                clear: both;
              }
              .coins_li_shows {
                width: 71%;
                float: left;
                .coins_box {
                  padding: 25px;
                  position: relative;
                  &:after {
                    content: '';
                    display: block;
                    clear: both;
                  }
                  .coins_icon {
                    width: 60px;
                    height: 60px;
                    margin:11px 0;
                    float: left;
                  }
                  .coins_info {
                    float: left;
                    padding-left: 24px;
                    width: calc(50% - 82px);
                    box-sizing: border-box;
                    word-wrap: break-word;
                    .coins_sym {
                      line-height: 44px;
                      font-size: 34px;
                      font-weight: 600;
                      &:after {
                        content: attr(data-zh);
                        color: $gray;
                        font-size: 22px;
                        font-weight: 500;
                      }
                    }
                    .coins_name {
                      line-height: 36px;
                      font-size: 26px;
                      color: $gray;
                    }
                  }
                  .coins_money {
                    float: left;
                    width: 50%;
                    text-align: right;
                    padding-right: 50px;
                    box-sizing: border-box;
                    .coins_number {
                      font-size: 34px;
                      line-height: 44px;
                      font-weight: 600;
                    }
                    .coins_price {
                      color: $gray;
                      font-size: 26px;
                      line-height: 36px;
                    }
                  }
                  .coins_more {
                    position: absolute;
                    top: 0;
                    right: 24px;
                    height: 100%;
                    line-height: #{80px + 24px * 2};
                    background: none;
                    width: 34px;
                    font-size: 22px;
                    color: $gray;
                    transform: rotate(-180deg) scale(.555);
                    transform-origin: center 45%;
                    &.show_more {
                      transform: rotate(0deg) scale(.555);
                    }
                  }
                }
                .coins_accounts {
                  .coins_account {
                    border-top: 1Px solid $listBottomGray;
                    padding: 25px;
                    &:after {
                      content: '';
                      display: block;
                      clear: both;
                    }
                    .account_name {
                      width: 50%;
                      float: left;
                      line-height: 62px;
                      .watch_icon {
                        width: 30px;
                        height: 20px;
                        display: inline-block;
                        vertical-align: middle;
                        margin-right:3px;
                      }
                    }
                    .account_money {
                      text-align: right;
                      float: right;
                      width: 50%;
                      box-sizing: border-box;
                      padding-right: 50px;
                      .account_number {
                        color: $mainColor;
                        font-size: 30px;
                        line-height: 44px;
                      }
                      .account_price {
                        color: $gray;
                        font-size: 26px;
                        line-height: 36px;
                      }
                    }
                  }
                }
              }
              .coins_li_admin {
                width: 29%;
                float: left;
                .coins_li_btn {
                  float: left;
                  width: 50%;
                  height: 130px;
                  color: #fff;
                  font-size: 28px;
                  &:nth-child(1) {
                    background: $mainColor;
                  }
                  &:nth-child(2) {
                    background: #f75434;
                  }
                }
              }
            }
          }
        }
      }
    }
    .index_more {
      width: 33.32%;
      height: 100%;
      float: left;
      background-image: url('../../assets/images/index_more_bg.jpg');
      background-size: 100% 100%;
      background-position: -1Px -1Px;
      padding-top: 118px;
      box-sizing: border-box;
      text-align: center;
      color: #fff;
      .index_more_type {
        padding-bottom: 50px;
        .index_more_icon {
          height: 134px;
          .index_more_img {
            width: 94px;
            display: block;
            margin: 20px auto;
          }
        }
        .index_more_name {
          line-height: 50px;
        }
      }
    }
  }
</style>
