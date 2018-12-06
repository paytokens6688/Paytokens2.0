<template>
  <div
    id="editName">
    <div class="content">
      <div class="con_top">
        <h2 class="title">
          {{ title }}
        </h2>
        <input
          class="inputs"
          type="text"
          v-model="inputValue"
          :placeholder="placeholder">
      </div>
      <div class="con_btns">
        <button
          class="con_btn"
          @click="close">
          取消
        </button>
        <button
          class="con_btn"
          @click="confirm">
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'editName',
  data () {
    return {
      // 输入内容
      inputValue: ''
    };
  },
  beforeMount () {
  },
  methods: {
    // 确认事件
    confirm () {
      this.submit(this.inputValue);
    }
  },
  props: {
    // 标题
    title: String,
    // input内容
    value: String,
    // placeholder
    placeholder: String,
    // 关闭事件
    close: Function,
    // 提交事件
    submit: Function
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #editName{
    position:fixed;
    left:0;
    top:0;
    height:100%;
    width:100%;
    background:rgba(0, 0, 0, 0.5);
    z-index: 10;
    .content{
      background-color:#fff;
      width:570px;
      height:320px;
      border-radius: 10px;
      position:absolute;
      top:50%;
      left:50%;
      transform: translate(-50%, -50%);
      overflow: hidden;
      .con_top{
        height:210px;
        border-bottom:1PX solid $listBottomGray;
        box-sizing: border-box;
        padding:30px;
        .title{
          text-align:center;
          line-height:52px;
          font-size:30px;
          margin-bottom:23px;
        }
        .inputs{
          width:100%;
          height:72px;
          font-size:28px;
          box-sizing: border-box;
          padding:0 20px;
          background-color:#f3f4f8;
        }
      }
      .con_btns{
        height:110px;
        width:100%;
        display:flex;
        .con_btn{
          flex:1;
          background-color:#fff;
          font-size:30px;
          color:$mainColor;
          &:first-child{
            color:#9297a5;
            border-right:1PX solid $listBottomGray;
          }
        }
      }
    }
  }
</style>
