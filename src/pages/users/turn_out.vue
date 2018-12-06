<template>
  <div id='turnOut' >
    <!-- 第一块地址 -->
    <div class="address_box">
      <!-- top -->
      <div class="top_box">
        <span class="iconfont icon-zhanghu"></span>
        <span class="top_txt">Paytokens-3</span>
      </div>
      <!-- content -->
      <div class="content_box">
        <!-- 左边地址 -->
        <div class="left_address">
          <img src="./../../assets/images/address_icon.png" alt="" class="address_icon">
          <div class="address_info">
            <div class="type_wrap">
              <span class="type">
                {{addressType}}
              </span>
              <span class="default">默认地址</span>
            </div>
            <!-- 地址 -->
            <p class="address_link">{{addressLink.replace(/^(.{10})(.*?)(.{10})$/, '$1...$3')}}</p>
          </div>
        </div>
        <!-- 右边操作 -->
        <div class="exchange_box" @click="doExchange">
          <span class="ex_txt">变更</span>
          <span class="iconfont icon-you"></span>
        </div>
      </div>
    </div>
    <!-- 第二块金额 -->
    <div class="price_box">
      <!-- 左边 -->
      <div class="left_btc_type">
        <div class="img_wrap_btc">
          <img src="./../../assets/images/address_price_btc.png" alt="">
        </div>
        <span class="type_txt_btc">{{btcType}}</span>
      </div>
      <!-- 右边金额 -->
      <div class="price_right">
        <span class="price">{{price}}</span>
        <p class="exchange_price">&yen;{{rmb}} / ${{usd}}</p>
      </div>
    </div>
    <!-- 第三块操作输入 -->
    <div class="operate_box">
      <!-- 收货地址 -->
      <div class="common_box">
        <label class="common_title">收款地址</label>
        <input type="text" :value="collectAddress" readonly class="_input">
      </div>
       <!-- 转出数量 -->
      <div class="common_box">
        <label class="common_title">转出数量</label>
        <input type="number" v-model="inputNum" placeholder="输入BTC 数量" class="_input" @input="clearNum">
      </div>
      <!-- 选填 -->
      <input type="text" v-model="remarks" placeholder="备注（选填）" class="remark_input">
      <!-- 矿工费 -->
      <p class="miner_box">
        <span class="miner">矿工费</span>
        <span class="exchange_miner_price">{{btc_miner}} BTC&asymp;&yen;{{rmbMiner}}</span>
      </p>
    </div>
    <!-- 高级设置 -->
    <p class="options_show">
      <span class="_wrap" @click="moreOptions">
        <span class="options_show_title">高级设置</span>
        <i
          class="options_show_icon iconfont icon-xiala-copy"
          :class="{'options_show_more': showMoreOptions}"></i>
      </span>
    </p>
    <div
      class="more"
      v-show="showMoreOptions">
      <div
        class="line"
        ref="poundageLineBig">
        <div
          class="line_inner"
          :style="{width: freeChangeValue}"></div>
        <img
          class="line_point"
          src="../../assets/images/free_point.png"
          :style="{left: freeChangeValue}"
          ref="freeChangeEle">
      </div>
      <p class="more_icon">
        <i class="iconfont icon-ic_directions_bike_px"></i>
        <i class="iconfont icon-huojian"></i>
      </p>
    </div>
    <!-- 转出按钮 -->
    <div class="turn_btn" @click="doOut">转出</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'turnOut',
  layout () {
    return 'back_page';
  },
  data () {
    return {
      addressType: 'BTC-1', // 地址类型
      addressLink: '35hfuiehwgghyughuhukhjkhhjijijfufheyugh', // 地址
      btcType: 'BTC-1', // 金额类型
      price: '5000.0000',
      rmb: '70000.00',
      usd: '10000.00',
      collectAddress: 'bnfierhjkshgjhgghyughuhukinikh', // 收款地址
      inputNum: '', // 转出数量
      remarks: '', // 备注
      btc_miner: '0.0000000', // 矿工费
      rmbMiner: '0.00',
      // 是否展开高级设置
      showMoreOptions: false,
      // 手续费选择条占比
      freeChangeValue: '50%',
      // 手续费更改时的left值
      screenLeft: 0,
      // 手续费开启滑动
      poundageMoveStart: false
    };
  },
  beforeMount () {
    this.pageTitle({ title: '转出', shadown: true });
  },
  mounted () {
    this.initPoundageEmit();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 地址变更
    doExchange () {
      this.$router.push({
        path: '/ai/roll_select_account',
        query: {
          type: 'flashPay'
        }
      });
    },
    // input输入
    clearNum () {
      if (this.inputNum < 0) this.inputNum = '';
    },
    // 高级设置
    moreOptions () {
      this.showMoreOptions = !this.showMoreOptions;
    },
    // 初始化矿工费切换点事件
    initPoundageEmit () {
      const Hammer = require('hammerjs');
      const hammer = new Hammer(this.$refs.freeChangeEle);
      hammer.on('panstart', (e) => {
        this.screenLeft = e.center.x;
        this.poundageMoveStart = true;
      });
      hammer.on('panmove', (e) => {
        if (!this.poundageMoveStart) return false;
        let willWith = (e.center.x - this.$refs.poundageLineBig.offsetLeft) / this.$refs.poundageLineBig.clientWidth;
        if (willWith > 1 || willWith < 0) return false;
        this.freeChangeValue = Math.round(willWith * 100) + '%';
      });
      hammer.on('panend', (e) => {
        this.poundageMoveStart = false;
      });
    },
    // 转出
    doOut () {
      if (!this.inputNum) {
        this.$global.alertOptions('请输入BTC 数量');
      } else {
        this.$global.successOptions({
          message: '保存成功',
          callback: () => {
            this.$router.replace('/users/find');
          }
        });
      }
    }
  }
};
</script>

