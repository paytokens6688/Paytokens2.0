<template>
  <div id="market">
    <!-- 头部 -->
    <div class="market_top">
      <nuxt-link
        to="/market/market_search"
        tag="button"
        class="market_search iconfont icon-sousuo"></nuxt-link>
      <h2 class="market_title">行情</h2>
      <nuxt-link
        to="/market/market_sort"
        tag="button"
        class="market_sort iconfont icon-paixu"></nuxt-link>
      <nuxt-link
        to="/market/market_manage"
        tag="button"
        class="market_add iconfont icon-tianjia2"></nuxt-link>
    </div>
    <!-- 导航 -->
    <!-- 暂不开放 -->
    <!-- <div class="market_navs">
      <div
        class="navs"
        ref="navs">
        <div
          class="market_nav"
          :class="{'active': index === navIndex}"
          v-for="(item, index) in navs"
          :key="index"
          ref="nav"
          @click="navToggle(index)">
          {{item.title}}
        </div>
      </div>
    </div> -->
    <!-- 列表头部 -->
    <div class="market_list_top">
      <div class="list_top_title">
        币种
      </div>
      <div class="list_top_title">
        最新价
      </div>
      <div class="list_top_title">
        涨跌幅(24h)
      </div>
    </div>
    <!-- 行情列表 -->
    <div class="market_lists">
      <div
        class="market_list"
        v-for="(item, index) in coins"
        :key="index"
        @click="goDetail(index)">
        <div class="list_coin">
          <div class="list_imgs">
            <img :src="item.image" alt="">
          </div>
          <div class="list_name">
            <div class="list_name_1">
              <span class="list_name_en">
                {{item.name}}
              </span>
              <span
                class="list_name_cn"
                v-show="item.name_cn !== '－'">
                /{{item.name_cn}}
              </span>
            </div>
            <div class="list_name_all">
              {{item.symbol}}
            </div>
          </div>
        </div>
        <div class="list_prices">
          <div class="list_price">
            <div class="list_price_usd">
              ${{item.now_price}}
            </div>
            <div class="list_price_cny">
              &yen;{{item.now_price_cny}}
            </div>
          </div>
          <div
            class="list_applies"
            :class="item.isNumber === 2 ? 'fall': 'rose'">
            {{item.isNumber === 1 ? '+' : ''}}{{item.increase24}}%
            <i
              class="iconfont icon-rise"
              :class="{'fall': item.isNumber === 2}"></i>
          </div>
        </div>
      </div>
      <noRecord
        title="暂无数据"
        type="record"
        v-show="!coins.length">
      </noRecord>
    </div>
    <footerTmpl :index="1" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import footerTmpl from '@/components/fixed/footer.vue';
