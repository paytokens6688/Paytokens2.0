<template>
  <div id="choiceCode">
    <!-- 国家列表 -->
    <div class="content" ref="wrapper">
      <div class="bigbox">
        <div class="box" v-for="(item, index) in countryget" :key="index" :ref="item.title">
          <div class="title">{{item.title}}</div>
          <div class="listbox" >
            <div class="list" v-for="(con, j) in item.list" :key="j" @click="choose(con)">
              <span>{{con.name}}</span>
              <span class="tel">+{{con.tel}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  <!-- 字母表 -->
    <div class="alpha">
      <div class="list" v-for="(item, index) in zimu" :key="index" @click="zimuclick"
      @touchstart = "start(index)"
      @touchmove = "move"
      @touchend = "end"
      :ref = "item"
      v-bind:class="{ active: index === currentIndex}"
      >{{item}}</div>
    </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll';
import country from '@/assets/js/country.js';
import { mapMutations } from 'vuex';
export default {
  name: 'choice_code',
  layout (context) {
    return 'back_page';
  },
  head () {
    // 返回头部信息
    return {
      title: '选择区号'
    };
  },
  data () {
    return {
      // 所有城市的数组
      country,
      // 城市的首字母
      zimu: [],
      zi: '',
      status: true,
      startY: null,
      time: null,
      listHeight: [],
      scrollY: 0
    };
  },
  computed: {
    // s--过滤为空的数据
    countryget () {
      return this.country.filter((item, index) => {
        return item.list.length !== 0;
      });
    },
    currentIndex () {
      let i = 0;
      for (i; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return i;
    }
  },
  created () {
    let arr = [];
    this.countryget.forEach((item, index) => {
      arr.push(item.title);
    });
    this.zimu = arr;
  },
  watch: {
    zi (xin, old) {
      const element = this.$refs[xin][0];
      this.scroll.scrollToElement(element, 150);
    }
  },
  beforeMount () {
    // 头部
    this.pageTitle({ title: '', shadown: true });
  },
  mounted () {
    // ---s---vue中dom加载完的钩子解决刷新页面不能滑动
    this.$nextTick(() => {
      this.scroll = new Bscroll(this.$refs.wrapper, {
        click: true,
        probeType: 3
      });
      this.scroll.on('scroll', pos => {
        // 拿到实时的y坐标
        this.scrollY = Math.abs(Math.round(pos.y));
      });
      this.calculateHeight();
    });
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      chooseTel: 'chooseTel'
    }),
    choose (item) { // 选中某个城市 区号，返回上一页
      let str = '';
      if (item.tel !== '86') { // 区号仅选中国86
        this.$global.notOpenOptions();
      } else {
        str = item.name + ' +' + item.tel;
        this.chooseTel(str);
        this.$router.go(-1);
      }
    },
    // 选中某个字母开头的城市
    zimuclick (e) {
      this.zi = e.target.innerText;
    },
    start () {
      this.status = true;
    },
    move (e) {
      if (this.status) {
        if (this.time) {
          clearTimeout(this.time);
        }
        this.time = setTimeout(() => {
          const touchY = e.touches[0].clientY - 50;
          const index = Math.floor((touchY - this.startY) / 20);
          if (index >= 0 && index < this.zimu.length) {
            this.zi = this.zimu[index];
          }
        }, 16);
      }
    },
    end () {
      this.status = false;
    },
    calculateHeight () {
      let list = this.$refs.wrapper.getElementsByClassName('box');
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #choiceCode {
    // padding-top: 84px;
    background: white;
    padding-bottom: 60px;
    box-sizing: border-box;
    .content {
      position: absolute;
      top: 100px;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: hidden;
    }
    .content .box:last-child .listbox .list:last-child {
      border-bottom: 1px solid #e5e5e5;
    }
    .box {
      .title {
        width: 100%;
        padding: 0 30px;
        box-sizing: border-box;
        height: 80px;
        font-size: 24px;
        color: rgba(175, 181, 195, 1);
        line-height: 80px;
      }
      .listbox {
        background: white;
        margin: 0 30px;
      }
      .list {
        width: 100%;
        box-sizing: border-box;
        height: 108px;
        line-height: 108px;
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28px;
        .tel{
          color: $darkBlue;
          margin-right: 22px;
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
    .alpha {
      position: absolute;
      top: 100px;
      width: 40px;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .list {
        text-align: center;
        height: 40px;
        line-height: 40px;
        color: #9297a5;
        font-size: 22px;
      }
    }
  }
</style>
