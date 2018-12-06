<template>
  <div id="settlementSet">
    <div class="set_head">
      <span
        class="iconfont icon-fanhui"
        @click="goBack"></span>
    </div>
    <div class="set_con">
      <div class="set_title">
        结算方式设置
      </div>
      <p class="set_rule">
        请设置您的AI交易的结算方式，可随时修改。
      </p>
      <p class="set_rule">
        此结算方式将同时适用于BTC与ETH。
      </p>
      <div class="set_smart_title">
        当前结算方式：
      </div>
      <div class="set_select">
        <div
          class="select_default"
          @click="selectSet">
          <span class="select_text">
            {{sets[setIndex]}}
          </span>
          <span
            class="iconfont icon-triangle-down01-copy"
            :class="{'flip': setShow}"></span>
        </div>
        <div
          class="select_lists"
          v-if="setShow">
          <div
            class="select_list"
            v-for="(item, index) in sets"
            v-show="setIndex !== index"
            :key="index"
            @click="setSelect(index)">
            {{item}}
          </div>
        </div>
      </div>
      <button
        class="set_submit"
        @click="submit">
        确认
      </button>
    </div>
    <div class="set_con_bottom">
      <div class="con_bottom_title">
        <span class="title_text">
          结算说明
        </span>
      </div>
      <div class="explain_lists">
        <div
          class="explain_list"
          v-for="(item, index) in explain"
          :key="index">
          <div class="list_num">
            0{{index + 1}}
          </div>
          <div class="list_mess">
            <div class="list_title">
              {{item.title}}
            </div>
            <div class="list_info">
              {{item.info}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'settlementSet',
  data () {
    return {
      // 选择的结算设置
      setIndex: '',
      // 结算设置列表
      sets: ['滚存', '周结'],
      // 结算列表显示
      setShow: false,
      // 按钮是否可以点击
      submitState: true,
      // 结算说明
      explain: [
        {
          title: '周结',
          info: '每周 AI收益 将自动存入收益账户，不增加 AI交易基础币量。'
        },
        {
          title: '滚存',
          info: '每周 AI收益 将自动存入 本金账户，增加 AI交易基础币量，提高收益！'
        }
      ]
    };
  },
  beforeMount () {
    this.getStatus();
  },
  methods: {
    // 返回
    goBack () {
      this.$router.go(-1);
    },
    // 获取结算设置
    getStatus () {
      this.$axios.get('/v1/ai/method')
        .then(({ data }) => {
          if (data.status === 200) {
            this.setIndex = data.data - 1;
          }
        });
    },
    // 选择结算设置
    selectSet () {
      this.setShow = !this.setShow;
    },
    // 结算设置选择
    setSelect (index) {
      this.setShow = false;
      this.setIndex = index;
    },
    // 确认
    submit () {
      if (!this.submitState) return false;
      this.submitState = false;
      this.$axios.put('/v1/ai/method/update', {
        method: this.setIndex + 1
      })
        .then(({ data }) => {
          this.submitState = true;
          if (data.status === 200) {
            this.$global.successOptions(data.message);
          } else {
            this.$global.alertOptions(data.message);
          }
        });
    }
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #settlementSet{
    height:100%;
    background-image: url('../../assets/images/settlement_bg.jpg');
    background-size:100% 100%;
    .set_head{
      height:88px;
      line-height:88px;
      .iconfont{
        padding-left:30px;
        color:#888e9e;
        font-size:35px;
        display: block;
        width: 88px;
        height: 88px;
      }
    }
    .set_con{
      padding:0 50px;
      .set_title{
        font-size:40px;
        color:#fff;
        line-height:96px;
      }
      .set_rule{
        font-size:24px;
        color:#babac0;
        line-height:48px;
      }
      .set_smart_title{
        font-size:26px;
        color:#fff;
        line-height:106px;
      }
      .set_select{
        width:100%;
        height:100px;
        background-color:#fff;
        text-align:center;
        line-height:100px;
        position:relative;
        border-radius: 10px;
        font-size:30px;
        .select_default{
          height:100px;
          width:100%;
          position:absolute;
          .iconfont{
            position: absolute;
            top:0;
            right:40px;
            color:#666666;
            font-size:40px;
            width:40px;
            display:inline-block;
            transition: all 0.5s ease;
            &.flip{
              transform: rotateX(180deg);
            }
          }
          &:after{
            position:absolute;
            content:'';
            display:block;
            width:1PX;
            height:60px;
            top:50%;
            margin-top:-30px;
            right:15%;
            background-color:#eaecf1;
          }
        }
        .select_lists{
          position:absolute;
          top:105px;
          left:0;
          background-color:#fff;
          line-height:100px;
          width:100%;
          border-radius: 10px;
          padding:0 30px;
          box-sizing: border-box;
          .select_list:nth-child(1){
            border-bottom:1PX solid $listBottomGray;
          }
        }
      }
      .set_submit{
        width:100%;
        height:100px;
        margin:40px 0;
        background-color:$mainColor;
        color:#fff;
        border-radius: 10px;
        font-size:30px;
      }
    }
    .set_con_bottom{
      .con_bottom_title{
        line-height:108px;
        font-size:24px;
        color:#595d8a;
        text-align:center;
        position:relative;
        &:before, &:after{
          position:absolute;
          content:'';
          display:block;
          height:1PX;
          width:40%;
          background-color:#31355c;
          top:50%;
        }
        &:before{
          left:0;
        }
        &:after{
          right:0;
        }
      }
      .explain_lists{
        padding:0 50px;
        .explain_list{
          margin-bottom:45px;
          color:#595d8a;
          height:128px;
          display:flex;
          .list_num{
            box-sizing: border-box;
            height:90px;
            width:90px;
            border-radius: 50%;
            border: 1PX solid #44476a;
            margin-right:30px;
            line-height:90px;
            text-align:center;
            font-size:40px;
            margin-top:20px;
          }
          .list_mess{
            width:calc(100% - 100px);
            .list_title{
              font-size:26px;
              color:#fff;
              line-height:56px;
            }
            .list_info{
              font-size:24px;
              line-height:36px;
            }
          }
        }
      }
    }
  }
</style>
