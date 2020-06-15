<template>
	<div class="check">
    	<div class="leftSpread userInform">
    		<img class="defaultHead" src="../assets/default.png" alt=""/>
    		<div>
    			<h2>{{account}}</h2>
    			<p>UID:{{uid}}</p>
    		</div>
    	</div>
    	<el-row>
    		<el-col :xs="24" :sm="24" :md="12" :lg="12">
    			<el-form ref="form" :model="form">
					<div v-if="realStatus != 1 && realStatus != 2"> 
						<el-form-item :label="$t('person.realName')" :rules="[{ required: true, message: $t('person.realNameEmpty')}]" prop="name">
							<el-input v-model="form.name" autocomplete="off" :placeholder="$t('person.realNameEmpty')">
							</el-input>
						</el-form-item>
						<el-form-item :label="$t('person.realNo')" :rules="[{ required: true, message: $t('person.realNoEmpty')}]" prop="realNo">
							<el-input v-model="form.realNo" autocomplete="off" :placeholder="$t('person.realNoEmpty')">
							</el-input>
						</el-form-item>
						
						<div class="leftSpread">
						<!-- 上传身份证正面 -->
							<el-upload
								class="avatar-uploader"
								v-model="form.front"
								:action="baseUrl+'/api/upload/img'"
								:show-file-list="false"
								:on-success="frontAvatarSuccess"
								:on-error="failAvater"
								:on-remove="handleRemove"
								:before-upload="beforeAvatarUpload">
								<img v-if="imageUrl" :src="imageUrl" class="avatar">
								<img v-else src="../assets/infront.png" alt="" />
								<div class="el-upload__tip" slot="tip">{{$t('person.front')}}</div>
							</el-upload>
						<!-- 上传身份证反面 -->
							<el-upload
								class="avatar-uploader"
								v-model="form.behind"
								:action="baseUrl+'/api/upload/img'"
								:show-file-list="false"
								:on-success="behindAvatarSuccess"
								:on-error="failAvater"
								:on-remove="handleRemove"
								:before-upload="beforeAvatarUpload">
								<img v-if="behindUrl" :src="behindUrl" class="avatar">
								<img v-else src="../assets/infront.png" alt="" />
								<div class="el-upload__tip" slot="tip">{{$t('person.behind')}}</div>
							</el-upload>
						</div>
					</div>
	                <el-button :disabled="realStatus == 0 ? false : true" class="themeBtn" @click="submit('form')">{{buttonTxt}}</el-button>
	           </el-form>
    		</el-col>
    		<el-col :xs="24" :sm="24" :md="12" :lg="12"></el-col>
    	</el-row>
    </div>
        
</template>

<script>
import { baseUrl } from '@/config/env'
import { certificationApi } from '@/api/getData'
import codeStatus from '@/config/codeStatus'
import userInform from '@/config/userInform'
export default{
	inject:['reload'],
	data(){
		return{
			form:{
            	name:'',
				realNo:'',
				front:'',
				bebind:'',
			},
			imageUrl:'',
			behindUrl:'',
			baseUrl,
			account:'',
			uid:'',
			realStatus:'',
			buttonTxt:''
		}
	},
	created(){
		this.getUserFun();
	},
	methods:{
		getUserFun(){
			var that = this;
			userInform(function(res){
				that.account = res.account;
				that.uid = res.uid;
				that.realStatus = res.realStatus;
				switch (Number(res.realStatus)) {
					case 0:
						that.buttonTxt = that.$t('person.submit')
						break;
					case 1:
						that.buttonTxt = that.$t('codeTxt.authentication')
						break;
					case 2:
						that.buttonTxt = that.$t('codeTxt.waitAuthent')
						break;
					default:
						break;
				}
			})	
		},
		frontAvatarSuccess(res, file) {//正面上传成功
            this.imageUrl = URL.createObjectURL(file.raw);
            if(res.code == 200){
                this.form.front = res.data.src;
            }
		},
		behindAvatarSuccess(res, file) {//反面上传成功
            this.behindUrl = URL.createObjectURL(file.raw);
            if(res.code == 200){
                this.form.bebind = res.data.src;
            }
		},
		submit(form){
			var that = this;
            that.$refs[form].validate(async (valid) => {
                if(valid){
					if(that.form.front == ''){
						that.$message.error(that.$t('person.front'));
						return false;
					}
					if(that.form.bebind == ''){
						that.$message.error(that.$t('person.behind'));
						return false;
					}
                    let dataArr = new URLSearchParams();
                    dataArr.set('name',that.form.name);
					dataArr.set('idCard',that.form.realNo);
					dataArr.set('frontImg',that.form.front);
                    dataArr.set('backImg',that.form.bebind);
                    var res = await certificationApi(dataArr);
                    if(res.success){
						codeStatus(res.code,function(msg){
                            that.$message({
								type:'success',
								message:msg
							});
                        })
                        that.reload();
                    }else{
                        codeStatus(res.code,function(msg){
                            that.$message.error(msg);
                        })
                    }
                }
            })
		},
		failAvater(err,file){
            this.$message.error(this.$t('tip.uploadFail'));
		},
		handleRemove(file, fileList) {
            var that = this;
            var a = file.response.data.src;
            var b = that.imageUrl.indexOf(a);
            that.imageUrl.splice(b,1);
            that.dialogImageUrl.splice(b,1);
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
        }
	}
}
</script>

<style lang="less">
.check{
	background-color: #1C1C27;
	border-radius: 4px;
	padding: 20px;
	.userInform{
		margin: 20px 0;
		h2{
			font-weight: normal;
		}
		p{
			color: #C3C3C3;
		}
	}
	.defaultHead{
		width: 80px;
		height: 80px;
		margin-right: 20px;
	}
	.leftSpread{
		&>div{
			&:nth-child(1){
				margin-right: 40px;
			}
		}
	}
	.avatar-uploader{
		.el-upload{
			border: 1px solid #3B3B3B;
			border-radius: 4px;
			padding: 20px ;
		}
		.el-upload__tip{
			color: #ffffff;
			text-align: center;
		}
		.avatar{
			width: 240px;
			height: 150px;
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
}
</style>