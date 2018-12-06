<template>
  <div id='find' >
    <!-- 第一块 -->
    <div class="first_box">
      <p class="p_token">Paytokens服务</p>
      <ul class="server_list">
        <div class="server_item" @click="goDetail(item.path)" v-for="(item, index) in serverList" :key="index">
          <li class="_box">
            <img :src="item.iconImg" alt="" class="icon_img">
            <span class="nav">{{item.serverType}}</span>
          </li>
        </div>
      </ul>
    </div>
    <!-- 第二块 -->
    <p class="speed_box" @click="newShow">
      <span class="title">限时推广</span>
      <span class="iconfont icon-xiala" :class="{'do_trans': !newsOpen}"></span>
    </p>
    <!-- 新闻 -->
    <div class="spread_wrap" v-if="newsOpen">
      <!-- 下方轮播图 -->
      <div class="swiper_wrap">
        <div v-swiper:mySwiper="swiperOption" class="swiper_box">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, index) in bannerList" :key="index">
              <!-- 上方 -->
              <div class="txt_top">
                <!-- 图片 -->
                <div class="img_wrap">
                  <img :src="item.newsImg" alt="" class="news_img">
                </div>
                <div class="news_content">
                  <!-- 标题 -->
                  <div class="news_title">{{item.newsTitle}}</div>
                  <!-- 描述 -->
                  <p class="news_descrip">{{item.newsTxt}}</p>
                  <!-- 更多 -->
                  <div class="news_more">
                    <span class="more_txt">了解更多&gt;&gt;</span>
                    <span class="iconfont icon-lianjie"></span>
                  </div>
                </div>
              </div>
              <img :src="item.image" class="slide_img">
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
    </div>
    <!-- 第三块 -->
    <p class="third_server">第三方服务</p>
    <ul class="third_server_list">
      <div class="third_server_item" v-for="(item, index) in thirdServerList" :key="index" @click="goDetail1(item.path)">
        <li class="_box">
          <span class="iconfont" :class="item.iconImg"></span>
          <p class="nav">{{item.serverType}}</p>
        </li>
      </div>
    </ul>
    <footerTmpl :index="3" />
  </div>
</template>

