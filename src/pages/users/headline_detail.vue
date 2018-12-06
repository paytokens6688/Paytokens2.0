<template>
  <div id="headlineDetail">
    <div class="detail_top">
      <button
        class="detail_back iconfont icon-fanhui"
        @click="callBack"></button>
      <h2 class="detail_title">链上头条</h2>
      <button
        class="detail_share iconfont icon-fenxiang"
        @click="detailShare"></button>
    </div>
    <div class="detail_content">
      <div
        class="detail_content_inner"
        ref="detailCon">
        <h3 class="con_title" v-html="notice.title"></h3>
        <p class="con_time">
          {{notice.create_time}}
        </p>
        <div
          class="con_mess"
          v-html="notice.content">
        </div>
      </div>
    </div>
    <!-- 分享弹框(暂时不要了) -->
    <div class="pop_main" v-if="isShare" @click="noShare">
      <div class="pop_content">
        <p class="title">分享给小伙伴</p>
        <div class="share_main">
          <div
            class="share_list"
            v-for="(item, index) in shareData" :key="index"
            @click="shareList(index)">
            <img class="share_img" :src="item.share_img" alt="">
            <p class="share_name">{{item.share_title}}</p>
          </div>
        </div>
        <p class="title cancel" @click="noShare">取消</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'headlineDetail',
  data () {
    return {
      // 头条id
      id: this.$route.query.id,
      notice: {
        title: '',
        create_time: '',
        content: ''
      },
      // 分享弹窗的变量
      isShare: false,
      // 需要分享的平台
      shareData: [
        {
          share_img: require('../../assets/images/share_img1.png'),
          share_title: '微信'
        },
        {
          share_img: require('../../assets/images/share_img2.png'),
          share_title: '朋友圈'
        },
        {
          share_img: require('../../assets/images/share_img3.png'),
          share_title: '微博'
        }
      ],
      // 截图url
      picUrl: ''
    };
  },
  beforeMount () {
    this.getInfo();
  },
  methods: {
    // 顶部返回按钮
    callBack () {
      this.$router.go(-1);
    },
    // 分享按钮
    detailShare () {
      const oftenFunc = require('@/plugins/often_func');
      oftenFunc.default.screenshotToBase(this.$refs.detailCon).then((baseUrl) => {
        this.picUrl = baseUrl;
        this.isShare = true;
      });
    },
    // 取消分享按钮
    noShare () {
      this.isShare = false;
    },
    // 分享的事件
    shareList (index) {
      try {
        window.webkit.messageHandlers.thirdPartyShare.postMessage({
          index: index,
          url: this.picUrl
        }); // ios
      } catch (error) {
        try {
          android.thirdPartyShare(index, this.picUrl); // 安卓 friend
        } catch (error) {
          this.$global.alertOptions('请在APP内分享');
        }
      }
    },
    // 详情接口
    getInfo () {
      this.$axios.get('/v1/api/article/info', {
        params: {
          article_id: this.id
        }
      }).then(({ data }) => {
        if (data.status === 200) {
          this.notice = data.data;
          this.notice.create_time = this.$func.formatDate(new Date(this.notice.create_time));
        } else {
          this.$global.alertOptions(data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #headlineDetail{
    background-color:#fff;
    .detail_top{
      height:90px;
      width:100%;
      background-color:#fff;
      position: fixed;
      top:0;
      left:0;
      @include eleBottomShadown();
      .detail_back{
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
      .detail_share{
        position: absolute;
        top: 0;
        right: 0;
        width: 78px;
        height: 90px;
        text-align: center;
        font-size: 34px;
        background: none;
        color: #9297a5;
      }
      .detail_title{
        text-align: center;
        width: 100%;
        line-height: 90px;
        font-size: 32px;
        font-weight: 500;
      }
    }
    .detail_content{
      height:calc(100% - 90px);
      overflow-y: scroll;
      overflow-x: hidden;
      padding:115px 30px 0;
      .detail_content_inner {
        min-height: 100%;
        padding: 0 30px 180px;
      }
      .con_title{
        font-size:36px;
        line-height:60px;
      }
      .con_time{
        font-size:26px;
        color:#b7bac3;
        line-height:86px;
        border-bottom:1PX solid $listBottomGray;
      }
      .con_mess{
        font-size:26px;
        line-height:50px;
        color:#5e6476;
        padding-top:25px;
        img{
          max-width: 100%;
        }
      }
    }
    // 分享弹框（暂时不要了）
    .pop_main {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 50;
      background: rgba(0, 0, 0, 0.6);
      .pop_content{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        min-height: 415px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        background: #fff;
        animation: myShow 0.5s;
        @keyframes myShow {
          0% {
            opacity:0;
            transform: scale(0.5);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            opacity:1;
            transform: scale(1);
          }
        }
        .title{
          margin: 0 20px;
          padding: 40px 0;
          box-sizing: border-box;
          border-bottom: 1Px solid #dad9de;
          font-size: 30px;
          font-weight: bold;
          text-align: center;
          &.cancel{
            color: #999999;
            font-size: 26px;
            border: none;
            font-weight: 200;
          }
        }
        .share_main{
          width: 100%;
          min-height: 205px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-wrap: wrap;
          padding: 30px 0;
          box-sizing: border-box;
          border-bottom: 1Px solid #dad9de;
          .share_list{
            width: 33.3%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .share_img{
              width: 96px;
              height: 96px;
              border-radius: 50%;
            }
            .share_name{
              font-size: 26px;
              line-height: 66px;
            }
          }
        }
      }
    }
  }
</style>
