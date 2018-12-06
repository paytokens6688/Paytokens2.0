<template>
  <div id="selectCoins">
    <div
      class="top"
      @click="importWord">
      <h5 class="top_prompt title_style">账户一键导入</h5>
      <p class="top_tap">
        （助记词使用）
        <i class="iconfont icon-fanhui"></i>
      </p>
    </div>
    <div class="main">
      <div class="main_all">
        <div class="main_all_left">
          <radio-list
            class="main_all_radio"
            :callback="coinSelectChangeAll"
            v-model="select.allSelect" />
          全选
        </div>
        <p class="main_all_right">切换方式</p>
      </div>
      <!-- 币种显示列表 -->
      <ul class="main_ul">
        <li
          class="main_li"
          v-for="item in select.canCreateCoins"
          :key="item.id">
          <radio-list
            class="main_li_radio"
            :callback="coinSelectChange(item)"
            v-model="item.select" />
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
            <div class="main_li_btns">
              <button
                class="main_li_btn"
                :class="{'main_li_btn_select': item.select && item.type === 'create'}"
                @click="coinTypeCange(item, 'create')">
                创建
              </button>
              <button
                class="main_li_btn"
                :class="{'main_li_btn_select': item.select && item.type === 'import'}"
                @click="coinTypeCange(item, 'import')">
                导入
              </button>
            </div>
          </div>
        </li>
      </ul>
      <!-- 分割线 -->
      <hr class="main_ul_hr" />
      <div style="height:1px"></div>
      <div class="min_ul_text">
        需付费创建
      </div>
      <!-- 币种显示列表 -->
      <ul class="main_ul">
        <li
          class="main_li"
          v-for="item in select.notCreateCoins"
          :key="item.id">
          <radio-list
            class="main_li_radio"
            v-model="item.select" />
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
            <div class="main_li_btns">
              <button
                class="main_li_btn_big"
                :class="{'main_li_btn_select': item.select && item.type === 'import'}">
                导入
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <button
      class="foot submit-button"
      @click="judgeSelectCoin">下一步</button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import radioList from '@/components/radio/radio.vue';
// import { setTimeout } from 'timers';

