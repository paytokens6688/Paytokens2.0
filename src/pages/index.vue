<template>
  <div
    id="Index"
    class="app_page_box">
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Index',
  computed: {
    ...mapState({
      accounts: state => state.storage.userInfo.accounts
    })
  },
  beforeMount () {
    this.$nextTick(() => {
      if (this.accounts.length) {
        // 如果有账户
        this.$router.replace('/wallet');
      } else {
        // 如果没有账户
        this.$router.replace('/wallet/create_account');
      }
    });
  }
};
</script>
