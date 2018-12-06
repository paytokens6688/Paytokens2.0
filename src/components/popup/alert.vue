<template>
  <div class="popup-alert">
    <div
      class="popup-background"
      @click="closeAlert"></div>
    <div
      class="popup-alert-inner"
      ref="popupBox">
      <div
        class="popup-alert-message"
        v-html="options.message"></div>
      <div class="popup-alert-btns">
        <button
          class="popup-alert-button"
          :class="{'popup-alert-color': options.noClose}"
          v-for="(item, index) in options.callbackList"
          :key="index"
          @click="close(item.callback)">{{ item.title }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popupAlert',
  model: {
    prop: 'options',
    event: 'change'
  },
  data () {
    return {
    };
  },
  mounted () {
    // 垂直居中属性添加
    this.$refs.popupBox.style['margin-top'] = `-${this.$refs.popupBox.clientHeight / 2}px`;
  },
  methods: {
    closeAlert () {
      if (this.options.callbackList.length === 1) return false;
      this.$emit('change', {
        show: false
      });
    },
    close (callback) {
      (typeof (callback) === 'function' && callback());
      this.$emit('change', {
        show: false
      });
    }
  },
  props: {
    options: Object
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  .popup-alert {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    .popup-background {
      background: rgba(0, 0, 0, 0.6);
      z-index: -1;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .popup-alert-inner {
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
      .popup-alert-message {
        line-height: 48px;
        padding: 50px;
      }
      .popup-alert-btns {
        width: 100%;
        height: 112px;
        line-height: 112px;
        border-top: 1Px solid $listBottomGray;
        display: flex;
        .popup-alert-button {
          flex-grow: 2;
          color: $mainColor;
          background: #fff;
          font-size: 30px;
          &.popup-alert-color:nth-last-child(2) {
            color: $mainColor;
          }
          &:nth-last-child(2) {
            border-right: 1Px solid $listBottomGray;
            color: $gray;
          }
        }
      }
    }
  }
</style>
