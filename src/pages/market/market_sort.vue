<template>
  <div id="marketSort">
    <div class="sort_title">
      <div class="title_left">
        币种
      </div>
      <div class="title_right">
        点击置顶
      </div>
    </div>
    <div class="sort_lists">
      <div
        class="sort_list"
        v-for="(item, index) in coins"
        :key="index">
        <div class="list_info">
          <div class="list_names">
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
        <span
          class="iconfont icon-totop"
          @click="coinToTop(index)"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
export default {
  name: 'marketSort',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      coins: []
    };
  },
  beforeMount () {
    // 头部
    this.pageTitle({ title: '排序', shadown: true });
    this.getInfo();
  },
  methods: {
    ...mapActions({
      saveUserInfo: 'storage/saveUserInfo',
      getUserInfo: 'storage/getUserInfo'
    }),
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 币种排序
    coinToTop (index) {
      let coin = this.coins[index];
      this.coins.splice(index, 1);
      this.coins.unshift(coin);
      this.saveUserInfo({
        type: 'marketList',
        data: this.coins
      });
    },
    // 获取数据
    getInfo () {
      this.getUserInfo('marketList')
        .then((data) => {
          this.coins = data;
        });
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #marketSort{
    .sort_title{
      height:72px;
      padding:0 30px;
      line-height:72px;
      display:flex;
      justify-content: space-between;
      font-size:24px;
      color:#9297a5;
      border-bottom:1PX solid #f5f5f8;
    }
    .sort_lists{
      padding-left:30px;
      .sort_list{
        box-sizing: border-box;
        border-bottom:1PX solid #f5f5f8;
        height:130px;
        display:flex;
        justify-content: space-between;
        padding-right:30px;
        align-items: center;
        .list_info{
          .list_names{
            .list_name_en{
              font-size:34px;
              font-weight: 600;
            }
            .list_name_cn{
              font-size:22px;
              color:$lowGray;
            }
          }
          .list_name_all{
            color:$lowGray;
            font-size:26px;
            line-height:46px;
          }
        }
        .icon-totop{
          font-size:35px;
          color:$darkBlue;
          padding:0 25px;
        }
      }
    }
  }
</style>
