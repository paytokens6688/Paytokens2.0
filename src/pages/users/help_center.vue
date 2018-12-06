<template>
  <div id="helpCenter">
    <!-- 头部 -->
    <div class="fixed_top">
      <i class="layout-backpage-back iconfont icon-fanhui" @click="callBack"></i>
      <p>帮助中心</p>
    </div>
    <!-- 外围圆角 -->
    <div class="container_warp">
      <div class="container">
        <!-- 切换头部 -->
        <div class="head_tab">
          <span class="item"
            v-for="(item, index) in headTab" :key="index"
            @click="selectTab(index)"
            :class="{'active': select_tab === index}"
          >{{item.name}}
          <span :class="{'is_new': item.is_new === true}"></span>
          </span>
        </div>
        <!-- FAQ -->
        <listBox
          class="container_main"
          v-if="select_tab === 0"
          :listArr="dataFAQ"
          :scrollBack="getList">
          <div class="container_list"
            v-for="(item, index) in dataFAQ" :key="index">
            <div class="list_top" @click="isShow(index, item.show)">
              <div class="list_left">
                <span class="index">Q{{index + 1}}</span>
                <span class="title">{{item.title}}</span>
              </div>
              <i class="iconfont icon-xiala-copy-copy" v-if="item.show === false"></i>
              <i class="iconfont icon-xiala-copy" v-if="item.show === true"></i>
            </div>
            <div
              class="list_bottom"
              :class="{'padding_bot': item.content}"
              v-if="item.show === true">
              {{item.content}}
            </div>
          </div>
          <noRecord
            title="暂无消息"
            type="message"
            v-if="!dataFAQ.length && canRequest">
          </noRecord>
        </listBox>
        <!-- 新手教程 -->
        <listBox class="video_main"
          v-if="select_tab === 1"
          :listArr="videoList"
          :scrollBack="getList">
          <div class="video_list"
            v-for="(item, index) in videoList" :key="index">
            <div class="video_imgs" v-if="item.imgShow">
              <img class="video_img"
                @click="showVideo(index)"
                :src="item.image" alt=""/>
            </div>
            <video class="video_imgs video"
              v-if="item.videoShow"
              :src="item.video"
              autoplay="autoplay"
              controls></video>
            <div class="title">{{item.title}}</div>
            <!-- <img class="video_play" @click="showVideo(index)"
            v-if="item.imgShow"
            :src="require('@/assets/images/video_play.png')" /> -->
          </div>
          <noRecord
            title="暂无消息"
            type="message"
            v-if="!videoList.length && canRequest">
          </noRecord>
        </listBox>
      </div>
    </div>
  </div>
</template>

