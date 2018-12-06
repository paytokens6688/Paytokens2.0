<template>
  <div
    class="more-list-box"
    ref="listBox">
    <div
      class="more-list-scroll"
      ref="scrollBox"
      @scroll="boxScroll">
      <div
        class="more-list-inner"
        ref="listInner">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'moreListBox',
  data () {
    return {
    };
  },
  watch: {
    listArr () {
      // 监听传入数据，如果数据更改，判断内容高度是否大于外部高度
      // 如果内容高度小于外部高度，说明本次请求之后无法触发滚动事件，继续请求
      setTimeout(() => {
        try {
          if (this.$refs.listInner.clientHeight < this.$refs.listBox.clientHeight) {
            this.scrollBack();
          }
        } catch (err) {}
      }, 20);
    }
  },
  methods: {
    // 滚动事件
    boxScroll (e) {
      try {
        // 判断距离底部距离,盒子高度加上头部卷起高度，减去内容盒子高度的绝对值
        const toBottomHeight = this.$refs.listInner.clientHeight - e.target.scrollTop - e.target.clientHeight;
        // 如果值小于30的话触发回调函数
        if (toBottomHeight < 30 && typeof this.scrollBack === 'function') this.scrollBack();
      } catch (err) {}
    }
  },
  props: [
    'listArr',
    'scrollBack'
  ]
};
</script>

<style lang="scss">
  .more-list-box {
    overflow: hidden;
  }
  .more-list-scroll {
    width: calc(100% + 20px);
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    padding-right: 20px;
  }
</style>
