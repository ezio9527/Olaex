<template>
  <!--交易币种行情-->
  <ul class="transaction_pair">
    <li v-for="(item,index) in ticketArr" :key="index">
      <p class="pair">{{item.symbol}}</p>
      <h3>{{item.close}}</h3>
      <p class="profie" v-if="((item.rose)*100).toFixed(2) > 0">+{{((item.rose)*100).toFixed(2)}}%</p>
      <p class="loss" v-else>{{((item.rose)*100).toFixed(2)}}%</p>
    </li>
  </ul>
</template>
<script>
import {ticketApi} from '@/api/getData'
export default {
  data() {
    return {
      ticketArr: [],//币种行情数据
      timer: null
    }
  },
  mounted() {
    this.ticketFun();
  },
  methods: {
    ticketFun() {//币种行情
      var that = this;
      that.timer = setInterval(async () => {
        var res = await ticketApi();
        that.ticketArr = [];
        if (res.code == 200) {
          var arr = res.data;
          arr.forEach(element => {
            that.ticketArr.push(element);
          });
          that.$emit('update', that.ticketArr)
        }
      }, 2000);
    }
  },
  destroyed() {
    clearInterval(this.timer);
  }
}
</script>
<style lang="less">
  .transaction_pair {
    background-color: #1B1C27;
    padding: 12px 0;
    overflow-x: auto;
    display: flex;
    flex-direction: row;
    justify-self: start;
    justify-content: center;
    li {
      width: 220px;
      text-align: center;
      border-right: 1px solid #3C3C3C;
      &:nth-last-child(1) {
        border: none;
      }
      h3 {
        font-size: 20px;
        margin: 0;
      }
      .pair {
        color: #8E8E8E;
      }
      .profie {
        color: #6FC1A1;
      }
      .loss {
        color: #EC5E45;
      }
    }
  }
</style>
