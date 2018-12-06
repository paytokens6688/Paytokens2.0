<template>
  <div id="selectAccount">
    <div class="account_lists">
      <div
        class="account_list"
        @click="selectEarnAccount">
        <div class="list_top">
          <div class="list_info">
            <div class="iconfont icon-zhanghu"></div>
            <div class="list_name">
              收益账户
            </div>
          </div>
          <div class="list_num">
            可转 {{earnNum}} {{type}}
          </div>
        </div>
      </div>
      <div
        class="account_list"
        @click="accountSelect">
        <div class="list_top">
          <div class="list_info">
            <div class="iconfont icon-zhanghu"></div>
            <div class="list_name">
              本金账户
            </div>
          </div>
          <div class="list_num">
            {{principal}} {{type}}
            <span class="iconfont icon-you"></span>
          </div>
        </div>
        <div
          class="fund_lists"
          v-show="fundShow">
          <div
            class="fund_list"
            v-for="(item, index) in funds"
            :key="index"
            @click="selectAccount(index)">
            <span class="list_title">
              {{item.invest}}
            </span>
            <span class="list_num">
              可转 {{item.number}} {{type}}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'selectAccount',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 币种
      type: this.$route.query.type,
      // 收益账户
      earnNum: '0',
      // 本金账户
      principal: '0',
      // 本金列表是否显示
      fundShow: false,
      // 本金账户列表
      funds: []
    };
  },
  beforeMount () {
    // 头部
    this.pageTitle({ title: '选择账户', shadown: true });
    this.getInfo();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 选择收益
    selectEarnAccount () {
      let accountType = {
        type: 1
      };
      localStorage.setItem('accountType', JSON.stringify(accountType));
      this.$router.go(-1);
    },
    // 本金列表显示
    accountSelect () {
      if (this.funds.length === 0) {
        this.$global.alertOptions('暂无可转出本金');
      } else {
        this.fundShow = !this.fundShow;
      }
    },
    // 选择本金账户
    selectAccount (index) {
      let accountType = {
        type: 2,
        id: this.funds[index].invest_id
      };
      localStorage.setItem('accountType', JSON.stringify(accountType));
      this.$router.go(-1);
    },
    // 获取本金
    getInfo () {
      // 获取本金
      this.$axios.get('/v1/ai/enter/capital', {
        params: {
          class: this.type === 'BTC' ? 1 : 2
        }
      })
        .then(({ data }) => {
          if (data.status === 200) {
            this.funds = data.data;
            let allNum = 0;
            for (let i = 0; i < this.funds.length; i++) {
              allNum += this.funds[i].number;
            }
            this.principal = allNum;
          }
        });
      // 获取收益账户余额
      this.$axios.get('/v1/ai/profit_balance')
        .then(({ data }) => {
          if (data.status === 200) {
            if (this.type === 'BTC') {
              this.earnNum = data.data.btc;
            } else {
              this.earnNum = data.data.eth;
            }
          }
        });
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #selectAccount {
    height:100%;
    .account_lists{
      padding:40px 30px 0;
      .account_list{
        min-height:130px;
        border-radius: 10px;
        @include eleBottomShadown();
        margin-bottom:20px;
        .list_top{
          height:130px;
          display:flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 30px;
          .list_info{
            display:flex;
            align-items: center;
            .iconfont{
              width:44px;
              height:44px;
              background-color:#eaecf1;
              color:#9297a5;
              font-size:25px;
              text-align:center;
              line-height:44px;
              border-radius: 50%;
              margin-right:25px;
            }
          }
          .list_num{
            font-size:26px;
            color:#9297a5;
            .iconfont{
              font-size:30px;
              margin-left:5px;
            }
          }
        }
        .fund_lists{
          .fund_list{
            height:113px;
            border-top:1PX solid $listBottomGray;
            padding:0 70px  0 25px;
            display:flex;
            justify-content: space-between;
            align-items: center;
            .list_num{
              font-size:26px;
              color:#9297a5;
            }
          }
        }
      }
    }
  }
</style>
