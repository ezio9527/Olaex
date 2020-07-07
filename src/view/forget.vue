<template>
    <div>
        <div class="formPage">
        	<h2>{{$t('verification.forgetName')}}</h2>
            <p>{{$t('verification.forgetTxt')}}</p>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="$t('verification.email')" name="0"></el-tab-pane>
                <!--<el-tab-pane :label="$t('verification.phone')" name="1"></el-tab-pane>-->
            </el-tabs>
            <el-form :model="form" :rules="rules" ref="ruleForm">

                <el-form-item v-if="activeName == '0'" :rules="[{ required: true, message: $t('form.loginEmail')}]" prop="email">
                    <el-input v-model="form.email" autocomplete="off" :placeholder="$t('form.loginEmail')"></el-input>
                </el-form-item>

                <div class="selectArea" v-if="activeName == '1'" >
                    <el-form-item :rules="[{ required: true, message: $t('form.phone')}]" prop="phone">
                        <el-input class="enterInput" v-model="form.phone" autocomplete="off" :placeholder="$t('form.phone')"></el-input>
                        <Area @selectValue="selectValue" />
                    </el-form-item>
                </div>

                <el-form-item :rules="[{ required: true, message: $t('form.loginPwdEmpty')},{pattern:/^[A-Za-z0-9]{6,16}$/,message:$t('form.loginPwdRight'),trigger:'blur'}]" prop="pwd">
                    <el-input v-model="form.pwd" :type="showIcon1?'text':'password'" autocomplete="off" :placeholder="$t('form.loginPwdEmpty')">
                        <img class="eye" :src="showIcon1? eyeImg : closeImg" slot="suffix" alt="" @click="handleEye(1)" />
                    </el-input>
                </el-form-item>

                <el-form-item prop="repwd">
                    <el-input v-model="form.repwd" :type="showIcon2?'text':'password'" autocomplete="off" :placeholder="$t('form.loginSureEmpty')">
                        <img class="eye" :src="showIcon2? eyeImg : closeImg" slot="suffix" alt="" @click="handleEye(2)" />
                    </el-input>
                </el-form-item>

                <el-form-item id="vsCode" :rules="[{ required: true, message: $t('form.codeEmpty')}]" prop="codeMsg">
                    <el-input v-model="form.codeMsg" autocomplete="off" :placeholder="$t('form.codeEmpty')">
                    <i class="el-input__icon themeFont" slot="suffix" @click="handleIconClick">{{$t('form.code')}}{{count}}</i>
                    </el-input>
                </el-form-item>
                <p class="moveHand" style="text-align: right;"><a class="themeFont" @click="returnClose">{{$t('verification.return')}}</a></p>
                <div>
                    <el-button class="themeBtn" style="width: 100%;" @click="submitForget('ruleForm')">{{$t('verification.reset')}}</el-button>
                    <p class="fontCenter">{{$t('form.noAccount')}}<a class="themeFont" @click="openRegister">{{$t('verification.registerName')}}</a></p>
                </div>
            </el-form>
            <AppTxt />
        </div>
    </div>
