<template>
  <div id="foot">
    <div
      class="foot-nav"
      :class="{'foot-nav-selected': index === 0}"
      @click="goPage('/wallet')">
      <p class="foot-icon iconfont icon-zichan"></p>
      <p class="foot-nav-name">资产</p>
    </div>
    <div
      class="foot-nav"
      :class="{'foot-nav-selected': index === 1}"
      @click="goPage('/market/market')">
      <p class="foot-icon iconfont icon-hangqing"></p>
      <p class="foot-nav-name">行情</p>
    </div>
    <div
      class="foot-nav"
      :class="{'foot-nav-selected': index === 2}"
      @click="goPage('/ai/ai_smart_trade')">
      <img
        class="foot-ai"
        src="@/assets/images/footer_nav_center.gif"
        alt="AI">
    </div>
    <div
      class="foot-nav"
      :class="{'foot-nav-selected': index === 3}"
      @click="goPage('/users/link_headline')">
      <p class="foot-icon iconfont icon-faxian"></p>
      <p class="foot-nav-name">链上头条</p>
    </div>
    <div
      class="foot-nav"
      :class="{'foot-nav-selected': index === 4}"
      @click="goPage('/users/user')">
      <p class="foot-icon iconfont icon-wode"></p>
      <p class="foot-nav-name">我的</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'foot',
  data () {
    return {
    };
  },
  methods: {
    goPage (path) {
      this.$router.push(path);
    }
  },
  props: {
    index: Number
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #foot {
    display: flex;
    justify-content: space-around;
    height: 98px;
    box-shadow: 0 0 18px 3px rgba(27, 55, 173, 0.1);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 5;
    background: #fff;
    .foot-nav {
      width: 5em;
      text-align: center;
      padding-top: 12px;
      color: $gray;
      &.foot-nav-selected {
        color: $mainColor;
      }
      .foot-icon {
        line-height: 46px;
        font-size: 36px;
      }
      .foot-nav-name {
        padding-top: 8px;
        font-size: 20px;
        line-height: 20px;
      }
      .foot-ai {
        display: block;
        width: 74px;
        height: 74px;
        margin:0 auto;
      }
    }
  }
</style>
