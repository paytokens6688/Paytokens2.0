<template>
  <div
    id="BackPageImg"
    class="app_page_box"
    :class="{'default-bg-hid': userInited, 'default-bg-none': userInitIng}">
    <div
      class="layout-backpage-head"
      :class="{'layout-backpage-head_bottom': titleShadown}">
      <button
        class="layout-backpage-back iconfont icon-fanhui"
        @click="callBack"
        v-show="backShow"></button>
      <h2 class="layout-backpage-title">{{ pageTitle }}</h2>
    </div>
    <img
      class="layout-backpage-bg"
      :src="require('@/assets/images/wallet_top_bg.jpg')"
      alt="背景图" />
    <nuxt
      class="layout-backpage-nuxt"
      />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'BackPageImg',
  data () {
    return {
      // 页面初始化控制变量
      userInitIng: false,
      userInited: false
    };
  },
  head () {
    // 返回头部信息
    return {
      title: this.pageTitle || 'PayTokens'
    };
  },
  watch: {
    '$route' () {
      this.pageTitleChange(this.$store.state.layout.backPageConfigDefault);
    }
  },
  computed: {
    ...mapState({
      // 页面标题
      pageTitle: state => state.layout.backPageConfig.title,
      // 页面标题底部阴影是否添加
      titleShadown: state => state.layout.backPageConfig.shadown,
      // 返回箭头是否显示
      backShow: state => state.layout.backPageConfig.backShow || false
    })
  },
  mounted () {
    // 是否是第一次进入页面
    if (this.$store.state.fristShowPage) {
      // 返回时遮罩层，避免尴尬
      this.userInitIng = true;
      setTimeout(() => {
        this.userInited = true;
      }, 10);
      this.$store.commit('fristShowPageChange');
    } else {
      this.userInitIng = true;
      this.userInited = true;
    }
  },
  methods: {
    // 返回上一级
    callBack () {
      this.$router.go(-1);
    },
    ...mapMutations({
      // 头部数据更改，在这里是为了页面切换时初始化数据
      pageTitleChange: 'layout/backPageChange'
    })
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #BackPageImg {
    position: relative;
    z-index: 2;
    overflow: hidden;
    .layout-backpage-head {
      height: 90px;
      position: relative;
      .layout-backpage-back {
        position: absolute;
        top: 0;
        left: 0;
        width: 78px;
        height: 90px;
        text-align: center;
        font-size: 34px;
        background: none;
        color: #9297a5;
      }
      .layout-backpage-title {
        text-align: center;
        width: 100%;
        line-height: 90px;
        font-size: 32px;
        font-weight: 500;
        color: #fff;
      }
      &.layout-backpage-head_bottom {
        @include eleBottomShadown();
      }
    }
    .layout-backpage-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 320px;
      z-index: -1;
    }
    .layout-backpage-nuxt {
      height: calc(100% - 90px);
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>
