<template>
  <div id="coinsSearch">
    <header class="head">
      <button
        class="head_back iconfont icon-fanhui"
        @click="callBack"></button>
      <label
        class="search_label"
        for="searchInput">
        <i class="search_icon iconfont icon-sousuo"></i>
        <input
          class="search_input"
          id="searchInput"
          placeholder="请输入币种名称搜索"
          type="text"
          :value="inputValue"
          @input="searchCoinsNameFunc">
      </label>
      <button
        class="head_none"
        @click="callBack">
        取消
      </button>
    </header>
    <more-list-box
      class="main"
      :scrollBack="scrollFunc"
      :listArr="showCoinsList">
      <transition-group
        name="flip-list"
        class="main_ul"
        tag="ul">
        <li
          class="main_coins"
          v-for="(item, index) in showCoinsList"
          :key="item.id">
          <img
            class="coins_icon"
            :src="item.icon"
            :alt="item.name">
          <div class="icons_info">
            <p
              class="icons_sym"
              :data-zh="`/${item.nameZh}`">
              {{ item.symbol }}
            </p>
            <p class="icons_name">{{ item.name }}</p>
          </div>
          <button
            class="icons_btn"
            :class="{'icons_btn_added': !item.select}"
            @click="coinSelect(item, index)">
            {{ item.select ? '移除' : '添加' }}
          </button>
        </li>
      </transition-group>
    </more-list-box>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import moreListBox from '@/components/list/more_list_box.vue';
