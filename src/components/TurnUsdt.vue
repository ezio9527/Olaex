<template>
	<div class="Turn_div">
		<!--资产划转-->
		<el-row :gutter="60">
			<el-col :xs="24" :sm="24" :md="12" :lg="12">
				<el-form ref="form" :model="form">
		           	<el-form-item class="title" prop="region">
		           		<div class="content">
		           			<img src="../assets/USDT.png" alt="" />
							<span>USDT</span>
		           		</div>
					    <p>{{$t('trasfer.available')}} {{abiliyPrice}} USDT </p>
					</el-form-item>
					<div class="transfer_box">
						<div class="exchangBtn" @click="changeBoxFun"><img src="../assets/exchangeIcon.png" /></div>
						<div class="exchangContent">
							<el-form-item>
								<p>{{$t('contract.from')}}：</p>
								<el-select v-model="form.fromValue" @change="selectFrom">
									<el-option v-for="item in getFromArr" :key="item.id" :label="item" :value="item"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<p>{{$t('contract.to')}}：</p>
								<el-select v-model="form.toValue" @change="selectTo">
									<el-option v-for="item in getToArr" :key="item.id" :label="item" :value="item"></el-option>
								</el-select>
							</el-form-item>
						</div>
					</div>

					<el-form-item :label="$t('trasfer.turn')" :rules="[{ required: true, message: $t('trasfer.turnEmpty')},{pattern:/^(0(\.\d*[1-9]+\d*)?)$|^([1-9]\d*)(\.\d*)?$/,message:$t('trasfer.turnEmpty'),trigger:'blur'}]" prop="number">
	                    <el-input v-model="form.number" autocomplete="off" :placeholder="$t('trasfer.turnEmpty')">
	                    <template slot="append">USDT</template>
	                    </el-input>
	                </el-form-item>
						
					<el-button @click="submitFun('form')" class="themeBtn">{{$t('trasfer.sureTurn')}}</el-button>
				</el-form>
			</el-col>
        	<el-col :xs="24" :sm="24" :md="12" :lg="12">
        		<div class="tipBox">
        			
        		</div>
        	</el-col>
        </el-row>
	</div>

</template>