<script>
import noRecord from '@/components/noRecord/no_record.vue';
import listBox from '@/components/list/more_list_box.vue';
export default {
  name: 'help_center',
  head () {
    // 返回头部信息
    return {
      title: '帮助中心'
    };
  },
  data () {
    return {
      // 头部切换数据
      headTab: [
        {
          name: 'FAQ'
        },
        {
          name: '新手教程'
        }
      ],
      // 头部切换的变量
      select_tab: Number(this.$route.query.select_tab) || 0,
      // FAQ
      dataFAQ: [],
      // 新手教程
      videoList: [],
      page: 1, // 默认第一页
      canRequest: true, // 是否可以请求数据，请求锁 默认能请求，不是在请求中
      hasMoreData: true // 是否还有更多数据
    };
  },
  mounted () {
    // 获取数据
    this.getList();
  },
  beforeMount () {
  },
  methods: {
    getList () {
      let type; // 声明type参数
      if (this.select_tab === 0) { // FAQ传type4
        type = 4;
      } else if (this.select_tab === 1) { // 新手教程传type1
        type = 1;
      }
      if (!this.canRequest) return false; // 在请求中（不能请求）
      if (!this.hasMoreData) return false; // 没有更多，则不请求
      this.canRequest = false; // 默认不请求
      this.$axios.get('/v1/api/article', {
        params: {
          type: type,
          page: this.page
        }
      }).then(({ data }) => {
        if (data.status === 200) {
          this.canRequest = true;
          this.page++;
          let resObj;
          resObj = data.data;
          if (resObj.length < 10 || !resObj.length || !resObj) {
            this.hasMoreData = false;
          } else {
            this.hasMoreData = true;
          }
          if (this.select_tab === 0) { // FAQ
            this.dataFAQ = this.dataFAQ.concat(resObj);
            // 是否展开的状态循环到数组中
            for (var i = 0; i < this.dataFAQ.length; i++) {
              this.$set(this.dataFAQ[i], 'show', false);
            }
          } else if (this.select_tab === 1) { // 新手教程
            this.videoList = this.videoList.concat(resObj);
            // 视频是否出现的变量
            for (var j = 0; j < this.videoList.length; j++) {
              this.$set(this.videoList[j], 'videoShow', false);
            }
            for (var g = 0; g < this.videoList.length; g++) {
              this.$set(this.videoList[g], 'imgShow', true);
            }
          }
        } else {
          this.$global.alertOptions(data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    // 返回上一级
    callBack () {
      this.$router.go(-1);
    },
    // 头部类型切换
    selectTab (index) {
      if (this.select_tab === index || this.canRequest === false) {
        return false;
      }
      this.select_tab = index;
      this.page = 1;
      this.canRequest = true;
      this.hasMoreData = true;
      this.dataFAQ = [];
      this.videoList = [];
      this.getList();
      this.$router.replace({ // 刷新当前页面，不更改页面状态
        path: '/users/help_center',
        query: {
          select_tab: this.select_tab
        }
      });
    },
    // 是否展开教程详情
    isShow (index, show) {
      this.dataFAQ[index].show = !this.dataFAQ[index].show;
    },
    // 查看视频
    showVideo (index) {
      // 图片隐藏，视频出现
      this.videoList[index].videoShow = !this.videoList[index].videoShow;
      this.videoList[index].imgShow = !this.videoList[index].imgShow;
    }
  },
  components: {
    listBox,
    noRecord
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #helpCenter {
    // 头部
    .fixed_top{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 290px;
      line-height: 90px;
      color: #fff;
      font-size: 32px;
      text-align: center;
      background-image: url('../../assets/images/contact_bg.jpg');
      background-size: 100% 100%;
      .layout-backpage-back {
        position: absolute;
        top: 0;
        left: 0;
        width: 78px;
        height: 90px;
        text-align: center;
        font-size: 34px;
        background: none;
        color: #fff;
      }
    }
    // 外围圆角
    .container_warp{
      width: 92%;
      height: calc(100%);
      position: fixed;
      top: 10%;
      left: 28px;
      border-radius: 10px;
      overflow: hidden;
      .container{
        border: 1Px solid #eaecf1;
        border-image: linear-gradient( #eaecf1, #f7f7f9, #fafbfc) 1 1;
        height: calc(100% - 10px);
        box-sizing: border-box;
        border-bottom: none;
        background: #fff;
        padding: 10px 32px 0;
        // 切换头部
        .head_tab{
          z-index: 20;
          background: #fff;
          padding: 0 100px;
          box-sizing: border-box;
          width: 100%;
          height: 78px;
          line-height: 78px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1Px solid #eaecf1;
          .item{
            height: 84px;
            line-height: 84px;
            background: #fff;
            font-size: 28px;
            color: $gray;
            position: relative;
            &:after {
              content: '';
              width: 80px;
              height: 6px;
              background: #fff;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              position: absolute;
              border-radius: 3px;
            }
            .is_new{
              right: 0;
              top: 18px;
              position: absolute;
              display: inline-block;
              width: 12.4px;
              height: 12.4px;
              border-radius: 50%;
              background: #ff0000;
            }
            &.active {
              color: $mainColor;
              font-weight: bold;
              &:after {
                background: $mainColor;
              }
            }
          }
        }
        // FAQ
        .container_main{
          height: calc(100% - 90px);
          overflow-y: auto;
          box-sizing: border-box;
          padding-bottom: 100px;
          box-sizing: border-box;
          &::-webkit-scrollbar {
            width: 0;
          }
          .container_list{
            border-bottom: 1Px solid #eaecf1;
            padding-top: 4px;
            box-sizing: border-box;
            &:last-child {
              margin-bottom: 100px;
              box-sizing: border-box;
            }
            .list_top{
              width: 100%;
              padding: 30px 0;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .list_left{
                display: flex;
                align-items: center;
                .index{
                  background: linear-gradient(to bottom, #2d56fd, #4e7bfd);
                  width: 44px;
                  height: 44px;
                  line-height: 44px;
                  border-radius: 50%;
                  margin-right: 20px;
                  font-size: 22px;
                  color: #fff;
                  text-align: center;
                }
                .title{
                  font-size: 28px;
                  color: #222222;
                  font-weight: bold;
                }
              }
              .iconfont{
                font-size: 26px;
                color: #9da2b2;
              }
            }
            .list_bottom{
              padding-left: 64px;
              box-sizing: border-box;
              color: #5e6476;
              line-height: 50px;
              font-size: 26px;
              &.padding_bot{
                padding-bottom: 35px;
                box-sizing: border-box;
              }
            }
          }
        }
        // 新手教程
        .video_main{
          padding-bottom: 100px;
          box-sizing: border-box;
          height: calc(100% - 200px);
          overflow-y: scroll;
          &::-webkit-scrollbar {
            width: 0;
          }
          .video_list{
            position: relative;
            margin-top: 30px;
            width: 100%;
            height: 440px;
            border-radius: 10px;
            background: #eaecf1;
            overflow: hidden;
            &:last-child {
              padding-bottom: 100px;
              box-sizing: border-box;
            }
            .video_imgs{
              width: 100%;
              height: 350px;
              border-radius: 10px;
              .video_img{
                width: 100%;
                height: 100%;
              }
              &.video{
                object-fit: fill;
              }
            }
            // 图片没展示出来时，图片自带的边框消失
            img[src = ""],img:not([src]){
              opacity: 0;
            }
            .title{
              padding: 20px 30px 30px;
              box-sizing: border-box;
              color: #222222;
              font-size: 28px;
            }
            .video_play{
              width: 68px;
              height: 68px;
              position: absolute;
              top: 140px;
              left: 50%;
              transform: translateX(-50%);
            }
          }
        }
      }
    }
  }
</style>
