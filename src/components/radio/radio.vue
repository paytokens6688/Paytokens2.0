<template>
  <div
    class="radio-list iconfont"
    :class="[select ? 'icon-xuanze' : 'icon-xuanze1']"
    @click="radioClick">
  </div>
</template>

<script>
export default {
  name: 'radioList',
  data () {
    return {
    };
  },
  model: {
    prop: 'select',
    event: 'change'
  },
  methods: {
    radioClick () {
      this.$emit('change', !this.select);
      if (this.callback) this.callback();
    }
  },
  props: {
    select: Boolean,
    callback: Function
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  .radio-list {
    $listHeight: 40px;
    width: $listHeight;
    height: $listHeight;
    background: #fff;
    font-size: $listHeight;
    line-height: $listHeight;
    transition: color .3s;
    &.icon-xuanze1 {
      color: #9297a5;
    }
    &.icon-xuanze {
      color: $mainColor;
    }
  }
</style>
