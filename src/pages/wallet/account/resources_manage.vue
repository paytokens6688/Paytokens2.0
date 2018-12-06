<template>
  <div id="resourcesManage">
    <div class="manage_top">
      <div class="manage_charts">
        <div
          class="charts"
          ref="myChart"></div>
        <div class="all_assets">
          <p class="assets_title">
            总资产/EOS
          </p>
          <p class="assets_info">
            {{allAssets}}
          </p>
        </div>
      </div>
      <div class="manage_lists">
        <div class="manage_list blue">
          <span class="list_title">
            余额
          </span>
          <span class="list_info">
            {{balance}}
            <span class="info_unit">
              EOS
            </span>
          </span>
        </div>
        <div class="manage_list red">
          <span class="list_title">
            抵押
          </span>
          <span class="list_info">
            {{mortgage}}
            <span class="info_unit">
              EOS
            </span>
          </span>
        </div>
        <div class="manage_list orange">
          <span class="list_title">
            赎回
          </span>
          <span class="list_info">
            {{redemption}}
            <span class="info_unit">
              EOS
            </span>
          </span>
        </div>
      </div>
    </div>
    <div class="resour_lists">
      <nuxt-link
        :to="item.path"
        tag="div"
        class="resour_list"
        v-for="(item, index) in resources"
        :key="index">
        <div class="list_titles">
          <span class="list_title">
            {{item.title}}
          </span>
          <span class="iconfont icon-you"></span>
        </div>
        <div class="list_nums">
          <span class="list_num_title">
            可用{{item.title}}
          </span>
          <span class="list_num">
            {{item.used}} / {{item.all}}
          </span>
        </div>
      </nuxt-link>
    </div>
    <nuxt-link
      :to="{path: '/wallet/user_help', query: {type: 'whyBuyResouyces'}}"
      tag="p"
      class="resour_why">
      <span class="iconfont icon-iconfontquestion"></span>
      <span class="why_text">
        为什么购买资源？
      </span>
    </nuxt-link>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
let echarts = require('echarts/lib/echarts');
// 引入line
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
export default {
  name: 'resourcesManage',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 余额
      balance: '540.00005',
      // 抵押
      mortgage: '20',
      // 赎回
      redemption: '10',
      // 总资产
      allAssets: '525.05698',
      // 资源列表
      resources: [
        {
          // 路径
          path: '/wallet/account/memory',
          // title
          title: '内存',
          // 总量
          all: '50.00KB',
          // 已用
          used: '10.00KB'
        },
        {
          // 路径
          path: '/wallet/account/cpu',
          // title
          title: 'CPU',
          // 总量
          all: '50.00ms',
          // 已用
          used: '10.00ms'
        },
        {
          // 路径
          path: '/wallet/account/network',
          // title
          title: '网络',
          // 总量
          all: '50MB',
          // 已用
          used: '10MB'
        }
      ]
    };
  },
  beforeMount () {
    // 头部
    this.pageTitle({ title: '资源管理', shadown: true });
  },
  mounted () {
    this.echartInit();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 图表初始化
    echartInit (data, date) {
      let myChart = echarts.init(this.$refs.myChart);
      let option = {
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            color: ['#2a53fd', '#f75434', '#fcc603'],
            startAngle: 45,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.balance
              },
              {
                value: this.mortgage
              },
              {
                value: this.redemption
              }
            ]
          }
        ]
      };
      myChart.setOption(option);
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #resourcesManage{
    .manage_top{
      width:100%;
      height:355px;
      display:flex;
      flex-wrap: wrap;
      .manage_charts{
        width:50%;
        height:355px;
        position:relative;
        .charts{
          height:100%;
          width:100%;
        }
        .all_assets{
          position:absolute;
          left:50%;
          top:50%;
          transform: translate(-50%, -50%);
          .assets_title{
            font-size:24px;
            color:#9297a5;
          }
          .assets_info{
            font-size:26px;
          }
        }
      }
      .manage_lists{
        width:50%;
        padding:65px 40px 0 0;
        box-sizing: border-box;
        .manage_list{
          display:flex;
          justify-content: space-between;
          line-height:76px;
          font-size:26px;
          box-sizing: border-box;
          width:100%;
          padding-left:40px;
          position:relative;
          &:after{
            content:'';
            display:block;
            position:absolute;
            left:0;
            top:50%;
            margin-top:-12px;
            width:24px;
            height:24px;
            border-radius: 5px;
            background-color:#9297a5;
          }
          &.blue:after{
            background-color:#2a53fd;
          }
          &.red:after{
            background-color:#f75434;
          }
          &.orange:after{
            background-color:#fcc603;
          }
          .info_unit{
            color:#b7bac3;
          }
        }
      }
    }
    .resour_lists{
      padding:0 30px;
      .resour_list{
        width:100%;
        height:190px;
        @include eleBottomShadown();
        border-radius: 10px;
        margin-bottom:20px;
        box-sizing: border-box;
        padding:0 30px;
        .list_titles{
          height:100px;
          display:flex;
          box-sizing: border-box;
          justify-content: space-between;
          align-items: center;
          border-bottom:1PX solid $listBottomGray;
          font-size:28px;
          .icon-you{
            font-size:30px;
            color:#9da2b2;
          }
        }
        .list_nums{
          height:90px;
          display:flex;
          justify-content: space-between;
          align-items: center;
          font-size:26px;
          color:#9297a5;
        }
      }
    }
    .resour_why{
      color:#9297a5;
      font-size:28px;
      text-align:center;
      margin-top:150px;
      span{
        display:inline-block;
        vertical-align: middle;
      }
      .iconfont{
        font-size:35px;
      }
    }
  }
</style>
