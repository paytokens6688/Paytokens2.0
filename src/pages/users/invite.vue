<template>
  <div id="invite">
    <!-- 头部导航 -->
    <div class="fixed_top" :class="{'select_head': select_tab === 1}">
      <i class="layout-backpage-back iconfont icon-fanhui" @click="callBack"></i>
      <div class="head_tab">
        <span class="item" v-for="(item, index) in headTab" :key="index"
        @click="selectTab(index)"
        :class="{'active': select_tab === index}"
        >{{item.name}}
        <span :class="{'is_new': item.is_new === true}"></span>
        </span>
      </div>
    </div>
    <div class="container">
      <!-- 好友 -->
      <div class="container_list" v-if="select_tab === 0">
        <!-- 好友的上部分 -->
        <div class="container_head">
          <div class="head_left">
            <i class="iconfont icon-yaoqing"></i>共邀请好友
          </div>
          <div class="head_right">
            <span class="number">{{count}}</span>位
          </div>
        </div>
        <div class="prompt">邀请记录</div>
        <!-- 邀请记录 -->
        <listBox class="data_main"
          :listArr="dataList"
          :scrollBack="getFriendList">
          <div
            class="data_content"
            v-for="(item, index) in dataList" :key="index">
            <img class="img" :src="item.image ? headImg[item.image].image : userimg" alt="">
            <div class="data_list">
              <div class="data_top">
                <span>{{item.nickname}}</span>
                <span>{{item.mobile.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')}}</span>
              </div>
              <div class="data_top data_bottom">
                <span>{{item.create_time}}</span>
                <span class="trans" :class="{'select': item.open_ai - 0 === 1}">
                  <i class="iconfont icon-xuanze"></i>AI交易
                </span>
              </div>
            </div>
          </div>
          <noRecord
            title="暂无消息"
            type="message"
            v-if="!dataList.length && canRequest">
          </noRecord>
        </listBox>
      </div>
      <!-- 邀请码 -->
      <div class="qrcode" v-if="select_tab === 1">
        <img class="qrcode_img" :src="qrcode_bg"/>
        <!-- 复制按钮 -->
        <div class="copy_button"
          :data-clipboard-text="qrcode_link"
          onclick="">复制链接分享</div>
      </div>
    </div>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard';
import { mapState } from 'vuex';
import noRecord from '@/components/noRecord/no_record.vue';
import listBox from '@/components/list/more_list_box.vue';
export default {
  name: 'invite',
  head () {
    // 返回头部信息
    return {
      title: '推广邀请'
    };
  },
  data () {
    return {
      // 头部切换数据
      headTab: [
        {
          name: '好友'
        },
        {
          name: '邀请码'
        }
      ],
      // 头部切换的变量
      select_tab: Number(this.$route.query.select_tab) || 0,
      userimg: require('../../assets/images/user_img.png'), // 默认头像
      dataList: [], // 数据列表
      count: '', // 好友人数
      page: 1, // 默认第一页
      canRequest: true, // 是否可以请求数据，请求锁 默认能请求，不是在请求中
      hasMoreData: true, // 是否还有更多数据
      qrcode_bg: '', // 邀请码
      qrcode_link: '' // 邀请码的链接
    };
  },
  computed: {
    ...mapState({
      headImg: state => state.public.headImg
    })
  },
  mounted () {
    // 复制
    this.copyInit();
    // 获取好友列表
    this.getFriendList();
    // 获取邀请码
    this.getCode();
  },
  beforeMount () {
    console.log(this.headImg);
  },
  methods: {
    getFriendList () {
      if (!this.canRequest) return false; // 在请求中（不能请求）
      if (!this.hasMoreData) return false; // 没有更多，则不请求
      this.canRequest = false; // 默认不请求
      this.$axios.get('/v1/user/friends', {
        params: {
          page: this.page
        }
      }).then(({ data }) => {
        if (data.status === 200) {
          this.canRequest = true;
          this.page++;
          let resObj;
          resObj = data.data.list;
          if (this.page === 2) {
            this.count = data.data.count;
          }
          if (resObj.length < 10 || !resObj.length || !resObj) {
            this.hasMoreData = false;
          } else {
            this.hasMoreData = true;
          }
          this.dataList = this.dataList.concat(resObj);
          for (let i = 0; i < this.dataList.length; i++) {
            this.dataList[i].create_time = this.$func.formatDate(new Date(this.dataList[i].create_time));
          }
        } else {
          this.$global.alertOptions(data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    getCode () {
      this.$axios.get('/v1/user/invite')
        .then(({ data }) => {
          if (data.status === 200) {
            this.qrcode_bg = data.data.qrcodeFile;
            this.qrcode_link = data.data.qrcodeUrl;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 返回上一级
    callBack () {
      this.$router.go(-1);
    },
    // 头部类型切换
    selectTab (index) {
      this.select_tab = index;
      this.$router.replace({ // 刷新当前页面，不更改页面状态
        path: '/users/invite',
        query: {
          select_tab: index
        }
      });
    },
    // 复制
    copyInit () {
      let clipboard = new ClipboardJS('.copy_button');
      clipboard.on('success', () => {
        this.$global.successOptions('复制成功');
      });
      clipboard.on('error', () => {
        this.$global.successOptions('复制成功');
      });
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
  #invite {
    height: 100%;
    // 头部导航
    .fixed_top{
      z-index: 2;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 90px;
      line-height: 90px;
      color: #9297a5;
      font-size: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 18px 3px rgba(27, 55, 173, 0.1);
      background: #fff;
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
      &.select_head{
        background: linear-gradient(to right, #3a8ffc, #4a69f4);
        border-bottom: 1Px solid #6699fa;
        .layout-backpage-back{
          color: #fff;
        }
        .head_tab{
          .item{
            background: transparent;
            &:after{
              background: transparent;
            }
            &.active {
              color: #ffffff;
              font-weight: bold;
              &:after {
                background: #fff;
              }
            }
          }
        }
      }
      .head_tab{
        width: 250px;
        height: 78px;
        line-height: 78px;
        height: 90px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
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
    }
    .container{
      height: 100%;
      // 好友
      .container_list{
        height: 100%;
        padding-top: 100px;
        box-sizing: border-box;
        &::-webkit-scrollbar {
          width: 0;
        }
        overflow: hidden;
        // 好友的上部分
        .container_head{
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 690px;
          height: 200px;
          color: #ffffff;
          font-size: 26px;
          padding: 60px 61px 60px 40px;
          box-sizing: border-box;
          background-size: 100% 100%;
          background-image: url('../../assets/images/invite_bg.png');
          .head_left{
            .iconfont{
              font-size: 38px;
              margin-right: 20px;
            }
          }
          .head_right{
            .number{
              font-size: 48px;
            }
          }
        }
        .prompt{
          color: #9297a5;
          font-size: 26px;
          padding: 20px 50px 36px;
          box-sizing: border-box;
          border-bottom: 1Px solid #eaecf1;
        }
        // 邀请记录
        .data_main{
          box-sizing: border-box;
          padding: 0 30px 100px;
          height: calc(100% - 190px);
          overflow-y: auto;
          overflow-x: hidden;
          &::-webkit-scrollbar {
            width: 0;
          }
          .data_content{
            box-sizing: border-box;
            padding: 30px 0;
            display: flex;
            align-items: center;
            border-bottom: 1Px solid #eaecf1;
            .img{
              width: 74px;
              height: 74px;
              border-radius: 50%;
              margin-right: 15px;
            }
            .data_list{
              width: 90%;
              height: 86px;
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              .data_top{
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 28px;
                color: #222222;
              }
              .data_bottom{
                color: #b7bac3;
                font-size: 24px;
                .select{
                  color: #2fd460;
                }
                .trans{
                  display: flex;
                  align-items: center;
                  .iconfont{
                    font-size: 24px;
                    margin-right: 20px;
                  }
                }
              }
            }
            &:last-child{
              margin-bottom: 100px;
            }
          }
        }
      }
      // 邀请码
      .qrcode{
        position: relative;
        width: 100%;
        height: 100%;
        .qrcode_img{
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        // 复制按钮
        .copy_button{
          position: absolute;
          bottom: 18%;
          left: 50%;
          transform: translateX(-50%);
          width: 240px;
          box-sizing: border-box;
          height: 60px;
          line-height: 60px;
          text-align: center;
          border-radius: 10px;
          color: #fff;
          border: 1Px solid #fff;
          background: rgba(118, 60, 233, 0.8);
        }
      }
    }
  }
</style>
