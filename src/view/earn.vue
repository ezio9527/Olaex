<template>
  <div class="earn">
    <div class="banner-container">
      <p class="title">{{$t('earn.title')}}</p>
      <p class="des">{{$t('earn.subTitle')}}</p>
      <el-link class="buyBtn" href="#earn" style="color: white" :underline="false" ref="link">{{$t('earn.buy')}}</el-link>
      <img src="../assets/earn_banner.png">
    </div>

    <div class="introduce">
      <h1>LHC官方网站：<a href="http://www.lhc.ink/" target="_blank">http://www.lhc.ink/</a></h1>
      <h2>全名：生命密码基因健康链</h2>
      <h2>编号：LHC</h2>
      <p>基因作为支撑世界万物生命的基本构造和性能的神秘密码，储存着世间万物生命的种族、血脉、繁育、生长、凋亡等过程的全部信息，演绎着生命的繁衍、细胞分裂和蛋白质合成等重要生理过程。生物体的生、长、衰、病、老、死等一切生命现象都与基因有关，它是决定生命健康的内在因素。为促进基因健康领域整体向前发展，解决当前基因市场普遍存在的痛点问题，LHC 创始技术团队以分布式的生命基因健康应用为核心，以区块链底层技术为纽带，以LHC币为媒介，创新建立生命密码基因健康链(LHC)。LHC完全革新目前基因健康市场的基因数据存储方式和底层协议，引入POC共识机制，从去中心化程度、实用性、技术可靠性、抗封锁性考虑、开创多种基因健康合约和交易生态。LHC在未来将实现分布式网络、Ledger 、共识、网关、分布式节点全员认证交易、币币种交易、数字资产兑换等全场景基础性生态功能，协同完成DeFi金融创新的全面升级，打造基因健康最强共识，建立公平民主的智能利益分配体系，推动基因健康智能合约自动正向循环。LHC首创“区块链+基因健康”的商业模式，它将成为每个用户畅通无阻穿梭在区块链世界和基因健康世界的合约通证，它将是每个用户获取所有附加服务和应用的关键钥匙，。创建一个可自循环、自孵化、自进化、自创新、去中心化，更加高效透明、安全可信的多元化基因健康数字合约生态圈。

      LHC发行上线规划：</p>
      <p>1.     To ken类型：ERC-20</p>
      <p>2.     发行总量：10亿枚</p>
      <p>3.     早期会员开放发售：总量40%，锁定期3个月后可在二级市场自由交易</p>
      <p>4.     初始发售时间：2020年10月</p>
      <p>5.     发售定价方式：逐轮价格不低于上涨1.5%的递增式发售</p>
      <p>6.     初始发售价格：1LHC=0.03USDT</p>
      <p>7.     公开上市交易时间：2021年1月</p>
      <p>8.     相关链接：<a href="http://www.lhc.ink/down/LHC.pdf" target="_blank">http://www.lhc.ink/down/LHC.pdf</a></p>
    </div>
    <div class="earn-container" id="earn">
      <el-form ref="form" :model="form" class="left">
        <el-form-item>
          <img :src="coinImgAdd" slot="label" style="vertical-align: middle"/>
          <el-select v-model="form.region" @change="selectCoin">
            <el-option v-for="item in coinArr" :key="item.id" :value="item">
              <img v-if="item == 'USDT-ERC20' || item == 'USDT-OMIN'" src="../assets/USDT.png" />
              <img v-else :src="require('../assets/'+ item +'.png')" />
              <span>{{item}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('earn.buyNum')" :rules="[{ required: true, trigger:'blur' }]" prop="number">
          <el-input v-model="form.number" autocomplete="off" :placeholder="$t('earn.inputPlaceholder')" @input="number">
            <template slot="append">{{form.region}}</template>
          </el-input>
        </el-form-item>
        <p>BTC≥0.001&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;USDT≥100&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;ETH≥0.3</p>
        <p>{{$t('trasfer.available')}}: {{wallet[form.region]}}    {{$t('earn.rate')}}: {{coinConversion}}</p>
        <el-form-item :label="$t('earn.buyNum')" :rules="[{ required: true, trigger:'blur' }]" prop="number">
          <el-input v-model="form.targetNumber" autocomplete="off" :placeholder="$t('earn.inputPlaceholder')" @input="targetNumber" disabled>
            <template slot="append">LHC</template>
          </el-input>
        </el-form-item>
        <el-button type="button" @click="submit('form')">{{$t('earn.buy')}}</el-button>
      </el-form>
    </div>
    <el-table :data="recordData" class="table">
      <el-table-column prop="flowCoin" :label="$t('earn.type')"></el-table-column>
      <el-table-column prop="flowPrice" :label="$t('earn.number')"></el-table-column>
      <el-table-column prop="remark" :label="$t('earn.rate')"></el-table-column>
      <el-table-column prop="convertNum" :label="$t('earn.convert')"></el-table-column>
      <el-table-column prop="createTime" :label="$t('earn.time')"></el-table-column>
    </el-table>
    <foot/>
  </div>
</template>

<script>
import Foot from '@/components/Foot'
import codeStatus from '@/config/codeStatus'
import { walletApi, ticketApi, conversionApi, assetsRecordApi, conversionRateApi } from '@/api/getData'
export default {
  name: 'earn',
  components: {
    Foot
  },
  data () {
    return {
      earnData: {},
      coinConversion: 1,
      form:{
        region:'USDT',
        link:'',
        asset:'',
        number:'0',
        targetNumber:'0',
        imageUrl:''
      },
      wallet: {},
      market: {},
      // coinArr:['USDT-ERC20','USDT-OMIN','BTC','LTC','EOS','XRP','BCH','ETH','ETC'],
      coinArr:['USDT','BTC', 'ETH'],
      coinImgAdd: require('../assets/USDT.png'),
      page: {
        currentPage: 1,
        limit: 10,
        total: 0,
      },
      recordData: []
    }
  },
  computed: {
    earn () {
      return this.earnData[this.form.region] || {accrual: ''}
    },
    rate () {
      if (this.form.region === 'USDT') {
        return 1
      } else {
        const selectPrice = (this.market[this.form.region + '/USDT'] || { price: 0}).price
        const lhcPrice = (this.market['LHC/USDT'] || { price: 0}).price
        return selectPrice / lhcPrice
      }
    }
  },
  methods: {
    submit (form) {
      this.$refs[form].validate(async (valid) => {
        if(valid){
          const dataArr = new URLSearchParams();
          dataArr.set('type',this.form.region);
          dataArr.set('numbers',this.form.number);
          var res = await conversionApi(dataArr);
          if(res.success){
            this.$message({
              type:'success',
              message:this.$t('earn.success')
            })
            this.$refs[form].resetFields();
          }else{
            codeStatus(res.code,msg=>{
              this.$message.error(msg)
            })
          }
        }
      })
    },
    async getRate () {
      const dataArr = new URLSearchParams();
      dataArr.set('type',this.form.region);
      var res = await conversionRateApi(dataArr);
      if(res.success){
        this.coinConversion = res.data.coinConversion
      }else{
        codeStatus(res.code,msg=>{
          this.$message.error(msg)
        })
      }
    },
    selectCoin(value){
      this.getRate()
      this.$set(this.form, 'number', '0')
      this.$set(this.form, 'targetNumber', '0')
      if(value == 'USDT-ERC20' || value == 'USDT-OMIN'){
        this.coinImgAdd = require('../assets/USDT.png')
      }else{
        this.coinImgAdd = require('../assets/'+ value +'.png')
      }
    },
    async walletFun() {
      var that = this;
      var dataArr = new URLSearchParams();
      dataArr.set('valuation', 'USDT');//BTC
      dataArr.set('hide', 'N');
      dataArr.set('type', 'WALLET');
      var res = await walletApi(dataArr);
      that.tableData = [];
      if (res.success) {
        const list = res.data.list;
        const obj = {}
        list.forEach(item => {
          obj[item.type] = item.usedPrice
        })
        this.wallet = obj
      }
    },
    async ticketFun(){//获取币种
      var res = await ticketApi();
      if(res.success){
        const obj = {}
        const arr = []
        res.data.forEach(item => {
          arr.push(item.symbol.replace('/USDT', ''))
          obj[item.symbol] = {
            price: item.close
          }
        });
        this.coinArr = arr
        this.market = obj
      }
    },
    number (val) {
      if (val === '0') {
        this.$set(this.form, 'targetNumber', 0)
      } else {
        const targetNumber = (val * this.coinConversion).toFixed(8)
        this.$set(this.form, 'targetNumber', targetNumber)
      }
    },
    targetNumber (val) {
      if (val === '0') {
        this.$set(this.form, 'number', 0)
      } else {
        const number = (val * this.rate).toFixed(8)
        this.$set(this.form, 'number', number)
      }
    },
    async recordFun() {//流水记录
      // *******
      let that = this;
      let dataArr = new URLSearchParams();
      let res
      dataArr.set('type', 'CONVERSION');
      dataArr.set('current', that.page.currentPage);
      dataArr.set('size', that.page.limit);
      res = await assetsRecordApi(dataArr);
      that.tableData = [];
      if (res.success) {
        that.page.total = Number(res.data.records.total);
        that.recordData = res.data.records.records.filter(item => {
          return item.flowType === 'CONVERT_OUT'
        }).map(item => {
          item.convertNum = (item.remark.split(':')[1] || 0) * item.flowPrice
          return item
        })
      }
    }
  },
  created () {
    this.walletFun();//钱包资产
    // this.ticketFun();
    this.getRate();
    this.recordFun();
  }
}
</script>

<style lang="less" scoped>
.earn {
  .banner-container {
    position: relative;
    height: 420px;
    padding: 40px;
    background: #1B1924;
    .title {
      font-size: 36px;
      margin: auto;
    }
    .des {
      margin: 20px auto 40px auto;
    }
    .buyBtn {
      background: #87D8EA;
      color: white;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      border: 1px solid #87D8EA;
      -webkit-appearance: none;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      -webkit-transition: .1s;
      transition: .1s;
      font-weight: 500;
      padding: 12px 20px;
      font-size: 14px;
      border-radius: 4px
    }
    img {
      width: 611px;
      height: 380px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  .introduce {
    background-color: #262A38;
    border-radius: 2px;
    padding: 20px;
    margin: auto;
    margin-top: 50px;
    width: 1200px;
    *zoom: 1;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .earn-container {
    margin: auto;
    width: 1200px;
    *zoom: 1;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    &::after {
      content: '';
      height: 0;
      line-height: 0;
      visibility: hidden;
      clear: both;
      display: block;
    }
    .left {
      float: left;
      background-color: #262A38;
      border-radius: 2px;
      width: 100%;
      padding: 20px;
      margin: 50px 0 20px 0;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      button {
        float: right;
        background: #87D8EA;
        border-color: #87D8EA;
        color: white;
      }
    }
  }
  .table {
    width: 1200px;
    margin: auto;
  }
}
</style>
