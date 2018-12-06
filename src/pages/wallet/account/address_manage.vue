<template>
  <div id="addressManage">
    <div class="address_navs">
      <div
        class="address_nav"
        :class="{'active': index === navIndex}"
        v-for="(item, index) in coins"
        :key="index"
        @click="navToggle(index)">
        {{item.title}}
      </div>
    </div>
    <div
      class="address_con"
      v-if="navIndex !== -1">
      <div class="con_title">
        <div class="con_imgs">
          <img :src="coins[navIndex].info.img" alt="">
        </div>
        <h4 class="title_text">
          所有地址总览
        </h4>
      </div>
      <div class="address_lists">
        <div
          class="address_list"
          v-for="(item, index) in coins[navIndex].info.address"
          :key="index"
          @click="goDetail(item)">
          <div class="iconfont icon-dizhi1"></div>
          <div class="list_info">
            <div class="list_names">
              <span class="list_name">
                {{item.name}}
              </span>
              <p class="list_right">
                <!-- <span
                  class="select_default"
                  @click.stop="selectDefault(index)">
                  <span
                    class="iconfont"
                    :class="{'icon-xuanze': item.isDefault, 'icon-xuanze1': !item.isDefault}"></p>
                  <span
                    class="select_text"
                    :class="{'gray': !item.isDefault}">
                    {{item.isDefault ? '默认账户' : '设为默认账户'}}
                  </span>
                </span> -->
                <span class="iconfont icon-you"></span>
              </p>
            </div>
            <div class="list_address">
              {{item.addre}}
            </div>
          </div>
        </div>
      </div>
      <div
        class="observe_title"
        v-if="coins[navIndex].info.observe_address.length">
        观察地址
      </div>
      <div class="observe_lists">
        <div
          class="observe_list"
          v-for="(item, index) in coins[navIndex].info.observe_address"
          :key="index"
          @click="observeDetail(index)">
          <div class="list_icon">
            <span class="iconfont icon-sannongguancha"></span>
          </div>
          <div class="list_info">
            <div class="list_names">
              <span class="list_name">
                {{item.name}}
              </span>
              <span class="iconfont icon-you"></span>
            </div>
            <div class="list_address">
              {{item.addre}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 功能暂不实现 -->
    <!-- <div class="address_btns">
      <button
        class="address_btn"
        v-if="type === 1"
        @click="importAddress">
        <span class="iconfont icon-daoru"></span>
        <span class="btn_text">导入地址</span>
        </button>
      <button
        class="address_btn"
        @click="addObserve">
        <span class="iconfont icon-chakanyanjingshishifenxi"></span>
        <span class="btn_text">添加观察地址</span>
        </button>
    </div> -->
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'addressManage',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 选中的nav(默认第一个)
      navIndex: -1,
      // type 底部按钮显示一个还是两个
      type: 1,
      // 地址列表
      coins: [
        // {
        //   title: '币名',
        //   info: 币的信息 {
        //     img: 币图表,
        //     address:常规地址 [
        //       {
        //         name: '地址名称',
        //         addre: '地址',
        //         isDefault: 是否为默认地址
        //       },
        //       {
        //         name: '地址名称',
        //         addre: '地址',
        //         isDefault: 是否为默认地址
        //       }
        //     ],
        //     observe_address:观察地址 [
        //       {
        //         name: '观察BTC-2',
        //         addre: '35sdf4e1cr...f5415ds400'
        //       }
        //     ]
        //   }
        // }
      ],
      // 账户选择
      selectAccount: ''
    };
  },
  computed: {
    ...mapState({
      accounts: state => state.storage.userInfo.accounts,
      mainCoin: state => state.storage.coins.main
    })
  },
  beforeMount () {
    this.selectAccount = this.$route.query.selectAccount;
    this.pageTitle('地址管理');
    this.initPage();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    initPage () {
      let coinArr = [];
      this.mainCoin.map((coin) => {
        const coinSite = {
          title: coin.symbol,
          info: {
            img: coin.icon,
            address: [],
            observe_address: []
          }
        };
        [].concat(this.accounts[this.selectAccount - 0].siteOfOther, this.accounts[this.selectAccount - 0].siteOfWord).map((site) => {
          if (site.type === coin.id) {
            coinSite.info.address.push({
              name: site.siteName,
              addre: site.key,
              isDefault: true,
              id: coin.id
            });
          }
        });
        coinArr.push(coinSite);
      });
      this.coins = coinArr;
      this.$nextTick(() => {
        this.navIndex = 0;
      });
    },
    // nav切换
    navToggle (index) {
      this.navIndex = index;
    },
    // 查看地址详情
    goDetail (item) {
      this.$router.push({
        path: '/wallet/account/address_detail',
        query: {
          key: item.addre,
          coinType: item.id,
          selectAccount: this.selectAccount
        }
      });
    },
    // 观察地址进入详情
    observeDetail (item) {
      this.$router.push({
        path: '/wallet/account/address_detail',
        query: {
          watch: 'yes',
          key: item.addre,
          coinType: item.id,
          selectAccount: this.selectAccount
        }
      });
    },
    // 设置默认地址
    selectDefault (index) {
      for (let i = 0; i < this.coins[this.navIndex].info.address.length; i++) {
        this.coins[this.navIndex].info.address[i].isDefault = false;
      }
      this.coins[this.navIndex].info.address[index].isDefault = true;
    },
    // 导入地址
    importAddress () {
      this.$router.push({ path: '/wallet/import_coin/private_key' });
    },
    // 添加观察地址
    addObserve () {
      this.$router.push('/wallet/account/add_observe_address');
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #addressManage{
    padding-top:78px;
    box-sizing: border-box;
    .address_navs{
      width:100%;
      display:flex;
      flex-wrap: wrap;
      height:78px;
      line-height:78px;
      position: fixed;
      left:0;
      top:90px;
      background-color:#fff;
      box-shadow: 0 4px 8px 1px rgba(27, 55, 173, 0.1);
      .address_nav{
        flex:1;
        height:78px;
        text-align:center;
        font-size:26px;
        color:#9297a5;
        &.active{
          color:$mainColor;
          position:relative;
          &:after{
            position:absolute;
            content:'';
            width:80px;
            height:6px;
            display:block;
            background-color:$mainColor;
            border-radius: 3px;
            bottom:0;
            left:50%;
            margin-left:-40px;
          }
        }
      }
    }
    .address_con{
      padding-top:10px;
      .con_title{
        height:105px;
        display:flex;
        align-items: center;
        padding-left:30px;
        .con_imgs{
          height:44px;
          width:44px;
          margin-right:20px;
          img{
            height:100%;
            width:100%;
          }
        }
        .title_text{
          font-size:28px;
          // font-weight: 700;
        }
      }
      .address_lists{
        padding-left:30px;
        .address_list{
          border-top:1PX solid $listBottomGray;
          height:120px;
          width:100%;
          display:flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          padding-right:30px;
          box-sizing: border-box;
          .icon-dizhi1{
            width:44px;
            height:44px;
            background-color:$listBottomGray;
            color:#9297a5;
            font-size:30px;
            text-align:center;
            line-height:44px;
            border-radius: 50%;
            margin-right:20px;
          }
          .list_info{
            width:calc(100% - 70px);
            .list_names{
              display:flex;
              justify-content: space-between;
              .list_name{
                font-size:28px;
              }
              .list_right{
                display:flex;
                align-items: center;
                .select_default{
                  font-size:24px;
                  display:flex;
                  align-items: center;
                  .select_text{
                    color:$mainColor;
                    &.gray{
                      color:#80889e;
                    }
                  }
                  .iconfont{
                    font-size:25px;
                    margin-right:8px;
                  }
                  .icon-xuanze{
                    color:$mainColor;
                  }
                  .icon-xuanze1{
                    color:#9297a5;
                  }
                }
                .icon-you{
                  font-size:30px;
                  color:#9da2b2;
                  margin-left:5px;
                }
              }
            }
            .list_address{
              font-size:26px;
              color:#9297a5;
              line-height:44px;
            }
          }
        }
      }
      .observe_title{
        height:70px;
        padding-left:30px;
        font-size:24px;
        color:#666666;
        background-color:#fafafc;
        line-height:70px;
      }
      .observe_lists{
        padding-left:30px;
        .observe_list{
          height:120px;
          border-bottom:1PX solid $listBottomGray;
          display:flex;
          align-items: center;
          justify-content: space-between;
          width:100%;
          box-sizing: border-box;
          padding-right:30px;
          .list_icon{
            width:44px;
            height:44px;
            border-radius: 50%;
            background-color:$listBottomGray;
            line-height:44px;
            text-align:center;
            margin-right:20px;
            color:$mainColor;
          }
          .icon-sannongguancha{
            background: linear-gradient(to bottom, #2d4ffb, #4e25e8);
            -webkit-background-clip: text;
            color: transparent;
            font-size:30px;
          }
          .list_info{
            width:calc(100% - 70px);
            .list_names{
              display:flex;
              justify-content: space-between;
              .list_name{
                font-size:28px;
              }
              .icon-you{
                font-size:30px;
                color:#9da2b2;
              }
            }
          }
          .list_address{
            font-size:26px;
            color:#9297a5;
            line-height:44px;
          }
        }
      }
    }
    .address_btns{
      position:fixed;
      bottom:0;
      left:0;
      width:100%;
      display:flex;
    }
    .address_btn{
      flex:1;
      height:98px;
      color:#fff;
      background-color:$mainColor;
      font-size:28px;
      display:flex;
      justify-content: center;
      align-items: center;
      &:nth-child(2){
        position:relative;
        &:after{
          position:absolute;
          content:'';
          display:block;
          width:1PX;
          height:40px;
          background-color:#5072fb;
          left:0;
          top:50%;
          margin-top:-20px;
        }
      }
      .iconfont{
        font-size:35px;
        margin-right:10px;
      }
    }
  }
</style>
