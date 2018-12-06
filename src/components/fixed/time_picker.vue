<template>
  <div id="timePicker">
    <div class="time_picker_bg" @click="closePicker"></div>
    <div class="time_picker_inner">
      <h3 class="time_picker_title">{{ defaultData.title }}<button class="time_picker_submit" @click="submit">确认</button></h3>
      <div class="time_picker_list_box" v-for="(item, index) in data" :key="index" v-if="item">
        <dl class="time_picker_list">
          <!-- <dt class="time_picker_select_title">{{ item.name }}</dt> -->
          <dd class="time_picker_data" @scroll="listScroll" :data-index="index" :ref="index">
            <div class="time_picker_scroll">
              <p class="time_picker_info" v-for="(it, i) in item.data" :key="i">{{ it }}</p>
            </div>
          </dd>
        </dl>
        <div class="time_picker_change"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'timePicker',
  data () {
    return {
      // 数据
      data: {
        year: {
          name: '年',
          data: []
        },
        month: {
          name: '月',
          data: []
        },
        day: {
          name: '日',
          data: []
        }
      },
      // 默认数据
      defaultData: {
        show: true,
        title: '时间选择器',
        mode: 'day',
        startYear: (new Date()).getFullYear() - 10,
        endYear: (new Date()).getFullYear() + 10
      },
      // 设置全局倒计时，方便清除
      setTime: {
        year: null,
        month: null,
        day: null
      },
      // 设置全局默认滚动计时，方便滚动
      setInter: {
        year: null,
        month: null,
        day: null
      },
      // 全局提供时间
      getData: {
        year: null,
        month: null,
        day: null
      },
      // 全局默认时间,只读
      readonlyData: {
        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth(),
        day: (new Date()).getDate()
      }
    };
  },
  mounted () {
    this.agumentsInit();
  },
  methods: {
    // 更改默认参数
    agumentsInit () {
      // 更改标题
      if (this.title) this.defaultData.title = this.title;
      // 更改显示模式
      if (this.mode) this.defaultData.mode = this.mode;
      // 开始年份
      if (this.startYear) this.defaultData.startYear = this.startYear;
      // 结束年份
      if (this.endYear) this.defaultData.endYear = this.endYear;
      // 默认时间
      if (this.defaultTime) {
        this.getData.year = this.readonlyData.year = (new Date(this.defaultTime)).getFullYear();
        this.getData.month = this.readonlyData.month = (new Date(this.defaultTime)).getMonth();
        this.getData.day = this.readonlyData.day = (new Date(this.defaultTime)).getDate();
      }
      // 初始化
      this.init();
    },
    // 初始化页面
    init () {
      // 更改页面模式显示
      this.changeDataShow();
      // 更改当前时间
      this.getDateInit();
      // 产生时间
      this.changeYear();
    },
    // 确认事件
    submit () {
      this.closePicker();
      if (this.timeClick) {
        this.timeClick({
          year: this.getData.year,
          month: this.getData.month + 1,
          day: this.getData.day
        });
      }
    },
    // 关闭picker事件
    closePicker () {
      this.closeCallback();
    },
    // 更改页面模式
    changeDataShow () {
      if (this.defaultData.mode === 'month') this.data.day = null;
      if (this.defaultData.mode === 'year') {
        this.data.month = null;
        this.data.day = null;
      }
    },
    // 初始化更改时间
    getDateInit () {
      // 如果没有选择时间
      if (this.getData.day === null) {
        this.getData.year = this.readonlyData.year;
        this.getData.month = this.readonlyData.month;
        this.getData.day = this.readonlyData.day;
      }
    },
    // 时间滚动事件
    listScroll (e) {
      // 获取第几个
      let doNode = e.target.getAttribute('data-index');
      this.getSelectData(doNode);
    },
    // 返回当前选择的时间
    getSelectData (doNode) {
      this.setTime[doNode] = setTimeout(() => {
        if (!this.$refs[doNode][0]) return false;
        // 获取滚动条高度
        let boxScrTop = this.$refs[doNode][0].scrollTop;
        // 获取顶部高度
        let padTop = parseInt(getComputedStyle(this.$refs[doNode][0], null)['padding-top']);
        // 获取行高
        let lineHeight = parseInt(getComputedStyle(this.$refs[doNode][0].childNodes[0], null)['line-height']);
        // 返回值
        if ((boxScrTop - padTop) % lineHeight === 0) {
          if (doNode === 'month') {
            return (this.getData[doNode] = (boxScrTop - padTop) / lineHeight);
          } else {
            return (this.getData[doNode] = this.data[doNode].data[(boxScrTop - padTop) / lineHeight]);
          }
        }
        // 创建滚动到第几条，从而确定位置
        let toTopNum = null;
        if (Math.ceil((boxScrTop - padTop) / lineHeight) > (this.data[doNode].data.length - 1)) {
          toTopNum = this.data[doNode].data.length - 1;
        } else if (Math.floor((boxScrTop - padTop) / lineHeight) < 0) {
          toTopNum = 0;
        } else {
          toTopNum = Math.floor((boxScrTop - padTop + lineHeight / 2) / lineHeight);
        }
        // 将要前往的位置
        let toTop = toTopNum * lineHeight + padTop;
        // 位置差
        let goTop = toTop - boxScrTop;
        // 每次滚动距离
        let everyHeight = goTop / 10;
        // 清除上次的定时
        clearInterval(this.setInter[doNode]);
        // 定时
        let timeNum = 0;
        this.setInter[doNode] = setInterval(() => {
          if (!this.$refs[doNode][0]) return clearInterval(this.setInter[doNode]);
          if (++timeNum !== 10) {
            this.$refs[doNode][0].scrollTop = boxScrTop + everyHeight * timeNum;
          } else {
            this.$refs[doNode][0].scrollTop = toTop;
            clearInterval(this.setInter[doNode]);
            // 滚动后赋值
            if (doNode === 'month') {
              this.getData[doNode] = parseInt((boxScrTop - padTop) / lineHeight + 1);
            } else {
              this.getData[doNode] = this.data[doNode].data[parseInt((boxScrTop - padTop) / lineHeight)];
            }
            this.dataRefresh(doNode);
          }
        }, 20);
      }, 300);
    },
    // 触发数据更新事件
    dataRefresh (doNode) {
      if (doNode === 'year' && this.defaultData.mode !== 'year') {
        this.changeMonths(this.getData.year);
      } else if (doNode === 'month' && this.defaultData.mode === 'day') {
        this.changeDays(this.getData.year, this.getData.month);
      }
    },
    // 产生年份
    changeYear () {
      // 获取年份差值
      const yearDiff = this.defaultData.endYear - this.defaultData.startYear;
      // 清空年份数组
      this.data.year.data = [];
      // 循环出来年份
      for (let i = 0; i < yearDiff; i++) {
        this.data.year.data.push(this.defaultData.startYear + i);
      }
      // 在下次更新后处理数据
      this.$nextTick(() => {
        // 如果没有年份返回
        if (!this.$refs.year[0]) return false;
        // 让页面滚动到默认位置
        this.$refs.year[0].scrollTop = (parseInt(getComputedStyle(this.$refs.year[0].childNodes[0], null)['line-height']) * yearDiff / 2 + parseInt(getComputedStyle(this.$refs.year[0].childNodes[0], null)['padding-top']));
        // 如果模式不仅仅是年，继续走月份
        if (this.defaultData.mode !== 'year') this.changeMonths(this.getData.year);
      });
    },
    // 产生月份
    changeMonths (year) {
      // 清空后赋值
      this.data.month.data = [];
      // 给月份复制
      for (let i = 0; i < 12; i++) {
        this.data.month.data.push(i + 1);
      }
      // 在下次更新后处理数据
      this.$nextTick(() => {
        // 判断是否需要更改滚动条
        if (!this.$refs.month[0]) return false;
        if (year === this.readonlyData.year) {
          this.$refs.month[0].scrollTop = parseInt(getComputedStyle(this.$refs.month[0].childNodes[0], null)['line-height']) * this.readonlyData.month + parseInt(getComputedStyle(this.$refs.month[0].childNodes[0], null)['padding-top']);
          this.getData.month = this.readonlyData.month;
        } else {
          this.$refs.month[0].scrollTop = 0;
        }
        if (this.defaultData.mode === 'day') this.changeDays(year, this.getData.month);
      });
    },
    changeDays (year, month) {
      let theYear = year;
      let theMonth = month;
      // 判断是否是最后一月
      if (month === 11) {
        theYear++;
        theMonth = 0;
      }
      // 获取当前月最后一秒时间
      let nextMonthTime = (new Date(theYear, theMonth + 1, 1)).getTime() - 1;
      // 获取当前月最后一天
      let theMonthLast = (new Date(nextMonthTime)).getDate();
      // 清空后赋值
      this.data.day.data = [];
      for (let i = 0; i < theMonthLast; i++) {
        this.data.day.data.push(i + 1);
      }
      this.$nextTick(() => {
        // 判断是否需要更改滚动条
        if (!this.$refs.day[0]) return false;
        if (year === this.readonlyData.year && month === this.readonlyData.month) {
          this.$refs.day[0].scrollTop = parseInt(getComputedStyle(this.$refs.day[0].childNodes[0], null)['line-height']) * (this.readonlyData.day - 1) + parseInt(getComputedStyle(this.$refs.month[0].childNodes[0], null)['padding-top']);
        } else {
          this.$refs.day[0].scrollTop = 0;
        }
      });
    }
  },
  props: [
    'title',
    'mode',
    'startYear',
    'endYear',
    'defaultTime',
    'timeClick',
    'closeCallback'
  ]
};
</script>

