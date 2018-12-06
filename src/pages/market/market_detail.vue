<template>
  <div id="marketDetail">
    <!-- 头部 -->
    <div class="detail_top">
      <button
        class="detail_back iconfont icon-fanhui"
        @click="back"></button>
        <h2 class="top_title">
          {{coin.en_name}}
        </h2>
      <button
        class="detail_share iconfont icon-fenxiang"
        v-if="isColler"
        @click="detailShare"></button>
    </div>
    <!-- 主体 -->
    <div
      class="detail_con"
      ref="detailCon">
      <!-- 币种信息 -->
      <div class="coin_infors">
        <div class="coin_info">
          <div class="names">
            <div class="names_1">
              <div class="coin_imgs">
                <img
                  class="coin_img"
                  :src="coin.img"
                  alt="">
              </div>
              <span class="coin_name_en">
                {{coin.en_name}}
              </span>
            </div>
            <div class="names_2">
              {{coin.all_name}}{{coin.cn_name === '－' ? '' : '/' + coin.cn_name}}
            </div>
          </div>
          <div class="prices">
            <div class="price_cny">
              &yen;
              <span>{{coin.price_cny}}</span>
            </div>
            <div class="price_usd">
              &#x2248;${{coin.price_usd}}({{coin.applies}}%)
            </div>
          </div>
        </div>
        <div class="info_lists">
          <div class="info_list">
            <span class="list_title">
              24H最高：
            </span>
            <span class="list_text">
              {{coin_info.max}}
            </span>
          </div>
          <div class="info_list">
            <span class="list_title">
              24H换手率：
            </span>
            <span class="list_text">
              {{coin_info.turnover_ratio}}%
            </span>
          </div>
          <div class="info_list">
            <span class="list_title">
              24H最低：
            </span>
            <span class="list_text">
              {{coin_info.min}}
            </span>
          </div>
          <div class="info_list">
            <span class="list_title">
              24H成交额：
            </span>
            <span class="list_text">
              &yen;{{coin_info.turnover}}
            </span>
          </div>
        </div>
      </div>
      <!-- 图表 -->
      <div class="echarts">
        <div class="echart_navs">
          <div
            class="nav"
            :class="{'active': index === echartNavIndex}"
            v-for="(item, index) in echartNavs"
            :key="index"
            @click="echartNavToggle(index)">
            {{item}}
          </div>
        </div>
        <div
          class="echart_con"
          ref="myChart"
          v-show="echartShow">
        </div>
        <noRecord
          title="暂无数据"
          type="record"
          class="echart_no_record"
          v-show="!echartShow">
        </noRecord>
      </div>
      <!-- 我的资产 -->
      <!-- <div
        class="my_assets"
        v-if="isColler">
        <div class="assets">
          <div class="asset">
            <p class="assets_num">
              {{coin.my_assets}}
            </p>
            <p class="assets_title">
              我的资产
            </p>
          </div>
          <div class="asset">
            <p class="assets_num">
              {{coin.can_assets}}
            </p>
            <p class="assets_title">
              可用资产
            </p>
          </div>
        </div>
        <div class="assets_btns">
          <nuxt-link
            to=""
            tag="div"
            class="assets_btn blue">
            账户详情
          </nuxt-link>
          <nuxt-link
            to=""
            tag="div"
            class="assets_btn white">
            兑换
          </nuxt-link>
        </div>
      </div> -->
      <!-- 项目信息 -->
      <div
        class="mess_title"
        v-if="!isColler">
        项目介绍
      </div>
      <div
        class="infor_titles"
        v-if="isColler">
        <div
          class="infor_title"
          :class="{'active': index === inforNavIndex}"
          v-for="(item, index) in inforNavs"
          :key="index"
          @click="inforNavToggle(index)">
          {{item}}
        </div>
      </div>
      <div
        class="coin_mess"
        v-if="inforNavIndex === 0">
        <div class="mess_detail">
          <p class="detail_name">
            {{coin.en_name}}({{coin.cn_name}})
          </p>
          <p class="detail_intro">
            {{coin.inforshow ? coin.info : coin.lessInfo}}
          </p>
          <span
            class="detail_more"
            @click="coin.inforshow = !coin.inforshow"
            v-show="coin.moreBtnShow">
            {{coin.inforshow ? '收起' : '展开'}}
            <i
              class="iconfont icon-fanhui"
              :class="{'active': coin.inforshow}"></i>
          </span>
        </div>
        <div class="mess_lists">
          <div class="mess_list">
            <span class="list_title">
              市值排名
            </span>
            <span class="list_text">
              {{coin.ranking === '0' ? '暂无' : '第' + coin.ranking + '名'}}
            </span>
          </div>
          <div class="mess_list">
            <span class="list_title">
              流通市值
            </span>
            <span class="list_text">
              <span v-show="coin.market_value">&yen;</span>{{coin.market_value ? coin.market_value : '暂无'}}
            </span>
          </div>
          <div class="mess_list">
            <span class="list_title">
              流通总量
            </span>
            <span class="list_text">
              {{coin.market_number ? coin.market_number + ' ' + coin.en_name : '暂无'}}
            </span>
          </div>
          <div class="mess_list">
            <span class="list_title">
              发行总量
            </span>
            <span class="list_text">
              {{coin.issue_number ? coin.issue_number + ' ' + coin.en_name : '暂无'}}
            </span>
          </div>
          <!-- <div class="mess_list">
            <span class="list_title">
              募资成本
            </span>
            <span class="list_text">
              {{coin.financing_costs}}
            </span>
          </div> -->
          <div class="mess_list">
            <span class="list_title">
              发行时间
            </span>
            <span class="list_text">
              {{coin.issue_time ? coin.issue_time : '暂无'}}
            </span>
          </div>
        </div>
        <div class="link_lists">
          <div class="link_list">
            <span class="list_title">
              官网
            </span>
            <span
              class="list_gray"
              v-show="!coin.website">
              暂无
            </span>
            <span
              class="list_text website"
              @click="checkWebsite"
              v-show="coin.website">
              {{coin.website}}
            </span>
          </div>
          <div class="link_list">
            <span class="list_title">
              其他链接
            </span>
            <span
              class="list_gray"
              v-show="!coin.white_paper">
              暂无
            </span>
            <a
              class="list_text"
              :href="coin.white_paper"
              download
              v-show="coin.white_paper">
              <i class="iconfont icon-xiazai"></i>
              下载白皮书
            </a>
          </div>
        </div>
      </div>
      <!-- 咨询列表 -->
      <listBox
        class="infor_lists"
        :listArr="infors"
        :scrollBack="scrollCallback"
        v-if="inforNavIndex === 1">
          <nuxt-link
            :to="{path: '/users/headline_detail', query: {id: item.id}}"
            class="infor_list"
            v-for="(item, index) in infors"
            :key="index">
            <div class="list_titles">
              <div class="list_title">
                {{item.title}}
              </div>
              <div class="list_time">
                {{item.create_time}}
              </div>
            </div>
            <div class="list_pics">
              <img :src="item.image" alt="">
            </div>
          </nuxt-link>
        <noRecord
          title="暂无咨询"
          type="record"
          v-if="!infors.length">
        </noRecord>
      </listBox>
    </div>
    <!-- 底部 -->
    <div
      class="detail_foot"
      ref="foot">
      <div
        class="foot_btn"
        @click="isCollecCoin">
        <i
          class="iconfont"
          :class="{'icon-guanzhu': isColler, 'icon-xing-': !isColler}"></i>
        <span class="btn_text">
          {{isColler ? '取消关注' : '关注'}}
        </span>
      </div>
      <div
        class="foot_btn"
        @click="detailShare"
        v-if="!isColler">
        <i class="iconfont icon-fenxiang"></i>
        <span class="foot_text">
          分享
        </span>
      </div>
      <!-- <div
        class="foot_btn"
        v-if="isColler"
        @click="goChatRoom">
        <i class="iconfont icon-liaotianshi"></i>
        <span class="foot_text">
          聊天室
        </span>
      </div>
      <div
        class="foot_btn"
        v-if="isColler">
        <i class="iconfont icon-app"></i>
        <span class="foot_text">
          下载APP
        </span>
      </div> -->
    </div>
    <div class="pop_main" v-if="isShare" @click="noShare">
      <div class="pop_content">
        <p class="title">分享给小伙伴</p>
        <div class="share_main">
          <div
            class="share_list"
            v-for="(item, index) in shareData" :key="index"
            @click="shareList(index)">
            <img class="share_img" :src="item.share_img" alt="">
            <p class="share_name">{{item.share_title}}</p>
          </div>
        </div>
        <p class="title cancel" @click="noShare">取消</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import noRecord from '@/components/noRecord/no_record.vue';
