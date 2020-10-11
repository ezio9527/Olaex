<template>
  <div class="earn">
    <div class="banner-container">
      <p class="title">{{$t('earn.title')}}</p>
      <p class="des">{{$t('earn.subTitle')}}</p>
      <el-link class="buyBtn" href="#earn" style="color: white" :underline="false" ref="link">{{$t('earn.buy')}}</el-link>
      <img src="../assets/earn_banner.png">
    </div>

    <div class="introduce">

      <h1>{{$t('earn.introduce1')}}<a href="https://www.lhc.ink/" target="_blank">https://www.lhc.ink/</a></h1>
      <h2>{{$t('earn.introduce2')}}</h2>
      <h2>{{$t('earn.introduce3')}}</h2>
      <p>{{$t('earn.introduce4')}}</p>
      <p>{{$t('earn.introduce5')}}</p>
      <p>{{$t('earn.introduce6')}}</p>
      <p>{{$t('earn.introduce7')}}</p>
      <p>{{$t('earn.introduce8')}}</p>
      <p>{{$t('earn.introduce9')}}</p>
      <p>{{$t('earn.introduce10')}}</p>
      <p>{{$t('earn.introduce11')}}</p>
      <p>{{$t('earn.introduce12')}}</p>
      <p>{{$t('earn.introduce13')}}<a href="https://www.lhc.ink/down/LHC.pdf" target="_blank">https://www.lhc.ink/down/LHC.pdf</a></p>
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
        <el-form-item :label="$t('earn.buyNum')" :rules="[{ required: true, trigger:'blur' }, { validator: validateNumber, trigger: 'blur' }]" prop="number">
          <el-input v-model="form.number" autocomplete="off" :placeholder="$t('earn.inputPlaceholder')" @input="number">
            <template slot="append">{{form.region}}</template>
          </el-input>
        </el-form-item>
        <p>BTC≥0.001&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;USDT≥100&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;ETH≥0.3</p>
        <p>{{$t('trasfer.available')}}: {{wallet[form.region]}}</p>
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
      <!--<el-table-column prop="remark" :label="$t('earn.rate')"></el-table-column>-->
      <!--<el-table-column prop="convertNum" :label="$t('earn.convert')"></el-table-column>-->
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
        return (1 / (this.market['LHC/USDT'] || {price: 1}).price)  * this.coinConversion
      } else {
        const selectPrice = (this.market[this.form.region + '/USDT'] || { price: 0}).price
        const lhcPrice = (this.market['LHC/USDT'] || { price: 0}).price
        console.log(selectPrice, lhcPrice, this.coinConversion)
        return (selectPrice / lhcPrice) * this.coinConversion
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
        // this.coinArr = arr
        this.market = obj
      }
    },
    validateNumber (rule, value, callback) {
      if (Number(value) <= 0) {
        return callback(new Error(this.$t('verification.numLessZero')))
      } else if (!Number(value)) {
        return callback(new Error(this.$t('verification.numMustNum')))
      } else if (Number(value) > this.wallet[this.form.region]) {
        return callback(new Error(this.$t('verification.numGreaterBalance')))
      } else if (this.form.region === 'BTC' && Number(value) < 0.001) {
        return callback(new Error('BTC≥0.001'))
      }  else if (this.form.region === 'USDT' && Number(value) < 100) {
        return callback(new Error('USDT≥100'))
      }  else if (this.form.region === 'ETH' && Number(value) < 0.3) {
        return callback(new Error('ETH≥0.3'))
      } else {
        callback()
      }
    },
    number (val) {
      if (val === '0') {
        this.$set(this.form, 'targetNumber', 0)
      } else {
        const targetNumber = (val * this.rate).toFixed(8)
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
          return item.flowType === 'TRANSFER_IN'
        }).map(item => {
          item.convertNum = (item.remark.split(':')[1] || 0) * item.flowPrice
          return item
        })
      }
    }
  },
  created () {
    this.walletFun();//钱包资产
    this.ticketFun();
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
