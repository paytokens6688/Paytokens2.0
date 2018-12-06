<template>
  <div class="word-list">
    <label
      class="word-list-li"
      v-for="(item, index) in dataList"
      :key="index"
      :class="{
        'word-list-noleft': index % 3 === 0,
        'word-list-nobottom': index > 8
      }"
      :for="`wordList${index + 1}`">
      <p class="word-list-index">{{ index + 1 }}</p>
      <input
        type="text"
        class="word-list-input"
        :id="`wordList${index + 1}`"
        :value="dataList[index]"
        :readonly="dataDisable"
        :ref="`input${index}`"
        autocomplete="off"
        @input="changeInput(index, $event)"
        @keydown.13="changeInputBox(index)">
    </label>
  </div>
</template>

<script>
export default {
  name: 'wordList',
  data () {
    return {};
  },
  model: {
    prop: 'dataList',
    event: 'change'
  },
  methods: {
    // 更新input框数据
    changeInput (index, event) {
      // 如果是第一个input框
      if (index === 0) {
        if (event.target.value.split(' ').length === 12) {
          return this.$emit('change', event.target.value.split(' '));
        }
      }
      let arr = this.dataList.map(item => item);
      arr[index] = event.target.value;
      this.$emit('change', arr);
    },
    // 更改获取数据的input焦点
    changeInputBox (index) {
      if (index >= this.dataList.length - 1) return false;
      this.$refs[`input${index + 1}`][0].focus();
    }
  },
  props: {
    dataList: Array,
    dataDisable: Boolean
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  .word-list {
    width: 100%;
    border-radius: 10px;
    background: #fff;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 20px 0 rgba(27, 55, 173, 0.1);
    .word-list-li {
      display: block;
      float: left;
      width: 33.33%;
      height: 100px;
      box-sizing: border-box;
      border-left: 1Px solid $listBottomGray;
      border-bottom: 1Px solid $listBottomGray;
      position: relative;
      &.word-list-noleft {
        border-left: none;
      }
      &.word-list-nobottom {
        border-bottom: none;
      }
      .word-list-index {
        position: absolute;
        font-size: 40px;
        color: #dee0e5;
        transform: scale(0.5);
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        top: -20px;
        left: -20px;
      }
      .word-list-input {
        display: block;
        width: 100%;
        height: 100%;
        text-align: center;
        color: #5e6476;
        font-size: 30px;
        box-sizing: border-box;
        padding: 0 10%;
      }
    }
  }
</style>
