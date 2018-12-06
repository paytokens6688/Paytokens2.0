<template>
  <div id="btcAccount">
    <div class="account_top">
      <div class="top_all">
        <p class="all_num">
          {{all_num}}
        </p>
        <p class="all_text">
          总资产（ BTC ）
        </p>
      </div>
      <div class="top_accounts">
        <div class="account">
          <p class="account_text">
            本金账户（BTC）
          </p>
          <p class="account_num">
            {{principal}}
          </p>
        </div>
        <div class="account">
          <p class="account_text">
            收益账户（BTC）
          </p>
          <p class="account_num">
            {{earnings}}
          </p>
        </div>
        <div class="account">
          <p class="account_text">
            上周收益（BTC）
          </p>
          <p class="account_num">
            {{lastWeek}}
          </p>
        </div>
      </div>
    </div>
    <div class="record_navs">
      <div
        class="record_nav"
        :class="{'active': index === recordNavIndex}"
        v-for="(item, index) in recordNavs"
        :key="index"
        @click="recordNavToggle(index)">
        <span class="record_text">
          {{item.title}}
        </span>
        <span
          class="iconfont"
          :class="item.icon"></span>
      </div>
    </div>
    <listBox
      class="record_lists"
      :listArr="records"
      :scrollBack="scrollCallback">
      <div
        class="record_list"
        v-for="(item, index) in records"
        :key="index">
        <div class="list_titles">
          <span class="list_title">
            {{item.message}}
          </span>
          <span
            class="list_num"
            :class="{'red': recordNavIndex === 0}">
            {{item.money}} BTC
          </span>
        </div>
        <div class="list_times">
          <span class="list_time">
            {{item.create_time}}
          </span>
          <span
            class="list_state"
            :class="{'gray': item.status === 2 || item.status === 4, 'blue': item.status === 1, 'red': item.status === 3}"
            v-if="recordNavIndex !== 0">
            {{item.status === 1 ? '审核中' : (item.status === 2 ? '已完成' : (item.status === 3 ? '已驳回' : '失败'))}}
            </span>
        </div>
        <div
          class="list_why"
          v-if="item.status === 3 && recordNavIndex === 2">
          驳回原因：{{item.err_message}}
        </div>
      </div>
      <noRecord
        title="暂无数据"
        type="record"
        v-if="!records.length">
      </noRecord>
    </listBox>
    <button
      class="account_btn"
      @click="rollOut">
      转出
    </button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import noRecord from '@/components/noRecord/no_record.vue';