export default {
  name: 'coinsSearch',
  data () {
    return {
      // 是否有eth地址
      isHaveEthSite: false,
      // 分页page
      page: 1,
      // 每页几个
      pageList: 30,
      // 搜索内容
      inputValue: '',
      // 头部列表
      navList: [
        {
          // id
          id: 0,
          // 名字
          name: '已添加'
        },
        {
          id: 1,
          name: '全部'
        },
        {
          id: 2,
          name: '热搜'
        },
        {
          id: 3,
          name: '市值排名'
        },
        {
          id: 4,
          name: 'BTC家族'
        },
        {
          id: 5,
          name: 'ETH家族'
        }
      ],
      // 头部列表选择的第几个
      navSelected: 0,
      // 代币内容显示列表
      mainList: [
        // {
        //   // 币种id
        //   id: 1,
        //   // 币种名称
        //   name: 'Bitcoin',
        //   // 币种符号
        //   symbol: 'BTC',
        //   // 币种中文名
        //   nameZh: '比特币',
        //   // 币种图标
        //   icon: require('@/assets/images/coins_icon/btc.png'),
        //   // 是否已经添加
        //   select: false,
        //   address: 合约地址,
        //   dec: 保留小数点后几位
        // },
      ],
      // 所有代币币种列表
      allCoinList: [],
      // 主流币种列表
      showMainCoinsList: [],
      // 搜索名字
      searchCoinsName: '',
      // 可更改显示列表
      showCoinsList: []
    };
  },
  computed: {
    ...mapState(
      {
        // 主流币种
        mainCoinsList: state => state.storage.coins.main,
        // 已添加ETH代币币种列表
        isAddEthCoinsList: state => state.storage.coins.other.ETH,
        // 账户列表
        accountList: state => state.storage.userInfo.accounts,
        // 已选择账户
        selectAccount: state => state.storage.userInfo.selectAccount
      }
    ),
    // 已选择的主流币种列表
    showMainCoin () {
      return this.accountList[this.selectAccount - 0].showMainCoins;
    },
    // 已选择的ETH代币种列表
    showEthFalseCoin () {
      const account = this.accountList[this.selectAccount - 0];
      let newArr = [];
      [].concat(account.siteOfOther, account.siteOfWatch, account.siteOfWord).map(item => {
        return (newArr = newArr.concat(item.userCoinsInfo));
      });
      return newArr;
    },
    // 显示的币种列表
    showListCoinsList () {
      return [].concat(
        this.showMainCoinsList,
        this.isAddEthCoinsList.filter((item) => {
          let chooseEth = false;
          this.showEthFalseCoin.map(ethFalse => {
            if (item.id === ethFalse.id) chooseEth = true;
          });
          return chooseEth;
        }).map(item => ({ ...item, select: true })),
        this.mainList
      ).filter((item) => {
        return (Boolean(item.symbol.toLocaleLowerCase().match(this.inputValue.toLocaleLowerCase()) ||
          item.name.toLocaleLowerCase().match(this.inputValue.toLocaleLowerCase()) ||
          item.nameZh.toLocaleLowerCase().match(this.inputValue.toLocaleLowerCase())));
      }).sort((prev, after) => {
        return (after.select - prev.select);
      });
    }
  },
  watch: {
    'searchCoinsName' (to) {
      this.inputValue = to;
      this.page = 1;
      // 主流币种初始化
      this.getMainCoinList();
      // 获取代币
      this.showCoinListToPage();
    },
    'showListCoinsList' (to) {
      this.showCoinsList = to;
    }
  },
  beforeMount () {
    // 判断是否有eth地址，没有的话无法添加代币
    this.haveEthSite();
    // 主流币种初始化
    this.getMainCoinList();
    // 获取代币
    this.getTokensList();
  },
  methods: {
    ...mapActions({
      saveUserInfo: 'storage/saveUserInfo',
      getUserInfo: 'storage/getUserInfo'
    }),
    ...mapMutations({
      // 添加代币
      addFalseCoin: 'storage/addFalseCoin',
      // 移除主链币种
      removeFalseCoin: 'storage/removeFalseCoin',
      // 添加主链币种
      addMainCoin: 'storage/addMainCoin',
      // 移除主链币种
      removeMainCoin: 'storage/removeMainCoin'
    }),
    // 判断是否有eth地址，没有的话无法添加代币
    haveEthSite () {
      const account = this.accountList[this.selectAccount - 0];
      [].concat(account.siteOfOther, account.siteOfWatch, account.siteOfWord).map((site) => {
        // 如果等于2，说明有eth账户
        if (site.type === '2') this.isHaveEthSite = true;
      });
    },
    // 获取主流币种列表
    getMainCoinList () {
      this.showMainCoinsList = [];
      this.mainCoinsList.map(coin => {
        this.showMainCoinsList.push({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          nameZh: coin.nameZh,
          icon: coin.icon,
          select: (() => {
            let haveTheCoin = false;
            this.showMainCoin.map(item => {
              if (item === coin.id) haveTheCoin = true;
            });
            return haveTheCoin;
          })()
        });
      });
      this.showMainCoinsList = this.showMainCoinsList.filter((item) => {
        return (Boolean(item.symbol.toLocaleLowerCase().match(this.inputValue.toLocaleLowerCase()) ||
          item.name.toLocaleLowerCase().match(this.inputValue.toLocaleLowerCase()) ||
          item.nameZh.toLocaleLowerCase().match(this.inputValue.toLocaleLowerCase())));
      });
    },
    // 获取代币列表
    getTokensList () {
      this.getUserInfo('tokenInfo').then((data) => {
        if (data) {
          this.allCoinList = data;
          this.showCoinListToPage();
        }
        return this.$axios.get('/v1/api/coin/eth_token');
      }).then(({ data }) => {
        if (data.data.length) {
          this.allCoinList = data.data;
          this.saveUserInfo({
            type: 'tokenInfo',
            data: data.data
          });
          const mainListLength = this.mainList.length;
          this.mainList = [];
          this.$nextTick(() => {
            this.mainList = this.fomatArr(this.allCoinList.slice(0, mainListLength));
          });
        }
      });
    },
    // 渲染代币列表
    showCoinListToPage () {
      this.mainList = [];
      this.mainList = this.fomatArr(this.allCoinList.slice((this.page - 1) * this.pageList, this.page * this.pageList)).filter((item) => {
        return (Boolean(item.symbol.toLocaleLowerCase().match(this.inputValue.toLocaleLowerCase()) ||
          item.name.toLocaleLowerCase().match(this.inputValue.toLocaleLowerCase()) ||
          item.nameZh.toLocaleLowerCase().match(this.inputValue.toLocaleLowerCase())));
      });
    },
    // 滚动事件
    scrollFunc () {
      if (++this.page > (this.allCoinList / this.pageList) + 10) return false;
      this.mainList = this.mainList.concat(
        this.fomatArr(this.allCoinList.slice((this.page - 1) * this.pageList,
          this.page * this.pageList))
      ).filter((item) => {
        return (Boolean(item.symbol.toLocaleLowerCase().match(this.inputValue.toLocaleLowerCase()) ||
          item.name.toLocaleLowerCase().match(this.inputValue.toLocaleLowerCase()) ||
          item.nameZh.toLocaleLowerCase().match(this.inputValue.toLocaleLowerCase())));
      });
    },
    // 格式化后台传入未添加代币数组
    fomatArr (arr) {
      const newArr = arr.filter(item => {
        return !this.coinListIsAdd('2-' + item.id);
      });
      return newArr.map((item, index) => {
        const coinIndex = this.mainList.length + index;
        const coinObj = {
          id: '2-' + item.id,
          name: item.symbol,
          symbol: item.name,
          nameZh: item.name_cn,
          icon: item.image,
          select: false,
          address: item.address,
          dec: item.decimals,
          // 获取index
          index: coinIndex
        };
        return coinObj;
      });
    },
    // 返回上一级
    callBack () {
      this.$router.go(-1);
    },
    // 头部切换
    navSelect (index) {
      this.navSelected = index;
    },
    // 搜索框监听
    searchCoinsNameFunc ($event) {
      this.searchCoinsName = $event.target.value;
    },
    // 判断代币是否已经添加
    coinListIsAdd (id) {
      let isAdd = false;
      this.showEthFalseCoin.map(coin => {
        if (coin.id === id) isAdd = true;
      });
      return isAdd;
    },
    // 选择添加或移除币种
    coinSelect (coin, index) {
      // 判断是不是代币
      const isFalseCoin = coin.id.split('-').length === 2;
      // 判断是移除还是添加
      if (coin.select) { // 如果是移除
        this.$global.alertOptions({
          message: `是否从列表中移除该币种?`,
          callbackList: [
            {
              title: '取消移除'
            },
            {
              title: '确认移除',
              callback: () => {
                if (isFalseCoin) { // 如果是代币
                  coin.select = false;
                  this.removeFalseCoin(coin.id);
                  this.mainList.push(coin);
                } else {
                  coin.select = false;
                  this.removeMainCoin(coin.id);
                }
              }
            }
          ]
        });
      } else { // 如果是添加
        if (isFalseCoin) { // 如果是代币
          // 如果没有eth地址
          if (!this.isHaveEthSite) return this.$global.alertOptions('添加ETH地址之后才可以添加ETH代币');
          this.mainList.map((item, index) => {
            if (item.index === coin.index) {
              this.mainList.splice(index, 1);
            }
          });
          this.$nextTick(() => {
            this.addFalseCoin(coin);
          });
        } else {
          this.showMainCoinsList.map(item => {
            if (item.id === coin.id) {
              item.select = true;
              this.addMainCoin(item.id);
            }
          });
        }
      }
    }
  },
  components: {
    moreListBox
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #coinsSearch {
    height: 100%;
    overflow: hidden;
    .head {
      position: relative;
      width: 100%;
      height: 98px;
      overflow: hidden;
      z-index: 2;
      background: #fff;
      @include eleBottomShadown();
      .head_back {
        position: absolute;
        top: 0;
        left: 0;
        width: 15%;
        height: 98px;
        text-align: center;
        font-size: 34px;
        background: none;
        color: $gray;
      }
      .search_label {
        width: 70%;
        margin: 19px auto;
        background: #f3f4f8;
        display: block;
        height: 60px;
        border-radius: 10px;
        position: relative;
        overflow: hidden;
        .search_icon {
          position: absolute;
          top: 0;
          left: 0;
          width: 15%;
          text-align: center;
          line-height: 60px;
          color: $gray;
          margin-top: 2px;
          font-size:30px;
        }
        .search_input {
          width: 80%;
          float: right;
          height: 60px;
          margin-right: 5%;
        }
      }
      .head_none {
        position: absolute;
        top: 0;
        right: 0;
        width: 15%;
        height: 98px;
        text-align: center;
        font-size: 26px;
        background: none;
        color: $gray;
      }
    }
    .nav {
      height: 78px;
      box-shadow: 0 0 18px 3px rgba(27, 55, 173, 0.1);
      overflow: hidden;
      .nav_inner {
        height: 90px;
        box-sizing: border-box;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 0 10px 2px;
        white-space: nowrap;
        .nav_btns {
          height: 78px;
          background: #fff;
          font-size: 26px;
          color: $gray;
          padding: 0 5px;
          margin: 0 20px;
          position: relative;
          &:after {
            content: '';
            width: 100%;
            height: 5px;
            background: #fff;
            bottom: 0;
            left: 0;
            position: absolute;
            border-radius: 5px;
          }
          &.nav_btns_selected {
            color: $mainColor;
            &:after {
              background: $mainColor;
            }
          }
        }
      }
    }
    .main {
      //  - 78px
      height: calc(100% - 98px);
      overflow-y: auto;
      .flip-list-move {
        transition: transform .5s;
      }
      .main_ul {
        padding-left: 30px;
        .main_coins {
          padding: 30px 30px 20px 0;
          overflow: hidden;
          border-bottom: 1Px solid $listBottomGray;
          background: #fff;
          .coins_icon {
            float: left;
            width: 44px;
            height: 44px;
            margin-top: 15px;
          }
          .icons_info {
            float: left;
            padding-left: 22px;
            .icons_sym {
              line-height: 44px;
              font-size: 34px;
              font-weight: 600;
              &:after {
                content: attr(data-zh);
                font-size: 22px;
                color: $gray;
                font-weight: 400;
              }
            }
            .icons_name {
              color: $gray;
              font-size: 26px;
              line-height: 38px;
            }
          }
          .icons_btn {
            float: right;
            width: 118px;
            height: 52px;
            border: 1Px solid rgba(247, 84, 52, 1);
            background: rgba(247, 84, 52, 0.1);
            color: rgba(247, 84, 52, 1);
            border-radius: 10px;
            margin-top: 10px;
            &.icons_btn_added {
              border-color: rgba(19, 43, 140, 1);
              background: rgba(19, 43, 140, 0.1);
              color: rgba(19, 43, 140, 1);
            }
          }
        }
      }
    }
  }
</style>
