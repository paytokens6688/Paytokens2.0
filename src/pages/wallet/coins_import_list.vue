<template>
  <div id="coinsImportList">
    <div class="main">
      <div class="type">
        <p class="type_coin type_type">币种</p>
        <p class="type_state type_type">状态</p>
      </div>
      <ul class="lists">
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
            <button
              class="main_li_type"
              :class="{'main_li_imported': item.imported}"
              @click="importCoin(item)">
              {{ item.imported ? '已导入' : '导入' }}
            </button>
          </div>
        </li>
      </ul>
    </div>
    <button
      class="foot submit-button"
      @click="thenStep">下一步</button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'coinsImportList',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 币种列表
      coinsList: [
        // {
        //   id: 币种id,
        //   name: 币种名称,
        //   symbol: 币种符号,
        //   nameZh: 币种中文名,
        //   icon: 币种图标,
        //   imported: 是否已导入
        // }
      ]
    };
  },
  computed: {
    ...mapState({
      importArray: state => state.createAccount.importArray,
      createArray: state => state.createAccount.createArray,
      importCoins: state => state.createAccount.importCoins,
      pass: state => state.createAccount.pass,
      coins: state => state.storage.coins.main,
      createAccountInfo: state => state.createAccount,
      accountsList: state => state.storage.userInfo.accounts
    })
  },
  beforeMount () {
    if (this.importArray.length === 0) return this.thenStep();
    this.pageTitle({
      title: '导入列表',
      shadown: true
    });
    this.imprtInit();
  },
  mounted () {
    this.$global.loadingOptions(false);
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      copyLowToLong: 'storage/copyLowToLong'
    }),
    // 判断哪些账户需要导入，哪些导入了
    imprtInit () {
      // 如果没有密码
      if (!this.$func.realPayPass(this.pass)) {
        return this.$global.alertOptions({
          message: '您的创建账户信息因您退出而清除，请重新填写',
          callbackList: [
            {
              title: '知道了',
              callback: () => {
                this.$router.replace('/wallet/create_account');
              }
            }
          ]
        });
      }
      this.coinsList = this.coins.filter(item => {
        // 先判断哪些需要导入
        return this.importArray.indexOf(item.id) !== -1;
      }).map(item => {
        // 是否已经导入币种
        let isImported = false;
        this.importCoins.map(coin => {
          if (coin.id === item.id) isImported = true;
        });
        // 循环返回值
        return {
          id: item.id,
          name: item.name,
          symbol: item.symbol,
          nameZh: item.nameZh,
          icon: item.icon,
          imported: isImported
        };
      });
    },
    // 导入方法
    importCoin (coin) {
      if (coin.imported) return false;
      this.$router.push({
        path: '/wallet/import_coin/private_key',
        query: {
          id: coin.id
        }
      });
    },
    // 下一步
    thenStep () {
      this.$global.loadingOptions(true);
      // 判断是否有未导入的币种
      const noImported = this.coinsList.filter(coin => !coin.imported).map(item => item.symbol);
      // 如果没有未导入和为创建的账户，创建成功
      if (!noImported.length && !this.createArray.length) return this.successAlert();
      // 如果有未创建的账户，去创建账户页面
      if (!noImported.length && this.createArray.length) return this.$router.replace('/wallet/creact_account_site');
      this.$global.loadingOptions(false);
      // 是否全部导入
      this.$global.alertOptions({
        message: `您的${noImported.join('、')}币种未导入，是否确认放弃该币种导入，继续创建账户？`,
        callbackList: [
          {
            title: '取消'
          },
          {
            title: '确认',
            callback: () => {
              if (this.createArray.length) return this.$router.replace('/wallet/creact_account_site');
              this.successAlert();
            }
          }
        ]
      });
    },
    // 创建成功提示
    successAlert () {
      // 储存账户信息
      this.copyLowToLong(this.createAccountInfo);
      this.$global.loadingOptions(false);
      this.$global.successOptions({
        message: '账户创建成功',
        callback: () => {
          this.$router.replace({
            path: '/wallet/copy_account',
            query: {
              id: this.accountsList.length - 1
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  $theFootHeight: 98px;
  #coinsImportList {
    padding-left: 30px;
    .main {
      height: calc(100% - #{$theFootHeight});
    }
    .type {
      height: 80px;
      padding-top: 10px;
      line-height: 80px;
      overflow: hidden;
      background: #fff;
      padding-right: 30px;
      .type_type {
        color: $lowGray;
        font-size: 24px;
        padding: 0 30px;
        &.type_coin {
          float: left;
        }
        &.type_state {
          float: right;
        }
      }
    }
    .lists {
      height: calc(100% - 90px);
      overflow-y: auto;
      .main_li {
        padding-bottom: 30px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .main_li_inner {
          background: #f3f4f8;
          width: 100%;
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
          .main_li_type {
            float: right;
            width: 160px;
            margin-top: 30px;
            background: $mainColor;
            color: #fff;
            font-size: 28px;
            height: 72px;
            line-height: 72px;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
            &.main_li_imported {
              background: $listBottomGray;
              color: $gray;
            }
          }
        }
      }
    }
    .foot {
      height: $theFootHeight;
      line-height: $theFootHeight;
      border-radius: 0;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
</style>
