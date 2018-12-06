<template>
  <div id="copyAccountTypeCoins" class="copy_account_type_coins">
    <ul class="main_ul">
      <li
        class="main_li"
        v-for="item in coinsList"
        :key="item.id">
        <div class="main_li_inner">
          <div class="main_li_info">
            <img
              class="main_li_icon"
              :src="item.icon"
              :alt="item.name" />
            <div class="main_li_text">
              <p
                class="main_li_sym"
                :data-name-zh="`/${item.nameZh}`">
                {{ item.symbol }}
              </p>
              <p class="main_li_name">
                {{ item.name }}
              </p>
            </div>
          </div>
        </div>
        <button
          class="main_li_copy"
          :class="{'main_li_copyed': item.copyed}"
          @click="goCopy(item)">
          {{ item.copyed ? '已备份' : '备份' }}
        </button>
      </li>
    </ul>
    <button
      class="submit-button go_home"
      @click="goHome">备份完成，去首页</button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'copyAccountTypeCoins',
  data () {
    return {
      coinsList: [
        // {
        //   id: 币种id,
        //   name: '币种名称',
        //   symbol: '币种符号',
        //   nameZh: 币种中文名,
        //   icon: 币种图标,
        //   copyed: 是否已备份
        // }
      ]
    };
  },
  computed: {
    ...mapState({
      account: state => state.storage.userInfo.accounts,
      coins: state => state.storage.coins.main
    })
  },
  mounted () {
    this.account[this.$route.query.id - 0].siteOfWord.map((item) => {
      let obj = {
        copyed: item.copyed,
        id: this.$route.query.id + '-' + item.type
      };
      this.coins.map(coin => {
        if (coin.id === item.type) {
          obj = {
            ...coin,
            ...obj
          };
        }
      });
      this.coinsList.push(obj);
    });
    console.log();
  },
  methods: {
    // 去备份
    goCopy (coin) {
      this.$router.push({
        path: '/wallet/copy_private',
        query: {
          id: coin.id
        }
      });
    },
    // 备份完成去首页
    goHome () {
      this.$router.push('/wallet');
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #copyAccountTypeCoins {
    &.main.copy_account_type_coins {
      padding-left: 0;
      padding-right: 0;
      padding-bottom: 88px;
    }
    .main_ul {
      padding-top: 30px;
      height: 100%;
      box-sizing: border-box;
      padding-left: 50px;
      padding-right: 50px;
      overflow-y: auto;
      .main_li {
        margin-bottom: 30px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 10px;
        position: relative;
        box-shadow: 0 0 20px 2px rgba(27, 55, 173, 0.1);
        background: #fff;
        .main_li_inner {
          width: 650px;
          overflow: hidden;
          .main_li_info {
            float: left;
            display: flex;
            align-items: center;
            padding-left: 25px;
            padding-top: 30px;
            padding-bottom: 20px;
            .main_li_icon {
              width: 44px;
              height: 44px;
              display: block;
            }
            .main_li_text {
              padding-left: 25px;
              .main_li_sym {
                line-height: 44px;
                font-size: 34px;
                font-weight: 900;
                &:after {
                  content: attr(data-name-zh);
                  font-size: 24px;
                  color: $lowGray;
                  font-weight: 500;
                  letter-spacing: 1Px;
                }
              }
              .main_li_name {
                font-size: 26px;
                color: $lowGray;
                line-height: 38px;
              }
            }
          }
        }
        .main_li_copy {
          width: 160px;
          height: 70px;
          position: absolute;
          right: 0;
          top: 50%;
          margin-top: -35px;
          font-size: 28px;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          color: #fff;
          background: $mainColor;
          &.main_li_copyed {
            background: $listBottomGray;
            color: $gray;
          }
        }
      }
    }
    .go_home {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      border-radius: 0;
    }
  }
</style>
