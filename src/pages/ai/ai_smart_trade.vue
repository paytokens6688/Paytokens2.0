<template>
  <div id="aiSmartTrade">
    <div class="trade_head">
      <h2 class="head_text">
        AI交易
      </h2>
      <span
        class="head_right"
        v-show="statusShow">
        <span class="iconfont icon-dangqianweizhi"></span>
        <span class="right_text">
          {{status}}
        </span>
      </span>
    </div>
    <div class="trade_links">
      <nuxt-link
        :to="item.path"
        tag="div"
        v-for="(item, index) in links"
        :key="index"
        class="trade_link">
        <span
          class="iconfont"
          :class="item.icon"></span>
        <p class="link_text">
          {{item.title}}
        </p>
      </nuxt-link>
    </div>
    <div class="trade_navs">
      <div
        class="trade_nav"
        :class="{'active': navIndex === index}"
        v-for="(item, index) in navs"
        :key="index"
        @click="navToggle(index)">
        <img
          class="nav_img"
          :src="item.img"
          alt="图标">
          <span class="nav_text">
            {{item.name}}
          </span>
      </div>
    </div>
    <!-- 基金列表 -->
    <listBox
      class="trade_goods"
      :listArr="goods"
      :scrollBack="scrollCallback">
      <div
        class="trade_good"
        v-for="(item, index) in goods"
        :key="index">
        <span
          class="iconfont icon-yishouqing-"
          v-if="Number(item.already_invest_percent) === 100"></span>
        <div class="good_title">
          <span class="title_nper">
            {{item.term}}
          </span>
          <span class="title">
            {{item.initiator}}
          </span>
        </div>
        <div class="good_info">
          <div class="info_earn">
            <p class="earn_num">
              {{item.anticipated_income}}
            </p>
            <p class="earn_title">
              预期年化收益
            </p>
          </div>
          <div class="info_limit">
            <p class="limit_num">
              {{item.grant_day}}天起
            </p>
            <p class="limit_title">
              期限
            </p>
          </div>
          <button
            class="good_btn"
            :class="{'gray': Number(item.already_invest_percent) === 100}"
            @click="goDetail(index)">
            查看详情
            </button>
        </div>
        <div class="good_lines">
          <div class="good_line">
            <div
              class="good_bar"
              :style="{width: item.already_invest_percent + '%'}"></div>
            <div
              class="good_point"
              :style="{left: item.already_invest_percent + '%'}"></div>
          </div>
          <div class="line_text">
            已售{{item.already_invest_percent}}%
          </div>
        </div>
      </div>
      <noRecord
        title="暂无数据"
        type="record"
        v-if="!goods.length">
      </noRecord>
    </listBox>
    <footerTmpl :index="2" />
  </div>
</template>

