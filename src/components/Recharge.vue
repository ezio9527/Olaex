<template>
    <div class="recharge_div">
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

			        <div>
			        	<p>{{$t('recharge.qrcode')}}</p>
			        	<div id="qrcode" v-loading="qrCodeLoading"></div>
			        </div>
					<el-form-item :label="$t('recharge.address')" prop="link">
	          <el-input v-model="form.link" autocomplete="off" readonly>
	          	<i class="el-icon-document-copy" style="width: 100%;cursor: pointer;" slot="suffix" @click="handleCopy"></i>
	          </el-input>
	        </el-form-item>
          <!--<el-form-item :label="$t('recharge.num')" prop="number" :rules="[{ required: true, message: $t('recharge.numEmpty')},{pattern:/^(0(\.\d*[1-9]+\d*)?)$|^([1-9]\d*)(\.\d*)?$/,message:$t('recharge.numEmpty'),trigger:'blur'}]">-->
					  <!--<el-input v-model="form.number" :placeholder="$t('recharge.numEmpty')"></el-input>-->
					<!--</el-form-item>-->
					<!--<el-form-item :label="$t('recharge.asset')" :rules="[{ required: true, message: $t('recharge.assetEmpty')},{pattern:/^[0-9]{6}$/,message:$t('form.assetsCruent'),trigger:'blur'}]" prop="asset">-->
	                    <!--<el-input v-model="form.asset" :type="passwordType ? 'text' : 'password'" autocomplete="off" :placeholder="$t('recharge.assetEmpty')">-->
	                        <!--<img class="eye" :src="eyeImg" slot="suffix" alt="" @click="handleEye" />-->
	                    <!--</el-input>-->
	               <!--</el-form-item>-->
					<!--<p>{{$t('recharge.rechargeImg')}}</p>-->
					<!--<div class="uploadDiv">-->
						<!--<el-upload-->
						  <!--class="avatar-uploader"-->
						  <!--v-model="form.imageUrl"-->
						  <!--:action="baseUrl+'/api/upload/img'"-->
						  <!--:show-file-list="false"-->
						  <!--:on-success="handleAvatarSuccess"-->
						  <!--:before-upload="beforeAvatarUpload">-->
						  <!--<img v-if="proveImg" :src="proveImg" class="avatar">-->
						  <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
						<!--</el-upload>-->
						<!--<span>{{$t('recharge.uploadTip')}}</span>-->
					<!--</div>-->
					<!--<el-button @click="submitFun('form')" class="themeBtn">{{$t('assets.recharge')}}</el-button>-->
				</el-form>

        	</el-col>
        	<el-col :xs="24" :sm="24" :md="12" :lg="12">
        		<div class="tipBox">
        			<p>{{$t('recharge.tip')}}</p>
        			<ul>
        				<li>{{$t('recharge.tipTxt1')}}</li>
        				<li>{{$t('recharge.tipTxt2')}}</li>
        			</ul>
        		</div>
        	</el-col>
        </el-row>

    	<AssetPage :vauleType="vauleType" :changeValue="changeValue" />
    </div>
