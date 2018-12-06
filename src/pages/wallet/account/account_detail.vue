<template>
  <div id="accountDetail">
    <div class="detail_con">
      <div class="con_top">
        <div class="iconfont icon-zhanghu"></div>
        <div class="top_names">
          <span class="top_name">
            {{account.name}}
          </span>
          <span
            class="iconfont icon-bianji"
            @click="changeName"></span>
        </div>
      </div>
      <div class="detail_lists">
        <div
          class="detail_list"
          @click="changePass">
          <span class="list_title">
            修改密码
          </span>
          <span class="iconfont icon-you"></span>
        </div>
        <div class="detail_list">
          <span class="list_title">
            密码提示
          </span>
          <span class="list_right">
            <span class="right_text">
              {{account.isShow ? account.passTest : hidePassText}}
            </span>
            <span
              class="iconfont"
              :class="{'icon-guanbi-yanjing': !account.isShow, 'icon-chakanyanjingshishifenxi': account.isShow}"
              @click="passTextToggle"></span>
          </span>
        </div>
        <div
          class="detail_list"
          @click="toAddressMessage">
          <span class="list_title">
            地址管理
          </span>
          <div class="list_right">
            <span class="prompt">私钥、Keystore导出</span>
            <span class="iconfont icon-you"></span>
          </div>
        </div>
        <div
          class="detail_list"
          @click="backupWord">
          <span class="list_title">
            备份助记词
          </span>
          <span class="iconfont icon-you"></span>
        </div>
      </div>
      <button
        class="detail_btn"
        @click="delectAccount">
        <span class="iconfont icon-shanchu"></span>
        <span class="btn_text">
          删除账户
        </span>
      </button>
    </div>
    <editName
      :title="title"
      :value="value"
      :placeholder="placeholder"
      :close="() => { this.shotShow = false }"
      v-if="shotShow"
      :submit="modifyName"></editName>
    <pass
      :value="password"
      :close="() => { this.passShow = false }"
      v-if="passShow"
      :submit="confirm"></pass>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import editName from '@/components/popup/edit_name.vue';
