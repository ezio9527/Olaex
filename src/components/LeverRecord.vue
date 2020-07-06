<template>
    <div class="contract_record_div">
        <el-tabs class="transtionBar" v-model="activeIndex" @tab-click="handleIndex">
            <el-tab-pane :label="$t('lever.trust')" name="0"></el-tab-pane>
            <el-tab-pane :label="$t('lever.buy')" name="1"></el-tab-pane>
            <el-tab-pane :label="$t('lever.sell')" name="2"></el-tab-pane>
            <el-tab-pane :label="$t('lever.position')" name="3"></el-tab-pane>
        </el-tabs>

        <el-table class="fishTable" :data="tableData" :empty-text="$t('tip.noRecord')">
            <el-table-column width="90" prop="symbols" :label="$t('lever.pair')"></el-table-column>
            <el-table-column prop="compactType" :label="$t('lever.type')">
                <template slot-scope="scope">
                    {{scope.row.compactType == 'BUY' ? $t('transaction.buy') : $t('transaction.sell')}}
                </template>
            </el-table-column>
            <el-table-column width="60" prop="leverName" :label="$t('lever.lever')"></el-table-column>
            <!-- v-if="activeIndex == '0'" -->
            <!-- 盈亏 -->
            <el-table-column width="160" prop="pl" :label="$t('lever.profile')">
                <template slot-scope="scope">
                    <span class="greenColor" v-if="scope.row.pl>0 ">{{(scope.row.pl).toFixed(2)}}{{scope.row.computedPirce}}</span>
                    <span class="redColor" v-else>{{(scope.row.pl).toFixed(2)}}{{scope.row.computedPirce}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="positionPrice" :label="$t('lever.bond')"></el-table-column>
            <el-table-column prop="tradePrice" v-if="activeIndex == '0'  || activeIndex == '2' " :label="$t('lever.average')"></el-table-column>
            <el-table-column prop="unit" v-if="activeIndex == '0'" :label="$t('lever.current')"></el-table-column>
            <el-table-column prop="exitPrice" v-if="activeIndex == '2'" :label="$t('transaction.averagePrice')">

            </el-table-column>
            <el-table-column prop="totalPrice" :label="$t('lever.total')"></el-table-column>
            <el-table-column prop="numbers" :label="$t('lever.num')"></el-table-column>
            <el-table-column prop="fee" :label="$t('lever.fee')"></el-table-column>

            <div v-if="activeIndex == '2'">
                <el-table-column prop="stopProfit" :label="$t('lever.proPrice')">
                    <template slot-scope="scope">
                        {{(scope.row.stopProfit)}}
                    </template>
                </el-table-column>
                <el-table-column prop="stopLoss" :label="$t('lever.lossPrice')">
                    <template slot-scope="scope">
                        {{(scope.row.stopLoss)}}
                    </template>
                </el-table-column>
                <el-table-column prop="exitType" :label="$t('transaction.averageType')"></el-table-column>
            </div>

            <div v-if="activeIndex != '2'">
                <el-table-column prop="compactId" :label="$t('lever.operation')">
                    <template slot-scope="scope">
                        <div class="operation_div" v-if="activeIndex == '0'">
                            <span @click="setPrice(scope.row.compactId)">{{$t('transaction.updateContract')}}</span>
                            <span @click="averageFun(scope.row.compactId)">{{$t('transaction.average')}}</span>
                        </div>
                        <div class="operation_div" v-if="activeIndex == '1'">
                            <span @click="cancelEntrustFun(scope.row.compactId)">{{$t('assets.cancelEntrust')}}</span>
                        </div>
                    </template>
                </el-table-column>
            </div>
        </el-table>
        <pageTotal v-if="page.total > 10" :page="page" @pageChange="pageChange"></pageTotal>

        <!-- 设置止盈止损弹窗 -->
        <el-dialog
            :visible.sync="setProfit"
            :close-on-click-modal="false"
            :before-close="setAverageCancel"
            width="20%"
            class="dialogPadding"
            :title="$t('transaction.updateContract')">
            <el-form :model="form" ref="form">
                 <!-- :rules="[{ required: true, message: $t('form.profileEmpty')}]" prop="profile" -->
                <el-form-item :label="$t('lever.proPrice')" prop="profile">
                    <el-input v-model="form.profile" autocomplete="off" :placeholder="$t('form.profileEmpty')"></el-input>
                </el-form-item>
                 <!-- :rules="[{ required: true, message: $t('form.lossEmpty')}]" prop="loss" -->
                <el-form-item :label="$t('lever.lossPrice')" prop="loss">
                    <el-input v-model="form.loss" autocomplete="off" :placeholder="$t('form.lossEmpty')"></el-input>
                </el-form-item>
                <div class="lastBtn">
                    <el-button class="transBtn" @click="setAverageCancel">{{$t('button.cancel')}}</el-button>
                    <el-button class="themeBtn" @click="setProfitFun('form')">{{$t('button.ok')}}</el-button>
                </div>
            </el-form>
		</el-dialog>

        <!-- 确认平仓弹窗 -->
        <el-dialog
            :visible.sync="sureAverage"
            :close-on-click-modal="false"
            :before-close="closeCancel"
            width="20%"
            class="dialogPadding"
            :title="$t('transaction.average')">
            <div class="average_content">
                <div class="title">
                    <span :class="averageContent.compactType == 'BUY' ? 'greenColor' : 'redColor'">{{averageContent.compactType == 'BUY' ? $t('transaction.buy') : $t('transaction.sell')}}  {{averageContent.leverName}}</span>
                    <span style="color:#fff;">{{averageContent.symbols}}</span>
                </div>
                <ul>
                    <li>
                        <!-- 当前盈亏 -->
                        <span>{{$t('lever.profile')}}</span>
                        <span :class="(averageContent.pl) >0 ? 'greenColor' : 'redColor'">{{(averageContent.pl).toFixed(2)}}{{'('+(((averageContent.pl)/((averageContent.positionPrice)*(averageContent.leverRate)))*100).toFixed(2)+'%)'}}</span>
                    </li>
                    <li>
                        <!-- 开仓价 -->
                        <span>{{$t('lever.average')}}</span>
                        <span>{{Number(averageContent.tradePrice).toFixed(2)}}</span>
                    </li>
                    <li>
                        <!-- 当前价 -->
                        <span>{{$t('lever.current')}}</span>
                        <span>{{Number(averageContent.unit).toFixed(2)}}</span>
                    </li>
                    <li>
                        <!-- 手续费 -->
                        <span>{{$t('lever.fee')}}</span>
                        <span>{{Number(averageContent.fee).toFixed(1)}}</span>
                    </li>
                </ul>
            </div>
            <div class="lastBtn">
                <el-button class="transBtn" @click="sureAverage = false">{{$t('button.cancel')}}</el-button>
                <el-button class="themeBtn" @click="setAverageFun('form')">{{$t('button.ok')}}</el-button>
            </div>
		</el-dialog>
    </div>
</template>
<script>
import codeStatus from '@/config/codeStatus'
import pageTotal from '@/components/pageTotal'
import { contractListApi,cancelListApi,outContractApi,contractPlApi } from '@/api/getData'
export default {
    inject:['reload'],
    data(){
        return{
            activeIndex:'0',
            tableData:[],
            form:{
                profile:'',
                loss:'',
            },
            page:{
                currentPage:1,
                limit:8,
                total:0,
            },
            setProfit:false,
            sureAverage:false,
            averageId:'',
            priceId:'',
            averageContent:{
                pl:0,
                tradePrice:0,
                unit:0,
                fee:0,
                positionPrice:0,
                leverRate:0,
            },
            timer:null,
            averageTime:null
        }
    },
    mounted(){
        var that = this;
        that.timer = setInterval(function(){
            that.recordFun()
        },1000)
    },
    methods:{
        async recordFun(){
            var that = this;
            var dataArr = new URLSearchParams();
            var type = '';
            if(that.activeIndex == '0'){
                type = 'N'
            }else if(that.activeIndex == '1'){
                type = 'IN'
            }else if(that.activeIndex == '2'){
                type = 'Y'
            }
            dataArr.set('type',type);
            dataArr.set('current',that.page.currentPage);
            dataArr.set('size',that.page.limit);
            var res = await contractListApi(dataArr);
            that.tableData = [];
            if(res.success){
                that.page.total = Number(res.data.total);
                var obj = res.data.records;

                obj.forEach(element => {
                    var num = (element.pl) + '';
                    var price = Number(num.substring(0,num.indexOf(".") + 3));
                    element.pl = price;
                    element.computedPirce = ('('+(((price / ((element.positionPrice)*(element.leverRate)) ))*100).toFixed(2)+'%)');
                    element.positionPrice = (element.positionPrice).toFixed(1);
                    element.tradePrice = (element.tradePrice).toFixed(2);//开仓价
                    element.unit = (element.unit).toFixed(2);//当前价
                    if(that.activeIndex == '2'){
                        element.exitPrice = (element.exitPrice).toFixed(2);//平仓价
                    }
                    element.totalPrice = (element.totalPrice).toFixed(1);//交易总额
                    element.numbers = (element.numbers).toFixed(1);//交易数量
                    element.fee = (element.fee).toFixed(2);//手续费
                    element.stopProfit == '' ?  element.stopProfit = '--' : element.stopProfit = (element.stopProfit).toFixed(2);
                    if(element.stopLoss == ''){
                        element.stopLoss = '--'
                    }else{
                        element.stopLoss = (element.stopLoss).toFixed(2)
                    }
                    var exitType = '';
					switch (element.exitType){
						case 'HANDLE':
							exitType = that.$t('assets.handWarehouse');
							break;
						case 'FIXED':
							exitType = that.$t('assets.forceWarehouse');
							break;
						case 'PROFIT':
							exitType = that.$t('assets.profileWarehouse');
							break;
						case 'LOSS':
							exitType = that.$t('assets.lossWarehouse');
							break;
						default:
							break;
                    }
                    element.exitType = exitType;
                    that.tableData.push(element)
                });

            }
            // else{
            //     codeStatus(res.code,function(msg){
            //         that.$message.error(msg)
            //     })
            // }
        },
        handleIndex(){//标题切换
            this.page.currentPage = 1;
            this.recordFun();
            if(this.activeIndex == '2'){
                clearInterval(this.timer)
            }
        },
        pageChange(item){
            this.page.currentPage = item;
            this.recordFun();
        },
        averageFun(id){//点击平仓获取id
            var that = this;
            that.sureAverage = true;
            that.averageTime = setInterval(function(){
                var arr = that.tableData;
                var obj = {};
                arr.forEach(element => {
                if(id == element.compactId){
                        var num = (element.pl) + '';
                        var price = Number(num.substring(0,num.indexOf(".") + 3));
                        element.pl = price;
                        obj = element
                }
                });
                that.averageContent = obj;
            },1000)
            that.averageId = id;
        },
        setPrice(id){//点击止盈止损获取id
            var that = this;
            that.setProfit = true;
            that.priceId = id;
        },
        async setAverageFun(){//确认平仓
            var that = this;
            var dataArr = new URLSearchParams();
            dataArr.set('compactId',that.averageId);
            var res = await outContractApi(dataArr);
            that.resultFun(res,1)
        },
        setProfitFun(form){//设置止盈止损
            var that = this;
            that.$refs[form].validate(async (valid) => {
                if(valid){
                    var dataArr = new URLSearchParams();
                    dataArr.set('compactId',that.priceId);
                    dataArr.set('stopProfit',that.form.profile);
                    dataArr.set('stopLoss',that.form.loss);
                    if(that.form.profile == '' && that.form.loss == ''){
                        that.setProfit = false;
                        that.$refs[form].resetFields();
                        return false;
                    }else{
                        var res = await contractPlApi(dataArr);
                        that.resultFun(res,2)
                    }
                }
            })
        },
        setAverageCancel(){
            this.setProfit = false;
            this.$refs.form.resetFields();
        },
        closeCancel(){
            this.sureAverage = false;
            clearInterval(this.averageTime);
        },
        async cancelEntrustFun(id){//撤销委托
            var that = this;
            var dataArr = new URLSearchParams();
            dataArr.set('compactId',id);
            var res = await cancelListApi(dataArr);
            that.resultFun(res)
        },
        resultFun(res,type){
            var that = this;
            if(res.success){
                if(type == 1){
                    that.$message({
                        type:'success',
                        message:that.$t('transaction.averageSuccess')
                    })
                }else{
                    codeStatus(res.code,function(msg){
                        that.$message({
                            type:'success',
                            message:msg
                        })
                    })
                }
                that.reload();
            }else{
                codeStatus(res.code,function(msg){
                    that.$message.error(msg)
                })
            }
        }
    },

    beforeDestroy(){
        clearInterval(this.timer);
        clearInterval(this.averageTime);
    },
    components:{
        pageTotal,
    }
}
</script>
<style lang="less">
.contract_record_div{
    .el-tabs__header{
        border-bottom: 1px solid #3b3b3b;
        margin-bottom: 40px;
    }
    .greenColor{
        color: #6FC1A1!important;
    }
    .redColor{
        color: #EC6543!important;
    }
    .operation_div{
        span{
            cursor: pointer;
            display: block;
            color: #87D8EA;
            &:nth-last-child(1){
                margin-right: 10px;
            }
        }
    }
    .average_content{
        margin: 20px 0;
        .title{
            text-align: center;
            span{
                margin-right: 10px;
            }
        }
        ul{
            li{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                line-height: 30px;
                span{
                    &:nth-child(1){
                        color: #8E8E8E;
                    }
                    &:nth-last-child(1){
                        color: #ffffff;
                    }
                }
            }
        }
    }
    .lastBtn{
        button{
            width: 47.6%;
        }
    }
}
</style>