</template>
<script>
import { baseUrl } from '@/config/env'
import AssetPage from '@/components/AssetPage'
import { rechargeAddressApi,rechargeApi } from '@/api/getData'
import QRCode from 'qrcodejs2'
import clip from '@/config/clipboard'
import codeStatus from '@/config/codeStatus'
export default {
    data(){
        return{
          qrCodeLoading: false,
            form:{
            	region:'USDT',
            	link:'',
            	number:'',
            	asset:'',
            	imageUrl:''
			},
			vauleType:1,
			proveImg:'',
			// coinArr:['USDT-ERC20','USDT-OMIN','BTC','LTC','EOS','XRP','BCH','ETH','ETC'],
          coinArr:['USDT','BTC','ETH'],
            passwordType:false,
            eyeArr:[{
                img:require('../assets/eye_close.png')
            },{
                img:require('../assets/eye_open.png')
            }],
			eyeImg:require('../assets/eye_close.png'),
			baseUrl,
			changeValue:0,
			coinImgAdd:require('../assets/USDT.png')
        }
	},
	created(){
		this.addressFun();
	},
    methods:{
		submitFun(form){//提交充币
			var that = this;
			that.$refs[form].validate(async (valid) => {
				if(valid){
					if(that.form.imageUrl == ''){
						that.$message.error(that.$t('tip.upImg'));
						return false;
					}
					var dataArr = new URLSearchParams();
					dataArr.set('type',that.form.region);
					dataArr.set('address',that.form.link);
					dataArr.set('price',that.form.number);
					dataArr.set('remark',that.form.imageUrl);
					dataArr.set('payPwd',that.form.asset);
					var res = await rechargeApi(dataArr);
					if(res.success){
						that.$message({
							type:'success',
							message:that.$t('tip.submitTxt')
						})
						that.proveImg = '';
						that.form.imageUrl = '';
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
		async addressFun(){//充币地址
      this.qrCodeLoading = true
			var that = this;
			var res = await rechargeAddressApi();
			if(res.success){
				var arr = res.data;
				var addressTxt = '';
				arr.forEach(element => {
					if(that.form.region == element.type){
						addressTxt = element.address;
					}
				});
				that.form.link = addressTxt;
				var qrcode = new QRCode('qrcode', {
					width: 140,
					height: 140,
					text: addressTxt,
				})
			}
      this.qrCodeLoading = false
		},
    	handleCopy(){//复制代码
    		clip(this.form.link,event);
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
        handleAvatarSuccess(res, file) {
			this.proveImg = URL.createObjectURL(file.raw);
            if(res.code == 200){
                this.form.imageUrl = res.data.src;
            }
	    },
	    beforeAvatarUpload(file) {
	        const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG) {
                this.$message.error(this.$t('tip.uploadTip'));
            }
            if (!isLt2M) {
                this.$message.error(this.$t('tip.uploadSize'));
            }
			return (isJPG || isPNG) && isLt2M;
		},
		selectCoin(value){
		  this.qrCodeLoading = true
			var that = this;
			document.getElementById('qrcode').innerHTML = ''; //清除二维码
			that.addressFun();
			if(value == 'USDT-ERC20' || value == 'USDT-OMIN'){
				that.coinImgAdd = require('../assets/USDT.png')
			}else{
				that.coinImgAdd = require('../assets/'+ value +'.png')
			}
      this.qrCodeLoading = false
		},
    },
    components:{
    	AssetPage
    }
}
</script>
<style lang="less">
.recharge_div{
	#qrcode{
		background-color: #ffffff;
		padding: 10px;
		width: 140px;
		height: 140px;
		margin: 10px 0 20px 0;
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
		.el-input__inner{
			border: none;
			background-color: transparent;
			padding: 0;
		}
	}

	.avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
	}
	.uploadDiv{
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		.avatar-uploader{
			background: url('../assets/voucher-bj.png') no-repeat;
			background-size: 100% 100%;
			.el-upload {

				border-radius: 2px;
				cursor: pointer;
				position: relative;
				overflow: hidden;
				.avatar-uploader-icon {
					border: 1px dashed #d9d9d9;
					font-size: 28px;
					color: #8c939d;
					width: 178px;
					height: 178px;
					line-height: 178px;
					text-align: center;
				}
				.el-icon-plus:before{
					content: '';
				}
			}
		}
		&>span{
			color: #8E8E8E;
			padding-left: 4px;
		}
	}
	.el-button{
		width: 100%;
		margin: 40px 0;
	}
	.tipBox{
		border: 1px solid #3B3B3B;
		border-radius: 4px;
		padding: 20px;
		&>p{
			color: #EC5E45;
			margin: 0 0 10px 0;
		}
		li{
			color: #8E8E8E;
			line-height: 30px;
		}
	}
}
</style>