</template>
<script>
import AppTxt from '@/components/AppTxt'
import Area from '@/components/Area'
import { updatePwdApi } from '@/api/getData'
import sendMsg from '@/config/sendMsg'
import codeStatus from '@/config/codeStatus'
export default {
    data(){
        var checkPwd = (rule,value,callback) => {
            if( value !== this.form.pwd ){
                callback(new Error(this.$t('form.pwdDifferent')));
            }else{
                callback()
            }
        };
        return{
            activeName:'0',
            form: {
                email:'',
                phone:'',
	        	name: '',
                pwd: '',
                repwd:'',
                code:'',
                codeMsg:'',
                areaCode:'',
                areaType:''
            },
            showIcon1:false,
            showIcon2:false,
            eyeImg:require('../assets/eye_open.png'),
            closeImg:require('../assets/eye_close.png'),
            ifDisable:false,
            count:'',
            totalTime:600,
            clock:null,
            rules:{
                repwd:[
                    { required:true,whitespace:true,message:this.$t('form.loginSureEmpty')},
                    {pattern:/^[A-Za-z0-9]{6,16}$/,message:this.$t('form.loginPwdRight'),trigger:'blur'},
                    { validator:checkPwd,trigger:'blur'}
                ],
            }
        }
    },
    methods:{
        selectValue(item){//选择区号
            var that = this;
            that.form.areaCode = item.code;
            that.form.areaType = item.type;
        },
		handleClick(tab, event){
            this.$refs.ruleForm.resetFields();
        },
        returnClose(){// 返回登录页
            this.$router.go(-1);
        },
        handleEye(value){//显示隐藏密码
            var that = this;
            if(value == 1){
                that.showIcon1 = !that.showIcon1
            }else if(value == 2){
                that.showIcon2 = !that.showIcon2
            }
        },
        handleIconClick(){//发送验证码
            var that = this;
            if(that.activeName == '1'){//手机
                if(that.form.areaCode == ''){
                    that.$message.error(that.$t('layer.emptyArea'));
                    return false;
                }
                if(that.form.phone == ''){
                    that.$message.error(that.$t('form.phone'));
                    return false;
                }
                var account = that.form.phone;
                var areaType = that.form.areaType;
                var areaCode = that.form.areaCode;
            }else{//邮箱
                if(that.form.email == ''){
                    that.$message.error(that.$t('form.loginEmail'));
                    return false;
                }
                var account = that.form.email;
                var areaType = '';
                var areaCode = '';
            }
            var obj = {
               'account':account,
               'type':areaType,
               'code':areaCode
            };
            sendMsg(obj,function(res){
                if(res.success){
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
                        that.$message.error(msg)
                    })
                }
            })
        },
        openRegister(){//关闭忘记密码层，打开注册层
            this.$router.push('/register')
        },
        submitForget(ruleForm){//提交
            var that = this;
            that.$refs[ruleForm].validate(async (valid) => {
                if(valid){
                    if(that.activeName == '0'){
                        var account = that.form.email;
                        var areaTypeTxt = '';
                    }else if(that.activeName == '1'){
                        if(that.form.areaType == ''){
                            that.$message.error(that.$t('layer.emptyArea'));
                            return false;
                        }
                        var account = that.form.phone;
                        var areaTypeTxt = that.form.areaType;
                    }
                    if(that.form.pwd != that.form.repwd){
                        that.$message.error(that.$t('form.pwdDifferent'));
                        return false;
                    }
                    var dataArr = new URLSearchParams();
                    dataArr.set('account',account);
                    dataArr.set('password',that.form.pwd);
                    dataArr.set('confirmPwd',that.form.repwd);
                    dataArr.set('msg',that.form.codeMsg);
                    dataArr.set('type',areaTypeTxt);
                    var res = await updatePwdApi(dataArr);
                    if(res.success){
                        that.$message({
                            type:'success',
                            message:that.$t('person.updatePwd')
                        })
                        that.$refs[ruleForm].resetFields();
                        setTimeout(function(){
                            that.$router.push('/login');
                        },800)
                    }else{
                        codeStatus(res.code,function(msg){
                            that.$message.error(msg)
                        })
                    }
                }
            })
        },
    },
    components:{
		AppTxt,Area
    }
}
</script>
<style lang="less">
.formPage {
	position: relative;
    margin: 8vh auto 40px;
	width: 30%;
	background-color: #1B1C27;
	border-radius: 8px;
	padding: 20px;
	.themeFont {
        cursor: pointer;
        font-style: normal;
    }
    .selectArea{
        .el-form-item.is-error .el-input__inner{
            border-color: #3B3B3B!important;
        }
        .el-form-item__content{
            display: flex;
            flex-direction: row;
            .enterInput{
                .el-input__inner{
                    border-radius: 4px;
                    border-right: none;
                    text-align: left;
                    border-left: 1px solid #3B3B3B;
                    &:focus{
                        border-color: #3B3B3B!important;
                    }
                }
            }

        }
    }
}
</style>
