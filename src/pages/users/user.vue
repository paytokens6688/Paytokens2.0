<template>
  <div id="user">
    <div class="container">
      <!-- 头部 -->
      <div class="head">
        <span
          class="user_name"
          @click="goSetup">{{nickname}}</span>
        <img class="user_img" :src="userImg" alt="" @click="goSetup">
      </div>
      <!-- 公告 -->
      <div class="notice" @click="goMessage" v-if="message">
        <i class="iconfont icon-xiaoxi"></i>
        <span>{{message}}</span>
        <i class="iconfont icon-you"></i>
      </div>
      <!-- 地址，站内消息及跳转链接 -->
      <div class="box_shadow">
        <nuxt-link class="list" tag="span" to="/users/common_address">
          <span>常用地址簿</span>
          <i class="iconfont icon-you"></i>
        </nuxt-link>
        <span class="list" @click="goStation">
          <span>站内消息</span>
          <div class="list_right">
            <span :class="{'is_new': isNew === true}" v-if="isNew === true"></span>
            <i class="iconfont icon-you"></i>
          </div>
        </span>
      </div>
      <!-- 推广邀请及跳转链接 -->
      <div class="box_shadow">
        <nuxt-link class="list" tag="span" to="/users/invite">
          <span>推广邀请</span>
          <i class="iconfont icon-you"></i>
        </nuxt-link>
      </div>
      <!-- 帮助中心及跳转链接 -->
      <div class="box_shadow">
        <nuxt-link class="list" tag="span" to="/users/help_center">
          <span>帮助中心</span>
          <i class="iconfont icon-you"></i>
        </nuxt-link>
        <nuxt-link class="list" tag="span" to="/users/about_us">
          <span>关于我们</span>
          <i class="iconfont icon-you"></i>
        </nuxt-link>
        <nuxt-link class="list" tag="span" to="/users/contact_us">
          <span>联系我们</span>
          <i class="iconfont icon-you"></i>
        </nuxt-link>
        <nuxt-link class="list" tag="span" to="/users/system_setup">
          <span>系统设置</span>
          <div class="list_right">
            <span class="gray">资料、安全设置</span>
            <i class="iconfont icon-you"></i>
          </div>
        </nuxt-link>
      </div>
    </div>
    <footerTmpl :index="4" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import footerTmpl from '@/components/fixed/footer.vue';
export default {
  name: 'user',
  head () {
    // 返回头部信息
    return {
      title: '我的'
    };
  },
  data () {
    return {
      // 是否有新消息
      isNew: false,
      // 最新公告
      message: '',
      nickname: '', // 昵称
      userImg: '', // 头像
      innerStation: false // 站内消息是否开放 默认不开放
    };
  },
  mounted () {
    // 获取用户昵称，头像
    this.getInfo();
    // 最新公告
    this.getMessage();
  },
  methods: {
    ...mapMutations({
      saveHeadPic: 'storage/pickHeaderImg'
    }),
    // 获取用户昵称，头像
    getInfo () {
      this.$axios.get('/v1/user/info')
        .then(({ data }) => {
          if (data.status === 200) {
            this.nickname = data.data.nickname;
            // 获取图片下标，在本地调取图片
            if (data.data.image !== '') { // 已选择头像
              let img = this.$store.state.public.headImg[data.data.image - 1].image;
              this.userImg = img;
            } else { // 未选择头像时
              let img = this.$store.state.public.headImg[1].image;
              this.userImg = img;
            }
          } else { // 默认头像(如未登录状态)
            let img = this.$store.state.public.headImg[1].image;
            this.userImg = img;
            this.nickname = '未登录';
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 最新公告
    getMessage () {
      this.$axios.get('/v1/user/first_news')
        .then(({ data }) => {
          if (data.status === 200) {
            this.message = data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    goMessage (id) {
      this.$router.push({
        path: '/users/message_station',
        query: {
          select_tab: 2
        }
      });
    },
    // 去站内详情
    goStation () {
      if (this.innerStation) {
        this.$router.push('/users/message_station');
      } else {
        this.$global.notOpenOptions();
      }
    },
    // 去头像选择
    goSetup () {
      this.$router.push('/users/personal_info');
    }
  },
  components: {
    footerTmpl
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #user {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: left .3s;
    background-image: url('../../assets/images/user_bg.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .container{
      height: 100%;
      overflow: scroll;
      &::-webkit-scrollbar {
        width: 0;
      }
      padding: 64px 40px 180px;
      box-sizing: border-box;
      // 头部
      .head{
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #222222;
        font-size: 48px;
        margin-bottom: 41px;
        .user_name{
          width:70%;
        }
        .user_img{
          width: 140px;
          height: 140px;
          border-radius: 50%;
        }
      }
      // 公告
      .notice{
        margin-bottom: 10px;
        padding: 22px;
        box-sizing: border-box;
        font-size: 24px;
        color: #c16615;
        background: #fef8e8;
        border-radius: 5px;
        display: flex;
        align-items: center;
        .icon-xiaoxi{
          font-size: 34px;
          margin-right: 14px;
          background-image: linear-gradient(to bottom, #f08922, #f9a861);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        span{
          margin-top: -4px;
          width: 540px;
          padding-left: 18px;
          box-sizing: border-box;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          border-left: 1Px solid #e4dfd0;
        }
      }
      .box_shadow{
        margin-top: 30px;
        background: #fff;
        border-radius: 5px;
        padding: 0px 28px 0;
        box-sizing: border-box;
        box-shadow: 0 0 20px 4px #eef0f9;
        .list{
          line-height: 100px;
          color: #222222;
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1Px solid #eaecf1;
          .iconfont{
            color: #9da2b2;
            font-size: 30px;
            margin-left: 21px;
          }
          .list_right{
            display: flex;
            align-items: center;
            .is_new{
              display: inline-block;
              width: 12.4px;
              height: 12.4px;
              border-radius: 50%;
              background: #ff0000;
            }
            .gray{
              font-size: 26px;
              color: #b7bac3;
            }
          }
          &:last-child{
            border: none;
          }
        }
      }
    }
  }
</style>
