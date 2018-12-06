<template>
  <div id="aiTradeDetail">
    <div class="detail_top">
      <div class="top_title">
        <span class="nper">
          {{good.nper}}
        </span>
        <span class="title">
          {{good.name}}
        </span>
      </div>
      <div class="top_info">
        <div class="info_earn">
          <p class="earn_num">
            {{good.earn}}
          </p>
          <p class="info_title">
            预期年化收益
          </p>
        </div>
        <div class="info_limit">
          <p class="limit_num">
            {{good.limit}}天起
          </p>
          <p class="info_title">
            期限
          </p>
        </div>
        <div class="info_type">
          <p class="type_num">
            {{good.type  === 1 ? '稳健型' : '激进型'}}
          </p>
          <p class="info_title">
            投资类型
          </p>
        </div>
      </div>
      <div class="top_line">
        <div class="line_bars">
          <div
            class="line_bar"
            :style="{width: good.sold + '%'}"></div>
        </div>
        <div class="line_texts">
          <div class="line_num">
            {{ good.sold }}%
          </div>
          <div class="list_text">
            您已转入 {{good.intoNum}} {{coinType}}
          </div>
        </div>
      </div>
    </div>
    <div class="detail_content">
      <div class="content_navs">
        <div
          class="content_nav"
          :class="{'active': navIndex === index}"
          v-for="(item, index) in navs"
          :key="index"
          @click="navToggle(index)">
          {{item}}
        </div>
      </div>
      <div
        class="content_rate"
        v-show="navIndex === 0">
        <div
          class="echart_con"
          ref="myChart"
          v-show="echartShow">
        </div>
        <noRecord
          title="暂无数据"
          type="record"
          class="no_echart"
          v-show="!echartShow">
        </noRecord>
        <div class="example">
          <div class="example_title">
            举例说明：
          </div>
          <div
            class="example_con"
            v-html="example">
            <!-- <div class="example_smart_title">
              投资本金=1{{coinType}},收益率=1%
            </div>
            <div class="example_smart_title">
              周结：
            </div>
            <div class="example_texts">
              收益=1*1%=0.01 {{coinType}} 进收益账户，<br>下周可计息本金=1 {{coinType}}
            </div>
            <div class="example_smart_title">
              滚存：
            </div>
            <div class="example_texts">
              收益=1*1%=0.01 {{coinType}} 投资AI，<br>下周可计息本金=1.01 {{coinType}}
            </div> -->
          </div>
        </div>
        <div
          class="rules"
          v-for="(item, index) in rules"
          :key="index">
          <div class="rule_title">
            {{item.title}}
          </div>
          <div
            class="rule_info"
            v-html="item.info">
            <!-- {{item.info}} -->
          </div>
          <!-- <div class="rule_imgs">
            <img
              :src="item.img"
              alt="item.title">
          </div> -->
        </div>
      </div>
      <div
        class="content_rules"
        v-if="navIndex === 1">
        <div
          class="rule_lists"
          v-html="snapUpRule">
          <!-- <div
            class="rule_list"
            v-for="(item, index) in snapUpRule"
            :key="index">
            <div class="list_title">
              {{item.title}}
            </div>
            <div
              class="list_info"
              v-html="item.info"></div>
          </div> -->
        </div>
      </div>
    </div>
    <button
      class="detail_submit"
      :class="{'gray': Number(good.sold) === 100}"
      @click="submit">
      转入
    </button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import noRecord from '@/components/noRecord/no_record.vue';
