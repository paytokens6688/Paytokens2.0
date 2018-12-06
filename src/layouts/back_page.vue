<template>
  <div
    id="BackPage"
    class="app_page_box"
    :class="{'default-bg-hid': userInited, 'default-bg-none': userInitIng}">
    <div
      class="layout-backpage-head"
      :class="[{'layout-backpage-head_bottom': titleShadown}, {'layout-backpage-transparent' : pageTitle === '联系我们'}, {'layout-backpage-blue' : (pageTitle === '链上头条' || pageTitle === '区块链浏览器')}]">
      <button
        class="layout-backpage-back iconfont icon-fanhui"
        @click="callBack"
        :class="[{'icon_back_white' : (pageTitle === '联系我们' || pageTitle === '链上头条' || pageTitle === '区块链浏览器')}, {'icon_back_none' : (pageTitle === '发现')}]"
        ></button>
      <h2
        class="layout-backpage-title"
        :class="{'layout-backpage-title-white': (pageTitle === '交易详情' || pageTitle === '联系我们' || pageTitle === '链上头条' || pageTitle === '区块链浏览器')}">{{ pageTitle }}</h2>
    </div>
    <nuxt
      class="layout-backpage-nuxt"
      />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { setTimeout } from 'timers';
export default {
  name: 'BackPage',
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
    '$route' (to, from) {
      this.pageTitleChange(this.$store.state.layout.backPageConfigDefault);
    }
  },
  computed: {
    ...mapState({
      // 页面标题
      pageTitle: state => state.layout.backPageConfig.title,
      // 页面标题底部阴影是否添加
      titleShadown: state => state.layout.backPageConfig.shadown
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
  #BackPage {
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
        &.icon_back_white {
          color: #fff;
        }
        &.icon_back_none {
          display: none;
        }
      }
      .layout-backpage-title {
        text-align: center;
        width: 100%;
        line-height: 90px;
        font-size: 32px;
        font-weight: 500;
        &.layout-backpage-title-white {
          color: #fff;
        }
      }
      &.layout-backpage-head_bottom {
        @include eleBottomShadown();
      }
      // 透明背景
      &.layout-backpage-transparent {
        background: transparent;
      }
      // 蓝色背景
      &.layout-backpage-blue {
        background: #2a53fd;
      }
    }
    .layout-backpage-nuxt {
      height: calc(100% - 90px);
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>
