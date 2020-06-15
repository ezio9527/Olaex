<template>
    <div class="legal_div">
        <div class="container">
            <h2>{{$t('legal.title')}}</h2>
            <div class="content">
                <div class="leftSpread">
                    <img src="../assets/USDT.png" alt="" /><span>USDT</span>
                </div>
                <el-form el-form :model="ruleForm" ref="ruleForm">
                     <!-- :rules="[{ required: true, message: $t('legal.money')}]" -->
                    <el-form-item prop="legalNumber">
                        <el-input type="number" readonly class="noRight" v-model="ruleForm.legalNumber" autocomplete="off" :placeholder="$t('legal.money')" @input="getValue">
                            <template slot="append">CNY</template>
                        </el-input>
                    </el-form-item>
                    <div class="betweenSpread">
                        <p>{{$t('legal.price')}} ≈ {{price}} CNY/USDT</p>
                        <p>{{$t('contract.num')}}：{{num}} USDT</p>
                    </div>
                    <el-button @click="submitFun('ruleForm')" class="themeBtn">{{$t('legal.title')}}</el-button>
                </el-form>
 
                <el-table class="fishTable" :data="tableData" :empty-text="$t('tip.noRecord')">
                    <el-table-column prop="createTime" :label="$t('table.time')"></el-table-column>
                    <el-table-column prop="price" :label="$t('table.money')"></el-table-column>
                    <el-table-column prop="numbers" :label="$t('table.number')"></el-table-column>
                    <el-table-column prop="status" :label="$t('table.status')">
                        <template slot-scope="scope">
                            <p :class="scope.row.status == 'Y' ? 'greenColor' : 'redColor'">{{scope.row.status == 'Y' ? $t('legal.successTxt') : $t('legal.waitTxt') }}</p>
                        </template>
                    </el-table-column>
                </el-table>
                <page-total v-if="page.total > 10" :page="page" @pageChange="pageChange"></page-total>
            </div>
        </div>
        <Foot />
    </div>
</template>
<script>
import pageTotal from '@/components/pageTotal'
import Foot from '@/components/Foot'
import { legalInformApi,buyLegalApi,buyLegalRecordApi } from '@/api/getData'
import codeStatus from '@/config/codeStatus'
export default {
    inject:['reload'],
    data(){
        return{
            ruleForm:{
                legalNumber:'',
            },
            price:'',
            num:0,
            min:'',
            page:{
                currentPage:1,
                limit:10,
                total:0,
            },
            tableData:[]
        }
    },
    created(){
        var that = this;
        that.legalInformFun();
    },
    methods:{
        async legalInformFun(){//法币信息
            var that = this;
            var res = await legalInformApi();
            if(res.code == 200){
                var obj = res.data;
                that.price = obj.unit;
                that.min = Number(obj.min);
                that.recordFun();
            }
        },
        getValue(value){//获取输入框的值，计算USDT的交易数量
            var that = this;
            var value = Number(value);
            var price = Number(that.price);
            var computerPrice = value / price;
			that.num = ((computerPrice).toFixed(2));
        },
        submitFun(ruleForm){//购买法币
            var that = this;
            that.$message(that.$t('tip.develop'))
            // that.$refs[ruleForm].validate(async (valid)=>{
            //     if(valid){
            //         if(Number(that.ruleForm.legalNumber) < 0){
            //             that.$message.error(that.$t('legal.money'));
            //             return false;
            //         }
            //         var data = new URLSearchParams();
            //         data.set('numbers',that.ruleForm.legalNumber);
            //         var res = await buyLegalApi(data);
            //         if(res.success){
            //             window.open(res.data);
            //         }else{
            //             codeStatus(res.code,function(msg){
            //                 that.$message.error(msg);
            //             })
            //         }
            //     }
            // })
        },
        async recordFun(){
            var that = this;
            var dataArr = new URLSearchParams();
            dataArr.set('current',that.page.currentPage);
            dataArr.set('size',that.page.limit);
            var res = await buyLegalRecordApi(dataArr);
            that.tableData = [];
            if(res.code == 200){
                that.page.total = Number(res.data.total);
                var obj = res.data.records;
                obj.forEach(element => {
                   element.price =  (element.price).toFixed(2)+' CNY';
                   element.numbers =  (element.numbers).toFixed(2)+' USDT'
                });
                that.tableData = obj;
            }
        },
        pageChange(item){//切换页码
			var that = this;
            that.page.currentPage = item;
            that.recordFun();
        },
    },
    components:{
        pageTotal,Foot
    },
}
</script>
<style lang="less">
.legal_div{
    h2{
        font-weight: initial;
        font-size: 28px;
        
    }
    .content{
        border-top: 1px solid #3B3B3B;
        padding: 20px 0;
        &>.leftSpread{
            margin-bottom: 20px;
            img{
                margin-right: 10px;
            }
        }
    }
    .el-form{
        width: 520px;
        button{
            width: 100%;
        }
        .el-form-item{
            margin-bottom: 0;
        }
        .themeBtn{
            margin-top: 40px;
        }
    }
    .fishTable{
        margin: 60px 0;
    }
    .greenColor{
        color: #6FC1A1;
    }
    .redColor{
        color: #EC5E45;
    }
}
</style>