<template>
    <div class="head_start">
        <div class="head_div">
			<el-row>
				<el-col :xs="24" :sm="24" :md="16" :lg="16">
					<div class="left_nav">
						<div class="logo_img" @click="comeback">
							<img src="../assets/logo.png" alt="" />
						</div>
              <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleNav" router>
                <!--<el-menu-item index="legalCoin">{{$t('nav.currency')}}</el-menu-item>-->
                <el-menu-item index="spot">{{$t('nav.spot')}}</el-menu-item>
                <el-menu-item index="transaction">{{$t('nav.contract')}}</el-menu-item>
                <el-menu-item index="lever">{{$t('nav.lever')}}</el-menu-item>
                <el-menu-item index="assets">{{$t('nav.assets')}}</el-menu-item>
                <el-menu-item index="earn">{{$t('nav.earn')}}</el-menu-item>
                <!--<el-menu-item index="contact">{{$t('nav.help')}}</el-menu-item>-->
                <!--<el-menu-item index="article">{{$t('nav.about')}}</el-menu-item>-->
              </el-menu>
					</div>
				</el-col>
				<el-col :xs="24" :sm="24" :md="8" :lg="8">
					<div class="right_nav">
						<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleNav" router>
              <div class="leftSpread">
                  <div>
                      <el-dropdown>
                          <div class="el-dropdown-link">
                              <img class="twoName" src="../assets/android.png" alt="" />
                          </div>
                          <el-dropdown-menu slot="dropdown">
                              <img class="qrcode" src="../assets/download_android.png" />
                          </el-dropdown-menu>
                      </el-dropdown>
                  </div>
                  <div>
                      <el-dropdown>
                          <div class="el-dropdown-link">
                            <img class="twoName" src="../assets/ios.png" alt="" />
                          </div>
                          <el-dropdown-menu slot="dropdown">
                            <img class="qrcode"  src="../assets/uploadImg.png" />
                          </el-dropdown-menu>
                      </el-dropdown>
                  </div>
              </div>
							<!-- 切换中英文 -->
							<div class="change_language">
                <el-dropdown @command="handleCommand" v-loading.fullscreen.lock="fullscreenLoading">
                  <span class="el-dropdown-link">
                      {{$t('nav.Language')}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu class="changeBg" slot="dropdown">
                    <!--<el-dropdown-item command="zh"><span>中文简体</span></el-dropdown-item>-->
                    <el-dropdown-item command="en"><span>English</span></el-dropdown-item>
                    <el-dropdown-item command="tw"><span>中文繁體</span></el-dropdown-item>
                    <el-dropdown-item command="jp"><span>日本語</span></el-dropdown-item>
                    <el-dropdown-item command="kr"><span>한국어</span></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
							</div>
							<div class="noTokenBox" v-if="getToken == null">
                                <el-menu-item index="login">{{$t('nav.log')}}</el-menu-item>
	                            <el-menu-item index="register">{{$t('nav.register')}}</el-menu-item>
                            </div>
                            <div class="user_box" v-else>
								<el-submenu class="selectMenu" index="">
									<template slot="title">
										<img src="../assets/default.png" alt="" style="width: 40px;height: 40px;border-radius: 10%;" />
										<span class="account">{{userName}}</span>
									</template>
									<div class="userDrop">
										<div class="user-top betweenSpread">
                         <div class="leftSpread">
                             <img src="../assets/default.png" style="width: 40px;height: 40px;border-radius: 10%;" />
                             <div class="userTxt">
                                 <span>{{userName}}</span>
                                 <p>{{realName}}</p>
                             </div>
                         </div>
                         <router-link to="set"><img src="../assets/set.png" alt="" /></router-link>

                     </div>
                     <div class="user-assets betweenSpread">
                         <div class="asset-box">
                             <p><span>{{$t('nav.person')}}</span><img @click="changeInput" :src="showImg ? openImg : closeImg" alt="" /></p>
                             <div class="leftSpread"><el-input :type="showImg == true ? 'text' : 'password'" readonly v-model="totalAssets"></el-input><span>{{coinTxt == 'USDT' ? 'BTC' : 'USDT'}}</span></div>
                         </div>
                         <div class="leftSpread"><img @click="changeCoin" src="../assets/blocked.png" alt="" /><span>{{coinTxt}}</span></div>
                     </div>
                     <div class="user-order">
                         <div class="user-order-left">
                             <p>{{$t('assets.wallet')}}</p>
                             <router-link :to="{path:'assets',query:{type:1}}"><img src="../assets/recharge-icon.png" />{{$t('assets.recharge')}}</router-link>
                             <router-link :to="{path:'assets',query:{type:2}}"><img src="../assets/withdraw-icon.png" />{{$t('assets.withdraw')}}</router-link>
                             <router-link :to="{path:'assets',query:{type:4}}"><img src="../assets/record-icon.png" />{{$t('assets.record')}}</router-link>
                         </div>
                         <div class="user-order-right">
                             <p>{{$t('nav.order')}}</p>
                             <router-link to="order"><img src="../assets/contact-icon.png" />{{$t('contract.title')}}</router-link>
                         </div>
                     </div>
                     <div class="userOUt leftSpread"><img src="../assets/out.png" alt="" /><el-button @click="outBtn" >{{$t('user.out')}}</el-button></div>
									</div>
								</el-submenu>
							</div>
						</el-menu>
					</div>
				</el-col>
			</el-row>
		</div>
    </div>
</template>
<script>
import { baseUrl } from '@/config/env'
import userInform from '@/config/userInform'
import { walletApi,userOutApi } from '@/api/getData'
export default {
    inject:['reload'],
    data(){
        return{
            fullscreenLoading:false,//切换语言的加载圈
            baseUrl,
            getToken:sessionStorage.getItem('userToken'),
            // getToken:'D',
            coinTrue:true,
            coinTxt:'USDT',
            openImg:require('../assets/eye_open.png'),
            closeImg:require('../assets/eye_close.png'),
            showImg:false,
            userName:'',
            realName:'',
            totalAssets:0,//个人资产
        }
    },
    computed: {
        activeIndex: function(){
            return this.$route.path.replace('/', '');
        },
        getCoinTxt(){
            return this.coinTxt
        }
    },
    watch:{
        getCoinTxt(newValue){
			this.$emit('flyingValue',newValue)
		},
    },
    mounted(){
        this.userFun();//用户信息
        this.$emit('flyingValue',this.coinTxt)
    },
    methods:{
        userFun(){
            var that = this;
            userInform(function(res){
                that.userName = res.account;
                switch (Number(res.realStatus)) {
                    case 0:
                        that.realName = that.$t('codeTxt.noAuthentication')
                        break;
                    case 1:
                        that.realName = that.$t('codeTxt.authentication')
                        break;
                    case 2:
                        that.realName = that.$t('codeTxt.waitAuthent')
                        break;
                    default:
                        break;
                }
                that.assestsFun();
            })
        },
        async assestsFun(){
            var that = this;
            var dataArr = new URLSearchParams();
            if(that.coinTxt == 'USDT'){
                var txt = 'BTC'
            }else{
                var txt = 'USDT'
            }
            dataArr.set('valuation',txt);
            dataArr.set('hide','N');
            dataArr.set('type','WALLET');
            var res = await walletApi(dataArr);
            if(res.success){
                if(that.coinTxt == 'USDT'){
                   that.totalAssets = Number(res.data.valuationTotalPrice).toFixed(8);
                }else{
                    that.totalAssets = Number(res.data.valuationTotalPrice).toFixed(4);

                }

            }
        },
        changeInput(){//隐藏显示资产
            var that = this;
            that.showImg = !that.showImg;

        },
        openLogin(){


        },
        openRegister(){

        },
        handleNav(key, keyPath) {//点击切换导航
			// console.log(key, keyPath);
        },
        comeback(){//点击logo跳转首页
			this.$router.push('/');
        },
        handleCommand(command) {//切换语言
          var that = this;
            if(command != that.$i18n.locale){
                    that.$i18n.locale = command;
              sessionStorage.setItem('language',command);
              that.fullscreenLoading = true;

                setTimeout(() => {
                  that.reload();
                    that.fullscreenLoading = false;
                }, 1000);
            }
        },
        outBtn(){
            var that = this;
			that.$confirm(that.$t("user.outTxt"), that.$t("layer.tips"), {
				confirmButtonText: that.$t("button.ok"),
				cancelButtonText: that.$t("button.cancel"),
				type: 'warning'
			}).then(async() => {
				var res = await userOutApi();
				if(res.success){
					that.$message({
						type: 'success',
						message: that.$t('user.outSuccess')
                    });
                    that.reload();
					sessionStorage.removeItem('userToken');
                    sessionStorage.removeItem('userInform');

					that.$router.push('/login')

				}
			}).catch(() => {
			});
        },
        changeCoin(){//切换币种
            var that = this;
            that.coinTrue = !that.coinTrue;
            if(that.coinTrue){
                that.coinTxt = 'USDT'
            }else{
                that.coinTxt = 'BTC'
            }
            that.assestsFun()
        }
    },
    components:{

    }
}
</script>

<style lang="less">
.head_div{
	position: fixed;
	top: 0;
	z-index: 999;
    width: 100%;
    background-color: #0B0B0B;
    .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, .el-menu--horizontal>.el-submenu .el-submenu__title:hover{
        background-color: transparent!important;
    }
    .el-row{
        padding: 0 40px;
    }
    .left_nav{
        display:flex;
        flex-direction: row;
        align-items: center;
        .el-menu.el-menu--horizontal{
			&>.el-menu-item.is-active{
				color: #87D8EA!important;
			}
		}
        .logo_img img{
            width: 112px;
            height: 44px;
        }
        .el-icon-search,.logo_img:hover,.el-input__suffix:hover{
            cursor: pointer;
        }
    }
    /* 右边导航 */
    .right_nav {
        .leftSpread{
            .twoName{
                width: 30px;
                height: 30px;
                margin-right: 40px;
            }
        }
        ul{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            height: 60px;
            text-align: right;
        }
        .el-menu.el-menu--horizontal{
        	&>.noTokenBox{
                display: flex;
                flex-direction: row;
                align-items: center;
                .el-menu-item{
                    height: 45px;
                    line-height: 45px;
                    border-radius: 4px;
                    &:nth-child(1){
                        margin-right: 8px;
                    }
                }
                .el-menu-item.is-active{
                    background-color: #87D8EA!important;
                    color: #FFFFFF!important;
                }
                .el-menu-item:hover{
                    background-color: #87D8EA!important;
                }
            }
        }

    }
    .change_language{
        margin-right: 40px;
        .el-dropdown-selfdefine{
            color: #ffffff;
        }
    }
    .user_box{
        .selectMenu{
            .el-submenu__title:hover{
                background-color: transparent!important;
            }
            .el-submenu__icon-arrow{
                right: 0;
                color: #ffffff;
            }
        }
        .account{
            color: #87D8EA;
        }
    }
}
.userDrop{
    padding: 20px;
    background-color: #1B1C27;
    width: 320px;
    .user-top{
        justify-self:flex-start;
        &>a{
            display: inline-block;
           img{
                width: 16px;
                height: 16px;
           }
        }
        .leftSpread{
            &>img{
                margin-right: 6px;
            }
            p{
                margin: 0;
                color: #EC5E45;
            }
        }
    }
    .user-assets{
        border-top: 1px solid #3B3B3B;
        border-bottom: 1px solid #3B3B3B;
        margin: 10px 0;
        padding: 10px 0;
        .leftSpread{
            img{
                margin-right: 8px;
            }
        }
        .el-input__inner{
            background: transparent;
            border: none;
            color: #ffffff;
            padding: 0;
            font-size: 28px;
            // width: 100px;
            &::-webkit-input-placeholder{
                color: #ffffff;
            }
            &:-moz-placeholder{
                color: #ffffff;
            }
            &::-o-placeholder{
                color: #ffffff;
            }
        }
        img{
            cursor: pointer;
        }
        .asset-box{
            p{
                img{
                    margin-left: 10px;
                }
                span{
                    color: #C3C3C3;
                    font-size: 12px;
                }
            }
        }
    }
}
.user-order{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    .user-order-right{
        margin-left: 15px;
    }
    &>div{
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        p{
            color: #C3C3C3;
            margin: 0 0 10px 0;
            font-size: 12px;
        }
        a{
            line-height: 35px;
            color: #ffffff;
            display: flex;
            flex-direction: row;
            align-items: center;
            &:hover{
                background-color: #575F67;
            }
            img{
                margin-right: 22px;
            }
        }
    }
}
.userOUt{
    border-top: 1px solid #3B3B3B;
    margin-top: 10px;
    button,button:focus,button:hover{
        background-color: transparent;
        border: none;
        color: #ffff;
        width: 90%;
        text-align: left;
    }
}
.userOUt:hover{
    background-color: #575F67;
}
.changeBg{
    background-color: #1B1C27!important;
    border: 1px solid #1B1C27!important;
    color: #8E8E8E!important;
    .el-dropdown-menu__item:hover{
        background-color: #575F67!important;
        color: #ffffff!important;
    }
}
</style>
