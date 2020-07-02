<template>
	<div class="trasfer_div">
		<!--借币-->
		<el-row :gutter="60">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-form ref="form" :model="form">
        	<el-form-item class="alignment" :label="$t('recharge.select')">
            <img :src="coinImgAdd" alt="" />
            <el-select v-model="form.region" :placeholder="$t('form.select')" @change="selectCoin">
              <el-option v-for="item in coinArr" :key="item.id" :value="item">
                <img v-if="item == 'USDT-ERC20' || item == 'USDT-OMIN'" src="../assets/USDT.png" />
                <img v-else :src="require('../assets/'+ item +'.png')" />
                <span>{{item}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('borrow.borrowNumber')" prop="number" :rules="[{ required: true, message: $t('withdraw.numEmpty')}]">
            <el-input v-model="form.number" :placeholder="$t('withdraw.numEmpty')"></el-input>
          </el-form-item>
					<div style="margin-bottom:20px">
            <div class="betweenSpread">
              <p>{{$t('borrow.cashDeposit')}}：{{totalPrice}} USDT </p>
              <p>{{$t('borrow.monthlyInterestRate')}}：{{accrual}} % </p>
            </div>
            <div class="betweenSpread">
              <p>{{$t('borrow.exhaustedCredit')}}：{{haveBorrowPrice}} USDT </p>
              <p>{{$t('borrow.usable')}}：{{mayBorrowPrice}} USDT </p>
            </div>
					</div>
					<el-form-item :label="$t('recharge.asset')" :rules="[{ required: true, message: $t('recharge.assetEmpty')},{pattern:/^[0-9]{6}$/,message:$t('form.assetsCruent'),trigger:'blur'}]" prop="asset">
            <el-input v-model="form.asset" :type="passwordType ? 'text' : 'password'" autocomplete="off" :placeholder="$t('recharge.assetEmpty')">
              <img class="eye" :src="eyeImg" slot="suffix" alt="" @click="handleEye" />
            </el-input>
          </el-form-item>
					<el-button class="themeBtn" @click="submitFun('form')">{{$t('button.ok')}}</el-button>
				</el-form>
        	</el-col>
        	<el-col :xs="24" :sm="24" :md="12" :lg="12">
        		<div class="tipBox">

        		</div>
        	</el-col>
        </el-row>
    	<el-table class="fishTable" :data="tableData" :empty-text="$t('tip.noRecord')">
        <el-table-column prop="typeTxt" :label="$t('table.type')"></el-table-column>
        <el-table-column prop="flowPrice" :label="$t('table.num')"></el-table-column>
        <el-table-column prop="createTime" :label="$t('table.time')"></el-table-column>
      </el-table>
    <pageTotal v-if="page.total > 10" :page="page" @pageChange="pageChange"></pageTotal>

	</div>
</template>
<script>
import pageTotal from '@/components/pageTotal'
import { borrowInfoApi, borrowApi,assetsRecordApi } from '@/api/getData'
import codeStatus from '@/config/codeStatus'
export default {
 data(){
   return {
     coinArr: ['USDT', 'BTC'],
     coinImgAdd: require('../assets/USDT.png'),
     form: {
       region: 'USDT',
       money: '',
       number: '',
       account: '',
       asset: '',
     },
     passwordType: false,
     eyeArr: [
       {
         img: require('../assets/eye_close.png')
       },
       {
         img: require('../assets/eye_open.png')
       }
     ],
     eyeImg: require('../assets/eye_close.png'),
     tableData: [],
     page: {
       currentPage: 1,
       limit: 10,
       total: 0,
     },
     totalPrice: 0, //总资产
     accrual: 0, //利息
     haveBorrowPrice: 0, //已借数量
     mayBorrowPrice: 0 //可借数量
   }
	},
	created(){
		this.formFun();
	},
	mounted(){
		this.recordFun();
	},
	methods:{
		async formFun(){//获取信息
			var that = this;
      var dataArr = new URLSearchParams();
      dataArr.set('type',that.form.region);
			var res = await borrowInfoApi(dataArr);
			if(res.success){
				var obj = res.data;
				that.totalPrice = obj.totalPrice;
				that.accrual = obj.accrual;
        that.haveBorrowPrice = obj.haveBorrowPrice;
        that.mayBorrowPrice = obj.mayBorrowPrice;
			}
		},
		submitFun(form){//提交借币
			var that = this;
			that.$refs[form].validate(async (valid) => {
				if(valid){
					var dataArr = new URLSearchParams();
					dataArr.set('numbers',that.form.number);
					dataArr.set('type',that.form.region);
          dataArr.set('payPwd',that.form.asset);
					var res = await borrowApi(dataArr);
					if(res.success){
						that.$message({
							type:'success',
							message:that.$t('tip.submitTxt')
						});
						that.$refs[form].resetFields();
						that.page.currentPage = 1;
						that.recordFun();
					}else{
						codeStatus(res.code,function(msg){
							that.$message.error(msg)
						})
					}
				}
			})
		},
		handleEye(){//显示隐藏密码
      var that = this;
      that.passwordType = !that.passwordType;
      if(that.passwordType){
          that.eyeImg = that.eyeArr[1].img
      }else{
          that.eyeImg = that.eyeArr[0].img
      }
		},
		async recordFun(){//转账记录
			var that = this;
			var dataArr = new URLSearchParams();
			dataArr.set('type','BORROW');
      dataArr.set('current',that.page.currentPage);
			dataArr.set('size',that.page.limit);
			var res = await assetsRecordApi(dataArr);
			that.tableData = [];
			if(res.success){
				that.page.total = Number(res.data.total);
        var obj = res.data.records.records;
				if(obj.length>0){
					obj.forEach(element => {
						element.typeTxt = element.name
						element.price = Number(element.price).toFixed(2);
            // createTime
						that.tableData.push(element)
					});
				}
			}else{
				codeStatus(res.code,function(msg){
					that.$message.error(msg)
				})
			}
		},
		pageChange(item){
			this.page.currentPage = item;
			this.recordFun();
		},
        handleClick(){

        },
    selectCoin(value){
      if(value == 'USDT-ERC20' || value == 'USDT-OMIN'){
        this.coinImgAdd = require('../assets/USDT.png')
      }else{
        this.coinImgAdd = require('../assets/'+ value +'.png')
      }
    }
	},
	components:{
        pageTotal
    }
}
</script>

<style lang="less">
.trasfer_div{
	.el-row{
		background-color: #1C1C27;
		padding: 20px 0;
		margin: 20px 0 40px 0!important;
	}
  .alignment{
    .el-form-item__content{
      display: flex;
      flex-direction: row;
      align-items: center;
      &>img{
        padding-right: 8px;
      }
    }
  }
	.el-form-item{
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		border:1px solid #3B3B3B;
		padding:10px;
		border-radius:4px;
		.el-form-item__label{
			text-align: left;
		}
		.el-form-item__content{
			.el-select{
				width: 94%;
			}
		}
		.el-input-group__append{
			border: none!important;
			background-color: transparent;
		}
		.el-input__inner{
			border: none;
			background-color: transparent;
			padding: 0;
		}
	}
	p{
		margin: 0;
		color: #8E8E8E;
	}
	.el-button{
		width: 100%;
		margin: 20px 0;
	}
}
</style>
