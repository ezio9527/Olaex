<template>
	<div class="email_div">
		<el-row :gutter="60">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<el-breadcrumb-item :to="{ path: '/set' }">{{$t('person.set')}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{$t('person.email')}}</el-breadcrumb-item>
			</el-breadcrumb>
        	<el-col :xs="24" :sm="24" :md="12" :lg="12">
        		<el-form ref="form" :model="form">
					<el-form-item :label="$t('form.email')" prop="email" :rules="[{ required: true, message: $t('form.loginEmail')}]">
	                    <el-input v-model="form.email" autocomplete="off" :placeholder="$t('form.loginEmail')">
	                    </el-input>
	               	</el-form-item>
					<el-form-item :label="$t('form.loginPwd')" prop="password" :rules="[{ required: true, message: $t('form.loginPwdEmpty')}]">
	                    <el-input v-model="form.password" type="password" autocomplete="off" :placeholder="$t('form.loginPwdEmpty')">
	                    </el-input>
	               	</el-form-item>
	                <el-form-item :rules="[{ required: true, message: $t('form.codeEmpty')}]" id="vsCode" prop="code">
	                    <el-input v-model="form.code" autocomplete="off" :placeholder="$t('form.codeEmpty')">
	                    	<i v-if="ifDisable == false" class="el-input__icon themeFont" slot="suffix"  @click="handleIconClick">{{$t('form.code')}}</i>
	                    	<i v-else class="el-input__icon themeFont" slot="suffix">{{$t('form.code')}}{{count}}</i>
	                    </el-input>
	                </el-form-item>
	                <el-button class="themeBtn" @click="bindFun('form')">{{$t('person.once')}}</el-button>
	            </el-form>
	        </el-col>
	        <el-col :xs="24" :sm="24" :md="12" :lg="12">

	        </el-col>
	   </el-row>
	</div>
</template>

<script>
import codeStatus from '@/config/codeStatus'
import { sendApi,bindAccountApi } from '@/api/getData'
export default {
	inject:['reload'],
    data(){
        return{
        	form:{
        		email:'',
				code:'',
				password:''
        	},
        	ifDisable:false,
            count:'',
            totalTime:600,
        }
    },
    methods:{
    	async handleIconClick(){//发送验证码
			var that = this;
			var res =  await sendApi();
			if(res.code == 200){
				that.$message({
                    type:'success',
                    message:that.$t('tip.sendSuccess')
                })
                that.ifDisable = true;
                that.count = '('+that.totalTime+'s)';
                that.clock = setInterval(function(){
                    that.totalTime--
                    that.count = '('+that.totalTime+'s)';
                    if(that.totalTime < 0){
                        clearInterval(that.clock)
                        that.count = ''
                        that.totalTime = 600
                        that.ifDisable = false
                    }
                },1000)
			}else{
				codeStatus(res.code,function(msg){
					that.$message.error(msg);
				})
			}
		},
		bindFun(form){
			var that = this;
			that.$refs[form].validate(async (valid) => {
				if(valid){
					var dataArr = new URLSearchParams();
					dataArr.set('bindAccount',that.form.email);
					dataArr.set('pwd',that.form.password);
					dataArr.set('msg',that.form.code);
					var res = await bindAccountApi(dataArr);
					if(res.success){
						codeStatus(res.code,function(msg){
							that.$message({
								type:'success',
								message:msg
							})
							that.reload();
						})
					}else{
						codeStatus(res.code,function(msg){
							that.$message.error(msg);
						})
					}
				}
			})
		}
    }
}
</script>

<style lang="less">
.email_div{
	.el-breadcrumb{
		padding: 10px 0 20px 26px;
		.el-breadcrumb__inner{
			color: #8E8E8E;
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
		.el-input-group__append{
			border: none;
			background-color: transparent;
			color: #2d60e0;
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
	.el-input__icon{
		width: 100%;
		cursor: pointer;
		font-style: normal;
	}
}
</style>
