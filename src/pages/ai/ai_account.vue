<template>
  <div id="aiAccount">
    <div class="account_navs">
      <nuxt-link
        :to="{path: item.path, query: {navIndex: index}}"
        tag="div"
        class="account_nav"
        :class="{'active': navIndex === index}"
        v-for="(item, index) in navs"
        :key="index"
        @click="navToggle(index)"
        replace>
        {{item.title}}
        </nuxt-link>
    </div>
    <!-- 子路由 -->
    <nuxt-child class="account_child"></nuxt-child>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'aiAccount',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 选择的导航(默认第一个)
      navIndex: Number(this.$route.query.navIndex) || 0,
      // 导航栏
      navs: [
        {
          title: 'BTC',
          path: '/ai/ai_account/btc_account'
        },
        {
          title: 'ETH',
          path: '/ai/ai_account/eth_account'
        },
        {
          title: '推广收益',
          path: '/ai/ai_account/promote_earn'
        }
      ]
    };
  },
  beforeMount () {
    this.pageTitle('AI 账户');
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 切换导航
    navToggle (index) {
      this.navIndex = index;
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #aiAccount{
    height:100%;
    .account_navs{
      height:80px;
      display:flex;
      .account_nav{
        flex:1;
        text-align:center;
        line-height:80px;
        font-size:26px;
        color:#9297a5;
        transition: all 0.5s ease;
        &.active{
          color:$mainColor;
          position:relative;
          &:after{
            position:absolute;
            content:'';
            display:block;
            width:80px;
            height:6px;
            border-radius: 3px;
            bottom:0;
            left:50%;
            margin-left:-40px;
            background-color:$mainColor;
          }
        }
      }
    }
    .account_child{
      height:calc(100% - 80px);
    }
  }
</style>
