<template>
  <div class="earn">
    <div class="banner-container">
      <p class="title">{{$t('earn.title')}}</p>
      <p class="des">{{$t('earn.des')}}</p>
      <el-button class="buyBtn" @click="submitFun('BUY')" type="button">{{$t('earn.buy')}}</el-button>
      <img src="../assets/earn_banner.png">
    </div>

    <el-form ref="form" :model="form" class="store">
      <el-form-item :label="$t('recharge.select')">
        <img :src="coinImgAdd" slot="label" style="vertical-align: middle"/>
        <el-select v-model="form.region" :placeholder="$t('form.select')" @change="selectCoin">
          <el-option v-for="item in coinArr" :key="item.id" :value="item">
            <img v-if="item == 'USDT-ERC20' || item == 'USDT-OMIN'" src="../assets/USDT.png" />
            <img v-else :src="require('../assets/'+ item +'.png')" />
            <span>{{item}}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'earn',
  data () {
    return {
      form:{
        region:'USDT',
        link:'',
        number:'',
        asset:'',
        imageUrl:''
      },
      // coinArr:['USDT-ERC20','USDT-OMIN','BTC','LTC','EOS','XRP','BCH','ETH','ETC'],
      coinArr:['USDT','BTC', 'ETH'],
      coinImgAdd: require('../assets/USDT.png')
    }
  },
  methods: {
    selectCoin(value){
      if(value == 'USDT-ERC20' || value == 'USDT-OMIN'){
        this.coinImgAdd = require('../assets/USDT.png')
      }else{
        this.coinImgAdd = require('../assets/'+ value +'.png')
      }
    }
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
    button {
      background: #87D8EA;
      border-color: #87D8EA;
      color: white;
    }
    img {
      width: 611px;
      height: 380px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  .store {
    background-color: #262A38;
    border-radius: 2px;
    width: 300px;
    padding: 20px;
    margin: 50px 0 20px 0;
  }
}
</style>