<style lang='scss' scoped>
  @import '@/assets/scss/public.scss';
  #turnOut{
    // 第一块
    .address_box {
      width: 92%;
      margin: 30px auto 20px;
      box-shadow: 0px 0px 10px 5px #f0f2fa;
      border-radius: 8px;
      background: #fff;
      box-sizing: border-box;
      .top_box {
        box-sizing: border-box;
        width: 100%;
        height: 72px;
        border-bottom: 1Px solid #eaecf1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 26px;
        color: #acb2d0;
        .icon-zhanghu {
          font-size: 42px;
          color: #acb2d0;
          padding: 0 30px 0 38px;
        }
      }
      .content_box {
        height: 130px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // 左边信息
        .left_address {
          width: 75%;
          height: 100%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          .address_icon {
            display: block;
            width: 50px;
            height: 50px;
            margin: 0 25px 0 35px;
          }
          // 地址信息
          .address_info {
            width: 80%;
            height: 100%;
            box-sizing: border-box;
            padding-top: 15px;
            .type_wrap {
              height: 54px;
              line-height: 54px;
              font-size: 28px;
              color: #222222;
              // 默认地址
              .default {
                font-size: 24px;
                color: #2a53fd;
                padding-left: 33px;
              }
            }
            .address_link {
              font-size: 26px;
              color: #9297a5;
            }
          }
        }
        // 右边操作
        .exchange_box {
          font-size: 24px;
          color: #b7bac3;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .icon-you {
            font-size: 30px;
            color: #9da2b2;
            padding: 0 30px 0 20px;
          }
        }
      }
    }
    // 第二块
    .price_box {
      width: 92%;
      min-height: 134px;
      margin: 0px auto;
      box-shadow: 0px 0px 10px 5px #f0f2fa;
      border-radius: 8px;
      background: #fff;
      box-sizing: border-box;
      padding-right: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      word-break: break-word;
      margin-bottom: 24px;
      // 左边类型
      .left_btc_type {
        display: flex;
        align-items: center;
        // 图片
        .img_wrap_btc {
          width: 82px;
          height: 82px;
          overflow: hidden;
          margin: 0 23px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-fit: cover;
          }
        }
        .type_txt_btc {
          font-size: 34px;
          color: #222222;
          font-weight: bold;
        }
      }
      // 右边
      .price_right {
        text-align: right;
        width: 50%;
        .price {
          font-size: 34px;
          color: #222222;
          font-weight: bold;
        }
        .exchange_price {
          font-size: 26px;
          color: #9297a5;
        }
      }
    }
    // 第三块操作输入
    .operate_box {
      box-sizing: border-box;
      width: 100%;
      padding-left: 30px;
      // 相同样式
      .common_box {
        height: 120px;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1Px solid #eaecf1;
        display: flex;
        align-items: center;
        .common_title {
          display: block;
          font-size: 28px;
          color: #222222;
          margin-right: 66px;
        }
        ._input {
          width: 75%;
          height: 100%;
          font-size: 28px;
          color: #222222;
          line-height: 60px;
          &::placeholder {
            font-size: 28px;
            color: #b7bac3;
            line-height: 60px;
          }
        }
      }
      // 选填
      .remark_input {
        display: block;
        height: 120px;
        width: 100%;
        border-bottom: 1Px solid #eaecf1;
        font-size: 28px;
        color: #222222;
        line-height: 60px;
        margin-bottom: 20px;
        &::placeholder {
          font-size: 28px;
          color: #b7bac3;
          line-height: 60px;
        }
      }
      // 矿工费
      .miner_box {
        box-sizing: border-box;
        width: 100%;
        height: 82px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 30px;
        .miner {
          font-size: 28px;
          color: #222222;
        }
        .exchange_miner_price {
          font-size: 28px;
          color: #f75434;
        }
      }
    }
    // 高级设置
    .options_show {
      text-align: right;
      font-size: 26px;
      color: $gray;
      line-height: 46px;
      box-sizing: border-box;
      padding: 0px 30px;
      .options_show_title {
        display: inline-block;
        vertical-align: middle;
      }
      .options_show_icon {
        font-size: 18px;
        display: inline-block;
        vertical-align: middle;
        transform: rotateZ(180deg);
        &.options_show_more {
          transform: rotateZ(0deg);
        }
      }
    }
    .more {
      margin-top: 50px;
      box-sizing: border-box;
      padding: 0px 30px;
      .line {
        background: #f3f3fb;
        width: 100%;
        height: 9px;
        position: relative;
        .line_inner {
          position: absolute;
          top: 0;
          left: 0;
          height: 9px;
          background: $mainColor;
        }
        .line_point {
          position: absolute;
          top: -14px;
          width: 32px;
          margin-left: -16px;
        }
      }
      .more_icon {
        padding-top: 25px;
        line-height: 50px;
        color: $gray;
        overflow: hidden;
        .iconfont {
          font-size: 42px;
          &.icon-ic_directions_bike_px {
            float: left;
          }
          &.icon-huojian {
            float: right;
          }
        }
      }
    }
    // 转出
    .turn_btn {
      width: 92%;
      height: 88px;
      background: #2a53fd;
      font-size: 30px;
      color: #fff;
      border-radius: 8px;
      text-align: center;
      line-height: 88px;
      margin: 78px auto;
    }
  }
</style>
