<template>
  <div id="MsHighRecord">
    <div class="record_navs">
      <div
        class="record_nav"
        @click="selectCoin">
        <img
          class="nav_img"
          :src="coins[coinIndex].img"
          alt="icon">
        <span class="nav_text">
          {{coins[coinIndex].name}}
        </span>
        <span
          class="iconfont icon-triangle-down01-copy"
          :class="{'filp': coinShow}"></span>
      </div>
      <div
        class="record_nav"
        @click="selectExchange">
        <img
          class="nav_img"
          :src="exchanges[exchangeIndex].img"
          alt="icon">
        <span class="nav_text">
          {{exchanges[exchangeIndex].name}}
        </span>
        <span
          class="iconfont icon-triangle-down01-copy"
          :class="{'filp': exchangeShow}"></span>
      </div>
      <div
        class="record_nav"
        @click="timePickerShow">
        <span class="nav_text">
          {{pickerValue.month}}/{{pickerValue.year}}
        </span>
        <span class="iconfont icon-triangle-down01-copy"></span>
      </div>
    </div>
    <div class="yields">
      <div class="yield_left">
        本周收益率&nbsp;&nbsp;{{weekYield}}%
      </div>
      <div class="yield_right">
        <span class="iconfont icon-iconziti28"></span>
        <span class="right_text">
          实时记录
        </span>
      </div>
    </div>
    <div class="record_title">
      <span class="titlle">
        日期
      </span>
      <span class="titlle">
        种类
      </span>
      <span class="titlle">
        数量
      </span>
    </div>
    <listBox
      class="record_lists"
      :listArr="records"
      :scrollBack="scrollCallback">
      <div
        class="record_list"
        v-for="(item, index) in records"
        :key="index">
        <span class="list_time">
          {{item.time}}
        </span>
        <span class="list_type">
          {{item.species}}
        </span>
        <span class="list_num">
          {{item.num}}
        </span>
      </div>
      <noRecord
        title="暂无记录"
        type="record"
        v-if="!records.length">
      </noRecord>
    </listBox>
    <div
      class="select_content"
      v-show="coinShow">
      <div class="coin_lists">
        <div
          class="coin_list"
          v-for="(item, index) in coins"
          :key="index"
          @click="coinSelect(index)">
          <img
            class="list_img"
            :src="item.img"
            alt="icon">
          <span class="list_name">
            {{item.name}}
          </span>
        </div>
      </div>
      <div
        class="con_close"
        @click="coinShow = false"></div>
    </div>
    <div
      class="select_content"
      v-show="exchangeShow">
      <div class="coin_lists">
        <div
          class="coin_list"
          v-for="(item, index) in exchanges"
          :key="index"
          @click="exchangeSelect(index)">
          <img
            class="list_img"
            :src="item.img"
            alt="icon">
          <span class="list_name">
            {{item.name}}
          </span>
        </div>
      </div>
      <div
        class="con_close"
        @click="exchangeShow = false"></div>
    </div>
    <timePicker
      title="选择时间"
      mode="month"
      v-if="pickerShow"
      :startYear="2018"
      :endYear="(new Date()).getFullYear() + 1"
      :closeCallback="() => { this.pickerShow = false }"
      :timeClick="getTimeChange"
      :defaultTime="`${theDate.getFullYear()}/${theDate.getMonth() + 1}/${theDate.getDate()}`" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import timePicker from '@/components/fixed/time_picker';
