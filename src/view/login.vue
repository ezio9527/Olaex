<template>
  <div class="allBox">
    <div class="formPage">
      <h2>{{$t('verification.logoName')+' LHC'}}</h2>

      <p>{{$t('verification.loginTxt')}}</p>
      <el-form :model="form" ref="form">
        <el-form-item :rules="[{ required: true, message: $t('form.accountEmpty')}]" prop="name">
          <el-input v-model="form.name" autocomplete="off" :placeholder="$t('form.account')"></el-input>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: $t('form.loginPwdEmpty')},{pattern:/^[A-Za-z0-9]{6,16}$/,message:$t('form.loginPwdRight'),trigger:'blur'}]"
          prop="pwd">
          <el-input v-model="form.pwd" :type="passwordType ? 'text' : 'password'" autocomplete="off"
                    :placeholder="$t('form.loginPwd')">
            <img class="eye" :src="eyeImg" slot="suffix" alt="" @click="handleEye"/>
          </el-input>
        </el-form-item>
        <p class="moveHand" style="text-align: right;"><a class="themeFont" @click="dialogForget">{{$t('form.forget')}}</a></p>
        <div>
          <el-button style="width: 100%;" class="themeBtn" @click="submitLogin('form')">{{$t('nav.log')}}</el-button>
          <p class="fontCenter moveHand">{{$t('form.noAccount')}}<a class="themeFont" @click="$router.push('/register')">{{$t('verification.registerName')}}</a>
          </p>
        </div>
      </el-form>
      <!--<AppTxt/>-->
    </div>
  </div>
</template>
<script>
// import AppTxt from '@/components/AppTxt'
import {loginApi} from '@/api/getData'
import codeStatus from '@/config/codeStatus'
export default {
  inject: ['reload'],
  data() {
    return {
      form: {
        name: '',
        pwd: '',
      },
      loginForm: true,
      passwordType: false,
      registerFormVisible: false,
      forgetFormVisible: false,
      eyeArr: [{
        img: require('../assets/eye_close.png')
      }, {
        img: require('../assets/eye_open.png')
      }],
      eyeImg: require('../assets/eye_close.png')
    }
  },
  methods: {
    handleEye() {//显示隐藏密码
      var that = this;
      that.passwordType = !that.passwordType;
      if (that.passwordType) {
        that.eyeImg = that.eyeArr[1].img
      } else {
        that.eyeImg = that.eyeArr[0].img
      }
    },
    dialogForget() {
      this.$router.push('/forget')
    },
    submitLogin(form) {
      var that = this;
      that.$refs[form].validate(async (valid) => {
        if (valid) {
          let dataArr = new URLSearchParams();
          dataArr.set('account', that.form.name);
          dataArr.set('password', that.form.pwd);
          var res = await loginApi(dataArr);
          if (res.code == 200) {
            that.$message({
              type: 'success',
              message: this.$t('form.loginSuccess')
            });
            var data = res.data;
            sessionStorage.setItem('userToken', data.token);
            // that.$refs[form].resetFields();
            that.reload();
            that.$router.push('/');

          } else if (res.code == 4004) {
            that.$message.error(that.$t('codeTxt.accountExit'));
          } else {
            codeStatus(res.code, function (res) {
              that.$message.error(res);
            })
          }
        }
      })
    }
  },
  components: {
    // AppTxt
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
    .moveHand {
      margin-bottom: 40px;
    }
    .eye {
      cursor: pointer;
      padding-top: 12px;
    }
    .themeFont {
      .moveHand {
        cursor: pointer;
      }
    }
    .el-tabs__active-bar {
      display: none;
    }
  }
</style>