<script>
import codeStatus from '@/config/codeStatus'
import { convertPageApi,convertApi } from '@/api/getData'
export default {
    data(){
        return{
        	form:{
        		region:'USDT',
				number:'',
				fromValue:'',
				toValue:''
        	},
			getTotalArr:[],
			getFromArr:[],
			getToArr:[],
			abiliyPrice:0
        }
	},
	computed:{
		getTotal(){
			var arr = [this.$t('assets.wallet'),this.$t('assets.contact'),this.$t('assets.currency')];
			this.getTotalArr = arr;
			return arr
		},
		getFrom(){
			var arr = [this.$t('assets.wallet'),this.$t('assets.contact'),this.$t('assets.currency')];
			this.getFromArr = arr;
			return arr
		},
		getTo(){
			var arr = [this.$t('assets.contact'),this.$t('assets.currency')];
			this.getToArr = arr;
			return arr
		},
		getFromValue(){
			return this.form.fromValue
		}
	},
	watch:{
		getFromValue(newValue){
			this.formFun();
		}
	},
	created(){
		var that = this;
		that.form.fromValue = that.getFrom[0];
		that.form.toValue = that.getTo[0]
	},
	mounted(){
		var that = this;
		
	},
	methods:{
		changeBoxFun(){
			var that = this;
			var fromArr = that.getFromArr;
			var toArr = that.getToArr;

			that.getFromArr = toArr;
			that.getToArr = fromArr;
			
			var formValueTxt = that.form.fromValue;
			var toValueTxt = that.form.toValue;
			


			that.form.fromValue = toValueTxt;
			that.form.toValue = formValueTxt;
		},
		async formFun(){//获取信息
			var that = this;
			if(that.form.typeTxt != ''){
				var typeTxt = '';
				if(that.form.fromValue == '钱包' || that.form.fromValue == 'Wallet' || that.form.fromValue == '錢包'){
					typeTxt = 'WALLET';
				}else if(that.form.fromValue == '合约' || that.form.fromValue == 'Contract' || that.form.fromValue == '合約'){
					typeTxt = 'CONTRACT';
				}else if(that.form.fromValue == '法币' || that.form.fromValue == 'Legal currency' || that.form.fromValue == '法幣'){
					typeTxt = 'LEGAL';
				}
				var dataArr = new URLSearchParams();
				dataArr.set('type',that.form.region);
				dataArr.set('from',typeTxt);
				var res = await convertPageApi(dataArr);
				if(res.success){
					var obj = res.data;
					that.abiliyPrice = (obj.price).toFixed(2)
				}else{
					codeStatus(res.code,function(msg){
						that.$message.error(msg)
					})
				}
			}
			
		},
		submitFun(form){//提交划转
			var that = this;
			that.$refs[form].validate(async (valid) => {
				if(valid){
					var dataArr = new URLSearchParams();
					var typeTxt = '';
					if(that.form.fromValue == '钱包' || that.form.fromValue == 'Wallet' || that.form.fromValue == '錢包'){
						typeTxt = 'WALLET';
					}else if(that.form.fromValue == '合约' || that.form.fromValue == 'Contract' || that.form.fromValue == '合約'){
						typeTxt = 'CONTRACT';
					}else if(that.form.fromValue == '法币' || that.form.fromValue == 'Legal currency' || that.form.fromValue == '法幣'){
						typeTxt = 'LEGAL';
					}
					var toTypeTxt = '';
					if(that.form.toValue == '钱包' || that.form.toValue == 'Wallet' || that.form.fromValue == '錢包'){
						toTypeTxt = 'WALLET';
					}else if(that.form.toValue == '合约' || that.form.toValue == 'Contract' || that.form.fromValue == '合約'){
						toTypeTxt = 'CONTRACT';
					}else if(that.form.toValue == '法币' || that.form.toValue == 'Legal currency' || that.form.fromValue == '法幣'){
						toTypeTxt = 'LEGAL';
					}
					dataArr.set('type',that.form.region);
					dataArr.set('from',typeTxt);
					dataArr.set('to',toTypeTxt);
					dataArr.set('numbers',that.form.number);
					var res = await convertApi(dataArr);
					if(res.success){
						that.$message({
							type:'success',
							message:that.$t('assets.trasferSuccess')
						})
						that.$refs[form].resetFields();
					}else{
						codeStatus(res.code,function(msg){
							that.$message.error(msg)
						})
					}
				}
			})
		},
		selectFrom(value){//选择from
			var that = this;
			var filtered  = (that.getTotal).filter(function(element){
				return element != value
			})
			that.getToArr = filtered;
			if(value == that.form.toValue){
				
				that.form.toValue = filtered[0];
				
			}
			
			
		},
		selectTo(value){//选择To
			var that = this;
			var filtered  = (that.getTotal).filter(function(element){
				return element != value
			})
			that.getFromArr = filtered;
			if(value == that.form.fromValue){
				
				that.form.fromValue = filtered[0];
				
			}
		},
	},
}
</script>

<style lang="less">
.Turn_div{
	.el-row{
		background-color: #1C1C27;
		padding: 20px 0;
		margin: 20px 0 40px 0!important;
	}
	.title{
		border: none!important;
		padding: 0!important;
		margin: 0;
		.content{
			display: flex;
			flex-direction: row;
			align-items: center;
			&>img{
				padding-right: 8px;
			}
		}
		.el-form-item__content{
			&::after,&::before{
				display: none!important;
			}
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 0;
			p{
				color:#8E8E8E
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
		.el-input-group__append{
			border: none!important;
			background-color: transparent;
			cursor: pointer;
		}
		.el-input__inner{
			border: none;
			background-color: transparent;
			padding: 0;
		}
	}
	.el-button{
		width: 100%;
		margin: 20px 0;
	}
	/*划转*/
	.transfer_box{
		position: relative;
		top: 0;
		margin-bottom: 20px;
		display: flex;
		flex-direction: row;
		.exchangContent{
			position: relative;
			top: 0;
			left: 106px;
			width: 80%;
			.el-form-item{
				padding: 1.5px;
				.el-form-item__content{
					display: flex;
					flex-direction: row;
					align-items: center;
					p{
						margin: 0;
						padding:0 10px ;
					}
				}
			}
			.el-select{
				width: 100%;
			}
		}
		.exchangBtn{
			position: absolute;
			top: 0;
			background-color: #222732;
			padding: 22px;
			z-index: 99;
			border-radius: 4px 0 0 4px;
			cursor: pointer;
		}
	}
}
</style>