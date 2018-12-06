<template>
  <div id="rollOutRule">
    <div class="rule_lists">
      <div
        class="rule_list"
        v-for="(item, index) in rules"
        :key="index">
        <div class="list_title">
          {{item.title}}
        </div>
        <div
          class="list_info"
          v-html="item.info">
        </div>
        <img
        class="list_img"
        :src="item.img"
        alt="规则"
        v-if="item.img">
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'rollOutRule',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      rules: [
        {
          title: '转出',
          info: '<p>AI投资成功后，需要进行转出操作，可申请转出本金，待平台确认转出后，将不再参与投资收益。资金将会在收益结束后，返还至您提供的钱包。</p>'
        },
        {
          title: '浮亏',
          info: '<p>收益结算后若出现浮亏，平台将会在您的投资金额中扣除相对应浮亏的金额。您转出的操作，实际收到的金额回低于您提交转出申请的金额。</p><p>（实收金额=投资金额-浮亏金额）</p>'
        },
        {
          title: '结算周期',
          info: '<p>账户正处于交易中，停止交易将影响账户整体收益，转出结算为每周一上午统一结算发放。</p>',
          img: require('../../assets/images/trade_detail_rule_img_3.jpg')
        }
      ]
    };
  },
  beforeMount () {
    // 头部
    this.pageTitle({ title: '转出规则', shadown: true });
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    })
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #rollOutRule{
    height:100%;
    .rule_lists{
      padding-left:70px;
      padding-top:30px;
      position:relative;
      &:after{
        position:absolute;
        content:'';
        display:block;
        width:22px;
        height:580px;
        background-image: url('../../assets/images/trade_detail_icon_2.png');
        background-size:100% 100%;
        left:30px;
        top:65px;
      }
      .list_title{
        line-height:88px;
      }
      .list_info{
        background-color:#f5f6fa;
        color:#9297a5;
        font-size:24px;
        line-height:48px;
        padding: 10px 30px 10px 15px;
        margin-bottom:10px;
        p{
          text-indent: 2em;
        }
      }
      .list_img{
        width:calc(100% - 30px);
      }
    }
  }
</style>
