<template>
  <div id="messageStation">
    <!-- 头部语音 -->
    <div class="fixed_top">
      <i class="iconfont icon-yuyinguanbi" v-if="select_tab === 0"></i>
      <i class="iconfont icon-yuyin" v-else></i>
      <span>语音</span>
    </div>
    <div class="container">
      <!-- 导航切换 -->
      <div class="head_tab">
        <span
          class="item"
          v-for="(item, index) in headTab" :key="index"
          @click="selectTab(index)"
          :class="{'active': select_tab === index}"
          >
          {{item.name}}
          <span :class="{'is_new': item.is_new === true}"></span>
        </span>
      </div>
      <!-- 数据列表 -->
      <div class="data_main">
        <!-- 资产转出 -->
        <div
          class="data_list"
          v-if="select_tab === 0"
          v-for="(item, index) in dataList" :key="index">
          <div class="list_fix list_top">
            <div class="list_left">
              <i class="iconfont icon-zhuanchu_money"></i>
              <span>转出通知</span>
            </div>
            <span class="list_right">{{item.time}}</span>
          </div>
          <div class="list_fix list_unline">
            <div class="list_left">
              <span>EOS: <span class="red">{{item.code}}</span> 转出</span>
            </div>
            <span class="list_right" @click="goDetails(item.id)">查看详情 ></span>
          </div>
          <div class="list_fix list_bottom">
            <div class="list_left">
              <span>收款地址：{{item.address}}</span>
            </div>
          </div>
        </div>
        <!-- 资产转入 -->
        <div
          class="data_list"
          v-if="select_tab === 1"
          v-for="(item, index) in dataList" :key="index">
          <div class="list_fix list_top">
            <div class="list_left">
              <i class="iconfont icon-zhuanchu_money1"></i>
              <span>转入通知</span>
            </div>
            <span class="list_right">{{item.time}}</span>
          </div>
          <div class="list_fix list_unline">
            <div class="list_left">
              <span>EOS: <span class="red">{{item.code}}</span> 已到账</span>
            </div>
            <span class="list_right" @click="goDetails(item.id)">查看详情 ></span>
          </div>
          <div class="list_fix list_bottom">
            <div class="list_left">
              <span>发款地址：{{item.address}}</span>
            </div>
          </div>
        </div>
        <!-- AI交易 -->
        <div
          class="data_list"
          v-if="select_tab === 2"
          v-for="(item, index1) in dataList" :key="index1">
          <div class="list_fix list_top">
            <div class="list_left">
              <img src="@/assets/images/icon_ai.png" alt="">
              <span>AI 通知</span>
            </div>
            <span class="list_right">{{item.time}}</span>
          </div>
          <div class="list_fix list_unline">
            <div class="list_left">
              <span>您本周收益的 <span class="red">{{item.coin}}ETH</span> 已到账,请前往收益账户查看。</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'message_station',
  layout (context) {
    return 'back_page';
  },
  head () {
    // 返回头部信息
    return {
      title: '站内消息'
    };
  },
  watch: {
    '$route' () {
      this.pageTitle({
        title: '站内消息',
        shadown: false
      });
    }
  },
  data () {
    return {
      // 头部切换数据
      headTab: [
        {
          name: '资产转出',
          is_new: false
        },
        {
          name: '资产转入',
          is_new: true
        },
        {
          name: 'AI交易',
          is_new: false
        }
      ],
      select_tab: Number(this.$route.query.select_tab) || 0,
      // 数据列表
      dataList: [
        {
          // 资产转入，转出的时间
          time: '3个小时前',
          // 交易
          code: '0.0002 EOS',
          // 转钱地址
          address: '123456789987456321zxdfghnfg456f2bf99999999999999999999999g2',
          coin: '10'
        },
        {
          time: '2018-10-19 23:23:21',
          code: '0.0002 EOS',
          address: '123456789987456321zxdfghnfg456f2bfg2',
          coin: '10'
        },
        {
          time: '2018-10-19 23:23:21',
          code: '0.0002 EOS',
          address: '123456789987456321zxdfghnfg456f2bfg2',
          coin: '10'
        },
        {
          time: '2018-10-19 23:23:21',
          code: '0.0002 EOS',
          address: '123456789987456321zxdfghnfg456f2bfg2',
          coin: '10'
        }
      ]
    };
  },
  computed: {
  },
  beforeMount () {
    this.pageTitle({
      title: '站内消息',
      shadown: false
    });
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 头部类型切换
    selectTab (index) {
      if (this.select_tab === index) {
        return false;
      }
      this.select_tab = index;
      this.$router.replace({
        path: '/users/message_station',
        query: {
          select_tab: this.select_tab
        }
      });
    },
    // 查看详情
    goDetails () {
      this.$router.push({
        path: '/wallet/tx_detail'
      });
    }
  },
  components: {
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #messageStation {
    // 头部语音消息
    .fixed_top{
      position: fixed;
      top: 0;
      right: 30px;
      width: 120px;
      height: 90px;
      line-height: 90px;
      color: #9297a5;
      font-size: 26px;
      display: flex;
      align-items: center;
      .iconfont{
        margin-right: 10px;
        font-size: 34px;
      }
      .icon-yuyin{
        color: $mainColor;
      }
    }
    .container{
      height: calc(100% - 1px);
      box-sizing: border-box;
      overflow-y: auto;
      // 导航切换
      .head_tab{
        height: 78px;
        line-height: 78px;
        box-shadow: 0 0 18px 3px rgba(27, 55, 173, 0.1);
        box-sizing: border-box;
        padding: 0 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item{
          width: 138px;
          height: 78px;
          background: #fff;
          font-size: 26px;
          color: $gray;
          position: relative;
          text-align: center;
          &:after {
            content: '';
            width: 80px;
            height: 6px;
            background: #fff;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            position: absolute;
            border-radius: 3px;
          }
          .is_new{
            right: 0;
            top: 18px;
            position: absolute;
            display: inline-block;
            width: 12.4px;
            height: 12.4px;
            border-radius: 50%;
            background: #ff0000;
          }
          &.active {
            color: $mainColor;
            font-weight: bold;
            &:after {
              background: $mainColor;
            }
          }
        }
      }
      // 数据列表
      .data_main{
        padding: 0 40px 100px;
        height: calc(100% - 78px);
        box-sizing: border-box;
        overflow-y: auto;
        .data_list{
          padding: 30px 0;
          box-sizing: border-box;
          border-bottom: 1Px solid #eaecf1;
          .list_fix{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .list_right{
              font-size: 24px;
            }
            &.list_top{
              color: #9297a5;
              font-size: 28px;
              .list_left{
                display: flex;
                align-items: center;
                .iconfont{
                  font-size: 38px;
                }
                img{
                  width: 24px;
                  height: 24px;
                }
              }
              .time{
                font-size: 24px;
              }
            }
            &.list_unline{
              color: #222;
              box-sizing: border-box;
              padding: 26px 0 20px;
              .list_left{
                font-size: 26px;
                .red{
                  color: #f75434;
                }
              }
              .list_right{
                color: #2a53fd;
              }
            }
            &.list_bottom{
              width: 100%;
              overflow: hidden;
              word-break: break-word;
              box-sizing: border-box;
              padding: 13px 10px;
              background: #f3f4f8;
              color: $gray;
              font-size: 24px;
            }
          }
        }
      }
    }
  }
</style>
