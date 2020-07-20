<template>
    <div class="assets_div">
        <div class="container">
            <div class="total_div" v-if="activeName == '0'">
                <div class="total_content">
                    <span class="title">{{$t('assets.assets')}}:</span>
                    <p class="assets"><span class="changeFont">{{totalPrice}}</span>{{coinType =="USDT" ? 'BTC' : 'USDT'}}<span></span></p>
                    <span class="money">≈ {{cny/7.0241}} USD</span>
                </div>
            </div>
            <h2 v-else class="assets_title">{{$t('nav.assets')}}</h2>

            <el-tabs class="titleBar" v-model="activeName" @tab-click="handleClick">
              <el-tab-pane :label="$t('assets.account')" name="0"></el-tab-pane>
              <el-tab-pane :label="$t('assets.recharge')" name="1"></el-tab-pane>
              <el-tab-pane :label="$t('assets.withdraw')" name="2"></el-tab-pane>
              <el-tab-pane :label="$t('assets.transfer')" name="3"></el-tab-pane>
              <el-tab-pane :label="$t('assets.record')" name="4"></el-tab-pane>
              <!--<el-tab-pane :label="$t('assets.carry')" name="5"></el-tab-pane>-->
              <el-tab-pane :label="$t('assets.borrow')" name="6"></el-tab-pane>
              <el-tab-pane :label="$t('assets.repay')" name="7"></el-tab-pane>
            </el-tabs>
			<!--账号信息-->
            <div v-if="activeName == '0'">

            	<el-tabs class="transtionBar cruntpage" v-model="activeIndex" @tab-click="handleIndex">
                <el-tab-pane :label="$t('assets.wallet')" name="0"></el-tab-pane>
                <el-tab-pane :label="$t('assets.contact')" name="1"></el-tab-pane>
                <el-tab-pane :label="$t('assets.earn')" name="2"></el-tab-pane>
                <el-tab-pane :label="$t('assets.lever')" name="3"></el-tab-pane>
                <el-tab-pane :label="$t('assets.spot')" name="4"></el-tab-pane>
	            </el-tabs>

	            <el-table class="fishTable" :data="tableData" :empty-text="$t('tip.noRecord')">
	              <el-table-column prop="type" :label="$t('table.coin')">
                  <template slot-scope="scope">
                    <div class="leftSpread">
                      <img class="coinImg" :src="require('../assets/'+scope.row.type+'.png')" />
                      <span>{{scope.row.type}}</span>
                    </div>
                  </template>
                </el-table-column>
	              <el-table-column prop="totalPrice" :label="$t('table.total')">
                  <template slot-scope="scope">
                    <p>{{(scope.row.totalPrice).toFixed(8)}}</p>
                  </template>
                </el-table-column>
	              <el-table-column prop="usedPrice" :label="$t('table.user')">
                  <template slot-scope="scope">
                    <p>{{(scope.row.usedPrice).toFixed(8)}}</p>
                  </template>
                </el-table-column>
	            </el-table>
	            <page-total v-if="page.total > 10" :page="page" @pageChange="pageChange"></page-total>
            </div>
            <!--充币-->
            <div v-if="activeName == '1'">
            	<Recharge />
            </div>
            <!--提币-->
            <div v-if="activeName == '2'">
            	<Withdraw />
            </div>
           <!--资产划转-->
            <div v-if="activeName == '3'">
            	<TurnUsdt />
            </div>
             <!--资产记录-->
            <div v-if="activeName == '4'">
            	<AssetsRecord />
            </div>
           <!--站内转账-->
            <div v-if="activeName == '5'">
            	<Trasfer />
            </div>
            <!--借币-->
            <div v-if="activeName == '6'">
              <Borrow />
            </div>
            <!--还币-->
            <div v-if="activeName == '7'">
              <Repay />
            </div>

        </div>
        <Foot />
    </div>
</template>
<script>
import pageTotal from '@/components/pageTotal'
import Recharge from '@/components/Recharge'
import Withdraw from '@/components/Withdraw'
import TurnUsdt from '@/components/TurnUsdt'
import Trasfer from '@/components/Trasfer'
import Borrow from '@/components/Borrow'
import Repay from '@/components/Repay'
import AssetsRecord from '@/components/AssetsRecord'
import Foot from '@/components/Foot'
import { walletApi, earnApi } from '@/api/getData'