import listBox from '@/components/list/more_list_box.vue';
let echarts = require('echarts/lib/echarts');
// 引入line
require('echarts/lib/chart/line');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
// 引入dataZoom
require('echarts/lib/component/dataZoom');
export default {
  name: 'marketDetail',
  data () {
    return {
      // 币种是否关注
      isColler: false,
      // 图表导航
      echartNavs: ['24H', '近一周', '近一月', '近一年'],
      // 选中的导航（默认第一个）
      echartNavIndex: 0,
      // 是否显示图标
      echartShow: true,
      // 储存的Echart数据
      echartDate: [],
      // 咨询导航
      inforNavs: ['项目介绍', '相关咨询'],
      // 选中的咨询导航(默认第一个)
      inforNavIndex: 0,
      // 币种交易信息
      coin_info: {
        // 最高
        max: '',
        // 最低
        min: '',
        // 换手率
        turnover_ratio: '',
        // 成交额
        turnover: ''
      },
      // 币种信息
      coin: {
        // 币种id
        id: Number(this.$route.query.id),
        // 币种图标
        img: '',
        // 币种简称
        en_name: '',
        // 币种中文名称
        cn_name: '',
        // 币种全称
        all_name: '',
        // 币种人民币价格
        price_cny: '',
        // 美元价格
        price_usd: '',
        // 涨跌幅
        applies: '',
        // 我的资产
        my_assets: '',
        // 可用资产
        can_assets: '',
        // 简介
        info: '',
        // 截取的简介
        lessInfo: '',
        // 是否显示更多按钮
        moreBtnShow: true,
        // 简介的切换
        inforshow: false,
        // 排名
        ranking: '',
        // 流通市值
        market_value: '',
        // 流通总量
        market_number: '',
        // 发行总量
        issue_number: '',
        // 募资成本
        financing_costs: '暂无',
        // 发行时间
        issue_time: '',
        // 官网链接
        website: '',
        // 白皮书链接
        white_paper: ''
      },
      // 咨询列表
      infors: [],
      // 咨询是否可以请求
      canReq: true,
      // 咨询是否还有更多
      hasMore: true,
      // 咨询页数
      page: 1,
      // 本地储存的关注的币种
      storageCoins: [],
      // 本地储存的未关注的币种
      storageCoinsHidden: [],
      // 分享弹窗的变量
      isShare: false,
      // 需要分享的平台
      shareData: [
        {
          share_img: require('../../assets/images/share_img1.png'),
          share_title: '微信'
        },
        {
          share_img: require('../../assets/images/share_img2.png'),
          share_title: '朋友圈'
        },
        {
          share_img: require('../../assets/images/share_img3.png'),
          share_title: '微博'
        }
      ],
      // 截图url
      picUrl: ''
    };
  },
  beforeMount () {
    if (Number(this.$route.query.isColler) === 1) {
      this.isColler = true;
    } else {
      this.isColler = false;
    }
    // 获取本地储存的币种
    this.getUserInfo('marketList')
      .then((data) => {
        this.storageCoins = data;
      });
    this.getUserInfo('marketListHidden')
      .then((data) => {
        if (data) {
          this.storageCoinsHidden = data;
        }
      });
    this.getCoinInfo();
  },
  mounted () {
    this.getKline();
  },
  methods: {
    ...mapActions({
      saveUserInfo: 'storage/saveUserInfo',
      getUserInfo: 'storage/getUserInfo'
    }),
    // 返回上一页
    back () {
      this.$router.go(-1);
    },
    // 关注、取消关注币种
    isCollecCoin () {
      if (this.isColler) {
        this.inforNavIndex = 0;
        this.cancelCollerCoin();
      } else {
        this.collerCoin();
      }
      this.saveUserInfo({
        type: 'marketList',
        data: this.storageCoins
      });
      this.saveUserInfo({
        type: 'marketListHidden',
        data: this.storageCoinsHidden
      });
      this.isColler = !this.isColler;
    },
    // 取消关注
    cancelCollerCoin () {
      let nowCoin = {};
      let isColler = false;
      let coinIndex = '';
      for (let i = 0; i < this.storageCoins.length; i++) {
        if (this.storageCoins[i].id === this.coin.id) {
          isColler = true;
          coinIndex = i;
        }
      }
      if (isColler) {
        nowCoin = this.storageCoins[coinIndex];
        this.storageCoins.splice(coinIndex, 1);
      }
      this.storageCoinsHidden.push(nowCoin);
    },
    // 关注
    collerCoin () {
      let nowCoin = {};
      // 判断储存的币种列表里面是否有当前地址
      let isHidden = false;
      let coinIndex;
      for (let i = 0; i < this.storageCoinsHidden.length; i++) {
        if (this.storageCoinsHidden[i].id === this.coin.id) {
          isHidden = true;
          coinIndex = i;
        }
      }
      if (isHidden) {
        nowCoin = this.storageCoinsHidden[coinIndex];
        this.storageCoinsHidden.splice(coinIndex, 1);
      } else {
        nowCoin = {
          id: this.coin.id,
          image: this.coin.img,
          increase24: this.coin_info.turnover_ratio,
          name: this.coin.en_name,
          name_cn: this.coin.cn_name,
          now_price: this.coin.price_usd,
          now_price_cny: this.coin.price_cny,
          symbol: this.coin.all_name
        };
      }
      this.storageCoins.push(nowCoin);
    },
    // 前往官网
    checkWebsite () {
      try {
        android.urlJump('http:' + this.coin.website); // 安卓
      } catch (error) {
        window.location.href = this.coin.website;
      }
    },
    // 前往聊天室
    goChatRoom () {
      this.$global.notOpenOptions();
    },
    // 下载币种对应的App
    downloadApp () {
      this.$global.notOpenOptions();
    },
    // 咨询导航切换
    inforNavToggle (index) {
      if (this.inforNavIndex === index) return false;
      this.inforNavIndex = index;
      if (this.inforNavIndex === 1) {
        this.getNotice();
      }
    },
    // 获取咨询数据
    getNotice () {
      this.canReq = false;
      this.$axios.get('v1/api/market/article', {
        params: {
          market_id: this.coin.id,
          page: this.page
        }
      })
        .then(({ data }) => {
          if (data.status === 200) {
            this.canReq = true;
            this.page++;
            if (data.data.length < 10 || !data.data.length || !data.data) {
              this.hasMore = false;
            }
            this.infors = this.infors.concat(data.data);
            console.log(this.infors);
            if (this.infors.length) {
              for (let i = 0; i < this.infors.length; i++) {
                this.infors[i].create_time = this.$func.formatDate(this.infors[i].create_time);
              }
            }
          }
        });
    },
    // 滚动事件
    scrollCallback () {
      if (this.canReq && this.hasMore) {
        this.getNotice();
      }
    },
    // 获取币种数据
    getCoinInfo () {
      this.$axios.get('/v1/api/market/info', {
        params: {
          market_id: this.coin.id
        }
      })
        .then(({ data }) => {
          if (data.status === 200) {
            this.coin_info.max = data.data.max24;
            this.coin_info.min = data.data.min24;
            this.coin_info.turnover_ratio = data.data.exchange24;
            this.coin_info.turnover = data.data.vol24;
            if (this.coin_info.turnover.length > 8) {
              this.coin_info.turnover = Number(this.coin_info.turnover / 100000000).toFixed(2) + '亿';
            } else if (this.coin_info.turnover.length > 4) {
              this.coin_info.turnover = Number(this.coin_info.turnover / 10000).toFixed(2) + '万';
            }
            this.coin.img = data.data.image;
            this.coin.en_name = data.data.name;
            this.coin.cn_name = data.data.name_cn;
            this.coin.all_name = data.data.symbol;
            this.coin.price_usd = data.data.now_price;
            this.coin.price_cny = data.data.now_price_cny;
            this.coin.applies = data.data.increase24;
            if (Math.sign(this.coin.applies) !== -1) {
              this.coin.applies = '+' + this.coin.applies;
            }
            this.coin.ranking = data.data.marketcap_rankings;
            this.coin.market_value = data.data.marketcap_cny;
            this.coin.market_number = data.data.turnover;
            this.coin.issue_number = data.data.circulation;
            this.coin.issue_time = data.data.issue;
            this.coin.website = data.data.network;
            this.coin.white_paper = data.data.white_paper;
            this.coin.info = data.data.detail;
            if (this.coin.info.split('。')[1]) {
              this.coin.lessInfo = this.coin.info.split('。')[0] + '...';
              this.coin.moreBtnShow = true;
            } else {
              this.coin.lessInfo = this.coin.info;
              this.coin.moreBtnShow = false;
            }
          }
        });
    },
    // 图表导航切换
    echartNavToggle (index) {
      if (this.echartNavIndex === index) return false;
      this.echartNavIndex = index;
      if (!this.echartDate[index]) {
        this.getKline();
      } else {
        this.getEchartData(this.echartDate[index]);
        if (this.echartDate[index].length !== 0) {
          this.echartShow = true;
        } else {
          this.echartShow = false;
        }
      }
    },
    // 获取k线图数据
    getKline () {
      this.$axios.get('/v1/api/market/klind', {
        params: {
          type: this.echartNavIndex + 1,
          market_id: this.coin.id
        }
      })
        .then(({ data }) => {
          if (data.status === 200) {
            this.echartDate[this.echartNavIndex] = JSON.parse(data.data).price_usd;
            if (this.echartDate[this.echartNavIndex].length === 0) {
              this.echartShow = false;
            } else {
              this.echartShow = true;
            }
            this.getEchartData(JSON.parse(data.data).price_usd);
          }
        });
    },
    // 图表数据
    getEchartData (arrays) {
      let date = [];
      let data = [];
      let array;
      for (array in arrays) {
        date.push(this.$func.formatDate(arrays[array][0]));
        data.push(arrays[array][1]);
      }
      this.echartInit(data, date);
    },
    // 图表初始化
    echartInit (data, date) {
      let myChart = echarts.init(this.$refs.myChart);
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date,
          axisLabel: {
            color: '#fff',
            fontSize: '12',
            margin: 15
          }
        },
        yAxis: {
          type: 'value',
          scale: true,
          axisLabel: {
            color: '#5e6476',
            fontSize: '12',
            margin: 10
          },
          splitLine: {
            lineStyle: {
              color: '#373c4f'
            }
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 100
        }, {
          start: 0,
          end: 100,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#9297a5'
          },
          textStyle: {
            color: '#9297a5'
          },
          borderColor: '#5e6476'
        }],
        grid: {
          top: 30,
          left: 70,
          right: 50,
          bottom: 80
        },
        series: [
          {
            name: 'price',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              color: 'rgb(42, 83, 253)',
              borderWidth: 0
            },
            lineStyle: {
              width: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(42, 83, 253)'
              }, {
                offset: 1,
                color: 'rgb(9, 15, 39)'
              }])
            },
            data: data
          }
        ]
      };
      myChart.clear();
      myChart.setOption(option);
    },
    // 分享按钮
    detailShare () {
      const oftenFunc = require('@/plugins/often_func');
      oftenFunc.default.screenshotToBase(this.$refs.detailCon, [this.$refs.foot]).then((baseUrl) => {
        this.picUrl = baseUrl;
        this.isShare = true;
      });
    },
    // 取消分享按钮
    noShare () {
      this.isShare = false;
    },
    // 分享的事件
    shareList (index) {
      try {
        window.webkit.messageHandlers.thirdPartyShare.postMessage({
          index: index,
          url: this.picUrl
        }); // ios
      } catch (error) {
        try {
          android.thirdPartyShare(index, this.picUrl); // 安卓 friend
        } catch (error) {
          this.$global.alertOptions('请在APP内分享');
        }
      }
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
  #marketDetail{
    background-color:#070d25;
    box-sizing: border-box;
    padding-top:90px;
    .detail_top{
      height:90px;
      background-color:#070d25;
      color:#9297a5;
      width:100%;
      position:fixed;
      top:0;
      left:0;
      display:flex;
      justify-content: space-between;
      z-index:5;
      .top_title{
        height:90px;
        width:100%;
        text-align:center;
        font-size:32px;
        color:#fff;
        line-height:90px;
        letter-spacing: 3px;
      }
      .icon-fanhui{
        width: 78px;
        height: 90px;
        text-align: center;
        font-size: 34px;
        background: none;
        margin: 0 10px;
        color:#9297a5;
        position:absolute;
        left:0;
        top:50%;
        transform: translateY(-50%);
      }
      .icon-fenxiang{
        width: 78px;
        height: 90px;
        text-align: center;
        font-size: 34px;
        background: none;
        color:#9297a5;
        position:absolute;
        right:0;
        top:50%;
        transform: translateY(-50%);
      }
    }
    .detail_con{
      padding-bottom:130px;
      background-color:#070d25;
      .coin_infors{
        height:300px;
        width:100%;
        padding:0 30px;
        background-color:#0c1229;
        box-sizing: border-box;
        .coin_info{
          height:160px;
          width:100%;
          border-bottom:1PX solid #252a3f;
          display:flex;
          justify-content: space-between;
          align-items: center;
          .names{
            .names_1{
              display:flex;
              align-items: center;
              .coin_imgs{
                height:44px;
                width:44px;
                margin-right:15px;
                .coin_img{
                  width:100%;
                  height:100%;
                }
              }
              .coin_name_en{
                font-size:48px;
                font-weight: 600;
                color:#fff;
              }
            }
            .names_2{
              color:#b7bac3;
              font-size:26px;
              line-height:46px;
            }
          }
          .prices{
            text-align:right;
            .price_cny{
              color:#fff;
              font-size:30px;
              font-weight: 600;
              span{
                font-size:48px;
              }
            }
            .price_usd{
              font-size:26px;
              color:#2dcd60;
              line-height:44px;
            }
          }
        }
        .info_lists{
          height:140px;
          display:flex;
          flex-wrap: wrap;
          align-items: center;
          align-content: center;
          line-height:54px;
          .info_list{
            width:47%;
            font-size:24px;
            display:flex;
            justify-content: space-between;
            &:nth-child(odd){
              margin-right:6%;
            }
            .list_title{
              color:$mainColor;
            }
            .list_text{
              color:#fff;
            }
          }
        }
      }
      .echarts{
        padding-top:10px;
        .echart_navs{
          box-sizing: border-box;
          padding:0 30px;
          width:100%;
          height:78px;
          text-align:center;
          display:flex;
          .nav{
            flex:1;
            height:78px;
            line-height:78px;
            color:#9297a5;
            font-size:26px;
            position:relative;
            transition: all 0.5s ease;
            &:before{
              position:absolute;
              content:'';
              right:0;
              top:50%;
              margin-top:-13px;
              width:1PX;
              height:26px;
              background-color:#20263b;
            }
            &:last-child:before{
              height:0;
            }
            &.active{
              color:#fff;
              &:after{
                position: absolute;
                bottom:0;
                left:50%;
                margin-left:-40px;
                content:'';
                width:80px;
                height:4px;
                background-color:#2dcd60;
                border-radius: 1PX;
              }
            }
          }
        }
        .echart_con{
          height:570px;
        }
        .echart_no_record{
          padding-top:100px;
          padding-bottom:50px;
          .no_record_icon{
            opacity: 0.3;
          }
        }
      }
      .my_assets{
        height:310px;
        .assets{
          width:100%;
          height:170px;
          display:flex;
          flex-wrap: wrap;
          align-items: center;
          .asset{
            flex:1;
            width:50%;
            text-align:center;
            &:first-child{
              position:relative;
              &:after{
                position:absolute;
                right:0;
                top:50%;
                content:'';
                width:1PX;
                height:80px;
                background-color:#22273d;
                margin-top:-40px;
              }
            }
            .assets_num{
              color:#fff;
              font-size:40px;
              line-height:66px;
            }
            .assets_title{
              color:#5e6476;
              font-size:26px;
              line-height:52px;
            }
          }
        }
        .assets_btns{
          margin-top:10px;
          display:flex;
          box-sizing: border-box;
          width:100%;
          padding:0 30px;
          .assets_btn{
            width:48%;
            height:80px;
            box-sizing: border-box;
            text-align:center;
            line-height:80px;
            font-size:28px;
            border-radius: 10px;
            &:first-child{
              margin-right:4%;
            }
            &.blue{
              border:1PX solid $mainColor;
              color:$mainColor;
            }
            &.white{
              background-color:$mainColor;
              color:#fff;
            }
          }
        }
      }
      .mess_title{
        height:100px;
        background-color:#0c1229;
        border-bottom:1PX solid #252a3f;
        padding:0 30px;
        line-height:100px;
        font-size:28px;
        color:#fff;
        position:relative;
        &:after{
          position:absolute;
          content:'';
          bottom:0;
          left:30px;
          width:80px;
          height:4px;
          background-color:#2dcd60;
        }
      }
      .infor_titles{
        width:100%;
        height:100px;
        display:flex;
        flex-wrap: wrap;
        background-color:#0c1229;
        border-bottom:1PX solid #252a3f;
        .infor_title{
          flex:1;
          text-align:center;
          line-height:100px;
          font-size:28px;
          color:#9297a5;
          transition: all 0.5s ease;
          &:first-child{
            position: relative;
            &:before{
              position:absolute;
              content:'';
              background-color:#252a3f;
              width:1PX;
              height:26px;
              right:0;
              top:50%;
              margin-top:-13px;
            }
          }
          &.active{
            color:#fff;
            position:relative;
            &:after{
              position: absolute;
              bottom:0;
              left:50%;
              content:'';
              width:80px;
              height:4px;
              background-color:#2dcd60;
              margin-left:-40px;
            }
          }
        }
      }
      .coin_mess{
        .mess_detail{
          background-color:#0c1229;
          padding: 25px 30px 20px;
          position:relative;
          .detail_name{
            font-size:28px;
            color:#fff;
            line-height:80px;
          }
          .detail_intro{
            font-size:26px;
            color:#5e6476;
            line-height:50px;
            word-break:break-all;
            padding-bottom:25px;
          }
          .detail_more{
            position:absolute;
            right:60px;
            bottom:10px;
            font-size:26px;
            color:$mainColor;
            display:flex;
            align-items: center;
            .iconfont{
              display:inline-block;
              transform: rotateZ(90deg);
              transition: all 0.5s ease;
              margin-left:10px;
              &.active{
                transform: rotateZ(270deg);
              }
            }
          }
        }
        .mess_lists{
          padding: 0 30px;
          background-color:#0c1229;
          .mess_list{
            height:99px;
            border-top:1PX solid #252a3f;
            line-height:99px;
            display:flex;
            justify-content: space-between;
            font-size:26px;
            color:#9297a5;
          }
        }
        .link_lists{
          padding: 0 30px;
          background-color:#0c1229;
          margin-top:20px;
          .link_list{
            height:99px;
            border-top:1PX solid #252a3f;
            line-height:99px;
            display:flex;
            justify-content: space-between;
            font-size:26px;
            color:#9297a5;
            &:first-child{
              border:0;
            }
            .list_text{
              display:flex;
              align-items: center;
              &.website{
                color:$mainColor;
              }
              &:link,&:visited{
                color:$mainColor;
              }
              .iconfont {
                font-size:30px;
                margin-right:5px;
              }
            }
          }
        }
      }
      .infor_lists{
        padding:0 30px;
        height:1000px;
        .no_record{
          padding-top:100px;
          .no_record_icon{
            opacity: 0.3;
            margin-bottom:50px;
          }
        }
        .infor_list{
          width:100%;
          height:200px;
          border-bottom:1PX solid #252a3f;
          display:flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          .list_titles{
            width:65%;
            .list_title{
              font-size:28px;
              color:#fff;
              line-height:40px;
              width:100%;
              overflow : hidden;
              text-overflow: ellipsis;
              display:-webkit-box;
              -webkit-line-clamp:2;
              -webkit-box-orient: vertical;
            }
            .list_time{
              color:#5e6476;
              font-size:24px;
              margin-top:15px;
            }
          }
          .list_pics{
            width:30%;
            height:60%;
            border-radius: 20px;
            overflow: hidden;
            img{
              height:100%;
              width:100%;
            }
          }
        }
      }
    }
    .detail_foot{
      position:fixed;
      bottom:0;
      left:0;
      width:100%;
      height:98px;
      background-color:#070d25;
      display:flex;
      box-shadow: 0 0 18px 3px #060b1f;
      .foot_btn{
        flex:1;
        text-align:center;
        line-height:98px;
        height:98px;
        font-size:26px;
        color:#c1dcff;
        position:relative;
        display:flex;
        align-items: center;
        justify-content: center;
        &:after{
          position:absolute;
          right:0;
          top:50%;
          content:'';
          height:30px;
          width:1PX;
          display:block;
          background-color:#20263b;
          margin-top:-15px;
        }
        &:last-child{
          &:after{
            height:0;
          }
        }
        .iconfont{
          font-size:35px;
          margin-right:8px;
          &.icon-guanzhu{
            color:#2a53fd;
          }
        }
      }
    }
    // 分享弹窗
    .pop_main {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 50;
      background: rgba(0, 0, 0, 0.6);
      .pop_content{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        min-height: 415px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        background: #fff;
        animation: myShow 0.5s;
        @keyframes myShow {
          0% {
            opacity:0;
            transform: scale(0.5);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            opacity:1;
            transform: scale(1);
          }
        }
        .title{
          margin: 0 20px;
          padding: 40px 0;
          box-sizing: border-box;
          border-bottom: 1Px solid #dad9de;
          font-size: 30px;
          font-weight: bold;
          text-align: center;
          &.cancel{
            color: #999999;
            font-size: 26px;
            border: none;
            font-weight: 200;
          }
        }
        .share_main{
          width: 100%;
          min-height: 205px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-wrap: wrap;
          padding: 30px 0;
          box-sizing: border-box;
          border-bottom: 1Px solid #dad9de;
          .share_list{
            width: 33.3%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .share_img{
              width: 96px;
              height: 96px;
              border-radius: 50%;
            }
            .share_name{
              font-size: 26px;
              line-height: 66px;
            }
          }
        }
      }
    }
  }
</style>
