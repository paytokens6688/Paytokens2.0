<template>
  <div
    class="popup-loading">
    <div
      class="content"
      v-show="conShow">
      <div
        class="popup-loading-inner"
        ref="popupBox">
      </div>
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
      closed: false,
      conShow: false
    };
  },
  beforeMount () {
    setTimeout(() => {
      this.conShow = true;
    }, this.options.time || 0);
  },
  mounted () {
    // 垂直居中属性添加
    // this.$refs.popupBox.style['margin-top'] = `-${this.$refs.popupBox.clientHeight / 2}px`;
    // 定时关闭
    // setTimeout(() => {
    //   if (!this.closed) this.close();
    // }, 2000);
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
  .popup-loading {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    .content{
      position:absolute;
      left:0;
      top:0;
      width:100%;
      height:100%;
      background: rgba(0, 0, 0, 0.3);
    }
    .popup-loading-inner {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 140px;
      height: 140px;
      // background: #fff;
      margin-top: -70px;
      margin-left: -70px;
      background:url('../../assets/images/loading.gif');
      background-size:100% 100%;
      // transform:scale(1.5);
    }
  }
</style>