<script>
import footerTmpl from '@/components/fixed/footer.vue';
import { mapMutations } from 'vuex';
import 'swiper/dist/css/swiper.css';
export default {
  name: 'find',
  layout () {
    return 'back_page';
  },
  components: {
    footerTmpl
  },
  data () {
    return {
      serverList: [
        {
          iconImg: require('./../../assets/images/find_icon1.png'),
          serverType: '区块链商城',
          path: ''
        },
        {
          iconImg: require('./../../assets/images/find_icon2.png'),
          serverType: '聊天室',
          path: ''
        },
        {
          iconImg: require('./../../assets/images/find_icon3.png'),
          serverType: '链上头条',
          path: 'link_headline'
        },
        {
          iconImg: require('./../../assets/images/find_icon4.png'),
          serverType: '闪付',
          path: ''
        }
      ],
      newsOpen: false,
      bannerList: [
        {
          id: 1,
          newsImg: require('./../../assets/images/news_pic.png'), // 新闻图片
          newsTitle: '教育链上线了！',
          newsTxt: '教育链致力于打造全球化教育公链,构建全部精.教育链致力于打造全球化教育公链,构建全部精',
          image: require('./../../assets/images/banner.jpg')
        },
        {
          id: 1,
          newsImg: require('./../../assets/images/news_pic.png'), // 新闻图片
          newsTitle: '教育链上线了！',
          newsTxt: '教育链致力于打造全球化教育公链,构建全部精.教育链致力于打造全球化教育公链,构建全部精',
          image: require('./../../assets/images/banner.jpg')
        },
        {
          id: 1,
          newsImg: require('./../../assets/images/news_pic.png'), // 新闻图片
          newsTitle: '教育链上线了！',
          newsTxt: '教育链致力于打造全球化教育公链,构建全部精.教育链致力于打造全球化教育公链,构建全部精',
          image: require('./../../assets/images/banner.jpg')
        },
        {
          id: 1,
          newsImg: require('./../../assets/images/news_pic.png'), // 新闻图片
          newsTitle: '教育链上线了！',
          newsTxt: '教育链致力于打造全球化教育公链,构建全部精.教育链致力于打造全球化教育公链,构建全部精',
          image: require('./../../assets/images/banner.jpg')
        },
        {
          id: 1,
          newsImg: require('./../../assets/images/news_pic.png'), // 新闻图片
          newsTitle: '教育链上线了！',
          newsTxt: '教育链致力于打造全球化教育公链,构建全部精.教育链致力于打造全球化教育公链,构建全部精',
          image: require('./../../assets/images/banner.jpg')
        },
        {
          id: 1,
          newsImg: require('./../../assets/images/news_pic.png'), // 新闻图片
          newsTitle: '教育链上线了！',
          newsTxt: '教育链致力于打造全球化教育公链,构建全部精.教育链致力于打造全球化教育公链,构建全部精',
          image: require('./../../assets/images/banner.jpg')
        },
        {
          id: 1,
          newsImg: require('./../../assets/images/news_pic.png'), // 新闻图片
          newsTitle: '教育链上线了！',
          newsTxt: '教育链致力于打造全球化教育公链,构建全部精.教育链致力于打造全球化教育公链,构建全部精',
          image: require('./../../assets/images/banner.jpg')
        },
        {
          id: 1,
          newsImg: require('./../../assets/images/news_pic.png'), // 新闻图片
          newsTitle: '教育链上线了！',
          newsTxt: '教育链致力于打造全球化教育公链,构建全部精.教育链致力于打造全球化教育公链,构建全部精',
          image: require('./../../assets/images/banner.jpg')
        }
      ],
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        loop: false,
        autoplay: {
          disableOnInteraction: false
        }
      },
      thirdServerList: [
        {
          iconImg: 'icon-qianbao1',
          serverType: '冷钱包',
          path: ''
        },
        {
          iconImg: 'icon-wodekuangji',
          serverType: '矿机',
          path: ''
        },
        {
          iconImg: 'icon-liulanqi',
          serverType: '区块链浏览器',
          path: 'blockchain_browser'
        }
      ]
    };
  },
  beforeMount () {
    this.pageTitle({ title: '发现', shadown: true });
  },
  mounted () {
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 新闻展开
    newShow () {
      this.newsOpen = !this.newsOpen;
    },
    // paytoken服务去详情页
    goDetail (path) {
      if (path) {
        this.$router.push(path);
      } else {
        this.$global.notOpenOptions();
      }
    },
    // 第三方服务去详情
    goDetail1 (path) {
      if (path) {
        this.$router.push(path);
      } else {
        this.$global.notOpenOptions();
      }
    }
  }
};
</script>