import noRecord from '@/components/noRecord/no_record.vue';
import listBox from '@/components/list/more_list_box.vue';
export default {
  name: 'market',
  data () {
    return {
      navIndex: 0,
      // 导航
      navs: [
        {
          // 导航ID
          id: 1,
          title: '已关注'
        },
        {
          // 导航ID
          id: 2,
          title: '热搜'
        },
        {
          // 导航ID
          id: 3,
          title: '市值排名'
        },
        {
          // 导航ID
          id: 4,
          title: 'BTC'
        },
        {
          // 导航ID
          id: 5,
          title: 'ETH'
        },
        {
          // 导航ID
          id: 5,
          title: 'ETH'
        },
        {
          // 导航ID
          id: 5,
          title: 'ETH'
        }
      ],
      coins: [],
      // 是否可以请求数据
      canReq: true,
      // 是否还有更多
      hasMore: true,
      // 页数
      page: 1
    };
  },
  beforeMount () {
    // this.getInfo();
    if (!localStorage.getItem('isFrist')) {
      this.getInfo();
      localStorage.setItem('isFrist', 'false');
    } else {
      this.getUserInfo('marketList')
        .then((data) => {
          this.coins = data;
          this.getSocket();
        });
    }
  },
  mounted () {
    // this.setNavsWidth();
  },
  beforeDestroy () {
    let obj = {
      type: 'market_exit'
    };
    window.$ws.send(JSON.stringify(obj));
  },
  computed: {
    marketList () {
      return this.$store.state.marketLine.show;
    }
  },
  methods: {
    ...mapActions({
      saveUserInfo: 'storage/saveUserInfo',
      getUserInfo: 'storage/getUserInfo'
    }),
    // nav切换
    navToggle (index) {
      this.navIndex = index;
    },
    // 获取数据
    getInfo () {
      this.$axios.get('/v1/api/market/get_list_20')
        .then(({ data }) => {
          if (data.status === 200) {
            this.coins = data.data;
            this.saveUserInfo({
              type: 'marketList',
              data: data.data
            }).then(() => {
              this.getSocket();
            });
          }
        });
    },
    // 链接socket 获取数据
    getSocket () {
      let obj = {
        type: 'market',
        content: []
      };
      obj.content = this.coins.map((item) => item.id.toString());
      window.$ws.send(JSON.stringify(obj));
      window.$ws.onmessage = (evt) => {
        let datas = JSON.parse(evt.data).data;
        for (let i = 0; i < this.coins.length; i++) {
          for (let j = 0; j < datas.length; j++) {
            if (this.coins[i].id === datas[j].id) {
              this.$set(this.coins[i], 'now_price', datas[j].now_price);
              this.$set(this.coins[i], 'now_price_cny', datas[j].now_price_cny);
              this.$set(this.coins[i], 'increase24', datas[j].increase24);
            }
          }
        }
        this.judgeNumber();
      };
    },
    // 判断是涨还是跌 1是涨， 2是跌
    judgeNumber () {
      for (let i = 0; i < this.coins.length; i++) {
        if (Math.sign(this.coins[i].increase24) === -1) {
          this.$set(this.coins[i], 'isNumber', 2);
        } else {
          this.$set(this.coins[i], 'isNumber', 1);
        }
      }
      this.saveUserInfo({
        type: 'marketList',
        data: this.coins
      });
    },
    // 查看详情
    goDetail (index) {
      this.$router.push({
        path: '/market/market_detail',
        query: {
          id: this.coins[index].id,
          isColler: 1
        }
      });
    },
    // 滚动事件
    scrollCallback () {
      if (this.canReq && this.hasMore) {
        this.getInfo();
      }
    },
    // 动态设置navs的宽度
    setNavsWidth () {
      let navs = this.$refs.nav;
      let width = 0;
      for (let i = 0; i < navs.length; i++) {
        width += (navs[i].clientWidth + navs[0].offsetLeft * 2);
      }
      this.$refs.navs.style.width = width + 5 + 'px';
    }
  },
  components: {
    footerTmpl,
    noRecord,
    listBox
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #market{
    background-color:#fff;
    height:100%;
    .market_top{
      height:90px;
      width:100%;
      background-color:#fff;
      position: relative;
      .market_search{
        position: absolute;
        top: 0;
        left: 0;
        width: 78px;
        height: 90px;
        text-align: center;
        font-size: 34px;
        background: none;
        color: $darkBlue;
      }
      .market_sort{
        position: absolute;
        top: 0;
        right: 78px;
        width: 78px;
        height: 90px;
        text-align: center;
        font-size: 40px;
        background: none;
        color: $darkBlue;
      }
      .market_add{
        position: absolute;
        top: 0;
        right: 0;
        width: 78px;
        height: 90px;
        text-align: center;
        font-size: 30px;
        background: none;
        color: $darkBlue;
      }
      .market_title{
        text-align: center;
        width: 100%;
        line-height: 90px;
        font-size: 32px;
        font-weight: 500;
      }
    }
    .market_navs{
      width:100%;
      background-color:#fff;
      height:78px;
      line-height:78px;
      box-shadow: 0 5px 10px 2px rgba(27, 55, 173, 0.1);
      overflow-y: hidden;
      overflow-x: auto;
      &::-webkit-scrollbar{
        height: 0;
      }
      .navs{
        height:78px;
        min-width:100%;
        .market_nav{
          height:78px;
          display:inline-block;
          margin:0 27px;
          font-size:26px;
          color:#9297a5;
          transition: all 0.5s ease;
          &.active{
            position:relative;
            color:#2a53fb;
            &:after{
              content:'';
              width:100%;
              height:6px;
              position: absolute;
              bottom:0;
              left:0;
              background-color:#2a53fb;
              border-radius: 6px;
            }
          }
        }
      }
    }
    .market_list_top{
      box-shadow: 0 5px 10px 1px rgba(27, 55, 173, 0.1);
      width:calc(100% - 60px);
      border-bottom:1PX solid $listBottomGray;
      height:83px;
      background-color:#fff;
      display:flex;
      justify-content: space-between;
      line-height:83px;
      padding: 0 30px;
      font-size:24px;
      color:#9297a5;
      .list_top_title:nth-child(2){
        margin-left:80px;
      }
    }
    .market_lists{
      width:calc(100% - 30px);
      height: calc(100% - 271px);
      padding-left:30px;
      overflow-y: auto;
      .market_list{
        height:127px;
        width:100%;
        box-sizing: border-box;
        padding-right:30px;
        border-bottom:1PX solid $listBottomGray;
        display:flex;
        align-items: center;
        .list_coin{
          display:flex;
          align-items: center;
          width:44%;
          .list_imgs{
            height:44px !important;
            width:44px !important;
            margin-right:20px;
            img{
              height:100%;
              width:100%;
            }
          }
          .list_name{
            width: 75%;
            .list_name_1{
              display:flex;
              align-items: center;
              .list_name_en{
                font-size:34px;
                font-weight: 600;
              }
              .list_name_cn{
                display: inline-block;
                font-size:22px;
                color:#b7bac3;
                width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .list_name_all{
              font-size:26px;
              color:#b7bac3;
              line-height:42px;
            }
          }
        }
        .list_prices{
          display:flex;
          width:56%;
          justify-content: space-between;
          align-items: center;
          .list_price{
            font-size:26px;
            line-height:46px;
            .list_price_cny{
              color:#9297a5;
            }
          }
          .list_applies{
            width:140px;
            height:60px;
            border-radius: 10px;
            text-align:center;
            font-size:26px;
            line-height:60px;
            color:#fff;
            display:flex;
            align-items: center;
            justify-content: center;
            &.rose{
              background-color:#2fd460;
            }
            &.fall{
              background-color:#eb4f36;
            }
            .iconfont{
              display:inline-block;
              font-size:30px;
              &.fall{
                transform: rotateX(-180deg);
              }
            }
          }
        }
      }
    }
  }
</style>