export default {
    data(){
        return{
            activeName:'0',
            activeIndex:'0',
            tableData:[],
            page:{
                currentPage:1,
                limit:10,
                total:0,
            },
            totalPrice:0,
            cny:0,
            coinType:'USDT'
        }
    },
    computed:{
        queryType(){
            return this.$route.query.type
        },
        getGolob(){
            return this.$parent.getCoinType
        }
    },
    watch:{
        queryType(newValue,oldValue){
            this.activeName = String(newValue)
        },
        getGolob(newValue){
            this.coinType = newValue
            this.walletFun();
        }
    },
    created(){
        if(this.$route.query.type){
            this.activeName = String(this.$route.query.type)
        }
    },
    mounted(){
        this.coinType = this.$parent.getCoinType;
        this.walletFun();//钱包资产
        this.earnFun();//余利宝资产
    },
    methods:{
      async walletFun(){
        var that = this;
        var txt = '';
        if(that.activeIndex == '0'){
          txt = 'WALLET'
        }else if(that.activeIndex == '1'){
          txt = 'CONTRACT'
        }else if(that.activeIndex == '2'){
          // txt = 'LEGAL'
          txt = 'SAVING'
        }else if(that.activeIndex == '3'){
          txt = 'LEVER'
        }else if(that.activeIndex == '4'){
          txt = 'CURRENCY'
        }
        var dataArr = new URLSearchParams();
        if(that.coinType == 'USDT'){
          var txtValue = 'BTC'
        }else{
          var txtValue = 'USDT'
        }
        dataArr.set('valuation',txtValue);//BTC
        dataArr.set('hide','N');
        dataArr.set('type',txt);
        var res = await walletApi(dataArr);
        that.tableData = [];
        if(res.success){
          var obj = res.data;
          if(that.coinType == 'USDT'){
            that.totalPrice = (obj.valuationTotalPrice).toFixed(8);
          }else{
            that.totalPrice = (obj.valuationTotalPrice).toFixed(4);
          }
          that.cny = (obj.cny).toFixed(2);
          that.tableData = obj.list;
        }
      },
      async earnFun(){
        const dataArr = new URLSearchParams();
        var res = await earnApi(dataArr);
        this.tableData = [];
        if(res.success){
          var obj = res.data;
          if(this.coinType == 'USDT'){
            this.totalPrice = (obj.valuationTotalPrice).toFixed(8);
          }else{
            this.totalPrice = (obj.valuationTotalPrice).toFixed(4);
          }
          this.cny = (obj.cny).toFixed(2);
          this.tableData = obj.list;
        }
      },
        handleClick(){//标题切换

        },
        handleIndex(){//交易切换
            this.walletFun();
        },
        pageChange(item){

        }
    },
    components:{
        pageTotal,
        Recharge,
        Withdraw,
        Trasfer,
        TurnUsdt,
        Borrow,
        Repay,
        AssetsRecord,
        Foot
    }
}
</script>
<style lang="less">
.assets_div{
    .assets_title{
        font-weight: normal;
        margin: 44px 0 20px 0;
        font-size: 24px;
    }
    .coinImg{
        margin-right: 6px;
    }
    //资产估值
    .total_content{
        background-color: #262A38;
        border-radius: 2px;
        width: 230px;
        padding: 20px;
        margin: 50px 0 20px 0;
        .assets{
            color: #92A6ED;
        }
        .changeFont{
            font-size: 24px;
            margin-right: 4px;
            font-weight: initial;
        }
        .title{
            color: #C3C3C3;
        }
        .money{
            color: #8E8E8E;
        }
    }
    .titleBar{
        //tab切换
        .el-tabs__header{
            border-bottom: 1px solid #3B3B3B;
            .el-tabs__item{
                padding: 0;
                margin-right: 20px;
            }
            .el-tabs__item.is-active{
                border-bottom: 1px solid #87D8EA!important;
            }
        }
    }
    .transtionBar{
        text-align: center;
        margin: 20px 0;
    }
    .cruntpage{
      .el-tabs__nav{
		    display: contents;
      	&>div:nth-child(2).is-active{
      		background: url(../assets/left-active.png) no-repeat;
      		background-size: 100% 100%;
      	}
        &>div:nth-child(3).is-active, &>div:nth-child(4).is-active, &>div:nth-child(5).is-active{
      		background:#87D8EA;
      	}
      	&>div:nth-child(6).is-active{
      		background: url(../assets/right-active.png) no-repeat;
      		background-size: 100% 100%;
      	}
      	.is-active{
      		color: #FFFFFF!important;
      	}
      	.el-tabs__item{
          &:nth-child(2){
      			background: url(../assets/left.png) no-repeat;
      			background-size: 100% 100%;
      			width: 120px;
      		}
          &:nth-child(3),&:nth-child(4) {
            margin-right: 8px;
          }
          &:nth-child(3),&:nth-child(4),&:nth-child(5){
      			width:110px;
            height:40px;
            -webkit-transform:skew(-22deg);
            -moz-transform:skew(-22deg);
            -o-transform:skew(-22deg);
            -ms-transform:skew(-22deg);
            transform:skew(-22deg);
            background:#262A38;
      		}
      		&:nth-child(6){
      			background: url(../assets/right.png) no-repeat;
      			background-size: 100% 100%;
      			width: 120px;
      		}
      	}
      }
    }
    .el-table tbody tr{
        margin: 0 20px;
    }
}
</style>