<style lang='scss'>
  @import '@/assets/scss/public.scss';
  #find{
    background: #fafafc;
    // padding-bottom: 150px;
    // 第一块
    .first_box {
      margin-bottom: 32px;
      background: #fff;
      .p_token {
        height: 88px;
        box-sizing: border-box;
        padding-left: 30px;
        font-size: 28px;
        color: #3f4e62;
        line-height: 88px;
      }
      // 服务项
      .server_list {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .server_item {
          box-sizing: border-box;
          height: 200px;
          width: 33.33%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1Px solid #e5e5e5;
          ._box{
            text-align: center;
            box-sizing: border-box;
            overflow: hidden;
            .icon_img {
              display: block;
              margin: 0px auto;
              margin-bottom: 30px;
            }
          }
          &:nth-child(1) {
            border-left: none;
            .icon_img {
              width: 41px;
              height: 42px;
            }
          }
          &:nth-child(2) {
            border-left: none;
            border-right: none;
            .icon_img {
              width: 44px;
              height: 38px;
            }
          }
          &:nth-child(3) {
            border-right: none;
            .icon_img {
              width: 38px;
              height: 38px;
            }
          }
          &:nth-child(4) {
            border-top: none;
            border-left: none;
            border-bottom: none;
            .icon_img {
              width: 52px;
              height: 35px;
            }
          }
          .nav {
            font-size: 26px;
            color: #222222;
          }
        }
      }
    }
    // 第二块
    .speed_box {
      width: 100%;
      box-sizing: border-box;
      height: 88px;
      padding: 0 30px;
      display: flex;
      justify-content: space-between;
      background: #fff;
      align-items: center;
      border-bottom: 1Px solid #e6e6e6;
      .title {
        font-size: 28px;
        color: #3f4e62;
      }
      .icon-xiala {
        font-size: 10px;
        color: #9da2b2;
        transform: scale(.555);
        &.do_trans {
          font-size: 10px;
          color: #9da2b2;
          // transition: all 0.5s;
          transform: rotateX(180deg) scale(.555);
        }
      }
    }
    // 新闻
    .spread_wrap {
      width: 100%;
      box-sizing: border-box;
      height: 620px;
      background: #fff;
      padding: 10px 30px 0;
      // 下方轮播图
      .swiper_wrap {
        width: 100%;
        height: 600px;
        box-sizing: border-box;
        .swiper_box {
          width: 100%;
          height: 600px;
          overflow: hidden;
          box-sizing: border-box;
          .swiper-wrapper {
            width: 100%;
            height: 600px;
            border-radius: 10px;
            box-sizing: border-box;
            .swiper-slide {
              width: 100%;
              height: 100%;
              border-radius: 10px;
              overflow: hidden;
              display: inline-block;
              box-sizing: border-box;
              // 上方新闻信息
              .txt_top {
                width: 100%;
                box-sizing: border-box;
                height: 158px;
                display: flex;
                padding-top: 16px;
                // 图片
                .img_wrap {
                  width: 60px;
                  height: 60px;
                  overflow: hidden;
                  box-sizing: border-box;
                  .news_img {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }
                }
                .news_content {
                  box-sizing: border-box;
                  width: 80%;
                  margin-left: 26px;
                  .news_title {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    font-size: 28px;
                    color: #222222;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                  .news_descrip {
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 24px;
                    color: #afb5c3;
                  }
                  .news_more {
                    height: 46px;
                    line-height: 46px;
                    .more_txt {
                      font-size: 22px;
                      color: #2a53fd;
                    }
                    .icon-lianjie {
                      font-size: 30px;
                      color: #cbcfd8;
                      vertical-align: middle;
                    }
                  }
                }
              }
              .slide_img {
                display: block;
                border-radius: 10px;
                width: 100%;
                height: 363px;
                object-fit: cover;
              }
            }
          }
          &.swiper-container-horizontal {
            // 控制器
            .swiper-pagination {
              &.swiper-pagination-bullets {
                width: 100%;
                height: 40px;
                bottom: 20px;
                .swiper-pagination-bullet {
                  display: inline-block;
                  width: 14px;
                  height: 14px;
                  margin: 0 15px;
                  background: #eaecf1;
                  border-radius: 50%;
                  &.swiper-pagination-bullet-active {
                    background: #2a53fd;
                  }
                }
              }
            }
          }
        }
      }
    }
    // 第三方服务
    .third_server {
      height: 88px;
      box-sizing: border-box;
      padding-left: 30px;
      font-size: 28px;
      color: #3f4e62;
      line-height: 88px;
      border-bottom: 1Px solid #e5e5e5;
      background: #fff;
      margin-top: 30px;
    }
    .third_server_list {
      box-sizing: border-box;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      background: #fff;
      margin-bottom: 180px;
      .third_server_item {
        box-sizing: border-box;
        height: 200px;
        width: 33.33%;
        display: flex;
        justify-content: center;
        align-items: center;
        ._box{
          text-align: center;
          box-sizing: border-box;
          overflow: hidden;
          .iconfont {
            font-size: 40px;
          }
          .nav {
            font-size: 26px;
            color: #222222;
            padding-top: 20px;
          }
        }
        &:nth-child(1) {
          .icon-qianbao1 {
            color: #1776eb;
          }
        }
        &:nth-child(2) {
          border-left: 1Px solid #e5e5e5;
          border-right: 1Px solid #e5e5e5;
          .icon-wodekuangji {
            color: #e8575f;
          }
        }
        &:nth-child(3) {
          .icon-liulanqi {
            color: #14a25b;
            font-size: 45px;
          }
        }
      }
    }
  }
</style>
