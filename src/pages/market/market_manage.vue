<template>
  <div id="marketManage">
    <div class="coller_coins">
      <div class="coller_title">
        已关注
      </div>
      <div class="coller_lists">
        <div
          class="coller_list coller"
          v-for="(item, index) in collerCoins"
          :key="index"
          @click="goDetail(item.id, 1)">
          <div class="list_infos">
            <div class="list_imgs">
              <img :src="item.image" alt="">
            </div>
            <div class="list_names">
              <div class="list_names_1">
                <span class="list_name_en">
                  {{item.name}}
                </span>
                <span
                  class="list_name_cn"
                  v-show="item.name_cn !== '－'">
                  /{{item.name_cn}}
                </span>
              </div>
              <div class="list_names_2">
                {{item.symbol}}
              </div>
            </div>
          </div>
          <div
            class="list_btn orange"
            @click.stop="cancelCollerCoin(index)">
            取消关注
          </div>
        </div>
      </div>
    </div>
    <div class="coller_coins">
      <div
        class="coller_title"
        v-show="moreCoins.length">
        更多行情
      </div>
      <div class="coller_lists">
        <div
          class="coller_list"
          v-for="(item, index) in moreCoins"
          :key="index"
          @click="goDetail(item.id, 2)">
          <div class="list_infos">
            <div class="list_imgs">
              <img :src="item.image" alt="">
            </div>
            <div class="list_names">
              <div class="list_names_1">
                <span class="list_name_en">
                  {{item.name}}
                </span>
                <span
                  class="list_name_cn"
                  v-show="item.name_cn !== '－'">
                  /{{item.name_cn}}
                </span>
              </div>
              <div class="list_names_2">
                {{item.symbol}}
              </div>
            </div>
          </div>
          <div
            class="list_btn blue"
            @click.stop="collerCoin(index)">
            关注
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
export default {
  name: 'marketManage',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      collerCoins: [],
      moreCoins: []
    };
  },
  beforeMount () {
    // 头部
    this.pageTitle({ title: '管理行情', shadown: true });
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
    // 获取数据
    getInfo () {
      this.getUserInfo('marketList')
        .then((data) => {
          this.collerCoins = data;
        });
      this.getUserInfo('marketListHidden')
        .then((data) => {
          if (data) {
            this.moreCoins = data;
            console.log(this.moreCoins);
          }
        });
    },
    // 取消关注币种
    cancelCollerCoin (index) {
      let coin = this.collerCoins[index];
      this.collerCoins.splice(index, 1);
      this.moreCoins.push(coin);
      this.saveCoins();
    },
    // 关注币种
    collerCoin (index) {
      let coin = this.moreCoins[index];
      this.moreCoins.splice(index, 1);
      this.collerCoins.push(coin);
      this.saveCoins();
    },
    // 储存币种
    saveCoins () {
      this.saveUserInfo({
        type: 'marketList',
        data: this.collerCoins
      });
      this.saveUserInfo({
        type: 'marketListHidden',
        data: this.moreCoins
      });
    },
    // 查看详情
    goDetail (id, index) {
      this.$router.push({
        path: '/market/market_detail',
        query: {
          id: id,
          isColler: index
        }
      });
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #marketManage{
    background-color:#fff;
    .coller_coins{
      .coller_title{
        height:72px;
        line-height:72px;
        padding:0 30px;
        font-size:24px;
        color:#666;
        background-color:#fafafc;
      }
      .coller_lists{
        padding-left:30px;
        .coller_list{
          border-bottom:1PX solid $listBottomGray;
          height:130px;
          display:flex;
          justify-content: space-between;
          align-items: center;
          padding-right:30px;
          &.coller:last-child{
            border:0;
          }
          .list_infos{
            display:flex;
            align-items: center;
            .list_imgs{
              height:44px;
              width:44px;
              overflow: hidden;
              border-radius: 50%;
              margin-right:20px;
              img{
                width:100%;
                height:100%;
              }
            }
            .list_names{
              .list_names_1{
                .list_name_en{
                  font-size:34px;
                  font-weight: 600;
                }
                .list_name_cn{
                  font-size:22px;
                  color:$lowGray;
                }
              }
              .list_names_2{
                font-size:26px;
                color:$lowGray;
                line-height:46px;
              }
            }
          }
          .list_btn{
            width:120px;
            height:54px;
            box-sizing: border-box;
            border-radius: 10px;
            text-align:center;
            line-height:52px;
            font-size:24px;
            &.orange{
              color:#f75434;
              border:1PX solid #f75434;
              background-color:#feeeea;
            }
            &.blue{
              color:$darkBlue;
              border:1PX solid $darkBlue;
              background-color:#e7e9f3;
            }
          }
        }
      }
    }
  }
</style>
