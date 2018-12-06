<template>
  <div
    id="Default"
    class="app_page_box"
    :class="{'default-bg-hid': userInited, 'default-bg-none': userInitIng}">
    <nuxt class="layout-defatul-nuxt" />
  </div>
</template>

<script>
export default {
  name: 'Default',
  data () {
    return {
      // 页面初始化控制变量
      userInitIng: false,
      userInited: false
    };
  },
  mounted () {
    // 是否是第一次进入页面
    if (this.$store.state.fristShowPage) {
      // 返回时遮罩层，避免尴尬
      this.userInitIng = true;
      setTimeout(() => {
        this.userInited = true;
      }, 10);
      this.$store.commit('fristShowPageChange');
    } else {
      // 不是第一次的话直接删除遮罩层
      this.userInitIng = true;
      this.userInited = true;
    }
  }
};
</script>

<style lang="scss">
</style>
