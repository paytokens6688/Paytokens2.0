<template>
  <div id="changePassword">
    <div class="change_lists">
      <label
        class="change_list"
        v-for="(item, index) in lists"
        :for="item.id"
        :key="index">
        <input
          :type="item.type"
          class="list_input"
          :id="item.id"
          :placeholder="item.title"
          :readonly="item.isEdit"
          v-model="item.info">
        <span
          class="iconfont"
          :class="{'icon-guanbi-yanjing': !item.isShow, 'icon-chakanyanjingshishifenxi': item.isShow}"
          @click="showTextToggle(index)"></span>
      </label>
    </div>
    <button
      class="change_btn"
      @click="submit">
      确认
    </button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { setTimeout } from 'timers';
export default {
  name: 'changePassword',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 列表
      lists: [
        {
          // placeholder
          title: '原密码',
          // id
          id: 'original',
          // 输入内容
          info: '',
          // 是否显示/隐藏内容 (默认隐藏)
          isShow: false,
          // input type
          type: 'password',
          // 是否可修改
          isEdit: true
        },
        {
          // placeholder
          title: '新密码(8-16位数字加字母组合)',
          // id
          id: 'newPwd',
          // 输入内容
          info: '',
          // 是否显示/隐藏内容 (默认隐藏)
          isShow: false,
          // input type
          type: 'password'
        },
        {
          // placeholder
          title: '确认密码',
          // id
          id: 'confirmPwd',
          // 输入内容
          info: '',
          // 是否显示/隐藏内容 (默认隐藏)
          isShow: false,
          // input type
          type: 'password'
        }
      ],
      account: ''
    };
  },
  beforeMount () {
    // 头部
    this.pageTitle({ title: '修改密码', shadown: true });
    this.account = this.accountsList[this.$route.query.selectAccount - 0];
    this.$set(this.lists[0], 'info', this.account.pass);
  },
  beforeDestroy () {
    // this.$global.loadingOptions(false);
  },
  computed: {
    ...mapState({
      passError: state => state.public.passError,
      accountsList: state => state.storage.userInfo.accounts
    })
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      // 修改账户密码
      changeAccountPass: 'storage/changeAccountPass'
    }),
    // 显示隐藏密码
    showTextToggle (index) {
      if (this.lists[index].type === 'text') {
        this.lists[index].type = 'password';
      } else {
        this.lists[index].type = 'text';
      }
      this.lists[index].isShow = !this.lists[index].isShow;
    },
    // 提交
    submit () {
      if (this.lists[0].info === this.lists[1].info) return this.$global.alertOptions('新密码不能与旧密码一致');
      if (!this.$func.realPayPass(this.lists[1].info)) return this.$global.alertOptions(this.passError);
      if (this.lists[2].info !== this.lists[1].info) return this.$global.alertOptions('新密码两次输入不一致');
      this.$global.loadingOptions(true);
      setTimeout(() => {
        this.changeAccountPass({
          accountIndex: this.$route.query.selectAccount - 0,
          pass: this.lists[1].info
        });
        this.$global.successOptions({
          show: true,
          message: '修改成功',
          callback: () => {
            this.$router.go(-1);
          }
        });
        this.$global.loadingOptions(false);
      }, 500);
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #changePassword{
    .change_lists{
      padding:30px 50px 80px;
      .change_list{
        height:104px;
        border-bottom:1PX solid $listBottomGray;
        display:flex;
        justify-content: space-between;
        align-items: center;
        padding-right:20px;
        .list_input{
          width:80%;
        }
        .iconfont{
          font-size:35px;
          color:#9da2b2;
          &.icon-chakanyanjingshishifenxi{
            color:$mainColor;
          }
        }
      }
    }
    .change_btn{
      width:calc(100% - 100px);
      display:block;
      margin:0 auto;
      height:88px;
      background-color:$mainColor;
      color:#fff;
      font-size:30px;
      border-radius: 10px;
      @include eleBottomShadown();
    }
  }
</style>
