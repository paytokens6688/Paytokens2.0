<template>
  <div id='personalInfo' >
    <!-- 轮播 -->
    <div class="swiper_wrap">
      <div v-swiper:mySwiper="swiperOption" class="swiper_box">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in swiperImg" :key="index">
            <img :src="item.image" class="img">
            <!-- 选择 -->
            <div class="choose_btn" :class="{'is_pick' : index === select-1}" @click="pick" :data-index="item.id">{{index === select-1 ? '已选择' : '选择'}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 相同样式 -->
    <div class="common_box">
      <label for="nick" class="common_title">昵称</label>
      <input type="text" id="nick" class="nick_input" v-model="nickName" placeholder="请输入昵称">
    </div>
    <div class="common_box">
      <span class="common_title">账号</span>
      <span class="content">{{phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</span>
    </div>
    <div class="common_box" @click="goEmail">
      <span class="common_title">邮箱</span>
      <div class="right_box">
        <span class="status" :class="{'email' : email}">{{email ? email : '未绑定'}}</span>
        <span class="iconfont icon-you"></span>
      </div>
    </div>
    <!-- 保存按钮 -->
    <div class="keep_btn" @click="doKeep">保存</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import 'swiper/dist/css/swiper.css';
export default {
  name: 'personalInfo',
  layout () {
    return 'back_page';
  },
  data () {
    return {
      select: '', // 默认选择
      swiperImg: [],
      isWhere: 1,
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        // autoplay: true,
        centeredSlides: true,
        loop: false,
        slidesPerView: 3
      },
      nickName: '',
      phone: '',
      email: ''
    };
  },
  beforeMount () {
    this.pageTitle({ title: '个人信息', shadown: true });
    this.swiperImg = this.$store.state.public.headImg; // 选择本地头像图片
  },
  mounted () {
    this.getInfo();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      saveHeadPic: 'storage/pickHeaderImg'
    }),
    // 头像选择
    pick (e) {
      let dom = e.target;
      this.select = dom.getAttribute('data-index') - 0; // 此选择的是图片id, 上面判断id减1是否等于图片索引
    },
    // 邮箱事件
    goEmail () {
      if (!this.email) {
        // this.$router.push('bind_email'); 暂时没有接口 故关闭
        this.$global.notOpenOptions();
      } else {
        this.$router.push('/users/edit_email');
      }
    },
    // 保存
    doKeep () {
      // if (!this.select) {
      //   this.$global.alertOptions('请选择头像');
      // } else if (!this.email) {
      //   this.$global.alertOptions('请绑定邮箱账号');
      // }
      if (this.nickName.length > 15) return this.$global.alertOptions('请输入1-15位昵称');
      this.keep(); // 执行保存接口
    },
    // 信息接口
    getInfo () {
      this.$axios.get('/v1/user/info').then(({ data }) => {
        if (data.status === 200) {
          this.nickName = data.data.nickname;
          this.phone = data.data.mobile;
          this.email = data.data.email;
          if (data.data.image) {
            this.select = data.data.image;
            this.isWhere = this.select - 1;
            this.mySwiper.slideTo(this.isWhere, 1000, false); // 轮播图转到已选头像的所在位置
          } else {
            this.mySwiper.slideTo(1, 1000, false); // 轮播图转到已选头像的所在位置
          }
        } else {
          this.$global.alertOptions(data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    // 保存接口
    keep () {
      this.$axios.put('/v1/user/info/update', {
        nickname: this.nickName,
        image: this.select
      }).then(({ data }) => {
        if (data.status === 200) {
          // this.$store.commit('storage/pickHeaderImg', this.select); // 不用mapMutations时
          this.saveHeadPic(this.select); // 用mapMutation时
          this.$global.successOptions({
            message: '保存成功',
            callback: () => {
              this.$router.go(-1);
            }
          });
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

<style lang='scss' scoped>
  @import '@/assets/scss/public.scss';
  #personalInfo{
    // 轮播
    .swiper_wrap {
      width: 100%;
      height: 380px;
      box-sizing: border-box;
      padding-top: 46px;
      margin-bottom: 10px;
      .swiper_box {
        width: 100%;
        height: 324px;
        overflow: hidden;
        .swiper-wrapper {
          width: 100%;
          height: 100%;
          .swiper-slide {
            height: 100%;
            text-align: center;
            overflow: hidden;
            display: inline-block;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            padding-bottom: 20px;
            .choose_btn {
              visibility: hidden;
            }
            &.swiper-slide-active {
              .choose_btn {
                visibility: inherit;
              }
            }
            .img {
              width: 100px;
              height: 100px;
              object-fit: cover;
              border-radius: 50%;
            }
            &.swiper-slide-active {
              .img {
                width: 176px;
                height: 176px;
                object-fit: cover;
                border-radius: 50%;
              }
            }
          }
        }
      }
      // 选择
      .choose_btn {
        width: 118px;
        height: 52px;
        border: 1Px solid #132b8c;
        color: #132b8c;
        text-align: center;
        line-height: 52px;
        margin: 0 auto;
        border-radius: 8px;
        background: #e7e9f3;
        // margin-top: 15px;
        // margin-bottom: 44px;
        &.is_pick {
          width: 120px;
          height: 52px;
          border: 1Px solid #b7bac3;
          color: #b7bac3;
          background: #f8f8f9;
          border-radius: 8px;
        }
      }
    }
    // 相同样式
    .common_box {
      box-sizing: border-box;
      width: 90%;
      height: 100px;
      border-bottom: 1Px solid #eaecf1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      font-size: 28px;
      color: #282828;
      // 昵称
      .nick_input {
        width: 70%;
        height: 100%;
        font-size: 28px;
        color: #282828;
        text-align: right;
        line-height: 60px;
        &::placeholder {
          font-size: 28px;
          color: #b7bac3;
          text-align: right;
        }
      }
      .right_box {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 100%;
        .status {
          font-size: 26px;
          color: #b7bac3;
          &.email {
            font-size: 28px;
            color: #282828;
          }
        }
        .icon-you {
          font-size: 30px;
          color: #b4b8c4;
          padding-left: 17px;
          padding-top: 8px;
        }
      }
    }
    // 保存按钮
    .keep_btn {
      width: 92%;
      height: 88px;
      background: #fff;
      box-shadow: 0px 0px 10px 5px #f0f2fa;
      font-size: 30px;
      color: #2a53fd;
      line-height: 88px;
      text-align: center;
      border-radius: 8px;
      margin: 109px auto;
    }
  }
</style>