export default {
  name: 'selectCoins',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 选择币种类型
      select: {
        // 是否全选
        allSelect: true,
        // 可创建币种列表
        canCreateCoins: [
          // {
          //   id: 币种id,
          //   name: 币种名称,
          //   symbol: 币种符号,
          //   nameZh: 币种中文名,
          //   icon: 币种图标,
          //   select: 是否选择,
          //   type: 创建还是导入
          // }
        ],
        // 不可创建币种列表
        notCreateCoins: []
      }
    };
  },
  computed: {
    ...mapState({
      coins: state => state.storage.coins.main,
      pass: state => state.createAccount.pass
    })
  },
  beforeMount () {
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
    this.pageTitle('选择币种');
    this.coinsToClass();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      accountSiteType: 'createAccount/accountSiteType',
      saveData: 'createAccount/accountFrist'
    }),
    // 分类币种
    coinsToClass () {
      this.coins.map(item => {
        // 如果可创建的币种
        if (item.canCreate) {
          this.select.canCreateCoins.push({
            id: item.id,
            name: item.name,
            symbol: item.symbol,
            nameZh: item.nameZh,
            icon: item.icon,
            select: true,
            type: 'create'
          });
        } else {
          this.select.notCreateCoins.push({
            id: item.id,
            name: item.name,
            symbol: item.symbol,
            nameZh: item.nameZh,
            icon: item.icon,
            select: false,
            type: 'import'
          });
        }
      });
    },
    // 助记词导入
    importWord () {
      this.$router.push('/wallet/import_account_word');
    },
    // 币种切换
    coinTypeCange (item, type) {
      item.type = type;
    },
    // 币种全选，及全不选
    coinSelectChangeAll () {
      if (this.select.allSelect) {
        this.select.canCreateCoins.map(item => {
          item.select = true;
        });
      } else {
        this.select.canCreateCoins.map(item => {
          item.select = false;
        });
      }
    },
    // 单个币种选择方式判断是否需要全选
    coinSelectChange (obj) {
      return () => {
        if (obj.select) {
          let isSelectAll = true;
          this.select.canCreateCoins.map(item => {
            if (!item.select) {
              isSelectAll = false;
            }
          });
          this.select.allSelect = isSelectAll;
        } else {
          this.select.allSelect = false;
        }
      };
    },
    // 判断是否选择币种，如果没有选择任何币种，则不能进行下一步
    judgeSelectCoin () {
      let isSelectCoin = false;
      let coins = [];
      coins = coins.concat(this.select.canCreateCoins);
      coins = coins.concat(this.select.notCreateCoins);
      for (let i = 0; i < coins.length; i++) {
        if (coins[i].select) {
          isSelectCoin = true;
          break;
        }
      }
      if (!isSelectCoin) return this.$global.alertOptions('请至少选择一个币种');
      this.thenStep();
    },
    // 下一步
    thenStep () {
      // TODO: 需要加loading
      this.$global.loadingOptions({ show: true, time: 0 });
      let importArr = [];
      let createArr = [];
      this.select.canCreateCoins.map(item => {
        if (!item.select) return false;
        if (item.type === 'import') {
          importArr.push(item.id);
        } else {
          createArr.push(item.id);
        }
      });
      this.select.notCreateCoins.map(item => {
        if (!item.select) return false;
        importArr.push(item.id);
      });
      this.accountSiteType({
        importArr,
        createArr
      });
      // 创建助记词
      const { btcUnit: { createWord } } = require('@/assets/js/btc_func');
      this.saveData({
        importWord: createWord()
      });
      setTimeout(() => {
        if (importArr && importArr.length) {
          this.$router.push('/wallet/coins_import_list');
        } else {
          this.$router.push('/wallet/creact_account_site');
        }
      }, 2000);
    }
  },
  components: {
    radioList
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #selectCoins {
    $theTopHeight: 86px;
    $theFootHeight: 98px;
    position: relative;
    // 标题元素
    .title_style {
      color: #9297a5;
      font-weight: 500;
      font-size: 28px;
      line-height: $theTopHeight;
    }
    .top {
      height: $theTopHeight;
      line-height: $theTopHeight;
      @include eleBottomShadown();
      padding: 0 30px;
      .top_prompt {
        float: left;
      }
      .top_tap {
        float: right;
        color: $lowGray;
        font-size: 24px;
        .icon-fanhui {
          float: right;
          font-size: 24px;
          color: $gray;
          transform: rotateZ(180deg);
        }
      }
    }
    .main {
      height: calc(100% - #{$theTopHeight} - #{$theFootHeight});
      overflow-y: auto;
      padding-left: 30px;
      padding-top:20px;
      .main_all {
        padding-top: 15px;
        line-height: 40px;
        overflow: hidden;
        padding-right: 30px;
        .main_all_left {
          float: left;
          color: $lowGray;
          font-size: 24px;
          .main_all_radio {
            float: left;
            margin-right: 30px;
          }
        }
        .main_all_right {
          float: right;
          color: $lowGray;
          font-size: 24px;
        }
      }
      .min_ul_text{
        margin-top:20px;
        font-size:24px;
        color: $lowGray;
        text-align:right;
        padding-right:30px;
      }
      .main_ul {
        padding-top: 20px;
        .main_li {
          padding-bottom: 30px;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .main_li_inner {
            background: #f3f4f8;
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
            .main_li_btns {
              float: right;
              padding-top: 30px;
              overflow: hidden;
              width: 260px;
              .main_li_btn {
                float: left;
                width: 50%;
                height: 72px;
                line-height: 72px;
                background: $listBottomGray;
                color: #9297a5;
                font-size: 28px;
                &:nth-child(1) {
                  border-top-left-radius: 10px;
                  border-bottom-left-radius: 10px;
                }
                &.main_li_btn_select {
                  background: $mainColor;
                  color: #fff;
                }
              }
              .main_li_btn_big {
                @extend .main_li_btn;
                width: 100%;
              }
            }
          }
        }
      }
      .main_ul_hr {
        background: $listBottomGray;
        border: none;
        height: 1Px;
        width: 650px;
        float: right;
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