import listBox from '@/components/list/more_list_box.vue';
export default {
  name: 'btcAccount',
  data () {
    return {
      // 总额
      all_num: '0.0000',
      // 本金账户
      principal: '0',
      // 收益账户
      earnings: '0',
      // 上周收益
      lastWeek: '0',
      // 记录  导航 默认第一个
      recordNavIndex: 0,
      // 记录的导航
      recordNavs: [
        {
          title: '收益',
          icon: 'icon-yuanhuan'
        },
        {
          title: '转入',
          icon: 'icon-yuanhuan'
        },
        {
          title: '转出',
          icon: 'icon-jiantou122'
        }
      ],
      // 收益记录
      records: [],
      canReq: true,
      hasMore: true,
      page: 1,
      // 默认账户是否有当前币种
      defaultIsCoin: false,
      // 下一个有当前币种的账户
      accountHasCoinIndex: ''
    };
  },
  computed: {
    ...mapState({
      // 账户列表
      accountsList: state => state.storage.userInfo.accounts,
      // 默认选择账户
      defaultSelectAccount: state => state.storage.userInfo.selectAccount
    })
  },
  beforeMount () {
    this.pageTitle('AI 账户');
    this.getInfo();
    this.getList();
    this.initAccount();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 切换记录的导航
    recordNavToggle (index) {
      if (this.recordNavIndex === index && !this.canReq) return false;
      this.recordNavIndex = index;
      this.page = 1;
      this.records = [];
      this.canReq = true;
      this.hasMore = true;
      this.getList();
    },
    // 判断默认账户是否有当前币种（BTC）（type === 1），如果没有则自动切换为下一个有当前币种的账户
    initAccount () {
      // 判断默认账户是否有当前币种
      let accounts = this.accountsList[this.defaultSelectAccount];
      let coins = [].concat(accounts.siteOfWord).concat(accounts.siteOfOther);
      for (let i = 0; i < coins.length; i++) {
        if (coins[i].type === '1') {
          this.defaultIsCoin = true;
        }
      }
      // 如果默认账户没有当前币种，则切换为下一个有当前币种的账户
      // if (!this.defaultIsCoin) {
      //   let otherAccount = this.accountsList;
      //   for (let i = 0; i < otherAccount.length; i++) {
      //     let otherCoins = [].concat(otherAccount[i].siteOfWord).concat(otherAccount[i].siteOfOther);
      //     for (let j = 0; j < otherCoins.length; j++) {
      //       if (otherCoins[j].type === '1') {
      //         this.accountHasCoinIndex = i;
      //         return;
      //       }
      //     }
      //   }
      // }
    },
    // 获取顶部数据
    getInfo () {
      this.$axios.get('v1/ai/account')
        .then(({ data }) => {
          if (data.status === 200) {
            this.all_num = (data.data.ai_btc + data.data.profit_btc).toFixed(4);
            this.principal = data.data.ai_btc;
            this.earnings = data.data.profit_btc;
            this.lastWeek = data.data.ai_btc_last_week_profit;
          }
        });
    },
    // 获取记录
    getList () {
      this.canReq = false;
      this.$axios.get('/v1/ai/account_log', {
        params: {
          type: this.recordNavIndex + 1,
          page: this.page,
          class: 1
        }
      })
        .then(({ data }) => {
          if (data.status === 200) {
            this.canReq = true;
            this.page++;
            if (data.data.length < 10 || !data.data.length || !data.data) {
              this.hasMore = false;
            }
            this.records = this.records.concat(data.data);
          }
        });
    },
    scrollCallback () {
      if (this.canReq && this.hasMore) {
        this.getList();
      }
    },
    // 转出按钮
    rollOut () {
      if (this.defaultIsCoin) {
        this.$router.push({
          path: '/ai/roll_out',
          query: {
            type: 'BTC'
          }
        });
      } else {
        this.$global.alertOptions(`当前默认账户没有BTC币种，请先导入或切换账户后进行操作`);
      }
    }
  },
  components: {
    noRecord,
    listBox
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #btcAccount{
    height:100%;
    .account_top{
      height:350px;
      text-align:center;
      .top_all{
        height:205px;
        background:linear-gradient(135deg, #036fd6, #013ed0);
        box-sizing: border-box;
        padding-top:45px;
        .all_num{
          line-height:70px;
          font-size:56px;
          color:#fff;
        }
        .all_text{
          font-size:24px;
          color:#97b7ff;
          line-height:52px;
        }
      }
      .top_accounts{
        height:145px;
        background:linear-gradient(135deg, #1c70d9, #1b4ad4);
        display:flex;
        .account{
          flex:1;
          display:flex;
          flex-wrap: wrap;
          align-content: center;
          justify-content: center;
          align-items: center;
          &:nth-child(2),&:nth-child(3){
            position:relative;
            &:before{
              position:absolute;
              content:'';
              display:block;
              left:0;
              top:50%;
              height:60px;
              width:4px;
              background:rgba(255, 255, 255, 0.2);
              border-radius: 2px;
              margin-top:-30px;
            }
          }
          .account_text{
            font-size:24px;
            color:#97b7ff;
            line-height:48px;
            width:100%;
          }
          .account_num{
            font-size:30px;
            color:#fff;
            line-height:54px;
            width:100%;
          }
        }
      }
    }
    .record_navs{
      display:flex;
      height:92px;
      line-height:92px;
      padding:0 20px;
      box-sizing: border-box;
      border-bottom:1PX solid $listBottomGray;
      justify-content: space-between;
      position:relative;
      &:before{
        position:absolute;
        content:'';
        display:block;
        width:23%;
        height:7px;
        top:50%;
        margin-top:-3px;
        background-color:#f3f3fb;
        left:18%;
        z-index:1;
      }
      &:after{
        position:absolute;
        content:'';
        display:block;
        width:23%;
        height:7px;
        top:50%;
        margin-top:-3px;
        background-color:#f3f3fb;
        right:18%;
        z-index:1;
      }
      .record_nav{
        width:18%;
        box-sizing: border-box;
        position:relative;
        color:#9297a5;
        font-size:26px;
        transition: all 0.5s ease;
        .iconfont{
          position:absolute;
          top:0;
          z-index: 2;
          color:#d9dcfb;
          font-size:25px;
        }
        &:nth-child(1), &:nth-child(2) {
          padding-left:30px;
          .iconfont{
            right:0;
          }
        }
        &:nth-child(3){
          text-align:right;
          padding-right:30px;
          .iconfont{
            left:0;
          }
        }
        &.active{
          color:$mainColor;
          .iconfont{
            color:$mainColor;
          }
        }
      }
    }
    .record_lists{
      height:100%;
      height:calc(100% - 540px);
      overflow-y: auto;
      padding-left:30px;
      .record_list{
        height:130px;
        border-bottom: 1PX solid $listBottomGray;
        display:flex;
        align-content: center;
        align-items: center;
        flex-wrap: wrap;
        padding-right:30px;
        .list_titles{
          width:100%;
          display:flex;
          justify-content: space-between;
          line-height:56px;
          .list_num{
            font-size:30px;
            font-weight: 600;
            &.red{
              color:#f75434;
            }
          }
        }
        .list_times{
          width:100%;
          display:flex;
          justify-content: space-between;
          .list_time{
            color:$lowGray;
            font-size:24px;
            line-height:50px;
          }
          .list_state{
            font-size:24px;
            &.gray{
              color:#b7bac3;
            }
            &.red{
              color:#f75434;
            }
            &.blue{
              color:$mainColor;
            }
          }
        }
      }
    }
    .account_btn{
      height:98px;
      width:100%;
      background-color:$mainColor;
      color:#fff;
      font-size:30px;
    }
  }
</style>
