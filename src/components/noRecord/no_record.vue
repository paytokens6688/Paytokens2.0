<template>
  <div class="no_record">
    <div
      class="no_record_icon"
      :class="type"></div>
    <p class="no_record_title">
      {{title}}
    </p>
  </div>
</template>

<script>
export default {
  name: 'no_record',
  data () {
    return {
    };
  },
  beforeMount () {
  },
  methods: {
  },
  props: {
    // 标题
    title: String,
    // 类型 record: 暂无记录   network: 暂无网络  message: 暂无消息  address: 暂无地址记录
    type: String
  }
};
</script>

<style lang="scss">
  .no_record{
    text-align:center;
    padding-top:150px;
    .no_record_icon{
      width:360px;
      height:240px;
      background-size:100% 100%;
      margin:0 auto 20px;
      &.record{
        background-image: url('../../assets/images/no_record.png');
      }
      &.network{
        background-image: url('../../assets/images/no_network.png');
      }
      &.message{
        background-image: url('../../assets/images/no_message.png');
      }
      &.address{
        background-image: url('../../assets/images/no_address_record.png');
      }
    }
    .no_record_title{
      font-size:26px;
      line-height:46px;
      color:#7d828e;
    }
  }
</style>