<style lang="scss">
  // 背景色
  $bgColor: rgba(0, 0, 0, 0.6);
  $mainColor: #06193a;
  $pickerBgColor: #fff;
  #timePicker {
    position: fixed;
    top: 0;
    left: 0;
    width: 750px;
    height: 100%;
    z-index: 30;
    .time_picker_bg {
      width: 100%;
      height: 100%;
      background: $bgColor;
    }
    .time_picker_inner {
      background: #fff;
      width: 80%;
      height: 400px;
      position: absolute;
      top: 50%;
      left: 10%;
      margin-top: -300px;
      border-radius: 20px;
      overflow: hidden;
      text-align: center;
      display: flex;
      justify-content: space-around;
      padding-top: 80px;
      .time_picker_title {
        font-size: 34px;
        color: $mainColor;
        height: 80px;
        line-height: 80px;
        border-bottom: 1px solid $mainColor;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background: $pickerBgColor;
        .time_picker_submit {
          position: absolute;
          top: 0;
          right: 20px;
          height: 80px;
          color: $mainColor;
          font-size: 28px;
          width: 80px;
          background: none;
        }
      }
      .time_picker_list_box{
        flex-grow: 2;
        position: relative;
        .time_picker_list {
          padding-top:50px;
          .time_picker_select_title {
            padding-top: 10px;
            line-height: 50px;
            font-size: 34px;
            font-weight: 900;
            background: $pickerBgColor;
            z-index: 2;
            position: relative;
          }
          .time_picker_data {
            height: 260px;
            overflow: scroll;
            line-height: 60px;
            font-size: 28px;
            color: #666;
            padding: 100px 0;
            position: relative;
            &:-webkit-scrollbar {
              display: none;
            }
            .time_picker_scroll {
              padding: 100px 0 250px;
            }
          }
        }
        .time_picker_change {
          position: absolute;
          width: 120px;
          height: 1PX;
          background: $mainColor;
          top: 210px;
          left: 50%;
          margin-left: -60px;
        }
        &:before {
          content: '';
          position: absolute;
          top: 50px;
          left: 0;
          width: 100%;
          height: 1PX;
          background: $pickerBgColor;
          box-shadow: 0 25px 60px 40px $pickerBgColor;
          z-index: 2;
        }
        &:after {
          content: '';
          position: absolute;
          bottom: 50px;
          left: 0;
          width: 100%;
          height: 1px;
          background: $pickerBgColor;
          box-shadow: 0 25px 60px 40px $pickerBgColor;
          z-index: 2;
        }
      }
    }
  }
</style>
