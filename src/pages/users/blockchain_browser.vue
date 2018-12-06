<template>
  <div id='blockchainBrowser' >
    <!-- 列表 -->
    <ul class="nav_list">
      <li class="nav_item" v-for="(item, index) in navList" :key="index" @click="gopath(item.path)">
        <!-- 左边内容 -->
        <div class="left_content">
          <img :src="item.img" alt="" class="brower_img">
          <p class="content_txt">{{item.title}}</p>
        </div>
        <!-- 右边icon -->
        <span class="iconfont icon-you"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'blockchainBrowser',
  layout () {
    return 'back_page';
  },
  data () {
    return {
      navList: [
        {
          img: require('@/assets/images/browser_img1.png'),
          title: 'BTC.com',
          path: 'BTC.com'
        },
        {
          img: require('@/assets/images/browser_img2.png'),
          title: 'Etherscan.io',
          path: 'Etherscan.io'
        }
      ]
    };
  },
  beforeMount () {
    this.pageTitle({ title: '区块链浏览器', shadown: false });
  },
  mounted () {
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 跳外链
    gopath (path) {
      window.location.href = 'https://' + path;
    }
  }
};
</script>

<style lang='scss' scoped>
  @import '@/assets/scss/public.scss';
  #blockchainBrowser{
    background: #fafafc !important;
    // 列表
    .nav_list {
      .nav_item {
        background: #fff;
        border-bottom: 1Px solid #eaecf1;
        height: 98px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px;
        // 左边内容
        .left_content {
          width: 90%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          box-sizing: border-box;
          // 图片
          .brower_img {
            width: 40px;
            height: 40px;
            padding-right: 32px;
            &:nth-child(2) {
              width: 37px;
              height: 40px;
            }
          }
          // 导航
          .content_txt {
            font-size: 28px;
            color: #222222;
            width: 85%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .icon-you {
          font-size: 30px;
          color: #9da2b2;
        }
      }
    }
  }
</style>
