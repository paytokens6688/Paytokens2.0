<template>
  <div id="addressDetail">
    <div class="detail_top">
      <div class="iconfont icon-dizhi1"></div>
      <div class="top_texts">
        <span class="top_text">
          {{address.name}}
        </span>
        <span
          class="iconfont icon-bianji"
          @click="changeName"></span>
      </div>
    </div>
    <div
      class="detail_lists"
      v-if="!isWatch">
      <div
        class="detail_list"
        v-for="(item, index) in lists"
        :key="index"
        @click="listTap(item)">
        <span class="list_title">
          {{item.title}}
        </span>
        <span class="iconfont icon-you"></span>
      </div>
    </div>
    <button
      class="detail_btn"
      @click="delectAddress">
      <span class="iconfont icon-shanchu"></span>
      <span class="btn_text">
        删除地址
      </span>
    </button>
    <editName
      :title="title"
      :value="value"
      :placeholder="placeholder"
      :close="() => { this.shotShow = false }"
      v-if="shotShow"
      :submit="modifyName"></editName>
    <passBox
      v-if="passBoxShow"
      :close="() => { this.passBoxShow = false; }"
      :submit="getPass"></passBox>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import editName from '@/components/popup/edit_name.vue';
import passBox from '@/components/popup/password.vue';
export default {
  name: 'addressDetail',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 是否是观察地址
      isWatch: this.$route.query.watch || '',
      // 地址类型
      key: this.$route.query.key || '',
      // 地址信息
      address: {
        // 地址名称
        name: ''
      },
      // 操作列表
      lists: [
        {
          title: '导出私钥',
          path: 'export_private_key'
        }
        // {
        //   title: '导出keystore',
        //   path: 'export_keystore_and_code'
        // },
        // {
        //   title: '资源管理',
        //   path: 'resources_manage'
        // }
      ],
      // 弹框标题
      title: '修改地址名称',
      // 弹框placeholder
      placeholder: '请输入新的地址名称',
      // 弹框内容
      value: '',
      // 弹框显示
      shotShow: false,
      selectaccount: '',
      // 密码显示
      passBoxShow: false,
      // 点击的功能
      selectType: '',
      userPass: ''
    };
  },
  computed: {
    ...mapState({
      accounts: state => state.storage.userInfo.accounts
    })
  },
  beforeMount () {
    // 头部
    this.pageTitle({ title: '我的地址', shadown: true });
    this.selectaccount = this.$route.query.selectAccount;
    const account = this.accounts[this.selectaccount - 0];
    // 如果有地址
    let haveTheSite = false;
    [].concat(account.siteOfWord, account.siteOfWatch, account.siteOfOther).map(site => {
      if (site.key === this.key) {
        this.address.name = site.siteName;
        this.userPass = account.pass;
        haveTheSite = true;
        if (site.type === '2') {
          // 以太坊
          this.lists.push({
            title: '导出keystore',
            path: '/wallet/account/export_keystore_and_code'
          });
        }
      }
    });
    if (!haveTheSite) this.$router.go(-1);
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      changeSiteName: 'storage/changeSiteName'
    }),
    // 修改地址名称
    changeName () {
      this.shotShow = true;
    },
    // 修改账户名确认按钮
    modifyName (text) {
      if (text === '') return this.$global.alertOptions('请输入名称');
      this.address.name = text;
      this.changeSiteName({
        selectAccount: this.selectaccount,
        key: this.key,
        newName: text
      });
      this.shotShow = false;
    },
    // 列表操作
    listTap (item) {
      this.passBoxShow = true;
      this.selectType = item.path;
      // this.$router.push({ path: this.lists[index].path });
    },
    // 删除地址
    delectAddress () {
      this.passBoxShow = true;
      this.selectType = 'delete';
    },
    // 获取密码
    getPass (pass) {
      if (pass !== this.userPass) return this.$global.alertOptions('密码输入错误');
      if (this.selectType === 'delete') {
        this.$router.push({
          path: '/wallet/account/delete_account',
          query: {
            type: 'address',
            selectAccount: this.selectaccount,
            key: this.key
          }
        });
      } else {
        this.$router.push({
          path: this.selectType,
          query: {
            selectAccount: this.selectaccount,
            key: this.key
          }
        });
      }
    }
  },
  components: {
    editName,
    passBox
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #addressDetail{
    padding:0 40px;
    .detail_top{
      width:100%;
      height:230px;
      background:url('../../../assets/images/address_detail_bg.jpg');
      background-size:100% 100%;
      margin:40px auto;
      @include eleBottomShadown();
      text-align:center;
      padding-top:35px;
      box-sizing: border-box;
      .icon-dizhi1{
        height:80px;
        width:80px;
        line-height:80px;
        font-size:45px;
        background-color:$listBottomGray;
        color:#9297a5;
        margin:0 auto;
        border-radius: 50%;
      }
      .top_texts{
        line-height:100px;
        .top_text{
          font-size: 30px;
        }
        .iconfont{
          color:#9297a5;
          font-size:35px;
        }
      }
    }
    .detail_lists{
      padding-top:80px;
      .detail_list{
        height:106px;
        display:flex;
        align-items: center;
        justify-content: space-between;
        font-size:28px;
        border-bottom:1PX solid $listBottomGray;
        .icon-you{
          color:#9da2b2;
          font-size:30px;
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
      display:flex;
      justify-content: center;
      align-items: center;
      .iconfont{
        font-size:35px;
        margin-right:10px;
      }
    }
  }
</style>
