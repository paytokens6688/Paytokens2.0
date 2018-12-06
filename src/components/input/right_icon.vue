<template>
  <label
    class="input-right-icon"
    :for="randomID">
    <input
      class="input-right-icon-input"
      :id="randomID"
      :class="{'input-right-icon-biginput': !iconfont}"
      :type="inputType"
      :placeholder="inputPlaceholder"
      :value="inputValue"
      @input="inputChange($event)" />
    <i
      class="input-right-icon-icon iconfont"
      :class="iconfont"
      v-if="iconfont"
      @click="iconCallback"></i>
  </label>
</template>

<script>
export default {
  name: 'RightIcon',
  data () {
    return {
      // 随机id，用来绑定label
      randomID: Math.random(Math.random()).toString().substr(2)
    };
  },
  model: {
    prop: 'inputValue'
  },
  methods: {
    // 输入框输入值更新触发函数
    inputChange (event) {
      this.$emit('input', event.target.value);
    }
  },
  props: {
    // 输入框placeholder
    inputPlaceholder: String,
    // 输入框type
    inputType: String,
    // v-model绑定的数据
    inputValue: String,
    // 右侧元素iconfont图标，如没有的话不显示
    iconfont: String,
    // 右侧元素的点击事件
    iconCallback: Function
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  // 单个高度
  $lineHeight: 84px;
  .input-right-icon {
    width: 100%;
    height: $lineHeight;
    border-bottom: 1Px solid $listBottomGray;
    display: block;
    position: relative;
    padding-top: 16px;
    .input-right-icon-input {
      width: calc(100% - #{$lineHeight});
      height: 100%;
      display: block;
      letter-spacing: 1px;
      &.input-right-icon-biginput {
        width: 100%;
      }
    }
    .input-right-icon-icon {
      position: absolute;
      bottom: 0;
      right: 0;
      width: $lineHeight;
      height: $lineHeight;
      line-height: $lineHeight;
      text-align: center;
      color: $gray;
      font-size: 34px;
      background: #fff;
    }
  }
</style>