<script>
import footerTmpl from '@/components/fixed/footer.vue';
import noRecord from '@/components/noRecord/no_record.vue';
import listBox from '@/components/list/more_list_box.vue';
export default {
  name: 'aiSmartTrade',
  data () {
    return {
      // 结算状态
      status: '滚存',
      // ai 是否开启
      statusShow: false,
      // 顶部导航
      links: [
        {
          title: 'AI 账户',
          icon: 'icon-shouyixiangqing',
          path: '/ai/ai_account/btc_account'
        },
        {
          title: '交易数据',
          icon: 'icon-haomiaogaopin',
          path: '/ai/ms_high_record'
        },
        {
          title: '结算设置',
          icon: 'icon-jiesuanshezhi',
          path: '/ai/settlement_set'
        }
      ],
      // 选中的导航，默认第一个
      navIndex: Number(this.$route.query.navIndex) || 0,
      // 币种导航
      navs: [
        {
          name: 'BTC',
          img: require('../../assets/images/coins_icon/btc.png')
        },
        {
          name: 'ETH',
          img: require('../../assets/images/coins_icon/eth.png')
        }
      ],
      // goods
      goods: [],
      // 是否有更多数据
      hasMore: true,
      // 是否可以请求数据
      canReq: true,
      // 页数
      page: 1
    };
  },
  beforeMount () {
    this.getInfo();
    this.getStatus();
    // 是否出现引导页
    try {
      window.webkit.messageHandlers.AIGudePage.postMessage(null); // ios
    } catch (error) {
      try {
        android.aiGuide(); // 安卓
      } catch (error) {
        // this.$global.alertOptions(error);
      }
    }
  },
  methods: {
    // 导航切换
    navToggle (index) {
      if (this.navIndex === index && !this.canReq) return false;
      this.navIndex = index;
      this.$router.replace({
        path: '/ai/ai_smart_trade',
        query: {
          navIndex: index
        }
      });
      this.page = 1;
      this.canReq = true;
      this.hasMore = true;
      this.goods = [];
      this.getInfo();
    },
    // 获取ai基金列表
    getInfo () {
      this.canReq = false;
      this.$axios.get('/v1/ai/invest', {
        params: {
          type: this.navIndex + 1,
          page: this.page
        }
      })
        .then(({ data }) => {
          if (data.status === 200) {
            this.canReq = true;
            this.page++;
            if (data.data.length < 10 || !data.data.length || !data.data) {
              this.hasMore = false;
            }
            this.goods = this.goods.concat(data.data);
          }
        });
    },
    // 获取结算设置
    getStatus () {
      this.$axios.get('/v1/ai/method')
        .then(({ data }) => {
          if (data.status === 200) {
            if (data.data === 1) {
              this.status = '滚存';
            } else {
              this.status = '周结';
            }
          }
        });
      this.$axios.get('/v1/user/info')
        .then(({ data }) => {
          if (data.status === 200) {
            if (data.data.open_ai === 1) {
              this.statusShow = true;
            } else {
              this.statusShow = false;
            }
          }
        });
    },
    // 滚动事件
    scrollCallback () {
      if (this.canReq && this.hasMore) {
        this.getInfo();
      }
    },
    // 进入详情
    goDetail (index) {
      // if (this.goods[index].sold === 1) return false;
      this.$router.push({
        path: '/ai/ai_trade_detail',
        query: {
          type: this.navs[this.navIndex].name,
          id: this.goods[index].id
        }
      });
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
  #aiSmartTrade{
    height:100%;
    .trade_head{
      height:90px;
      background:linear-gradient(135deg, #0370d7, #0143d1);
      position:relative;
      line-height:90px;
      .head_text{
        text-align:center;
        font-size:32px;
        color:#fff;
        font-weight: 500;
      }
      .head_right{
        display:block;
        position:absolute;
        right:30px;
        top:0;
        height:90px;
        color:#c3c6f5;
        font-size:26px;
        display:flex;
        align-items: center;
        .iconfont{
          font-size:30px;
          margin-right:10px;
        }
      }
    }
    .trade_links{
      height:160px;
      background:linear-gradient(135deg, #0d70d8, #0b3ed1);
      display:flex;
      .trade_link{
        flex:1;
        text-align:center;
        color:#fff;
        &:nth-child(2), &:nth-child(3){
          position:relative;
          &:after{
            position:absolute;
            display:block;
            content:'';
            left:0;
            top:50%;
            width:4px;
            height:60px;
            margin-top:-30px;
            background-color:rgba(255, 255, 255, 0.2);
            border-radius: 2px;
          }
        }
        .iconfont{
          font-size:50px;
          line-height:100px;
        }
        .link_text{
          font-size:24px;
          line-height:30px;
        }
      }
    }
    .trade_navs{
      height:92px;
      display:flex;
      .trade_nav{
        flex:1;
        height:92px;
        display:flex;
        align-items: center;
        justify-content: center;
        font-size:26px;
        color:#9297a5;
        transition: all 0.5s ease;
        .nav_img{
          height:36px;
          width:36px;
          margin-right:10px;
        }
        &.active{
          font-size:28px;
          font-weight: 600;
          color:#222;
          position:relative;
          &:after{
            position:absolute;
            content:'';
            left:50%;
            bottom:0;
            width:100px;
            margin-left: -50px;
            height:4px;
            background-color:$mainColor;
            border-radius: 2px;
          }
        }
      }
    }
    .trade_goods{
      height:calc(100% - 440px);
      overflow-y: auto;
      padding:0 20px;
      .trade_good{
        height:265px;
        margin-bottom:30px;
        background-color:#f7f7fa;
        box-sizing: border-box;
        padding:10px 0 0 30px;
        position:relative;
        overflow: hidden;
        .icon-yishouqing-{
          font-size:120px;
          color:#dedfe1;
          position: absolute;
          top:-25px;
          right:-20px;
        }
        .good_title{
          height:74px;
          border-bottom:1PX solid $listBottomGray;
          line-height: 74px;
          font-size:28px;
          .title_nper{
            margin-right:40px;
          }
        }
        .good_info{
          height:110px;
          padding-right:30px;
          margin-top:20px;
          display:flex;
          justify-content: space-between;
          align-items: center;
          .info_earn{
            .earn_num{
              color:#f75434;
              font-size:40px;
              font-weight: 600;
              line-height:50px;
            }
            .earn_title{
              color:#9297a5;
              font-size:22px;
              line-height:44px;
            }
          }
          .info_limit{
            .limit_num{
              font-size:36px;
              line-height:50px;
            }
            .limit_title{
              color:#9297a5;
              font-size:22px;
              line-height:44px;
            }
          }
          .good_btn{
            width:150px;
            height:54px;
            color:#fff;
            background-color:#f2574c;
            border-radius: 27px;
            font-size:24px;
            &.gray{
              background-color:#b7bac3;
            }
          }
        }
        .good_lines{
          padding-right:30px;
          height:32px;
          display:flex;
          align-items: center;
          justify-content: space-between;
          width:100%;
          box-sizing: border-box;
          .good_line{
            height:6px;
            width:calc(100% - 90px);
            background-color:#dfe2f0;
            border-radius: 3px;
            position:relative;
            .good_bar{
              height:6px;
              border-radius: 3px;
              background:$mainColor;
            }
            .good_point{
              position:absolute;
              height:37px;
              width:34px;
              background:url('../../assets/images/ai_point.png');
              background-size:34px 37px;
              top:-14px;
              transform: translateX(-16px);
            }
          }
          .line_text{
            font-size:18px;
            color:#2a2658;
            width:200px;
            text-align:right;
          }
        }
      }
    }
  }
</style>
