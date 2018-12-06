<template>
  <div id="copyAccountType">
    <select-type
      :typeArr="typeList"
      v-model="listType" />
    <nuxt class="main" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import selectType from '@/components/list/select_type.vue';
export default {
  name: 'copyAccountType',
  layout (context) {
    if (context.route.path === '/wallet/copy_account_type/coins') {
      return 'back_page_img';
    } else {
      return 'back_page_img_big';
    }
  },
  data () {
    return {
      // 头部切换数组
      typeList: [
        '助记词备份',
        '单币种私钥备份'
      ],
      pageList: [
        'word',
        'coins'
      ],
      // 选择了头部第几个
      listType: 0
    };
  },
  watch: {
    '$route' () {
      this.pageTitle('备份');
    },
    'listType' (to) {
      this.$router.replace({
        path: `/wallet/copy_account_type/${this.pageList[to]}`,
        query: {
          id: this.$route.query.id
        }
      });
    }
  },
  beforeMount () {
    this.pageTitle('备份');
    this.pageList.map((item, index) => {
      if (this.$route.path.match(item)) {
        this.listType = index;
      }
    });
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange'
    })
  },
  components: {
    selectType
  }
};
</script>

<style lang="scss">
  #copyAccountType {
    .main {
      height: calc(100% - 74px - 1Px);
      overflow-y: auto;
      box-sizing: border-box;
      padding-top: 30px;
      padding-left: 50px;
      padding-right: 50px;
    }
  }
</style>
