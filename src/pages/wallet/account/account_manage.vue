<template>
  <div id="accountManage">
    <!-- 主体 -->
    <div class="manage_lists">
      <div
        class="manage_list"
        :class="{'manage_default': item.isDefault}"
        v-for="(item, index) in accounts"
        :key="index">
        <div class="list_info">
          <span class="iconfont icon-zhanghu"></span>
          <div class="list_names">
            <div class="list_name">
              {{item.title}}
            </div>
            <div
              class="list_btns"
              @click="selectDefault(item, index)">
              <span
                class="iconfont"
                :class="{'icon-xuanze': item.isDefault, 'icon-xuanze1': !item.isDefault}"></span>
              <span class="btn_text">
                {{item.isDefault ? '' : '设为'}}默认账户
              </span>
            </div>
          </div>
        </div>
        <nuxt-link
          :to="{path: '/wallet/account/account_detail', query: {id: item.id}}"
          tag="button"
          class="iconfont icon-shenglve"></nuxt-link>
      </div>
    </div>
    <!-- 底部 -->
    <div class="manage_foot">
      <button
        class="foot_btn white"
        @click="importWord">
        助记词一键导入
      </button>
      <button
        class="foot_btn blue"
        @click="createAccount">
        创建账户
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'accountManage',
  layout (context) {
    return 'back_page';
  },
  data () {
    return {
      // 账户列表
      accounts: []
    };
  },
  computed: {
    ...mapState({
      accountsList: state => state.storage.userInfo.accounts,
      defaultAccount: state => state.storage.userInfo.selectAccount
    })
  },
  beforeMount () {
    // 头部
    this.pageTitle({ title: '账户管理', shadown: true });
    this.accounts = this.accountsList.map((item, index) => {
      return {
        // 账户id
        id: index,
        // 账户名称
        title: item.accountName,
        // 是否为默认账户
        isDefault: index === this.defaultAccount - 0
      };
    }).sort((prvp, after) => {
      // 排序
      return after.isDefault - prvp.isDefault;
    });
  },
  methods: {
    ...mapMutations({
      pageTitle: 'layout/backPageChange',
      changeDetaultAccount: 'storage/changeDetaultAccount'
    }),
    // 设置默认账户
    selectDefault (item, index) {
      if (this.accounts[index].isDefault) return false;
      for (let i = 0; i < this.accounts.length; i++) {
        this.accounts[i].isDefault = false;
      }
      this.accounts[index].isDefault = true;
      let account = this.accounts[index];
      this.accounts.splice(index, 1);
      this.accounts.unshift(account);
      this.changeDetaultAccount(item.id);
      this.$global.successOptions('设置成功');
    },
    // 助记词导入
    importWord () {
      this.$router.push({
        path: '/wallet/create_account',
        query: {
          import: 'import'
        }
      });
    },
    // 创建账户
    createAccount () {
      this.$router.push({ path: '/wallet/create_account' });
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #accountManage{
    height:100%;
    .manage_lists{
      padding:40px 40px 98px;
      .manage_list{
        width:100%;
        height:160px;
        border-radius: 10px;
        overflow: hidden;
        background:url('../../../assets/images/account_bg.jpg');
        background-size:100% 100%;
        margin-bottom:30px;
        display:flex;
        align-items: center;
        justify-content: space-between;
        padding-left:40px;
        box-sizing: border-box;
        @include eleBottomShadown();
        .list_info{
          display:flex;
          align-items: center;
          .icon-zhanghu{
            display:inline-block;
            width:60px;
            height:60px;
            background-color:#f0f2ff;
            border-radius: 50%;
            text-align:center;
            line-height:60px;
            font-size:35px;
            color:#8e99cc;
            margin-right:30px;
          }
          .list_names{
            .list_name{
              font-size:30px;
              line-height:50px;
            }
            .list_btns{
              .iconfont{
                color:#9297a5;
                font-size:25px;
              }
              .btn_text{
                color:#80889e;
                font-size:24px;
                line-height:44px;
              }
            }
          }
        }
        .icon-shenglve{
          width:160px;
          height:160px;
          color:#acb2d0;
          font-size:40px;
          background:rgba(0, 0, 0, 0)
        }
        &.manage_default{
          background-image: url('../../../assets/images/account_defalut_bg.jpg');
          .list_info{
            .icon-zhanghu{
              background-color:#4c6bfa;
              color:#cad3fe;
              margin-right:30px;
            }
            .list_names{
              .list_name{
                color:#fff;
              }
              .list_btns{
                .iconfont{
                  color:#fff;
                }
                .btn_text{
                  color:#a4b4ff;
                }
              }
            }
          }
          .icon-shenglve{
            color:#fff;
          }
        }
      }
    }
    .manage_foot{
      position:fixed;
      bottom:0;
      left:0;
      width:100%;
      display:flex;
      height:98px;
      box-shadow: 0 0 18px 3px rgba(27, 55, 173, 0.1);
      .foot_btn{
        flex:1;
        font-size:28px;
        &.white{
          background-color:#fff;
          color:#9297a5;
        }
        &.blue{
          background-color:$mainColor;
          color:#fff;
        }
      }
    }
  }
</style>
