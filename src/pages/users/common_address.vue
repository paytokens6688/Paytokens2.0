<template>
  <div id="commonAddress">
    <!-- 头部添加地址 -->
    <nuxt-link
      class="header"
      tag="div"
      :to="{path: '/users/add_address', query: { navSelected: ($route.query.navSelected - 0) ?  ($route.query.navSelected + '') : '1'}}">
      <i class="iconfont icon-tianjia2"></i>
    </nuxt-link>
    <!-- 币种切换的导航栏 -->
    <div class="nav">
      <div class="nav_inner">
        <div class="nav_btns" v-for="(item, index) in navList" :key="index"
          :class="{'nav_btns_selected': navSelected === index}"
          @click="navSelect(index)">
          {{ item.name }}
        </div>
      </div>
    </div>
    <!-- 币种的列表 -->
    <div class="main">
      <div class="main_list"
        :class="{'coins_li_show_btns': item.showBtns}"
        v-for="(item, coin_index) in mainList" :key="coin_index"
        v-goLeft="listGoLeft(item, coin_index)"
        v-goRight="listGoRight(item, coin_index)"
        @click="selectAddress(coin_index)">
        <div class="coin_left">
          <img class="coin_img" :src="item.icon"/>
          <div class="list_right">
            <input
              class="coin_name"
              :class="{'coins_li_show_edit': !item.isEdit}"
              v-model="item.name"
              :disabled="item.disabled"
              type="text"
              autofocus="autofocus"/>
            <input
              class="coin_addresss"
              :class="{'coins_li_show_edit': !item.isEdit}"
              v-model="item.addresss"
              :disabled="item.disabled"
              type="text"/>
          </div>
        </div>
        <div class="coins_li_admin">
          <button class="coins_li_btn" v-if="item.isEdit" @click="editSelect(coin_index)">编辑</button>
          <button class="coins_li_btn" v-if="item.isSave" @click="sureSave(item, coin_index)">保存</button>
          <button class="coins_li_btn" @click="delSelect(item, coin_index)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'common_address',
  layout (context) {
    return 'back_page';
  },
  head () {
    // 返回头部信息
    return {
      title: '常用地址'
    };
  },
  data () {
    return {
      // 头部列表
      navList: [
        // {
        //   id: 0,
        //   name: '币种名字'
        // }
      ],
      // 头部列表选择的第几个
      navSelected: Number(this.$route.query.navSelected) || 0,
      // 内容显示列表
      mainList: [
        // {
        //   showBtns: 是否可滑动,
        //   id: 1,
        //   name: '地址名称',
        //   disabled: 默认是不可编辑,
        //   isEdit: 是否编辑,
        //   isSave: 是否保存,
        //   icon: '币种的图标',
        //   addresss: '币种的地址'
        // }
      ],
      // 所有常用地址列表
      allSiteList: [
        // {
        //   showBtns: 是否可滑动,
        //   id: 1,
        //   name: '地址名称',
        //   disabled: 默认是不可编辑,
        //   isEdit: 是否编辑,
        //   isSave: 是否保存,
        //   icon: '币种的图标',
        //   addresss: '币种的地址',
        //   type: 币的ID
        // }
      ],
      // 是否可以选择
      isSelect: false
    };
  },
  computed: {
    ...mapState({
      mainCoins: state => state.storage.coins.main,
      alsoUseSite: state => state.storage.alsoUseSite
    })
  },
  watch: {
    '$route' (to) {
      this.pageTitle({
        title: '常用地址',
        shadown: false
      });
      this.listShow(to.query.navSelected);
    }
  },
  beforeMount () {
    this.pageTitle({
      title: '常用地址',
      shadown: false
    });
    this.headInit();
    if (this.$route.query.type === 'out') {
      this.isSelect = true;
    }
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      deleteUseSite: 'storage/deleteUseSite',
      editUseSite: 'storage/editUseSite'
    }),
    // 默认头部初始化
    headInit () {
      this.navList = [
        {
          id: 0,
          name: '全部'
        }
      ].concat(this.mainCoins.map((item) => {
        return {
          id: item.id - 0,
          name: item.symbol
        };
      }));
      this.allSiteInit();
    },
    // 所有常用地址初始化
    allSiteInit () {
      const siteArr = [];
      this.alsoUseSite.map(sites => {
        // 币种信息
        let coinInfo = '';
        this.mainCoins.map(coin => {
          if (sites.coinsId === coin.id) {
            coinInfo = coin;
          }
        });
        sites.siteList.map((site) => {
          siteArr.push({
            showBtns: false,
            id: site.id,
            name: site.siteName,
            disabled: true,
            isEdit: true,
            isSave: false,
            icon: coinInfo.icon,
            addresss: site.site,
            type: coinInfo.id
          });
        });
      });
      this.allSiteList = siteArr;
      this.listShow(this.$route.query.navSelected);
    },
    // 列表渲染
    listShow (navSelected) {
      if (navSelected + '' === '0' || navSelected === undefined) {
        this.mainList = this.allSiteList;
      } else {
        this.mainList = [].concat(this.allSiteList.filter(item => item.type === navSelected + ''));
      }
    },
    // 头部切换
    navSelect (index) {
      if (this.navSelected === index) {
        return false;
      }
      this.navSelected = index;
      this.$router.replace({ // 刷新当前页面，不更改页面状态
        path: '/users/common_address',
        query: {
          navSelected: this.navSelected,
          type: this.isSelect ? 'out' : ''
        }
      });
    },
    // 选择地址
    selectAddress (index) {
      console.log(this.isSelect);
      console.log(this.mainList);
      if (!this.isSelect) return false;
      localStorage.setItem('commonAddress', this.mainList[index].addresss);
      this.$router.go(-1);
    },
    // 列表左滑事件
    listGoLeft (item, index) {
      return () => {
        this.$set(this.mainList[index], 'showBtns', true);
        this.$set(this.mainList[index], 'showMore', false);
      };
    },
    // 列表右滑事件
    listGoRight (item, index) {
      return () => {
        this.$set(this.mainList[index], 'showBtns', false);
      };
    },
    // 删除该币种
    delSelect (item, index) {
      this.$global.alertOptions({
        message: `确定要删除该地址？`,
        callbackList: [
          {
            title: '取消'
          },
          {
            title: '确认',
            callback: () => {
              this.deleteUseSite({
                coinId: item.type,
                siteId: item.id
              });
              // 重新初始化
              this.headInit();
            }
          }
        ]
      });
    },
    // 编辑地址
    editSelect (index) {
      this.mainList[index].disabled = !this.mainList[index].disabled;
      if (this.mainList[index].disabled === false) {
        this.mainList[index].isSave = true; // 保存按钮出现
        this.mainList[index].isEdit = false; // 编辑按钮出现
      }
      this.$set(this.mainList[index], 'showBtns', false);
    },
    // 保存地址
    sureSave (item, index) {
      this.mainList[index].disabled = !this.mainList[index].disabled;
      // 如果保存按钮存在的话
      if (this.mainList[index].isSave === true) {
        this.mainList[index].isSave = false; // 保存按钮消失
        this.mainList[index].isEdit = true; // 编辑按钮消失
      }
      this.$set(this.mainList[index], 'showBtns', false);
      this.editUseSite(item);
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #commonAddress {
    height: 100%;
    overflow: hidden;
    // 头部添加地址
    .header {
      position: absolute;
      top: 0;
      right: 0;
      width: 15%;
      height: 90px;
      line-height: 90px;
      text-align: center;
      font-size: 26px;
      background: none;
      color: #132b8c;
      .iconfont{
        font-size:30px;
        color: #132b8c;
      }
    }
    // 币种切换的导航栏
    .nav {
      height: 78px;
      box-shadow: 0 0 18px 3px rgba(27, 55, 173, 0.1);
      overflow: hidden;
      .nav_inner {
        height: 78px;
        line-height: 78px;
        padding: 0 30px;
        box-sizing: border-box;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        display: flex;
        align-items: center;
        .nav_btns {
          width: 138px;
          height: 78px;
          background: #fff;
          font-size: 26px;
          color: $gray;
          position: relative;
          text-align: center;
          transition: all 0.5s ease;
          &:after {
            content: '';
            width: 80px;
            height: 6px;
            border-radius: 3px;
            background: #fff;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            position: absolute;
            border-radius: 5px;
          }
          &.nav_btns_selected {
            color: $mainColor;
            font-weight: bold;
            &:after {
              background: $mainColor;
            }
          }
        }
      }
    }
    // 币种的列表
    .main {
      height: calc(100% - 90px);
      overflow-y: auto;
      padding-left: 30px;
      padding-bottom: 100px;
      box-sizing: border-box;
      overflow: hidden;
      .main_list{
        height: 130px;
        width: 142%;
        box-sizing: border-box;
        border-bottom: 1Px solid $listBottomGray;
        transition: margin .3s;
        display: flex;
        align-items: center;
        &.coins_li_show_btns {
          margin-left: -42%;
        }
        &:after {
          content: '';
          display: block;
          clear: both;
        }
        .coin_left{
          width: 71%;
          display: flex;
          align-items: center;
          .coin_img{
            width: 44px;
            height: 44px;
            margin-right: 20px;
          }
          .list_right{
            width: 100%;
            display: flex;
            flex-direction: column;
            height: 64px;
            .coin_name{
              color: #222222;
              font-size: 28px;
              &.coins_li_show_edit {
                background: rgba(27, 55, 173, 0.1);
              }
            }
            .coin_addresss{
              font-size: 26px;
              color: #b7bac3;
              &.coins_li_show_edit {
                background: rgba(27, 55, 173, 0.1);
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
</style>
