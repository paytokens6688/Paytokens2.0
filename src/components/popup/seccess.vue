<template>
  <div
    class="popup-sucess"
    @click="close">
    <div
      class="popup-success-inner"
      ref="popupBox">
      <div class="popup-success-icon"></div>
      <p class="popup-success-title">{{ options.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popupSucess',
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
    }, this.options.message.length * 500);
  },
  methods: {
    close () {
      (typeof (this.options.callback) === 'function' && this.options.callback());
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
  .popup-sucess {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.6);
    .popup-success-inner {
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
      padding-top: 80px;
      .popup-success-icon {
        margin: 0 auto;
        width: 110px;
        height: 110px;
        color: #fff;
        overflow: hidden;
        border-radius: 50%;
        background-image: url('../../assets/images/popup-success.png');
        background-size: 100% 100%;
      }
      .popup-success-title {
        padding: 30px 90px 60px;
        font-size: 30px;
        font-weight: 700;
      }
    }
  }
</style>
