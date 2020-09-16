<template>
    <div class="transaction_div">
        <el-row>
            <el-col :xs="24" :sm="24" :md="17" :lg="19">
                <div class="grid-content transaction_left">
                    <div class="hasPadding">
                        <el-form ref="form" :model="form">
                            <el-form-item class="alignment">
                                <img :src="coinImg" alt="" />
                                <el-select v-model="form.region" :placeholder="$t('form.select')" @change="selectCoin">
                                    <el-option v-for="(item,index) in coinArr" :key="index" :value="item.symbol">
                                        <img :src="item.updateImg" />
                                        <span>{{item.symbol}}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <ul class="topBox">
                            <li>{{$t('transaction.newPirce')}}<span class="getValue">{{newPirce}}</span><span :class="rose>0 ? 'greenColor' : 'redColor'">{{rose}}%</span></li>
                            <li>{{$t('transaction.highPrice')}}<span class="getValue">{{highForth}}</span></li>
                            <li>{{$t('transaction.lossPrice')}}<span class="getValue">{{lossForth}}</span></li>
                            <li>{{$t('transaction.amountPirce')}}<span class="getValue">{{amountPirce}}</span></li>
                        </ul>
                    </div>
                    <div class="picture">
                        <!-- <keep-alive> -->
                            <TradeView :symbolValue="form.region" />
                        <!-- </keep-alive> -->
                    </div>
                    <div style="padding:0 20px">
                        <OrderRecord />
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="7" :lg="5">
                <div class="grid-content transaction_right">
                    <div class="entrustList">
                        <div class="transaction_right_title">
                            <div class="right_title">
                                <span>{{$t('transaction.price')}}</span>
                            </div>
                            <div class="right_title">
                                <span>{{$t('transaction.num')}}</span>
                            </div>
                        </div>
                      <!-- 卖单 -->
                      <ul class="fallList">
                        <li v-for="item in sellArr" :key="item.id">
                          <span>{{(item[0]).toFixed(1)}}</span>
                          <span>{{(item[1]).toFixed(4)}}</span>
                          <div class="percenttd">
                            <span class="percentDiv" :style="'width:'+((item[1]/sellHigh) * 100).toFixed(2)+'%'"></span>
                          </div>
                        </li>
                      </ul>
                        <div class="conversion">
                            <span :class="rose>0 ? 'greenColor' : 'redColor'">{{newPirce}} </span>
                            <span :class="rose>0 ? 'greenColor' : 'redColor'">{{rose}}%</span>
                            <!-- <span>{{cny}} CNY</span> -->
                        </div>
                      <!-- 买单 -->
                      <ul class="riseList">
                        <li v-for="item in buyArr" :key="item.id">
                          <span>{{(item[0]).toFixed(1)}}</span>
                          <span>{{(item[1]).toFixed(4)}}</span>
                          <div class="percenttd">
                            <span class="percentDiv" :style="'width:'+((item[1]/buyHigh) * 100).toFixed(2)+'%'"></span>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="transaction_right_div">
                        <el-tabs class="transtionBar" v-model="activeIndex" @tab-click="handleIndex">
                            <el-tab-pane :label="$t('transaction.limit')" name="0"></el-tab-pane>
                            <el-tab-pane :label="$t('transaction.market')" name="1"></el-tab-pane>
                        </el-tabs>
                        <div class="priceBox">
                            <el-input-number v-if="activeIndex == '0'" v-model="goodPrice" @change="addPrice" @input="addPrice" :min="1" :placeholder="$t('transaction.goodPrice')"></el-input-number>
                            <el-input v-else autocomplete="off" disabled :placeholder="$t('transaction.market')"></el-input>
                            <!-- <el-input-number v-model="num" @change="addNum" @input="addNum" :placeholder="$t('transaction.num')"></el-input-number> -->
                            <el-input class="upNum" v-model="num" @input="changeNum" :placeholder="$t('transaction.num')"></el-input>

                            <!--<p>≈ {{proportion.toFixed(2)}} CNY</p>-->
                        </div>
                        <div class="lever_div">
                            <p style="color:#8E8E8E">{{$t('contract.lever')}}</p>
                            <!--<div class="radioBlock">-->
                                <!--<div v-for="(item,index) in levarageArr" :key="item.id">-->
                                    <!--<el-radio v-model="sliderValue" :label="item.leverageId">{{item.name}}</el-radio>-->
                                    <!--<span v-if="levarageArr.length != (index+1)" class="line"></span>-->
                                <!--</div>-->
                            <!--</div>-->
                          <el-select v-model="sliderValue">
                            <el-option v-for="(item,index) in levarageArr" :key="index" :value="item.leverageId" :label="item.name">
                            </el-option>
                          </el-select>
                        </div>
                        <div class="bondClass">
                            <p>
                                <span>{{$t('contract.mustBond')}}</span>
                                <span>{{num == '' ? 0 : num}} USDT</span>
                            </p>
                            <p>
                                <span>{{$t('contract.abliyBond')}}</span>
                                <span>{{useBond}} USDT</span>
                            </p>
                        </div>
                        <div class="lastBtn">
                            <el-button class="buyBtn" @click="submitFun('BUY')" type="button">{{$t('transaction.buy')}}</el-button>
                            <el-button class="sellBtn" @click="submitFun('SELL')" type="button">{{$t('transaction.sell')}}</el-button>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import OrderRecord from '@/components/OrderRecord'
