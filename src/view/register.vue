<template>
    <div>
        <div class="formPage">
        	<h2>{{$t('verification.registerName')+$t('nav.account')}}</h2>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane :label="$t('verification.email')" name="0"></el-tab-pane>
                <!--<el-tab-pane :label="$t('verification.phone')" name="1"></el-tab-pane>-->
            </el-tabs>
            <el-form :model="form" ref="form">
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
                    <el-input v-model="form.pwd" :type="passwordType ? 'text' : 'password'" autocomplete="off" :placeholder="$t('form.loginPwdEmpty')">
                        <img class="eye" :src="eyeImg" slot="suffix" alt="" @click="handleEye" />
                    </el-input>
                </el-form-item>

                <el-form-item :rules="[{ required: false, message: $t('form.inviteEmpty')}]" prop="invite">
                    <el-input v-model="form.invite" autocomplete="off" :placeholder="$t('form.inviteEmpty')"></el-input>
                </el-form-item>

                <el-form-item :rules="[{ required: true, message: $t('form.codeEmpty')}]" id="vsCode" prop="code">
                    <el-input v-model="form.code" autocomplete="off" :placeholder="$t('form.codeEmpty')">
                        <i v-if="ifDisable == false" class="el-input__icon themeFont" slot="suffix"  @click="handleIconClick">{{$t('form.code')}}</i>
	                    <i v-else class="el-input__icon themeFont" slot="suffix">{{$t('form.code')}}{{count}}</i>
                    </el-input>
                </el-form-item>

                <p>
                    <el-checkbox v-model="checked">
                        {{$t('verification.agree')}}
                    </el-checkbox>
                    <router-link class="differnet" to="agreement">{{$t('tip.use')}}</router-link>
                    <router-link class="differnet" to="privacy">{{$t('tip.privacy')}}</router-link>
                </p>
                <div>
                    <el-button style="width: 100%;" class="themeBtn" @click="submitRegister('form')">{{$t('verification.registerName')}}</el-button>
                    <p class="fontCenter">{{$t('form.haveAccount')}}
                        <a class="themeFont moveHand" @click="openLoginClose">{{$t('verification.logoName')}}</a>
                    </p>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
import AppTxt from '@/components/AppTxt'
import Area from '@/components/Area'
import { registerApi } from '@/api/getData'
import sendMsg from '@/config/sendMsg'
import codeStatus from '@/config/codeStatus'
export default {
    data(){
        return{
            checked:false,
            activeName:'0',
            form: {
                areaCode:'',
                areaType:'',
                email: '',
                phone:'',
	        	pwd: '',
                invite:'',//搜索框内容
                code:''
            },
            passwordType:false,
            eyeArr:[{
                img:require('../assets/eye_close.png')
            },{
                img:require('../assets/eye_open.png')
            }],
            eyeImg:require('../assets/eye_close.png'),
            ifDisable:false,
            count:'',
            totalTime:600,
            userFormVisible:false,
            userContent:'',
            clock:null,
            getTwoLang:''
        }
    },
    methods:{
        selectValue(item){//选择区号
            var that = this;
            that.form.areaCode = item.code;
            that.form.areaType = item.type;
        },
		handleClick(tab, event){
            this.$refs.form.resetFields();
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
        submitRegister(form){//提交表单
            var that = this;
            that.$refs[form].validate(async (valid) => {
                if(valid){
                    if(!that.checked){
                        that.$message.error(that.$t('layer.select'));
                        return false;
                    }

                    if(that.activeName == '0'){
                        var account = that.form.email;
                        var areaType = '';
                        var areaCodeTxt = '';
                    }else if(that.activeName == '1'){
                        if(that.form.areaCode == ''){
                            that.$message.error(that.$t('layer.emptyArea'));
                            return false;
                        }
                        var account = that.form.phone;
                        var areaType = that.form.areaType;
                        var areaCodeTxt = that.form.areaCode;
                    }
                    let dataArr = new URLSearchParams();
                    dataArr.set('account',account);
                    dataArr.set('password',that.form.pwd);
                    dataArr.set('inviteCode',that.form.invite);
                    dataArr.set('msg',that.form.code);
                    dataArr.set('type',areaType);
                    dataArr.set('code',areaCodeTxt);
                    var res = await registerApi(dataArr);
                    if(res.success){
                        that.$message({
                            type:'success',
                            message:this.$t('form.registerSuccess')
                        });
                        var data = res.data;
                        that.$refs[form].resetFields();
                        setTimeout(function(){
                            that.$router.push('/login');
                        },800)

                    }else{
                        codeStatus(res.code,function(res){
                            that.$message.error(res);
                        })
                    }
                }
            })
        },
        openLoginClose(){
            this.$router.push('/login')
        },
        async userFun(){
            var that = this;
            var res = await agreementApi();
            if(res.ifsuccess){
                that.userContent = res.data;
            }
        }
    },
    components:{
		AppTxt,Area
    }
}
</script>
<style lang="less">
.formPage{
  input, textarea {
    color: black !important;
  }
    position: relative;
    margin: 8vh auto 40px;
    width: 30%;
    background-color: #FFF;
    color: #3f475a;
    border-radius: 8px;
    padding: 20px;
    .el-input__icon{
        width: 100%;
        cursor: pointer;
        font-style: normal;
    }
    .el-checkbox__inner{
        border-radius: 14px;
        background-color: transparent !important;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner{
        background-color: transparent;
        border-color: #83D2E4;
    }
    .el-checkbox__inner::after{
        border-radius: 6px;
        background-color:#83D2E4;
        width: 6px;
        height: 6px;
        top: 4px;
        left: 4px;
        border:1px solid #83D2E4;
        top: 2px;
        left: 2px;
    }
    .el-checkbox__label,.el-checkbox__input.is-checked+.el-checkbox__label,.el-checkbox__inner:focus{
        color: #8E8E8E;
    }
    .differnet{
        color: #2d60e0;
        cursor: pointer;
    }
    .el-checkbox__inner:hover{
        border-color: #DCDFE6!important;
    }
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
                border-right: none!important;
                text-align: left!important;
                border-left: 1px solid #3B3B3B!important;
                &:focus{
                    border-color: #3B3B3B!important;
                }
            }
        }

    }
}
</style>
