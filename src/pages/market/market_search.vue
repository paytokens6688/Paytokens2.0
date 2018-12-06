<template>
  <div id="marketSearch">
    <!-- 头部 -->
    <div class="search_top">
      <button
        class="search_back iconfont icon-fanhui"
        @click="back"></button>
      <label
        for="search"
        class="search_inputs">
        <span class="iconfont icon-sousuo"></span>
        <input
          class="search_input"
          id="search"
          type="text"
          v-model="searchText"
          placeholder="请输入币种名称搜索"
          @input="resultShowToggle">
      </label>
      <button
        class="search_cancel"
        @click="resetData">
        搜索</button>
    </div>
    <!-- 主体 -->
    <div class="search_con">
      <!-- 搜索历史 -->
      <div
        class="search_history"
        v-show="!resultShow">
        <div
          class="history_titles">
          <div class="history_title">
            搜索历史
          </div>
          <span
            class="iconfont icon-shanchu"
            @click="deleteSeatchHis"></span>
        </div>
        <div class="historys">
          <div
            class="history"
            v-for="(item, index) in searchHistory"
            :key="index"
            @click="historyClickSearch(index)">
            {{item}}
          </div>
        </div>
      </div>
      <!-- 搜索结果 -->
      <listBox
        class="search_results"
        :listArr="coins"
        :scrollBack="scrollCallback"
        v-show="resultShow">
        <div
          class="result_list"
          v-for="(item, index) in coins"
          :key="index"
          @click="goDetail(index)">
          <div class="list_infos">
            <div class="list_imgs">
              <img :src="item.image" alt="">
            </div>
            <div class="list_names">
              <div class="list_names_1">
                <span class="list_name_en">
                  {{item.name}}
                </span>
                <span
                  class="list_name_cn"
                  v-show="item.name_cn !== '－'">
                  /{{item.name_cn}}
                </span>
              </div>
              <div class="list_names_2">
                {{item.symbol}}
              </div>
            </div>
          </div>
          <div
            class="list_btn orange"
            v-show="item.isColler"
            @click.stop="cancelCollerCoin(index)">
            取消关注
          </div>
          <div
            class="list_btn blue"
            v-show="!item.isColler"
            @click.stop="collerCoin(index)">
            关注
          </div>
        </div>
        <noRecord
          title="暂无数据"
          type="record"
          v-if="!coins.length">
        </noRecord>
      </listBox>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import noRecord from '@/components/noRecord/no_record.vue';
