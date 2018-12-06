<template>
  <div id="globalComponents">
    <alert
      v-model="alertOptions"
      v-if="alertOptions.show" />
    <success
      v-model="successOptions"
      v-if="successOptions.show" />
    <notOpen
      v-model="notOpenOptions"
      v-if="notOpenOptions.show" />
    <loading
      v-model="loadingOptions"
      v-if="loadingOptions.show" />
  </div>
</template>

<script>
// 提示
import alert from './popup/alert.vue';
// 成功
import success from './popup/seccess.vue';
// 暂未开放
import notOpen from './popup/not_open.vue';
// loading
import loading from './popup/loading.vue';

export default {
  name: 'globalComponents',
  data () {
    return {
      alertOptions: {
        // 是否显示
        show: false,
        // 内容/HTML
        message: '',
        // 左边显示主色调
        noClose: false,
        // 回调函数
        callbackList: [
          {
            title: '知道了',
            callback () {}
          }
        ]
      },
      successOptions: {
        // 是否显示
        show: false,
        // 文字/标题
        message: '',
        // 回调函数
        callback: () => {}
      },
      notOpenOptions: {
        // 是否显示
        show: false
      },
      loadingOptions: {
        // 是否显示
        show: false,
        // loading延迟时间
        time: ''
      }
    };
  },
  components: {
    alert,
    success,
    notOpen,
    loading
  }
};
</script>

<style lang="scss">
  #globalComponents {
  }
</style>