import pass from '@/components/popup/password.vue';
export default {
  name: 'accountDetail',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 账户
      account: {
        // 账户名
        name: '',
        // 密码提示
        passTest: '',
        // 密码提示是否显示（默认隐藏）
        isShow: false
      },
      // 点击的哪个按钮显示的交易密码弹框
      btnType: '',
      // 弹框标题
      title: '修改账户名称',
      // 弹框placeholder
      placeholder: '请输入新的账户名称',
      // 弹框内容
      value: '',
      // 弹框显示
      shotShow: false,
      // 交易密码弹框
      passShow: false,
      // pass
      password: '',
      // 当前选择的账户
      selectAccount: this.$route.query.id,
      defatulAccount: ''
    };
  },
  beforeMount () {
    // 头部
    this.pageTitle({ title: '我的账户', shadown: true });
    this.initPageData();
  },
  computed: {
    ...mapState({
      accountsList: state => state.storage.userInfo.accounts
    }),
    hidePassText () {
      let text = '';
      for (let i = 0; i < this.account.passTest.length; i++) {
        text += '*';
      }
      return text;
    }
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      // 更改账户名称
      changeAccountName: 'storage/changeAccountName'
    }),
    // 初始化页面
    initPageData () {
      this.defatulAccount = this.accountsList[this.selectAccount - 0];
      if (!this.defatulAccount) return false;
      this.account.name = this.defatulAccount.accountName;
      this.account.passTest = this.defatulAccount.passPrompt;
    },
    // 解决重名问题
    getCanUseName (name) {
      if (!this.account.name) return name;
      for (let i = 0; i < this.accountsList.length; i++) {
        if (this.accountsList[i].accountName === name) {
          let lastNum = name.match(/\d+$/);
          if (lastNum) {
            return this.getCanUseName(`${name.substr(0, lastNum.index)}${parseFloat(lastNum[0]) + 1}`);
          } else {
            return this.getCanUseName(name + '1');
          }
        }
      }
      return name;
    },
    // 修改账户名
    changeName () {
      this.shotShow = true;
    },
    // 修改账户名确认按钮
    modifyName (text) {
      if (!text) return this.$global.alertOptions('请输入账户名称');
      let oldName = this.account.name;
      this.account.name = this.getCanUseName(text);
      this.shotShow = false;
      this.changeAccountName({
        accountIndex: this.selectAccount,
        newName: this.account.name
      });
      this.$global.alertOptions(`您的账户名由${oldName}更改为${this.account.name}`);
    },
    // 隐藏/显示密码提示语
    passTextToggle () {
      this.account.isShow = !this.account.isShow;
    },
    // 修改密码
    changePass () {
      this.passShow = true;
      this.btnType = 'pass';
    },
    confirm (pass) {
      if (!pass) return false;
      if (pass !== this.defatulAccount.pass) return this.$global.alertOptions('交易密码错误');
      this.passShow = false;
      // 如果是修改密码
      if (this.btnType === 'pass') {
        this.$router.push({
          path: '/wallet/account/change_password',
          query: {
            selectAccount: this.selectAccount
          }
        });
      } else if (this.btnType === 'word') {
        this.$router.push({
          path: '/wallet/copy_account_word',
          query: {
            selectAccount: this.selectAccount
          }
        });
      }
    },
    // 去地址管理
    toAddressMessage () {
      this.$router.push({
        path: '/wallet/account/address_manage',
        query: {
          selectAccount: this.selectAccount
        }
      });
    },
    // 去备份助记词
    backupWord () {
      this.passShow = true;
      this.btnType = 'word';
    },
    // 删除账户
    delectAccount () {
      this.$router.push({
        path: '/wallet/account/delete_account',
        query: {
          type: 'account',
          selectAccount: this.selectAccount
        }
      });
    }
  },
  components: {
    editName,
    pass
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #accountDetail{
    .detail_con{
      padding:0 40px;
      .con_top{
        width:100%;
        height:230px;
        border-radius: 10px;
        overflow: hidden;
        background-image:url('../../../assets/images/account_defalut_bg.jpg');
        background-size:100% 100%;
        margin:40px 0;
        text-align:center;
        box-sizing: border-box;
        padding-top:36px;
        @include eleBottomShadown();
        .icon-zhanghu{
          height:80px;
          width:80px;
          border-radius: 50%;
          line-height:80px;
          background-color:#5170fa;
          font-size:40px;
          color:#ccd5fe;
          margin:0 auto;
        }
        .top_names{
          color:#fff;
          font-size:30px;
          margin-top:30px;
          .iconfont{
            font-size:35px;
          }
        }
      }
      .detail_lists{
        padding-top:40px;
        .detail_list{
          height:108px;
          display:flex;
          justify-content: space-between;
          align-items: center;
          border-bottom:1PX solid $listBottomGray;
          font-size:28px;
          .icon-you{
            color:#9da2b2;
            font-size:30px;
          }
          .list_right{
            display:flex;
            align-items: center;
            margin-right:5px;
            .right_text{
              color:#9297a5;
              margin-right:10px;
            }
            .prompt{
              font-size: 26px;
              color: #b7bac3;
            }
            .iconfont{
              font-size:35px;
              &.icon-guanbi-yanjing{
                color:#9297a5;
              }
              &.icon-chakanyanjingshishifenxi{
                color:$mainColor;
              }
            }
            .icon-you{
              color:#9da2b2;
              font-size:30px;
            }
          }
        }
      }
      .detail_btn{
        width:100%;
        height:88px;
        margin-top:80px;
        border-radius: 10px;
        background-color:#fff;
        font-size:30px;
        color:#9297a5;
        @include eleBottomShadown();
        span{
          display:inline-block;
          vertical-align: middle;
        }
        .iconfont{
          font-size:35px;
        }
      }
    }
  }
</style>
