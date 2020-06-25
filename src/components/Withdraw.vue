<template>
	<div class="withdraw_div">
		<el-row :gutter="60">
			<el-tabs class="transtionBar" v-model="activeIndex" @tab-click="handleIndex">
                <el-tab-pane :label="$t('assets.withdraw')" name="0"></el-tab-pane>
                <el-tab-pane :label="$t('withdraw.addressEditor')" name="1"></el-tab-pane>
            </el-tabs>
        	<el-col :xs="24" :sm="24" :md="12" :lg="12">
        		<el-form ref="form" :model="form">
		           	<el-form-item class="alignment" :label="$t('recharge.select')">
		           		<img :src="coinImgAdd" alt="" />
					    <el-select v-model="form.region" :placeholder="$t('form.select')" @change="changeImg">
					      	<el-option v-for="item in coinArr" :key="item.id" :value="item">
								<img v-if="item == 'USDT-ERC20' || item == 'USDT-OMIN'" src="../assets/USDT.png" />
								<img v-else :src="require('../assets/'+ item +'.png')" />
								<span>{{item}}</span>
							</el-option>
					    </el-select>
					</el-form-item>
					<el-form-item :label="$t('withdraw.address')" :rules="[{ required: true, message: $t('withdraw.addressEmpty')}]" prop="link">
	                    <el-input v-model="form.link" autocomplete="off" :placeholder="$t('withdraw.addressEmpty')">
	                    	<template v-if="activeIndex == '0'" slot="append"><span @click="checkAddress">{{$t('withdraw.addressEditor')}}</span></template>
	                    </el-input>
	                </el-form-item>
	                <div v-if="activeIndex == '0'">
	                	<el-form-item :label="$t('withdraw.num')" prop="number" :rules="[{ required: true, message: $t('withdraw.numEmpty')}]">
						    <el-input v-model="form.number" :placeholder="$t('withdraw.numEmpty')"></el-input>
						</el-form-item>
						<div class="betweenSpread" style="margin-bottom:20px">
							<p>{{$t('withdraw.maxNum')}}：{{minPrice}}{{form.region}}</p>
							<p>{{$t('withdraw.fee')}}：{{feeNum}}{{form.region}}</p>
						</div>
						<el-form-item :label="$t('recharge.asset')" :rules="[{ required: true, message: $t('recharge.assetEmpty')},{pattern:/^[0-9]{6}$/,message:$t('form.assetsCruent'),trigger:'blur'}]" prop="asset">
		                    <el-input v-model="form.asset" :type="passwordType ? 'text' : 'password'" autocomplete="off" :placeholder="$t('recharge.assetEmpty')">
		                        <img class="eye" :src="eyeImg" slot="suffix" alt="" @click="handleEye" />
		                    </el-input>
		              	</el-form-item>
	                </div>
	                <div v-else>
	                	<el-form-item :label="$t('withdraw.remark')" prop="remark" :rules="[{ required: true, message: $t('withdraw.remarkEmpty')}]">
		                    <el-input v-model="form.remark" autocomplete="off" :placeholder="$t('withdraw.remarkEmpty')">
		                    </el-input>
		                </el-form-item>
	                </div>
					<el-button v-if="activeIndex == '0'" @click="submitFun('form')" class="themeBtn">{{$t('assets.withdraw')}}</el-button>
					<el-button v-if="activeIndex == '1'" @click="operation('form')" class="themeBtn">{{$t('assets.add')}}</el-button>
				</el-form>
        	</el-col>
        	<el-col :xs="24" :sm="24" :md="12" :lg="12">
        		<div class="tipBox">

        		</div>
        	</el-col>
        </el-row>
    	<AssetPage v-if="activeIndex == '0'" :vauleType="vauleType" :changeValue="changeValue" />
    	<div v-else>
			<el-table class="fishTable" :data="tableData" :empty-text="$t('tip.noRecord')">
				<el-table-column prop="address" :label="$t('withdraw.address')"></el-table-column>
				<el-table-column prop="remark" :label="$t('withdraw.remark')"></el-table-column>
				<el-table-column prop="address" :label="$t('contract.operation')">
					<template slot-scope="scope">
						<div class="opeare">
							<span class="copyClass" @click="handleCopy(scope.row.address,$event);">{{$t('assets.copyAddress')}}</span>
							<span class="delClass" @click="operationFun(0,scope.row.chainCoinId)">{{$t('assets.del')}}</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pageTotal v-if="page.total > 10" :page="page" @pageChange="pageChange"></pageTotal>
		</div>
	</div>
