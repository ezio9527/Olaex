<template>
  <div class="earn">
    <div class="banner-container">
      <p class="title">{{$t('earn.title')}}</p>
      <p class="des">{{$t('earn.subTitle')}}</p>
      <el-link class="buyBtn" href="#earn" style="color: white" :underline="false" ref="link">{{$t('earn.buy')}}</el-link>
      <img src="../assets/earn_banner.png">
    </div>

    <div class="earn-container" id="earn">
      <el-form ref="form" :model="form" class="left">
        <el-form-item>
          <img :src="coinImgAdd" slot="label" style="vertical-align: middle"/>
          <el-select v-model="form.region" @change="selectCoin" class="input">
            <el-option v-for="item in coinArr" :key="item.id" :value="item">
              <img v-if="item == 'USDT-ERC20' || item == 'USDT-OMIN'" src="../assets/USDT.png" />
              <img v-else :src="require('../assets/'+ item +'.png')" />
              <span>{{item}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('earn.buyNum')" :rules="[{ required: true, message: $t('trasfer.turnEmpty')},{pattern:/^(0(\.\d*[1-9]+\d*)?)$|^([1-9]\d*)(\.\d*)?$/,message:$t('trasfer.turnEmpty'),trigger:'blur'}]" prop="number">
          <el-input v-model="form.number" autocomplete="off" :placeholder="$t('earn.inputPlaceholder')" class="input">
            <template slot="append">{{form.region}}</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="right">
        <p class="title">{{form.region + $t('nav.earn')}}</p>
        <p class="des">{{$t('earn.des')}}</p>
        <div class="right-container">
          <div class="time-limit"><span>{{$t('earn.timeLimit')}}</span><span>{{$t('earn.demand')}}</span></div>
          <div class="reference"><span>{{$t('earn.reference')}}</span><span>{{earn.accrual * 365}}%</span></div>
          <div class="prospective"><span>{{$t('earn.prospectiveEarnings')}}</span><span>{{earn.accrual * form.number}}/{{$t('earn.day')}}</span></div>
          <el-button type="button" @click="submit('form')">{{$t('earn.buy')}}</el-button>
        </div>
      </div>
    </div>
    <foot/>
  </div>
</template>

<script>
import Foot from '@/components/Foot'
import codeStatus from '@/config/codeStatus'
import { earningsApi, convertApi } from '@/api/getData'
export default {
  name: 'earn',
  components: {
    Foot
  },
  data () {
    return {
      earnData: {},
      form:{
        region:'USDT',
        link:'',
        number:'1',
        asset:'',
        imageUrl:''
      },
      // coinArr:['USDT-ERC20','USDT-OMIN','BTC','LTC','EOS','XRP','BCH','ETH','ETC'],
      coinArr:['USDT','BTC', 'ETH'],
      coinImgAdd: require('../assets/USDT.png')
    }
  },
  computed: {
    earn () {
      return this.earnData[this.form.region] || {accrual: ''}
    }
  },
  methods: {
    submit (form) {
      this.$refs[form].validate(async (valid) => {
        if(valid){
          const dataArr = new URLSearchParams();
          // 划转到余币宝
          dataArr.set('type',this.form.region);
          dataArr.set('from','WALLET');
          dataArr.set('to','SAVING');
          dataArr.set('numbers',this.form.number);

          var res = await convertApi(dataArr);
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
    async qryEarnings () {
      let dataArr = new URLSearchParams();
      let res = await earningsApi(dataArr);
      if(res.success){
        this.coinArr = []
        res.data.records.forEach(item => {
          this.earnData[item.type] = item
          this.coinArr.push(item.type)
        })
        this.$set(this.form, 'region', this.coinArr[0] || 'USDT')
        this.selectCoin(this.coinArr[0])
      }else{
        codeStatus(res.code,msg => {
          this.$message.error(msg)
        })
      }
    },
    selectCoin(value){
      if(value == 'USDT-ERC20' || value == 'USDT-OMIN'){
        this.coinImgAdd = require('../assets/USDT.png')
      }else{
        this.coinImgAdd = require('../assets/'+ value +'.png')
      }
    }
  },
  created () {
    this.qryEarnings()
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
      background: #2d60e0;
      color: white;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      border: 1px solid #2d60e0;
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
  .earn-container {
    margin: auto;
    width: 1000px;
    *zoom: 1;

    &::after {
      content: '';
      height: 0;
      line-height: 0;
      visibility: hidden;
      clear: both;
      display: block;
    }
    .left, .right {
      float: left;
      background-color: #262A38;
      border-radius: 2px;
      width: 300px;
      padding: 20px;
      margin: 50px 0 20px 0;

      .input{
        color: #000 !important;
      }
    }
    .right {
      float: right;
      width: 500px;
      p {
        margin: auto;
      }
      .title {
        font-size: 26px;
      }
      .des {
        margin: 10px 0 20px 0;
      }
      .right-container {
        *zoom: 1;
        &::after {
          content: '';
          height: 0;
          line-height: 0;
          visibility: hidden;
          clear: both;
          display: block;
        }
        span {
          display: block;
        }
        .time-limit, .reference, .prospective {
          float: left;
          margin-right: 20px;
          *zoom: 1;
          &::after {
            content: '';
            height: 0;
            line-height: 0;
            visibility: hidden;
            clear: both;
            display: block;
          }
        }
        .time-limit {
          span:last-child {
            font-size: 24px;
          }
        }
        .reference {
          span:last-child {
            color: #22c63f;
            font-size: 24px;
          }
        }
        .prospective {
          span:last-child {
            font-size: 24px;
          }
        }
        button {
          float: right;
          background: #2d60e0;
          border-color: #2d60e0;
          color: white;
        }
      }
    }
  }
}
</style>
