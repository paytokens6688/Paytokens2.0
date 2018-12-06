<template>
  <div id="noticeList">
    <listBox
      class="notice_lists"
      :listArr="notices"
      :scrollBack="scrollCallback">
      <div
        class="notice_list"
        :class="{'active': item.isNew}"
        v-for="(item, index) in notices"
        :key="index">
        <i
          class="iconfont icon-gonggao"
          v-if="item.isNew"></i>
        <p class="list_titles">
          <span class="list_title">
            {{item.title}}
          </span>
          <span class="list_time">
            {{item.create_time}}
          </span>
        </p>
        <p class="list_mess">
          {{item.description}}
        </p>
        <nuxt-link
          class="list_link"
          :to="{path: '/notice/notice_detail', query: {id: item.id}}">
          查看详情>>
        </nuxt-link>
      </div>
      <noRecord
        title="暂无数据"
        type="record"
        v-if="!notices.length">
      </noRecord>
    </listBox>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import noRecord from '@/components/noRecord/no_record.vue';
import listBox from '@/components/list/more_list_box.vue';
export default {
  name: 'noticeList',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 公告数据
      notices: [],
      // 页数
      page: 1,
      // 是否可以请求
      canReq: true,
      // 是否还有更多
      hasMore: true
    };
  },
  beforeMount () {
    // 头部
    this.pageTitle({ title: '公告', shadown: true });
    this.getNotice();
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    }),
    scrollCallback () {
      if (this.canReq && this.hasMore) {
        this.getNotice();
      }
    },
    // 获取公告列表
    getNotice () {
      this.canReq = false;
      this.$axios.get('v1/api/article', {
        params: {
          type: 2,
          page: this.page
        }
      })
        .then(({ data }) => {
          if (data.status === 200) {
            this.canReq = true;
            this.page++;
            if (data.data.length < 10 || !data.data.length || !data.data) {
              this.hasMore = false;
            }
            this.notices = this.notices.concat(data.data);
            for (let i = 0; i < this.notices.length; i++) {
              this.notices[i].create_time = this.$func.setTimeToPersonRead(this.notices[i].create_time);
            }
          }
        });
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
  #noticeList{
    background-color:#fff;
    height:100%;
    .notice_lists{
      width:100%;
      .more-list-scroll{
        padding:20px 50px 20px 30px;
      }
      .notice_list{
        min-height:180px;
        box-shadow: 0 0 18px 3px rgba(27, 55, 173, 0.1);
        margin-top:30px;
        border-radius: 20px;
        padding: 20px 25px 0;
        font-size:24px;
        overflow: hidden;
        &.active{
          position:relative;
          &:after{
            position:absolute;
            right:0;
            top:0;
            width:0;
            height:0;
            border-top:86px solid $mainColor;
            border-left:94px solid transparent;
            content:'';
            display:block;
            z-index:1;
          }
          .icon-gonggao{
            position:absolute;
            z-index:2;
            top:15px;
            right:15px;
            color:#fff;
            font-size:30px;
          }
        }
        .list_titles{
          line-height:40px;
          width:95%;
          word-break: break-all;
          padding: 7px 0;
          .list_time{
            color:#b7bac3;
            margin-left:20px;
          }
        }
        .list_mess{
          font-size:26px;
          line-height:52px;
          width:100%;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .list_link{
          color:$mainColor;
          line-height:60px;
        }
      }
    }
  }
</style>
