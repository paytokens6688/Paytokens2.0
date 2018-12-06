<template>
  <div class="select-type">
    <div
      class="select-tab"
      v-for="(item, index) in typeArr"
      :key="index"
      :class="{'select-tab-change': index === propType}"
      @click="typeChange(index)">
      <div class="tab-inner">{{ item }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'selectType',
  data () {
    return {
      type: 0
    };
  },
  model: {
    prop: 'propType',
    event: 'change'
  },
  methods: {
    typeChange (type) {
      this.$emit('change', type);
    }
  },
  props: {
    typeArr: Array,
    propType: Number
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  .select-type {
    border-bottom: 1Px solid #2f365f;
    height: 74px;
    line-height: 74px;
    display: flex;
    .select-tab {
      flex-grow: 2;
      float: left;
      color: #9297a5;
      text-align: center;
      transition: color .5s;
      .tab-inner {
        position: relative;
        display: inline-block;
        text-align: center;
        &:after {
          content: '';
          width: calc(100% + 20px);
          height: 6px;
          background: none;
          position: absolute;
          bottom: 0;
          left: -10px;
          border-radius: 3px;
          transition: background .5s;
        }
      }
      &.select-tab-change {
        color: #fff;
        .tab-inner:after {
          background: $mainColor;
          bottom: -1Px;
        }
      }
    }
  }
</style>
