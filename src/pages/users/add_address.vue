<template>
  <div id="addAddress">
    <div class="main">
      <!-- 选择币种 -->
      <div class="list" v-if="!address.icon" @click="popAddress">
        <span>选择币种</span>
        <i class="iconfont icon-you"></i>
      </div>
      <!-- 已选币种 -->
      <div class="list" v-if="address.icon" @click="popAddress">
        <div class="coin_left">
          <img class="coin_img" :src="address.icon"/>
          <div class="list_right">
            <div class="coin_name">
              {{address.name}}
              <span class="zh_name">/{{address.zh_name}}</span>
            </div>
            <div class="coin_addresss">{{address.coin}}</div>
          </div>
        </div>
        <i class="iconfont icon-you"></i>
      </div>
    </div>
    <!-- 输入币种地址的信息 -->
    <div class="info_main" >
      <div class="infor">
        <span>名称</span>
        <div class="edit_info">
          <input class="input" type="text" placeholder="输入名称" v-model="address_name">
        </div>
      </div>
      <div class="infor">
        <span>地址</span>
        <div class="edit_info">
          <input class="input" type="text" placeholder="输入地址" v-model="address_add">
          <i
            class="iconfont icon-saoma"
            @click="flicking"></i>
        </div>
      </div>
    </div>
    <!-- 保存信息 -->
    <div class="main">
      <button
        class="form_submit submit-button"
        @click="goSave">保存</button>
    </div>
    <!-- 选择币种的弹窗 -->
    <div class="pop_main" v-if="popShow">
      <div class="pop_container">
        <div class="pop_head">
          <span>选择币种</span>
          <i class="iconfont icon-guanbi1" @click="closePop"></i>
        </div>
        <div class="pop_data">
          <div class="list"
          v-for="(item, index) in addressData" :key="index"
          @click="selectAddress(item)">
            <img class="coin_img" :src="item.icon"/>
            <div class="list_right">
              <div class="coin_name">
                {{item.name}}
                <span class="zh_name">/{{item.zh_name}}</span>
              </div>
              <div class="coin_addresss">{{item.coin}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'add_address',
  layout (context) {
    return 'back_page';
  },
  head () {
    // 返回头部信息
    return {
      title: '添加地址'
    };
  },
  data () {
    return {
      // 内容显示列表
      address: {
        // 币种名字
        name: '',
        // 币种中文名字
        zh_name: '',
        // 币种图标
        icon: '',
        // 币种英文名字
        coin: '',
        // 币种ID
        id: ''
      },
      // 可选择的币种
      addressData: [],
      // 地址名称
      address_name: '',
      // 地址
      address_add: '',
      popShow: false
    };
  },
  computed: {
    ...mapState({
      mainCoins: state => state.storage.coins.main,
      alsoUseSite: state => state.storage.alsoUseSite
    })
  },
  beforeMount () {
    this.pageTitle({
      title: '添加地址',
      shadown: true
    });
    this.initPage();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      addalsoUseSite: 'storage/addalsoUseSite'
    }),
    // 初始化页面
    initPage () {
      this.addressData = this.mainCoins.map((item) => {
        return {
          name: item.symbol,
          zh_name: item.nameZh,
          icon: item.icon,
          coin: item.name,
          id: item.id
        };
      });
      this.address = this.addressData[this.$route.query.navSelected - 1];
    },
    // 扫一扫
    flicking () {
      this.$global.notOpenOptions();
    },
    // 选择地址,弹窗出现
    popAddress () {
      this.popShow = true;
    },
    // 关闭按钮关闭弹窗
    closePop () {
      this.popShow = false;
    },
    // 选中某一种，弹窗消息
    selectAddress (coin) {
      this.address = coin;
      this.popShow = false;
    },
    // 保存信息
    goSave () {
      if (!this.address_name) {
        this.$global.alertOptions('地址名称不能为空');
      } else if (!this.address_add) {
        this.$global.alertOptions('详细地址不能为空');
      } else {
        this.addalsoUseSite({
          coinId: this.address.id,
          site: {
            site: this.address_add,
            siteName: this.address_name,
            id: `${this.address.id}_${Math.random(new Date()).toString().replace('.', '')}`
          }
        });
        this.$global.successOptions('保存成功');
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #addAddress {
    height: 100%;
    overflow: hidden;
    .main {
      padding: 0 30px;
      box-sizing: border-box;
      // 选择币种
      .list{
        line-height: 130px;
        margin-top: 30px;
        background: #fff;
        border-radius: 5px;
        padding: 0px 40px 0;
        box-sizing: border-box;
        box-shadow: 0 0 20px 4px #eef0f9;
        font-size: 28px;
        color: #1d3cbc;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .iconfont{
          color: #9da2b2;
        }
        .coin_left{
          width: 100%;
          display: flex;
          align-items: center;
          .coin_img{
            width: 44px;
            height: 44px;
            margin-right: 20px;
          }
          .list_right{
            width: 100%;
            height: 70px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .coin_name{
              color: #222222;
              font-size: 34px;
              line-height: 1;
              font-weight: bold;
              .zh_name{
                font-size: 22px;
                color: #b7bac3;
                font-weight: 100;
              }
            }
            .coin_addresss{
              line-height: 1;
              font-size: 26px;
              color: #b7bac3;
            }
          }
        }
      }
      // 保存信息
      .form_submit {
        margin-top: 80px;
      }
    }
    // 输入币种地址的信息
    .info_main{
      padding-left: 30px;
      box-sizing: border-box;
      .infor{
        border-bottom: 1Px solid #eaecf1;
        height: 100px;
        padding-top: 20px;
        box-sizing: border-box;
        font-size: 28px;
        color: #222222;
        display: flex;
        align-items: center;
        .edit_info{
          width: 80%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-left: 64px;
          .input{
            width: 86%;
          }
          .iconfont{
            padding: 14px;
            color: #4d5169;
            font-size: 34px;
          }
        }
      }
    }
    // 选择币种的弹窗
    .pop_main{
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1000;
      background: rgba(0, 0, 0, 0.6);
      .pop_container{
        width: 690px;
        height: 1072px;
        border-radius: 10px;
        background-color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .pop_head{
          border-bottom: 1Px solid #eaecf1;
          padding: 0 40px;
          box-sizing: border-box;
          line-height: 90px;
          font-size: 26px;
          color: #222222;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .iconfont{
            font-size: 40px;
            color: #9da2b2;
          }
        }
        .pop_data{
          height: 970px;
          padding-left: 40px;
          padding-right: 4px;
          box-sizing: border-box;
          overflow: auto;
          .list{
            border-bottom: 1Px solid #eaecf1;
            line-height: 130px;
            height: 130px;
            background: #fff;
            padding: 0 32px;
            box-sizing: border-box;
            font-size: 28px;
            display: flex;
            align-items: center;
            .coin_img{
              width: 44px;
              height: 44px;
              margin-right: 20px;
            }
            .list_right{
              width: 100%;
              height: 70px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              .coin_name{
                color: #222222;
                font-size: 34px;
                line-height: 1;
                font-weight: bold;
                .zh_name{
                  font-size: 22px;
                  color: #b7bac3;
                  font-weight: 100;
                }
              }
              .coin_addresss{
                line-height: 1;
                font-size: 26px;
                color: #b7bac3;
              }
            }
          }
        }
      }
    }
  }
</style>
