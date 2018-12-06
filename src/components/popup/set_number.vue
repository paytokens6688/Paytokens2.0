<template>
  <div class="set-number">
    <div class="set-number-inner">
      <p class="set-number-title">设置收款金额</p>
      <label
        class="set-number-label"
        for="setNumber">
        <input
          class="set-number-input"
          type="number"
          placeholder="请设置收款金额"
          :value="inputValue"
          @input="numberChange">
        <span class="set-number-symbol">{{ coinType }}</span>
      </label>
      <div class="set-number-btns">
        <button
          class="set-number-btn"
          @click="close">取消</button>
        <button
          class="set-number-btn"
          @click="submitValue">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'setNumber',
  data () {
    return {
      beforeValue: '',
      inputValue: ''
    };
  },
  beforeMount () {
    this.inputValue = this.value;
  },
  methods: {
    // 数量更改
    numberChange (e) {
      if (e.target.value === '') {
        if (this.beforeValue.length === 1) this.beforeValue = 0;
        const userInput = parseInt(this.beforeValue).toString();
        e.target.value = userInput;
        this.inputValue = e.target.value;
      } else {
        this.beforeValue = e.target.value;
        this.inputValue = e.target.value;
      }
    },
    // 提交数量更改事件
    submitValue () {
      this.submit(this.inputValue);
    }
  },
  props: {
    // 币种符号
    coinType: String,
    // 数量
    value: String,
    // 关闭事件
    close: Function,
    // 提交事件
    submit: Function
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  .set-number {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background: rgba(0, 0, 0, 0.4);
    .set-number-inner {
      background: #fff;
      position: absolute;
      top: 400px;
      left: 50%;
      width: 580px;
      margin-left: -290px;
      border-radius: 10px;
      text-align: center;
      .set-number-title {
        padding-top: 30px;
        padding-bottom: 20px;
        line-height: 60px;
        font-size: 30px;
      }
      .set-number-label {
        margin: 0 30px;
        background: #f3f4f8;
        display: block;
        height: 70px;
        line-height: 70px;
        position: relative;
        .set-number-input {
          height: 70px;
          text-align: center;
          width: 60%;
        }
        .set-number-symbol {
          position: absolute;
          top: 0;
          right: 0;
          padding-right: 10px;
        }
      }
      .set-number-btns {
        height: 100px;
        margin-top: 30px;
        overflow: hidden;
        border-top: 1Px solid #eaecf1;
        .set-number-btn {
          float: left;
          width: 50%;
          height: 100px;
          background: none;
          font-size: 30px;
          color: $gray;
          &:nth-last-child(1) {
            color: $mainColor;
            box-sizing:  border-box;
            border-left: 1Px solid #eaecf1;
          }
        }
      }
    }
  }
</style>