let echarts = require('echarts/lib/echarts');
// 引入line
require('echarts/lib/chart/line');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
export default {
  name: 'aiTradeDetail',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 币种
      coinType: this.$route.query.type,
      // 基金信息
      good: {
        // id
        id: 1,
        // 名称
        name: '',
        // 期数
        nper: '',
        // 预期年化收益
        earn: '',
        // 期限
        limit: '',
        // 类型
        type: '',
        // 已售
        sold: 0,
        // 您已转入的
        intoNum: '',
        // 最低转入数量
        min: ''
      },
      // 图表显示与否
      echartShow: false,
      // 选中的nav, 默认第一个
      navIndex: 0,
      // navs
      navs: ['历史收益率', '抢购规则'],
      // 是否可以投资ai
      isInvest: false,
      // 例子
      example: '',
      // 规则
      rules: [
        {
          title: '预存抢购清算规则',
          info: '本周抢购成功，下周一统一开户开启高频交易，收益每周结算一次（下下周一）收益计算。',
          img: require('../../assets/images/trade_detail_rule_img_1.jpg')
        },
        {
          title: '转出结算规则',
          info: '转入当周不开放转出申请，交易中资产申请转出，统一下一周周一结算。',
          img: require('../../assets/images/trade_detail_rule_img_2.jpg')
        }
      ],
      // 抢购规则
      snapUpRule: [
        {
          title: '抢购',
          info: '<p>每期均为限额抢购，若已售低于100%，可随时进行抢购，若己售达到100%后，本期将结束抢购无法进行购买，需等待抢购下期。</p>'
        },
        {
          title: '开始计算收益',
          info: '<p>购买成功当日完成扣款，平台确认抢购成功后，将在下周周一开始计算收益，收益目前的七日年化收益率已经扣除了相关管理费用。</p><p>若平台确认抢购失败，将不会获得投资收益。</p>'
        },
        {
          title: '到期',
          info: '<p>周一至周日七天为一天周期，本期成功参与后，若下期需要继续参与，不需要进行转出操作。若下期不参与抢购，需在收益期间进行转出操作，收益期间的转出不影响本周收益的计算。</p>'
        }
      ]
    };
  },
  beforeMount () {
    this.getInfo();
    this.getAccount();
  },
  computed: {
    ...mapState({
      // 账户列表
      accounts: state => state.storage.userInfo.accounts,
      // 选择的第几个账户
      selectAccount: state => state.storage.userInfo.selectAccount
    })
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 切换nav
    navToggle (index) {
      this.navIndex = index;
    },
    // 获取默认账户，判断是否有对应币种
    getAccount () {
      let accounts = this.accounts[this.selectAccount].siteOfWord;
      accounts = accounts.concat(this.accounts[this.selectAccount].siteOfOther);
      let type = '';
      if (this.coinType === 'BTC') {
        type = '1';
      } else if (this.coinType === 'ETH') {
        type = '2';
      }
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].type === type) {
          this.isInvest = true;
        }
      }
    },
    getInfo () {
      this.$axios.get('/v1/ai/invest/info', {
        params: {
          id: this.$route.query.id
        }
      })
        .then(({ data }) => {
          if (data.status === 200) {
            this.good.nper = data.data.invest.term;
            this.good.name = data.data.invest.initiator;
            this.good.earn = data.data.invest.anticipated_income;
            this.good.limit = data.data.invest.grant_day;
            this.good.type = data.data.invest.style;
            this.good.sold = data.data.already_invest_percent;
            this.good.intoNum = data.data.enter.toFixed(4);
            this.good.id = data.data.invest.id;
            this.good.min = data.data.invest.min_invest;
            this.rules[0].info = data.data.invest.detail_two;
            this.rules[1].info = data.data.invest.detail_three;
            this.snapUpRule = data.data.invest.detail_four;
            this.example = data.data.invest.detail_one;
            let echartsData = {};
            if (data.data.invest.history_profit) {
              echartsData = JSON.parse(data.data.invest.history_profit);
              this.echartShow = true;
            } else {
              this.echartShow = false;
            }
            this.getEchartData(echartsData);
          }
        });
    },
    // 转入按钮
    submit () {
      if (!this.isInvest) return this.$global.alertOptions(`当前默认账户没有${this.coinType}币种，请先导入或切换账户后进行操作`);
      if (Number(this.good.sold) === 100) return this.$global.alertOptions('本期基金已售罄');
      this.$router.push({
        path: '/ai/roll_into',
        query: {
          min: this.good.min,
          type: this.coinType,
          id: this.good.id
        }
      });
    },
    // 图表数据
    getEchartData (echartsData) {
      let date = [];
      let data = [];
      date = Object.keys(echartsData);
      data = Object.values(echartsData);
      this.echartInit(data, date);
    },
    // 图表初始化
    echartInit (data, date) {
      let myChart = echarts.init(this.$refs.myChart);
      let option = {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>{a}:{c}%',
          position: function (point, params, dom, rect, size) {
            // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
            // 提示框位置
            var x = 0; // x坐标位置
            var y = 0; // y坐标位置
            // 当前鼠标位置
            var pointX = point[0];
            var pointY = point[1];
            // 提示框大小
            var boxWidth = size.contentSize[0];
            var boxHeight = size.contentSize[1];
            // boxWidth > pointX 说明鼠标左边放不下提示框
            if (boxWidth > pointX) {
              x = 5;
            } else { // 左边放的下
              x = pointX - boxWidth;
            }
            // boxHeight > pointY 说明鼠标上边放不下提示框
            if (boxHeight > pointY) {
              y = 5;
            } else { // 上边放得下
              y = pointY - boxHeight;
            }
            return [x, y];
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date,
          axisLabel: {
            color: '#9297a5',
            fontSize: '12',
            margin: 15
          },
          axisLine: {
            lineStyle: {
              color: '#eaecf1'
            }
          }
        },
        yAxis: {
          type: 'value',
          // scale: true,
          axisLabel: {
            color: '#9297a5',
            fontSize: '12',
            formatter: '{value}%',
            margin: 10
          },
          axisLine: {
            lineStyle: {
              color: '#eaecf1'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#eaecf1'
            }
          }
        },
        grid: {
          top: 30,
          left: 60,
          right: 40
        },
        series: [
          {
            name: '收益',
            type: 'line',
            // smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: 'rgb(42, 83, 253)',
              borderWidth: 0
            },
            // lineStyle: {
            //   width: 1
            // },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(42, 83, 253)'
              }, {
                offset: 1,
                color: 'rgb(255, 255, 255)'
              }])
            },
            data: data
          }
        ]
      };
      myChart.setOption(option);
    }
  },
  components: {
    noRecord
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #aiTradeDetail{
    height:100%;
    background-color:#fafafc;
    box-sizing: border-box;
    padding-bottom:98px;
    .detail_top{
      @include eleBottomShadown();
      background-color:#fff;
      .top_title{
        padding:0 30px;
        font-size:36px;
        line-height:90px;
        font-weight: 600;
        .nper{
          margin-right:40px;
        }
      }
      .top_info{
        padding:0 30px;
        display:flex;
        align-items: center;
        height:166px;
        .info_title{
          font-size:24px;
          color:#9297a5;
          line-height:48px;
        }
        .info_earn{
          width:268px;
          position:relative;
          &:after{
            position:absolute;
            content:'';
            display:block;
            width:1PX;
            height:80px;
            background-color:#f1f3f6;
            right:0;
            top:50%;
            margin-top:-40px;
          }
          .earn_num{
            font-size:40px;
            color:#f75434;
            line-height:56px;
            font-weight: bold;
          }
        }
        .info_limit{
          width:228px;
          position:relative;
          padding-left:40px;
          box-sizing: border-box;
          &:after{
            position:absolute;
            content:'';
            display:block;
            width:1PX;
            height:80px;
            background-color:#f1f3f6;
            right:0;
            top:50%;
            margin-top:-40px;
          }
          .limit_num{
            font-size:30px;
            line-height:56px;
          }
        }
        .info_type{
          width:194px;
          padding-left:40px;
          box-sizing: border-box;
          .type_num{
            font-size:30px;
            line-height:56px;
          }
        }
      }
      .top_line{
        height:107px;
        padding-top:23px;
        box-sizing: border-box;
        .line_bars{
          width:100%;
          height:4px;
          background-color:$listBottomGray;
          .line_bar{
            height:4px;
            background-color:$mainColor;
          }
        }
        .line_texts{
          padding:0 30px;
          height:80px;
          display:flex;
          justify-content: space-between;
          align-items: center;
          .line_num{
            height:38px;
            padding:0 10px;
            background-color:$mainColor;
            color:#fff;
            line-height:38px;
            text-align:center;
            border-radius: 15px;
            font-size:22px;
            position:relative;
            &:after{
              position:absolute;
              display:block;
              content: '';
              border-left:15px solid $mainColor;
              border-top:15px solid rgba(0, 0, 0, 0);
              border-right:15px solid rgba(0, 0, 0, 0);
              border-bottom:15px solid rgba(0, 0, 0, 0);
              left:0;
              top:-15px;
            }
          }
          .line_text{
            font-size:26px;
          }
        }
      }
    }
    .detail_content{
      margin-top:30px;
      background-color:#fff;
      padding-top:30px;
      .content_navs{
        width:calc(100% - 60px);
        height:60px;
        box-sizing: border-box;
        border:1PX solid #2a2658;
        display:flex;
        margin:0 auto;
        border-radius: 10px;
        overflow: hidden;
        .content_nav{
          height:58px;
          line-height:58px;
          text-align:center;
          flex:1;
          font-size:24px;
          color:#2a2658;
          transition: all 0.5s ease;
          &.active{
            color:#fff;
            background-color:#2a2658;
          }
        }
      }
      .content_rate{
        .echart_con{
          height:420px;
          width:750px;
          border-bottom:1PX solid $listBottomGray;
        }
        .no_echart{
          padding-top:75px;
        }
        .example{
          min-height:585px;
          padding-left:30px;
          box-sizing: border-box;
          padding-top:40px;
          border-bottom:1PX solid $listBottomGray;
          .example_title{
            line-height:48px;
            font-size:26px;
            color:#5e6476;
          }
          .example_con{
            padding-right:40px;
            position:relative;
            img{
              max-width:100%;
            }
            // &:after{
            //   position:absolute;
            //   width:22px;
            //   height:283px;
            //   content:'';
            //   display:block;
            //   background-image: url('../../assets/images/trade_detail_icon_1.png');
            //   background-size:100% 100%;
            //   left:0;
            //   top:20px;
            // }
            .example_smart_title{
              line-height:65px;
              margin-top:5px;
            }
            .example_texts{
              padding:5px 10px;
              font-size:24px;
              line-height:50px;
              color:#9297a5;
              background-color:#f5f6fa;
              margin-bottom:15px;
            }
          }
        }
        .rules{
          padding:13px 30px 40px;
          border-bottom:1PX solid $listBottomGray;
          .rule_title{
            font-size:30px;
            line-height:93px;
            padding-left:24px;
            position:relative;
            &:after{
              position:absolute;
              display:block;
              content:'';
              left:0;
              top:50%;
              width:6px;
              height:30px;
              margin-top:-15px;
              background-color:$mainColor;
            }
          }
          .rule_info{
            line-height:41px;
            font-size:24px;
            color:#9297a5;
            margin-bottom:30px;
            img{
              max-width:100%;
            }
          }
          .rule_imgs{
            width:100%;
            img{
              max-width:100%;
            }
          }
        }
      }
      .content_rules{
        .rule_lists{
          // padding-left:68px;
          padding:10px 30px 0;
          position:relative;
          img{
            max-width:100%;
          }
          // &:after{
          //   position:absolute;
          //   content:'';
          //   display:block;
          //   width:22px;
          //   height:580px;
          //   background-image: url('../../assets/images/trade_detail_icon_2.png');
          //   background-size: 100% 100%;
          //   top:40px;
          //   left:30px;
          // }
          .rule_list{
            padding-bottom:10px;
            .list_title{
              line-height:88px;
            }
            .list_info{
              padding:5px 30px 10px 10px;
              background-color:#f5f6fa;
              color:#9297a5;
              line-height:48px;
              font-size:24px;
              p{
                text-indent: 2em;
              }
            }
          }
        }
      }
    }
    .detail_submit{
      height:98px;
      width:100%;
      position:fixed;
      left:0;
      bottom:0;
      background-color:$mainColor;
      color:#fff;
      font-size:28px;
      &.gray{
        background-color:$gray;
      }
    }
  }
</style>