</template>
<script>
import pageTotal from '@/components/pageTotal'
import codeStatus from '@/config/codeStatus'
import AssetPage from '@/components/AssetPage'
import { withdrawPageApi,withdrawCoinApi,addAddressApi,walletAddressApi } from '@/api/getData'
import clip from '@/config/clipboard'
export default {
    data(){
        return{
			activeIndex:'0',
			// coinArr:['USDT-ERC20','USDT-OMIN','BTC','LTC','EOS','XRP','BCH','ETH','ETC'],
      coinArr:['USDT','BTC','ETH'],
			coinImgAdd:require('../assets/USDT.png'),
        	form:{
				region:'USDT',
				link:'',
        		number:'',
        		asset:'',
        		remark:''
        	},
			passwordType:false,
            eyeArr:[{
                img:require('../assets/eye_close.png')
            },{
                img:require('../assets/eye_open.png')
            }],
            eyeImg:require('../assets/eye_close.png'),
            page:{
                currentPage:1,
                limit:10,
                total:0,
			},
			vauleType:2,
			changeValue:0,
			tableData:[],
			minPrice:0,
			feeNum:0
		}
	},
	mounted(){
		this.withInform();
	},
	methods:{
		async withInform(){
			var that = this;
			var data = new URLSearchParams();
			data.set('type',that.form.region);
			var res = await withdrawPageApi(data);
			if(res.success){
				that.minPrice = Number(res.data.price).toFixed(2);
				that.feeNum = Number(res.data.fee).toFixed(2);
			}
		},
		changeImg(value){//切换币种
			var that = this;
			if(value == 'USDT-ERC20' || value == 'USDT-OMIN'){
				that.coinImgAdd = require('../assets/USDT.png')
			}else{
				that.coinImgAdd = require('../assets/'+ value +'.png')
			}
			this.withInform();
		},
		handleCopy(text,$event){//复制代码
    		clip(text,event);
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
		submitFun(form){//提币
			var that = this;
			that.$refs[form].validate(async (valid) => {
				if(valid){
					var dataArr = new URLSearchParams();
					dataArr.set('toAddress',that.form.link);
					dataArr.set('type',that.form.region);
					dataArr.set('price',that.form.number);
					dataArr.set('payPwd',that.form.asset);
					var res = await withdrawCoinApi(dataArr);
					if(res.success){
						that.$message({
							type:'success',
							message:res.msg
						})
						that.$refs[form].resetFields();
						that.changeValue = that.changeValue +1;
					}else{
						codeStatus(res.code,function(msg){
							that.$message.error(msg)
						})
					}
				}
			})
		},
		operation(form){//提交添加地址
			var that = this;
			that.$refs[form].validate((valid) => {
				if(valid){
					that.operationFun(1,'')
				}
			})
		},
		async operationFun(type,id){//删除或添加地址
			var that = this;
			var dataArr = new URLSearchParams();
			dataArr.set('chainCoinId',id);
			dataArr.set('remark',that.form.remark);
			dataArr.set('address',that.form.link);
			dataArr.set('coin',that.form.region);
			dataArr.set('op',type);
			var res = await addAddressApi(dataArr);
			if(res.success){
				if(type == 0){
					that.$message({
						type:'success',
						message:that.$t('assets.delsuccess')
					});
				}else{
					that.$message({
						type:'success',
						message:that.$t('tip.submitTxt')
					});
				}
				that.$refs.form.resetFields();
				that.walletFun();
			}else{
				codeStatus(res.code,function(msg){
					that.$message.error(msg)
				})
			}
		},
		async walletFun(){//钱包地址
			var that = this;
			var dataArr = new URLSearchParams();
			dataArr.set('coin',that.form.region);
			dataArr.set('current',that.page.currentPage);
			dataArr.set('size',that.page.limit);
			var res = await walletAddressApi(dataArr);
			that.tableData = [];
			if(res.success){
				that.page.total = Number(res.data.total);
				that.tableData = res.data.records;
			}else{
				codeStatus(res.code,function(msg){
					that.$message.error(msg)
				})
			}
		},
		checkAddress(){//地址管理切换到地址管理
			this.activeIndex = '1';
			this.$refs.form.resetFields();
			this.walletFun();
		},
        handleIndex(){
			if(this.activeIndex == '1'){
				this.walletFun();
			}
        	this.$refs.form.resetFields();
		},
		pageChange(item){
			this.page.currentPage = item;
			this.walletFun()
		}
	},
	components:{
        AssetPage
    }
}
</script>

<style lang="less">
.withdraw_div{
	.copyClass{
		color: #87D8EA;
	}
	.delClass{
		color: #EC5E45;
	}
	.opeare span{
		margin-right: 12px;
		cursor: pointer;
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
	.el-row{
		background-color: #1C1C27;
		padding: 20px 0;
		margin: 20px 0 40px 0!important;
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
			color: #87D8EA;
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
	p{
		margin: 0;
		color: #8E8E8E;
	}
}
</style>
