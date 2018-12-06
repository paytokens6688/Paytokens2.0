<template>
  <div id="promoteEarn">
    <div class="earn_top">
      <p class="top_num">
        {{all_num}}
      </p>
      <p class="top_text">
        {{navs[navIndex].title}} - 推广总收益
      </p>
    </div>
    <div class="earn_navs">
      <div
        class="earn_nav"
        :class="{'active': navIndex === index}"
        v-for="(item, index) in navs"
        :key="index"
        @click="navToggle(index)">
        <span class="nav_text">
          {{item.title}}
        </span>
        <span
          class="iconfont"
          :class="item.icon"></span>
      </div>
    </div>
    <listBox
      class="record_lists"
      :listArr="records"
      :scrollBack="scrollCallback">
      <div
        class="record_list"
        v-for="(item, index) in records"
        :key="index">
        <div class="list_info">
          <div class="list_imgs">
            <img
              class="list_img"
              :src="item.image"
              alt="头像">
          </div>
          <div class="list_names">
            <div class="list_name">
              {{item.nickname}}
            </div>
            <div class="list_phone">
              {{item.mobile}}
            </div>
          </div>
        </div>
        <div class="list_nums">
          <div class="list_num">
            {{item.money}} {{navs[navIndex].title}}
          </div>
          <div class="list_time">
            {{item.create_time}}
          </div>
        </div>
      </div>
      <noRecord
        title="暂无数据"
        type="record"
        v-if="!records.length">
      </noRecord>
    </listBox>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import noRecord from '@/components/noRecord/no_record.vue';
import listBox from '@/components/list/more_list_box.vue';
export default {
  name: 'promoteEarn',
  data () {
    return {
      // 推广总收益
      all_num: '0.0000',
      // 选中的导航。默认第一个
      navIndex: 0,
      // 记录的导航
      navs: [
        {
          title: 'BTC',
          icon: 'icon-yuanhuan'
        },
        {
          title: 'ETH',
          icon: 'icon-jiantou122'
        }
      ],
      // 记录
      records: [],
      canReq: true,
      hasMore: true,
      page: 1
    };
  },
  beforeMount () {
    this.pageTitle('AI 账户');
    this.getInfo();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    // 切换导航
    navToggle (index) {
      if (this.navIndex === index && !this.canReq) return false;
      this.navIndex = index;
      this.page = 1;
      this.records = [];
      this.canReq = true;
      this.hasMore = true;
      this.getInfo();
    },
    getInfo () {
      this.canReq = false;
      this.$axios.get('v1/ai/invite_profit', {
        params: {
          class: this.navIndex + 1,
          page: this.page
        }
      })
        .then(({ data }) => {
          if (data.status === 200) {
            this.canReq = true;
            this.page++;
            if (data.data.log.length < 10 || !data.data.log.length || !data.data.log) {
              this.hasMore = false;
            }
            this.all_num = data.data.profit.toFixed(4);
            this.records = this.records.concat(data.data.log);
            for (let i = 0; i < this.records.length; i++) {
              this.records[i].create_time = this.$func.formatDate(new Date(this.records[i].create_time));
              if (this.records[i].image === '') {
                this.records[i].image = this.$store.state.public.headImg[1].image;
              }
            }
          }
        });
    },
    scrollCallback () {
      if (this.canReq && this.hasMore) {
        this.getList();
      }
    }
  },
  components: {
    noRecord,
    listBox
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #promoteEarn{
    height:100%;
    .earn_top{
      height:275px;
      text-align:center;
      background:linear-gradient(135deg, #046fd6, #0136cf);
      box-sizing: border-box;
      padding-top:65px;
      .top_num{
        font-size:60px;
        color:#fff;
        font-weight: 600;
        line-height:82px;
      }
      .top_text{
        font-size:24px;
        color:#c3c6f5;
        line-height:62px;
      }
    }
    .earn_navs{
      height:98px;
      line-height:98px;
      border-bottom:1PX solid $listBottomGray;
      padding:0 30px;
      display:flex;
      justify-content: space-between;
      align-items: center;
      position:relative;
      &:after{
        position: absolute;
        content:'';
        display:block;
        width:64%;
        height:7px;
        top:50%;
        margin-top:-3px;
        background-color:#f3f3fb;
        left:18%;
        z-index:1;
      }
      .earn_nav{
        width:18%;
        font-size:26px;
        box-sizing: border-box;
        color:#9297a5;
        position:relative;
        z-index:2;
        // background-color:#fff;
        transition: all 0.5s ease;
        .iconfont{
          position:absolute;
          top:0;
          z-index: 2;
          color:#d9dcfb;
          font-size:25px;
        }
        &:nth-child(1){
          padding-left:20px;
          .iconfont{
            right:0;
          }
        }
        &:nth-child(2){
          padding-right:20px;
          text-align: right;
          .iconfont{
            left:0;
          }
        }
        &.active{
          color:$mainColor;
          .iconfont{
            color:$mainColor;
          }
        }
      }
    }
    .record_lists{
      padding-left:30px;
      height:calc(100% - 375px);
      .record_list{
        height:130px;
        border-bottom:1PX solid $listBottomGray;
        display:flex;
        justify-content: space-between;
        align-items: center;
        padding-right:30px;
        .list_info{
          display:flex;
          align-items: center;
          .list_imgs{
            width:74px;
            height:74px;
            border-radius: 50%;
            overflow: hidden;
            margin-right:15px;
            .list_img{
              width:100%;
              height:100%;
            }
          }
          .list_names{
            .list_name{
              line-height:53px;
            }
            .list_phone{
              font-size:24px;
              color:#b7bac3;
              line-height:45px;
            }
          }
        }
        .list_nums{
          text-align:right;
          .list_num{
            font-size:30px;
            font-weight: 600;
            line-height:48px;
          }
          .list_time{
            font-size:24px;
            color:#b7bac3;
            line-height:45px;
          }
        }
      }
    }
  }
</style>
