<template>
  <div id="transitionIn">
    <qrcode
      class="code_img"
      :options="{padding: 20, size: 340}"
      :value="`${coinType.toLocaleLowerCase()}:${site}?amount=${value}&token=${coinType}`"/>
    <p class="set_value">
      <span
        class="set_value_inner"
        @click="setValue">
        {{ this.value ? `${this.value} ${coinType}` : '设置收款金额' }}
      </span>
    </p>
    <div class="site">
      <input
        readonly
        class="site_input"
        type="text"
        id="siteInput"
        :value="site">
      <img
        class="site_copy"
        src="../../assets/images/copy_icon.png"
        data-clipboard-target="#siteInput">
    </div>
    <set-number
      :coinType="coinType"
      :close="() => { this.numberBoxShow = false;}"
      :submit="setMoneyValue"
      :value="value"
      v-show="numberBoxShow" />
  </div>
</template>

<script>
import Vue from 'vue';
import { mapMutations, mapState } from 'vuex';
import setNumber from '@/components/popup/set_number.vue';
import VueQrcode from '@xkeshi/vue-qrcode';
Vue.component(VueQrcode.name, VueQrcode);

export default {
  name: 'transitionIn',
  layout: 'back_page',
  data () {
    return {
      // 币种
      coinType: '',
      // 地址
      site: this.$route.query.key,
      // 数量
      value: '',
      // 数量框显示
      numberBoxShow: false
    };
  },
  computed: {
    ...mapState({
      coins: state => state.storage.coins
    })
  },
  beforeMount () {
    this.pageTitle({
      title: '转入',
      shadown: true
    });
  },
  mounted () {
    // 添加拷贝事件
    this.copyFunc({
      ele: '.site_copy',
      self: this
    });
    this.initCoins();
  },
  beforeDestroy () {
    // 页面切换关闭成功弹窗
    this.$global.successOptions(false);
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      copyFunc: 'copyTextFunc'
    }),
    // 更改币种
    initCoins () {
      const coinType = this.$route.query.coinType.split('-');
      if (coinType.length === 1) {
        // 主链
        this.coins.main.map(coin => {
          if (coin.id === coinType[0]) {
            this.coinType = coin.symbol;
          }
        });
      } else {
        // 代币
        this.coins.other.ETH.map((coin) => {
          if (coin.id === this.$route.query.coinType) {
            this.coinType = coin.symbol;
          }
        });
      }
    },
    // 设置首款金额
    setValue () {
      this.numberBoxShow = true;
    },
    // 设置收款金额弹窗事件
    setMoneyValue (number) {
      this.numberBoxShow = false;
      this.value = number;
    }
  },
  components: {
    setNumber
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #transitionIn {
    .code_img {
      width: 380px;
      height: 380px;
      margin: 50px auto;
      display: block;
      box-shadow: 0 0 18px 3px rgba(27, 55, 173, 0.1);
    }
    .set_value {
      text-align: center;
      color: $mainColor;
    }
    .site {
      background: #f3f4f8;
      padding: 25px 0 25px 40px;
      margin: 60px 30px;
      position: relative;
      .site_input {
        padding-right: 80px;
        box-sizing: border-box;
        width: 100%;
      }
      .site_copy {
        width: 38px;
        height: 38px;
        position: absolute;
        top: 26px;
        right: 22px;
      }
    }
  }
</style>