import listBox from '@/components/list/more_list_box.vue';
import noRecord from '@/components/noRecord/no_record.vue';
export default {
  name: 'MsHighRecord',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 当前日期
      theDate: new Date(),
      // 日期选择插件绑定的值
      pickerValue: {
        year: 2018,
        month: 11,
        day: 21
      },
      // 日期选择期是否显示
      pickerShow: false,
      // 币种选择显示
      coinShow: false,
      // 交易所选择显示
      exchangeShow: false,
      // 本周收益率
      weekYield: '0',
      // 选中的币种 默认第一个
      coinIndex: 0,
      // 币种列表
      coins: [
        {
          img: require('../../assets/images/coins_icon/btc.png'),
          name: 'BTC'
        },
        {
          img: require('../../assets/images/coins_icon/eth.png'),
          name: 'ETH'
        }
      ],
      // 选中的交易所
      exchangeIndex: 0,
      exchanges: [
        {
          img: require('../../assets/images/exchange_img.png'),
          name: 'BitMEX'
        }
      ],
      // 记录
      records: [],
      // 页数
      page: 1,
      // 是否可以请求数据
      canReq: true,
      // 是否还有更多
      hasMore: true
    };
  },
  beforeMount () {
    this.pageTitle('交易数据');
    this.getInfo();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 选择币种导航
    selectCoin () {
      this.coinShow = !this.coinShow;
      this.exchangeShow = false;
    },
    // 币种选择
    coinSelect (index) {
      this.coinIndex = index;
      this.coinShow = false;
      this.againGetInfo();
    },
    // 选择交易所
    selectExchange () {
      this.exchangeShow = !this.exchangeShow;
      this.coinShow = false;
    },
    // 交易所选择
    exchangeSelect (index) {
      this.exchangeIndex = index;
      this.exchangeShow = false;
      this.againGetInfo();
    },
    // 时间更改
    getTimeChange (time) {
      this.pickerValue = time;
      this.againGetInfo();
    },
    // 显示时间选择
    timePickerShow () {
      this.pickerShow = true;
    },
    // 条件更改重新请求数据
    againGetInfo () {
      this.records = [];
      this.page = 1;
      this.canReq = true;
      this.hasMore = true;
      this.getInfo();
    },
    // 获取数据
    getInfo () {
      this.canReq = false;
      this.$axios.get('v1/ai/high_log', {
        params: {
          type: this.coins[this.coinIndex].name,
          platform: this.exchanges[this.exchangeIndex].name,
          page: this.page,
          time: this.pickerValue.year + '-' + this.pickerValue.month
        }
      })
        .then(({ data }) => {
          if (data.status === 200) {
            this.canReq = true;
            this.page++;
            if (data.data.log.length < 10 || !data.data.log.length || !data.data.log) {
              this.hasMore = false;
            }
            this.records = this.records.concat(data.data.log);
            for (let i = 0; i < this.records.length; i++) {
              this.records[i].time = this.$func.setTimeToPersonRead(this.records[i].time);
            }
            this.weekYield = data.data.profit;
          }
        });
    },
    // 滚动事件
    scrollCallback () {
      if (this.canReq && this.hasMore) {
        this.getInfo();
      }
    }
  },
  components: {
    timePicker,
    noRecord,
    listBox
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #MsHighRecord{
    .record_navs{
      height:78px;
      display:flex;
      .record_nav{
        flex:1;
        display:flex;
        justify-content: center;
        align-items: center;
        font-size:26px;
        color:#666;
        &:nth-child(1){
          .nav_img{
            height:20px;
            width:20px;
          }
        }
        &:nth-child(2){
          .nav_img{
            height:28px;
            width:28px;
          }
        }
        .nav_img{
          margin-right:6px;
        }
        .iconfont{
          font-size:40px;
          transition: all 0.5s ease;
          &.filp{
            transform: rotateX(180deg);
          }
        }
      }
    }
    .yields{
      height:120px;
      background:linear-gradient(135deg, #0370d7, #0136cf);
      padding-left:30px;
      display:flex;
      justify-content: space-between;
      align-items: center;
      .yield_left{
        font-size:30px;
        color:#fff;
      }
      .yield_right{
        width:214px;
        height:64px;
        background:rgba(255, 255, 255, 0.2);
        border-radius: 10px 0 0 10px ;
        display:flex;
        align-items: center;
        .iconfont{
          color:#fff;
          font-size:35px;
          margin:0 20px;
        }
        .right_text{
          font-size:26px;
          color:#b8c1ed;
        }
      }
    }
    .record_title{
      height:86px;
      display:flex;
      justify-content: space-between;
      align-items: center;
      padding:0 30px;
      font-size:26px;
      color:#9297a5;
      box-sizing: border-box;
      border-bottom: 1PX solid $listBottomGray;
    }
    .record_lists{
      height:calc(100% - 284px);
      overflow-y: auto;
      padding-left:30px;
      .record_list{
        border-bottom: 1PX solid $listBottomGray;
        height:77px;
        display:flex;
        justify-content: space-between;
        align-items: center;
        padding-right:30px;
        font-size:24px;
        .list_time{
          flex:4;
        }
        .list_type{
          text-align:center;
          flex:4;
        }
        .list_num{
          color:#f75434;
          text-align:right;
          flex:2;
        }
      }
    }
    .select_content{
      position:fixed;
      left:0;
      top:168px;
      width:100%;
      height:calc(100% - 168px);
      background:rgba(0, 0, 0, 0.7);
      .coin_lists{
        background-color:#fff;
        position:absolute;
        top:0;
        left:0;
        width:100%;
        box-sizing: border-box;
        z-index:5;
        box-shadow: 0 15px 25px -15px rgba(27, 55, 173, 0.2) inset;
        display:flex;
        flex-wrap: wrap;
        padding:30px;
        .coin_list{
          width:214px;
          height:66px;
          background-color:#efeff3;
          text-align:center;
          line-height:66px;
          margin-right:24px;
          .list_img{
            width:20px;
            height:20px;
          }
          .list_text{
            font-size:26px;
            color:#666;
          }
        }
      }
      .con_close{
        height:100%;
        width:100%;
        position: absolute;
        left:0;
        top:0;
        z-index:4;
      }
    }
  }
</style>