import listBox from '@/components/list/more_list_box.vue';
export default {
  name: 'marketSearch',
  data () {
    return {
      // 搜索内容
      searchText: '',
      // 搜索列表
      searchHistory: [],
      // 搜索结果
      coins: [],
      // 储存的币种列表
      storageCoins: [],
      // 储存的为关注币种列表
      storageHiddenCoins: [],
      // 搜索结果是否显示
      resultShow: false,
      // 是否可以请求数据
      canReq: true,
      // 是否还有更多
      hasMore: true,
      // 页数
      page: 1
    };
  },
  beforeMount () {
    // 获取本地储存的币种
    this.getUserInfo('marketList')
      .then((data) => {
        if (data) {
          this.storageCoins = data;
        }
      });
    // 获取本地储存的未关注币种
    this.getUserInfo('marketListHidden')
      .then((data) => {
        if (data) {
          this.storageHiddenCoins = data;
        }
      });
    // 获取本地储存的币种搜索历史
    this.getUserInfo('marketSearchHis')
      .then((data) => {
        if (data) {
          this.searchHistory = data;
        }
      });
  },
  methods: {
    ...mapActions({
      saveUserInfo: 'storage/saveUserInfo',
      getUserInfo: 'storage/getUserInfo'
    }),
    // 返回事件
    back () {
      this.$router.go(-1);
    },
    // 重置默认数据
    resetData () {
      this.coins = [];
      this.page = 1;
      this.canReq = true;
      this.hasMore = true;
      this.resultShow = true;
      this.searchMarket();
    },
    // 搜索事件
    searchMarket () {
      this.canReq = false;
      this.$axios.get('/v1/api/market/search', {
        params: {
          page: this.page,
          search: this.searchText
        }
      })
        .then(({ data }) => {
          if (data.status === 200) {
            this.canReq = true;
            this.page++;
            if (data.data.length < 10 || !data.data.length || !data.data) {
              this.hasMore = false;
            }
            this.coins = this.coins.concat(data.data);
            for (let i = 0; i < this.coins.length; i++) {
              for (let j = 0; j < this.storageCoins.length; j++) {
                if (this.coins[i].id === this.storageCoins[j].id) {
                  this.$set(this.coins[i], 'isColler', true);
                }
              }
            }
            this.addSearchHis();
          }
        });
    },
    // 添加搜索历史
    addSearchHis () {
      // 搜索历史去重
      let isRepeat = false;
      for (let i = 0; i < this.searchHistory.length; i++) {
        if (this.searchHistory[i] === this.searchText) {
          isRepeat = true;
        }
      }
      if (!isRepeat && this.searchText) {
        this.searchHistory.push(this.searchText);
      }
      this.saveUserInfo({
        type: 'marketSearchHis',
        data: this.searchHistory
      });
    },
    // 查看详情
    goDetail (index) {
      this.$router.push({
        path: '/market/market_detail',
        query: {
          id: this.coins[index].id,
          isColler: this.coins[index].isColler ? 1 : 2
        }
      });
    },
    // 点击搜索历史搜索
    historyClickSearch (index) {
      this.searchText = this.searchHistory[index];
      this.resetData();
    },
    resultShowToggle () {
      if (this.searchText === '') {
        this.resultShow = false;
      }
    },
    // 滚动事件
    scrollCallback () {
      if (this.canReq && this.hasMore) {
        this.searchMarket();
      }
    },
    // 删除历史搜索记录
    deleteSeatchHis () {
      this.searchHistory = [];
      this.saveUserInfo({
        type: 'marketSearchHis',
        data: []
      });
    },
    // 取消关注币种
    cancelCollerCoin (index) {
      for (let i = 0; i < this.storageCoins.length; i++) {
        if (this.storageCoins[i].id === this.coins[index].id) {
          this.storageCoins.splice(i, 1);
        }
      }
      this.storageHiddenCoins.push(this.coins[index]);
      this.saveUserInfo({
        type: 'marketList',
        data: this.storageCoins
      });
      this.saveUserInfo({
        type: 'marketListHidden',
        data: this.storageHiddenCoins
      });
      this.$set(this.coins[index], 'isColler', false);
    },
    // 关注币种
    collerCoin (index) {
      for (let i = 0; i < this.storageHiddenCoins.length; i++) {
        if (this.coins[index].id === this.storageHiddenCoins[i].id) {
          this.storageHiddenCoins.splice(i, 1);
        }
      }
      this.storageCoins.push(this.coins[index]);
      this.saveUserInfo({
        type: 'marketList',
        data: this.storageCoins
      });
      this.saveUserInfo({
        type: 'marketListHidden',
        data: this.storageHiddenCoins
      });
      this.$set(this.coins[index], 'isColler', true);
    }
  },
  components: {
    noRecord,
    listBox
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/public.scss';
  #marketSearch{
    padding-top:90px;
    height:100%;
    box-sizing: border-box;
    .search_top{
      height:90px;
      width:100%;
      background-color:#fff;
      position: fixed;
      top:0;
      left:0;
      z-index:4;
      box-shadow: 0 5px 10px 2px rgba(27, 55, 173, 0.1);
      .search_back{
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 90px;
        text-align: center;
        font-size: 34px;
        background: none;
        color: #9297a5;
      }
      .search_cancel{
        position: absolute;
        top: 0;
        right: 0;
        height:90px;
        padding:0 30px;
        text-align: center;
        font-size: 26px;
        background: none;
        color: #9297a5;
      }
      .search_inputs{
        width:70%;
        height:58px;
        background-color:#f3f4f8;
        position:absolute;
        top:50%;
        left:50%;
        margin-top:-29px;
        margin-left:-36%;
        line-height: 58px;
        font-size: 24px;
        border-radius: 10px;
        padding:0 20px;
        box-sizing: border-box;
        display:flex;
        align-items: center;
        .iconfont {
          color:#9da2b2;
          margin-right:15px;
          font-size:25px;
        }
        .search_input{
          width:80%;
        }
      }
    }
    .search_con{
      height:100%;
      .search_history{
        height:100%;
        background-color:#fafafc;
        .history_titles{
          height:100px;
          width:100%;
          box-sizing: border-box;
          padding:0 30px;
          display:flex;
          align-items: center;
          justify-content: space-between;
          .history_title{
            color:#666666;
            font-size:24px;
          }
          .iconfont{
            color:#9da2b2;
            font-size:40px;
          }
        }
        .historys{
          padding:0 30px;
          display:flex;
          flex-wrap: wrap;
          .history{
            margin-right:20px;
            margin-bottom:20px;
            height:62px;
            background-color:#fff;
            padding:0 30px;
            color:#132b8c;
            font-size:24px;
            line-height:62px;
            border-radius: 10px;
          }
        }
      }
      .search_results{
        height:100%;
        box-sizing: border-box;
        padding-left:30px;
        .result_list{
          border-bottom:1PX solid $listBottomGray;
          height:130px;
          display:flex;
          justify-content: space-between;
          align-items: center;
          padding-right:30px;
          .list_infos{
            display:flex;
            align-items: center;
            .list_imgs{
              height:44px;
              width:44px;
              overflow: hidden;
              border-radius: 50%;
              margin-right:20px;
              img{
                width:100%;
                height:100%;
              }
            }
            .list_names{
              .list_names_1{
                .list_name_en{
                  font-size:34px;
                  font-weight: 600;
                }
                .list_name_cn{
                  font-size:22px;
                  color:$lowGray;
                }
              }
              .list_names_2{
                font-size:26px;
                color:$lowGray;
                line-height:46px;
              }
            }
          }
          .list_btn{
            width:120px;
            height:54px;
            box-sizing: border-box;
            border-radius: 10px;
            text-align:center;
            line-height:52px;
            font-size:24px;
            &.orange{
              color:#f75434;
              border:1PX solid #f75434;
              background-color:#feeeea;
            }
            &.blue{
              color:$darkBlue;
              border:1PX solid $darkBlue;
              background-color:#e7e9f3;
            }
          }
        }
      }
    }
  }
</style>
