<template>
  <div id="exportPrivateKey">
    <div class="export_title">
      添加观察地址
    </div>
    <textarea
      class="key_text"
      v-model="key"
      placeholder="输入地址"></textarea>
    <button
      class="copy_btn">
      添加
    </button>
  </div>
</template>

<script>
export default {
  name: 'exportPrivateKey',
  layout (context) {
    return 'back_page_img_big';
  },
  data () {
    return {
      key: ''
    };
  },
  beforeMount () {
  },
  mounted () {
  },
  methods: {
    // 确定
    keyCopy () {}
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #exportPrivateKey{
    padding:0 50px;
    .export_title{
      font-size:40px;
      color:#fff;
      line-height:93px;
    }
    .key_text{
      width:100%;
      height:300px;
      background-color:#fff;
      @include eleBottomShadown();
      margin-top:30px;
      box-sizing: border-box;
      padding: 25px 45px;
      font-size:30px;
      line-height:50px;
      color:#5e6476;
      resize:none;
      border-radius: 10px;
    }
    .copy_btn{
      width:100%;
      height:88px;
      background-color:$mainColor;
      color:#fff;
      border-radius: 10px;
      @include eleBottomShadown();
      margin-top:100px;
      font-size:30px;
    }
  }
</style>
