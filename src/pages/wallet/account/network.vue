<template>
  <div id="network">
    <!-- 顶部 -->
    <div class="network_top">
      <div class="top_nums">
        <span class="top_title">
          可用网络
        </span>
        <span calss="top_num">
          {{used}} / {{all}}
        </span>
      </div>
      <div class="top_price">
        <span class="top_title">
          抵押
        </span>
        <span class="top_num">
          {{price}} EOS
        </span>
      </div>
    </div>
    <!-- 导航 -->
    <div class="network_navs">
      <div
        class="network_nav"
        :class="{'active': navIndex === index}"
        v-for="(item, index) in navs"
        :key="index"
        @click="navToggle(index)">
        {{item}}
      </div>
    </div>
    <!-- 主体 -->
    <div class="content">
      <!-- 买入 -->
      <div
        class="con_buy"
        v-if="navIndex === 0">
        <div class="pay_title">
          抵押方式
        </div>
        <div class="pay_lists">
          <div
            class="pay_list"
            v-for="(item, index) in payAccount"
            :key="index"
            @click="payTypeToggle(index)">
            <div
              class="iconfont"
              :class="{'icon-xuanze': payIndex === index, 'icon-xuanze1': payIndex !== index}"></div>
            <div class="list_info">
              <div class="list_img">
                <img
                  :src="item.img" alt="">
              </div>
              <div class="list_names">
                <div class="list_name">
                  {{item.title}}
                </div>
                <div class="list_type">
                  {{item.type}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="buy_nums">
          <div class="buy_titles">
            <span class="buy_title">
              抵押数量
            </span>
            <span class="buy_balance">
              余额：{{balance}} EOS
            </span>
          </div>
          <input
            class="buy_num_input"
            type="number"
            placeholder="输入EOS数量"
            v-model="buyNum">
        </div>
        <div class="select_account">
          <div class="select_titles">
            <span class="select_title">
              选择账户地址
            </span>
            <span class="account_name">
              <span class="iconfont icon-zhanghu"></span>
              <span class="name">
                {{account.account_name}}
              </span>
            </span>
          </div>
          <div class="select_address">
            <div class="address_infos">
              <div class="iconfont icon-dizhi1"></div>
              <div class="address_info">
                <div class="address_names">
                  <span class="address_name">
                    {{account.address_name}}
                  </span>
                  <span
                    class="address_default"
                    v-if="account.isDefault">
                    默认地址
                  </span>
                </div>
                <div class="address">
                  {{account.address}}
                </div>
              </div>
            </div>
            <div class="address_right">
              <span class="right_title">
                变更
              </span>
              <span class="iconfont icon-you"></span>
            </div>
          </div>
        </div>
        <div
          class="pay_money"
          v-if="payIndex !== 0">
          <span class="money_title">
            支付金额
          </span>
          <span class="money_num">
            {{payAmount}} {{payAmountRatio}}
          </span>
        </div>
        <div class="receive_account">
          <div class="account_title">
            接收账户
          </div>
          <input type="text" :value="receiveAccount" class="account_info" readonly>
        </div>
        <button class="buy_btn">
          确认
        </button>
      </div>
      <!-- 赎回 -->
      <div
        class="con_sell"
        v-if="navIndex === 1">
        <div class="sell_test">
          提示：可赎回的资源 = 总量 - 已用资源 - 赎回操作需消耗的资源 - 由他人抵押不可赎回的资源
        </div>
        <div class="sell_nums">
          <div class="sell_titles">
            <span class="sell_title">
              赎回数量
            </span>
            <span class="sell_balance">
              余额：{{sellBalance}} bytes
            </span>
          </div>
          <label
            class="sell_inputs"
            for="sellNum">
            <input
              class="sell_input"
              id="sellNum"
              type="number"
              v-model="sellNum"
              placeholder="输入NET数量">
          </label>
        </div>
        <div class="receive_account">
          <div class="account_title">
            接收账户
          </div>
          <input type="text" :value="receiveAccount" class="account_info" readonly>
        </div>
        <button class="sell_btn">
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'network',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 选中的导航（默认第一个）
      navIndex: 0,
      // navs
      navs: ['抵押', '赎回'],
      // 总网络
      all: '50.00MB',
      // 已用网络
      used: '10.00MB',
      // 当前价格
      price: '0.09263',
      // 余额
      balance: '540.00005',
      // 抵押数量
      buyNum: '',
      // 除EOS之外支付方式的支付金额
      payAmount: '0.000000',
      // 支付金额单位
      payAmountRatio: '',
      // 选择的支付方式（默认第一个EOS）
      payIndex: 0,
      // payAccount
      payAccount: [
        {
          img: require('../../../assets/images/coins_icon/eos.png'),
          title: 'EOS'
        },
        {
          img: require('../../../assets/images/coins_icon/eth.png'),
          title: 'ETH'
        },
        {
          img: require('../../../assets/images/icon_ai.png'),
          title: 'ETH',
          type: 'AI 收益账户'
        },
        {
          img: require('../../../assets/images/icon_ai.png'),
          title: 'BTC',
          type: 'AI 收益账户'
        }
      ],
      // 选择账户地址
      account: {
        // 账户名
        account_name: 'Paytokens-3',
        // 地址名称
        address_name: 'BTC-1',
        // 地址
        address: '35sdf4e1cr...f5415ds400',
        // 是否为默认
        isDefault: true
      },
      // 接收账户
      receiveAccount: 'kjmmdsgjiregihdkllllllllllllllllllruogggggggggggggggggggggazxcv',
      // 赎回余额
      sellBalance: '5656',
      // 赎回数量
      sellNum: ''
    };
  },
  beforeMount () {
    // 头部
    this.pageTitle({ title: '网络', shadown: true });
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // nav切换
    navToggle (index) {
      this.navIndex = index;
    },
    // 支付方式选择
    payTypeToggle (index) {
      this.payIndex = index;
      this.payAmountRatio = this.payAccount[index].title;
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #network{
    height:100%;
    .network_top{
      width:calc(100% - 60px);
      box-sizing: border-box;
      height:190px;
      background-color:$mainColor;
      @include eleBottomShadown();
      margin:40px auto;
      border-radius: 10px;
      padding:0 30px;
      .top_nums{
        display:flex;
        align-items: center;
        justify-content: space-between;
        color:#bcc3fd;
        font-size:26px;
        height:100px;
        border-bottom:1PX solid #4867f7;
      }
      .top_price{
        display:flex;
        align-items: center;
        justify-content: space-between;
        color:#fff;
        font-size:28px;
        height:90px;
        .top_num{
          font-size:26px;
        }
      }
    }
    .network_navs{
      height:78px;
      display:flex;
      box-shadow: 0 5px 5px 2px #f4f6fb;
      .network_nav{
        height:78px;
        line-height:78px;
        flex:1;
        font-size:26px;
        text-align:center;
        &.active{
          color:$mainColor;
          position:relative;
          &:after{
            position:absolute;
            bottom:0;
            left:50%;
            content:'';
            display:block;
            background-color:$mainColor;
            border-radius: 3px;
            height:6px;
            width:80px;
            margin-left:-40px;
          }
        }
      }
    }
    .content{
      padding-left:30px;
      width:100%;
      box-sizing: border-box;
      height: calc(100% - 348px);
      box-sizing: border-box;
      overflow-y: auto;
      .con_buy{
        .pay_title{
          color:#b7bac3;
          font-size:28px;
          line-height:88px;
        }
        .pay_lists{
          display:flex;
          flex-wrap: wrap;
          align-items: center;
          padding-right:30px;
          padding-bottom:10px;
          width:100%;
          box-sizing: border-box;
          border-bottom: 1PX solid $listBottomGray;
          .pay_list{
            width:50%;
            display:flex;
            align-items: center;
            box-sizing: border-box;
            margin-bottom:20px;
            min-height:72px;
            &>.iconfont{
              font-size:35px;
              margin-right:25px;
              &.icon-xuanze{
                color:$mainColor;
              }
              &.icon-xuanze1{
                color:#9297a5;
              }
            }
            &:nth-child(odd){
              padding-right:15px;
            }
            &:nth-child(even){
              padding-left:15px;
            }
            .list_info{
              display:flex;
              background-color:#f3f4f8;
              width:calc(100% - 60px);
              min-height:72px;
              align-items: center;
              box-sizing: border-box;
              padding:14px 0;
              .list_img{
                width:44px;
                height:44px;
                border-radius: 50%;
                margin:0 20px;
                img{
                  width:100%;
                  height:100%;
                }
              }
              .list_name{
                font-size:34px;
                font-weight: 600;
              }
              .list_type{
                font-size:24px;
                color:#9297a5;
              }
            }
          }
        }
        .buy_nums{
          border-bottom: 1PX solid $listBottomGray;
          padding-bottom:30px;
          .buy_titles{
            height:98px;
            display:flex;
            align-items: center;
            justify-content: space-between;
            padding-right:30px;
            font-size:28px;
            .buy_balance{
              font-size:26px;
              color:#9297a5;
            }
          }
          .buy_num_input{
            height:100px;
            width:100%;
            box-sizing: border-box;
            padding-left:40px;
            background-color:#f3f4f8;
            font-size:28px;
          }
        }
        .select_account{
          border-bottom: 1PX solid $listBottomGray;
          padding-bottom:30px;
          .select_titles{
            display:flex;
            justify-content: space-between;
            align-items: center;
            padding-right:50px;
            height:84px;
            .select_title{
              font-size:26px;
              color:#b7bac3;
            }
            .account_name{
              color:#acb2d0;
              display:flex;
              align-items: center;
              font-size:26px;
              .iconfont{
                font-size:35px;
                font-weight: 600;
                margin-right:15px;
              }
            }
          }
          .select_address{
            width:100%;
            box-sizing: border-box;
            background-color:#f3f4f8;
            height:100px;
            padding-right:30px;
            display:flex;
            justify-content: space-between;
            align-items: center;
            .address_infos{
              display:flex;
              align-items: center;
              .icon-dizhi1{
                width:44px;
                height:44px;
                border-radius: 50%;
                background-color:$listBottomGray;
                color:#9297a5;
                line-height:44px;
                text-align:Center;
                font-size:30px;
                margin:0 20px;
              }
              .address_info{
                .address_names{
                  .address_name{
                    font-size:28px;
                    margin-right:30px;
                  }
                  .address_default{
                    font-size:24px;
                    color:$mainColor;
                  }
                }
                .address{
                  font-size:26px;
                  color:#9297a5;
                  line-height:40px;
                }
              }
            }
            .address_right{
              display:flex;
              align-items: center;
              .right_title{
                color:#b7bac3;
                font-size:24px;
                margin-right:20px;
              }
              .icon-you{
                font-size:30px;
                color:#9da2b2;
              }
            }
          }
        }
        .pay_money{
          height:110px;
          border-bottom: 1PX solid $listBottomGray;
          width:100%;
          box-sizing: border-box;
          padding-right:30px;
          display:flex;
          justify-content: space-between;
          align-items: center;
          font-size:30px;
          .money_num{
            color:#f75434;
          }
        }
        .receive_account{
          padding-bottom:30px;
          font-size:28px;
          .account_title{
            height:90px;
            line-height:90px;
          }
          .account_info{
            height:100px;
            line-height:90px;
            width:100%;
            box-sizing: border-box;
            padding:0 30px 0 40px;
            background-color:#f3f4f8;
          }
        }
        .buy_btn{
          display:block;
          width:calc(100% - 30px);
          background-color:$mainColor;
          color:#fff;
          height:88px;
          border-radius: 10px;
          margin: 60px 0 30px 0;
          font-size:30px;
          @include eleBottomShadown();
        }
      }
      .con_sell{
        padding-top:30px;
        .sell_test{
          font-size:24px;
          color:#556ba8;
          line-height:40px;
          background-color:#f6f7ff;
          margin-right:30px;
          padding:10px 15px;
          border:1PX solid #a5b5fd;
        }
        .sell_nums{
          padding-bottom:30px;
          .sell_titles{
            display:flex;
            justify-content: space-between;
            align-items: center;
            padding-right:30px;
            height:86px;
            .sell_title{
              font-size:28px;
            }
            .sell_balance{
              font-size:26px;
              color:#9297a5;
            }
          }
          .sell_inputs{
            height:100px;
            width:100%;
            box-sizing: border-box;
            padding:0 30px;
            display:flex;
            justify-content: space-between;
            align-items: center;
            background-color:#f3f4f8;
            .sell_input{
              font-size:28px;
              width:70%;
            }
            .sell_ratio{
              font-size:28px;
            }
          }
        }
        .receive_account{
          padding-bottom:30px;
          font-size:28px;
          .account_title{
            height:90px;
            line-height:90px;
          }
          .account_info{
            height:100px;
            line-height:90px;
            width:100%;
            box-sizing: border-box;
            padding:0 30px 0 40px;
            background-color:#f3f4f8;
          }
        }
        .sell_btn{
          display:block;
          width:calc(100% - 30px);
          background-color:$mainColor;
          color:#fff;
          height:88px;
          border-radius: 10px;
          margin: 60px 0 30px 0;
          font-size:30px;
          @include eleBottomShadown();
        }
      }
    }
  }
</style>
