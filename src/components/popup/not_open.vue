<template>
  <div
    class="popup-not-open"
    @click="close">
    <div
      class="popup-not-open-inner"
      ref="popupBox">
      <div class="popup-not-open-icon"></div>
      <p class="popup-not-open-title">暂未开放</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popupNotopen',
  model: {
    prop: 'options',
    event: 'change'
  },
  data () {
    return {
      closed: false
    };
  },
  mounted () {
    // 垂直居中属性添加
    this.$refs.popupBox.style['margin-top'] = `-${this.$refs.popupBox.clientHeight / 2}px`;
    // 定时关闭
    setTimeout(() => {
      if (!this.closed) this.close();
    }, 2000);
  },
  methods: {
    close () {
      this.$emit('change', {
        show: false
      });
      this.closed = true;
    }
  },
  props: {
    options: Object
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  .popup-not-open {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.6);
    .popup-not-open-inner {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 570px;
      height: auto;
      background: #fff;
      margin-left: -285px;
      border-radius: 10px;
      box-sizing: border-box;
      text-align: center;
      overflow: hidden;
      text-align: center;
      padding-top: 45px;
      .popup-not-open-icon {
        margin: 0 auto;
        width: 123px;
        height: 170px;
        color: #fff;
        overflow: hidden;
        border-radius: 50%;
        background-image: url('../../assets/images/popup-not-open.png');
        background-size: 100% 100%;
      }
      .popup-not-open-title {
        padding: 45px 90px 60px;
        font-size: 30px;
        font-weight: 700;
      }
    }
  }
</style>
