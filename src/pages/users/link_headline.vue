<template>
  <div id='linkHeadline'>
    <!-- 导航 -->
    <div class="headline_navs">
      <div
        class="navs"
        ref="navs">
        <div
          class="headline_nav"
          :class="{'active': index === navIndex}"
          v-for="(item, index) in navs"
          :key="index"
          ref="nav"
          :data-id="item.id"
          @click="navToggle(index, item.id)">
          {{item.name}}
        </div>
      </div>
    </div>
    <!-- 头条列表 -->
    <listBox
      class="headline_list"
      :listArr="headlineList"
      :scrollBack="scrollCallback"
    >
      <noRecord
        title="暂无消息"
        type="message"
        v-if="!headlineList.length && canRequest">
      </noRecord>
        <nuxt-link
          tag="li"
          :to="{path: '/users/headline_detail', query: {id: item.id}}"
          class="headline_item"
          v-for="(item, index) in headlineList" :key="index">
        <!-- 左边信息 -->
        <div class="left_content">
          <p class="txt">{{item.title}}</p>
          <span class="time">{{item.create_time}}</span>
        </div>
        <!-- 图片 -->
        <div class="img_wrap">
          <img :src="item.image ? item.image : ''" alt="" class="headline_img">
        </div>
      </nuxt-link>
    </listBox>
  </div>
</template>

<script>
import noRecord from '@/components/noRecord/no_record.vue';
import listBox from '@/components/list/more_list_box.vue';
import { mapMutations } from 'vuex';
export default {
  name: 'linkHeadline',
  components: {
    noRecord,
    listBox
  },
  layout () {
    return 'back_page';
  },
  data () {
    return {
      navIndex: 0,
      isRequest: false, // 是否请求过数据
      canRequest: true, // 是否可以请求数据，请求锁 默认能请求，不是在请求中
      page: 1, // 分页默认数据
      hasMoreData: true, // 是否还有更多数据
      // 导航
      navs: [],
      headlineList: [] // 列表
    };
  },
  beforeMount () {
    this.pageTitle({ title: '链上头条', shadown: false });
    this.navIndex = 0;
    this.getNav();
  },
  mounted () {},
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // nav切换
    navToggle (index, id) {
      if (this.navIndex === index || this.canRequest === false) {
        return false;
      } else {
        this.page = 1;
        this.canRequest = true;
        this.hasMoreData = true;
        this.navIndex = index;
        this.headlineList = [];
      }
    },
    // 动态设置navs的宽度
    setNavsWidth () {
      let navs = this.$refs.nav;
      let width = 0;
      for (let i = 0; i < navs.length; i++) {
        width += (navs[i].clientWidth + navs[0].offsetLeft * 2);
      }
      this.$refs.navs.style.width = width + 5 + 'px';
    },
    // 滚动组件
    scrollCallback () {
      this.getInfo();
    },
    // 获取导航列表
    getNav () {
      this.$axios.get('/v1/api/market/get_name_id').then(({ data }) => {
        if (data.status === 200) {
          let firstNav = {
            name: '推荐'
          };
          data.data.unshift(firstNav);
          this.navs = data.data;
          this.$nextTick(() => {
            this.setNavsWidth();
            this.getInfo();
          });
        } else {
          this.$global.alertOptions(data.message);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    // 信息接口
    getInfo (id = this.navIndex) {
      if (id === 0) {
        id = null;
      } else {
        id = this.$refs.nav[id].attributes['data-id'].value;
      }
      if (!this.canRequest) return false; // 在请求中（译不能请求）
      if (!this.hasMoreData) return false;
      this.canRequest = false;
      this.$axios.get('/v1/api/article', {
        params: {
          type: 3,
          page: this.page,
          market_id: id
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
          this.headlineList = this.headlineList.concat(resObj);
          for (let i = 0; i < this.headlineList.length; i++) {
            this.headlineList[i].create_time = this.$func.setTimeToPersonRead(this.headlineList[i].create_time);
          }
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
  #linkHeadline{
    background: #fafafc;
    // 导航
    .headline_navs{
      width:100%;
      background-color:#fff;
      height:78px;
      line-height:78px;
      border-bottom: 1Px solid #eaecf1;
      overflow-y: hidden;
      overflow-x: auto;
      margin-bottom: 20px;
      &::-webkit-scrollbar{
        height: 0;
      }
      .navs{
        height:78px;
        min-width:100%;
        .headline_nav{
          height:78px;
          display:inline-block;
          margin:0 27px;
          font-size:26px;
          color:#9297a5;
          &.active{
            position:relative;
            color:#2a53fd;
            &:after{
              content:'';
              width:100%;
              height:6px;
              position: absolute;
              bottom:0;
              left:0;
              background-color:#2a53fd;
              border-radius: 6px;
            }
          }
        }
      }
    }
    // 头条列表
    .headline_list {
      width: 100%;
      height: calc(100% - 100px);
      background: #fff;
      box-sizing: border-box;
      overflow-y: auto;
      &::-webkit-scrollbar{
        width: 0;
      }
      .headline_item {
        width: 92.53%;
        min-height: 196px;
        margin: 0 auto;
        border-bottom: 1Px solid #eaecf1;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:last-child {
          margin-bottom: 100px;
        }
        // 左边
        .left_content {
          width: 62.82%;
          height: 100%;
          .txt {
            width: 100%;
            font-size: 28px;
            color: #222222;
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            word-break: break-word;
          }
          .time {
            font-size: 24px;
            color: #b7bac3;
          }
        }
        // 右边图片
        .img_wrap {
          width: 210px;
          height: 120px;
          border-radius: 10px;
          overflow: hidden;
          .headline_img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }
</style>