import { leverageApi,ticketApi,tradeListApi,contractPageApi,contractApi } from '@/api/getData'
import TradeView from '@/components/TradeView'
import codeStatus from '@/config/codeStatus'
export default {
    data(){
        return{
            activeIndex:'0',
            goodPrice:1,
            num: '',
            sliderValue:'',
            levarageArr:[],
            form:{
                region:'BTC/USDT'
            },
            coinArr:[],
            buyArr:[],
            buyHigh:'',
            sellArr:[],
            sellHigh:'',
            wTimerList:null,
            newPirce:'',
            highForth:'',
            lossForth:'',
            amountPirce:'',
            rose:'',
            cny:'',
            coinImg:'',
            useBond:'',
            needBond:0,
            proportion:0,
            getIndex:0
        }
    },
    created(){
        var that = this;
        this.levarageFun();
        that.wTimerList = setInterval(function(){
            that.ticketFun()
        },1000)

    },
    methods:{
        async ticketFun(){//获取币种
            var that = this;
            var res = await ticketApi();
            if(res.success){
                var obj = res.data;
                that.coinArr = [];

                obj.forEach(element => {
                    // 手动剔除BTCETF/USDT交易对
                    if (element.symbol == 'BTCETF/USDT') {
                      return
                    }
                    if(that.form.region == element.symbol){
                        that.form.region = element.symbol;
                        that.newPirce = element.close;
                        that.highForth = element.high;
                        that.lossForth = element.low;
                        that.rose = ((element.rose)*100).toFixed(2);
                        that.amountPirce = element.amount;
                        that.cny = element.cny;
                        var img = element.symbol.substr(0,3);
                        that.coinImg = require('../assets/'+img+'.png');
                        if(that.getIndex == 0){
                            that.goodPrice = element.close
                        }
                    }
                    var imgValue = element.symbol.substr(0,3);
                    element.updateImg = require('../assets/'+imgValue+'.png');
                    that.coinArr.push(element);
                });
                that.getIndex = that.getIndex+1;
                this.tradeFun();
            }
        },
        async tradeFun(){//行情深度
            var that = this;
            var dataArr = new URLSearchParams();
            dataArr.set('symbol',that.form.region);
            var res = await tradeListApi(dataArr);
            if(res.success){
                var buyArr = [],sellArr = [];
                var buyArrObj = res.data.bids;//买单
                var sellArrObj = res.data.asks;//卖单
                buyArrObj.sort(function(x,y){
                    return y[0] - x[0];
                })
                for(var i in buyArrObj){
                    buyArr.push(buyArrObj[i]);
                }
                that.buyArr = [];
                that.buyArr = buyArr.slice(0,10);

                var buyNum =  buyArr.slice(0,10);
                buyNum.sort(function(x,y){
                    return y[1]-x[1]
                })

                that.buyHigh = buyNum[0][1];

                sellArrObj.sort(function(x,y){
                    return y[0] - x[0];
                })
                for(var i in sellArrObj){
                    sellArr.push(sellArrObj[i]);
                }
                that.sellArr = [];
                that.sellArr = sellArr.slice(0,10);
                var sellNum =  sellArr.slice(0,10);
                sellNum.sort(function(x,y){
                    return y[1]-x[1]
                })
                that.sellHigh = sellNum[0][1];

                that.contractFun()
            }
        },
        async contractFun(){//获取可用保证金
            var that = this;
            var dataArr = new URLSearchParams();
            dataArr.set('symbols',that.form.region);
            var res = await contractPageApi(dataArr);
            if(res.success){
                that.useBond = res.data.price;
                // that.proportion = res.data.cnyUsdt;
            }
        },
        selectCoin(value){//选择币种
            var that = this;
            that.form.region = value;
            that.getIndex = 0;
            that.ticketFun();
        },
        async levarageFun(){//杠杆倍率列表
            var that = this;
            var res = await leverageApi();
            that.levarageArr = [];
            if(res.success){
                var obj = res.data;
                if(obj.length>0){
                    obj.forEach((element,index) => {
                        var arrObj = {};
                        if((index+1) == obj.length){
                            that.sliderValue = element.leverageId;
                        }
                        arrObj.name = element.name;
                        arrObj.leverageId = element.leverageId;
                        that.levarageArr.push(arrObj);
                    });
                }
            }
        },
        async submitFun(type){//合约交易
            var that = this;
            if(that.num == ''){
                that.$message.error(that.$t('nav.numEmpty'));
                return false;
            }
            var way = '',price='';
            if(that.activeIndex == '0'){//限价
                way = 'LIMIT';
                price = that.goodPrice;
            }else{//市价
                way = 'MARKET'
                price = that.newPirce;
            }

            var dataArr = new URLSearchParams();
            dataArr.set('symbols',that.form.region);
            dataArr.set('unit',price);
            dataArr.set('numbers',that.num);
            dataArr.set('compactType',type);
            dataArr.set('dealWay',way);
            dataArr.set('leverageId',that.sliderValue);
            var res = await contractApi(dataArr);
            if(res.success){
                codeStatus(res.code,function(msg){
                    that.$message({
                        type:'success',
                        message:msg
                    })
                })
            }else{
                codeStatus(res.code,function(msg){
                    that.$message.error(msg)
                })
            }
        },
        handleIndex(){

        },
        changeNum(value){
            var that = this;
            var patrn = /^(0(\.\d*[1-9]+\d*)?)$|^([1-9]\d*)(\.\d*)?$/;
            if(!(patrn.test(value))){
                that.num = '';
                that.proportion = 0;
                return false;
            }else{
                var cnyPrice = value * 7.23;
                that.proportion = cnyPrice;
            }
        },
        addPrice(value) {//加限价最优价格
            // console.log(value);
        },
        addNum(value){//加数量
            var that = this;
            if(value == undefined){
                return;
            }else{
                var cnyPrice = value * 7.23;
                that.proportion = cnyPrice;
            }

        }
    },
    beforeDestroy(){
        clearInterval(this.wTimerList);
    },
    components:{
        OrderRecord,TradeView
    }
}
</script>
<style lang="less">
.transaction_div{
    border-top: 1px solid #3B3B3B;
    .greenColor{
        color: #6FC1A1
    }
    .redColor{
        color: #EC6543;
    }
    .transaction_left{
        height: 1300px;
        overflow-y: auto;
        &::-webkit-scrollbar{/*滚动条整体部分，可以设置宽度啥的**/
            width: 6px;
        }
        &::-webkit-scrollbar-thumb{/*滚动的滑块*/
            border-radius: 10px;
            box-shadow: inset 0 0 5px #575F67;
            -webkit-box-shadow: inset 0 0 5px #575F67;
            background: #575F67;
        }
        &::-webkit-scrollbar-track{/* 外层轨道*/
            border-radius: 10px;
            box-shadow: inset 0 0 5px #131722;
            -webkit-box-shadow: inset 0 0 5px #131722;
            background: #131722;
        }
        .hasPadding{
            padding: 20px 20px 0 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
            .el-form-item{
                margin-bottom: 0;
            }
        }
        .topBox{
            display: flex;
            flex-direction: row;
            margin-left: 60px;
            li{
                color: #8E8E8E;
                margin-right: 20px;
            }
            .getValue{
                color: #ffffff;
                margin:0 10px;
            }
        }

        .el-form-item__content{
            display: flex;
            flex-direction: row;
            align-items: center;
            .el-input__inner{
                border: none;
                background-color: transparent;
                outline: none;
            }
            .el-select{
                width: 120px;
            }
        }
    }
    .transaction_right{
        background-color: #1B1C27;
        padding: 20px 20px 60px 20px;
        .transaction_right_title{
            width: 100%;
            .right_title{
                width: 48%;
                display: inline-block;
                color: #8E8E8E;
                &:nth-child(2){
                    text-align: center;
                }
                &:nth-last-child(1){
                    text-align: right;
                }
                span{
                    display: block;
                }
            }
        }
        .entrustList{
            &>ul{
                width: 100%;
                li{
                    width: 100%;
                    padding: 0;
                    height: 30px;
                    line-height: 30px;
                    span{
                        width: 48%;
                        display: inline-block;
                        &:nth-child(2){
                            text-align: right;
                        }
                        &:nth-last-child(1){
                            color: #C3C3C3;
                            text-align: right;
                        }
                    }
                    .percenttd{
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        right: 0;
                        height: 30px;
                        .percentDiv{
                            position: absolute;
                            right: 0;
                            width: 40%;
                            height: 100%;
                        }
                    }
                }
            }
        }
        .conversion{
            text-align: center;
            height: 40px;
            line-height: 40px;
            border-top: 1px solid #3B3B3B;
            border-bottom: 1px solid #3B3B3B;
            span{
                margin-right: 10px;
            }
        }
        .riseList{
            li{
                position: relative;
                top: 0;
                left: 0;
                span{
                    &:nth-child(1){
                        color: #6FC1A1;
                    }
                }
                .percenttd{
                    .percentDiv{
                       background-color: #6FC1A1;
                       opacity: .4;
                    }
                }
            }
        }
        .fallList{
            li{
                position: relative;
                top: 0;
                left: 0;
                span{
                    &:nth-child(1){
                        color: #EC6543;
                    }
                }
                .percenttd{
                    .percentDiv{
                       background-color:#EC6543 !important;
                       opacity: .4;
                    }
                }
            }
        }
        .transtionBar{
            text-align: center;
            .el-tabs__nav{
                display: contents;
                &>div:nth-child(2).is-active{
                    background: url(../assets/left-active.png) no-repeat;
                    background-size: 100% 100%;
                }
                &>div:nth-child(3).is-active{
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
                    &:nth-child(3){
                        background: url(../assets/right.png) no-repeat;
                        background-size: 100% 100%;
                        width: 120px;
                    }
                }
            }
        }
        .transaction_right_div{
            margin-top: 30px;
            border-top: 1px solid #3B3B3B;
            padding: 20px 0;
            .priceBox{
                display: flex;
                flex-direction: column;
                .el-input.is-disabled .el-input__inner {
                    background-color: transparent;
                    border: 1px solid #3B3B3B;
                }
                &>.el-input.is-disabled{
                    margin-top: 20px;
                }
                .upNum{
                    margin-top: 20px;
                    .el-input__inner{
                        background-color: transparent;
                        border: 1px solid #3B3B3B;
                        color: #ffffff;
                    }
                }

                .el-input-number{
                    width: 100%;
                    margin-top: 20px;
                    .el-input-number__decrease,.el-input-number__increase{
                        border: none;
                        background-color: transparent;
                        &:hover{
                            color: #2d60e0;
                        }
                        i{
                            color: #ffffff;
                        }
                    }
                    .el-input__inner{
                        background-color: transparent;
                        border: 1px solid #3B3B3B;
                        padding-left: 20px;
                        text-align: left;
                        color: #ffffff;
                    }
                    .el-input-number__decrease{
                        right: 40px;
                        left: auto;
                    }
                }
            }
            .radioBlock{
                display: flex;
                flex-direction: row;
                &>div{
                    display: flex;
                    flex-direction: row;
                }
                .line{
                    width: 40px;
                    display: inline-block;
                    background-color: #8E8E8E;
                    height: 2px;
                    margin: 6px 12px 0 8px;
                }
                .el-radio{
                    margin-right:0;
                    .el-radio__inner{
                        background-color: #8E8E8E;
                        width: 10px;
                        height: 10px;
                        border: none;
                    }
                    .el-radio__label{
                        display: block;
                        padding: 10px 0 0 0;
                        color: #8E8E8E;
                    }
                    .el-radio__input.is-checked .el-radio__inner,.el-radio__input.is-checked .el-radio__inner{
                        color:#6FC1A1;
                        border-color:#fff;
                        background: #ffffff;
                        width: 20px;
                        height: 20px;
                    }
                    .el-radio__input.is-checked .el-radio__inner::after{
                        background:#6FC1A1;
                        width: 10px;
                        height: 10px;
                    }
                }
            }
            .bondClass{
                p{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    span{
                        &:nth-child(1){
                            color: #8E8E8E;
                        }
                    }
                }
            }
            .lastBtn{
                margin-top: 20px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                button{
                    width: 44%;
                }
                .buyBtn{
                    background: #6FC1A1!important;
                    color:#fff !important;
                    border:1px solid #6FC1A1!important;
                    // margin-right: 26px;
                }
                .sellBtn{
                    background: #EC6543!important;
                    color:#fff !important;
                    border:1px solid #EC6543!important;
                }
            }
        }
    }
}
</style>
