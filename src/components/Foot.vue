<template>
    <div class="foot-box">
			<div class="container">
				<div class="footLayout far">
					<h3>{{$t('foot.concat')}}</h3>
					<ul class="footLayout">
						<li><a href="javascript:;"><img src="../assets/foot-facebook.png" alt="facebook" /></a></li>
						<li><a href="javascript:;"><img src="../assets/foot-weibo.png" alt="weibo" /></a></li>
						<li><a href="javascript:;"><img src="../assets/foot-wechat.png" alt="weixin" /></a></li>
						<li><a href="javascript:;"><img src="../assets/foot-qq.png" alt="qq" /></a></li>
						<li><a href="javascript:;"><img src="../assets/foot-tel.png" alt="tel" /></a></li>
					</ul>
				</div>
				<div class="foot-center footLayout">
					<img class="logo" src="../assets/logo.png" alt="olaex" />
					<div class="verticalBar">
						<p class="title">{{$t('foot.read')}}</p>
						<p><router-link to="agreement">{{$t('foot.agree')}}</router-link></p>
						<p><router-link to="privacy">{{$t('foot.secret')}}</router-link></p>
						<p><router-link to="privacy">{{$t('foot.Legal')}}</router-link></p>
					</div>
					<div class="verticalBar">
						<p class="title">{{$t('foot.help')}}</p>
						<p><router-link :to="{path:'contact',query:{type:1}}">{{$t('foot.newPeople')}}</router-link></p>
						<p><router-link :to="{path:'contact',query:{type:2}}">{{$t('foot.helpCenter')}}</router-link></p>
						<p><router-link to="notice">{{$t('foot.notice')}}</router-link></p>
					</div>
					<div class="verticalBar">
						<p class="title"><router-link to="article">{{$t('nav.about')}}</router-link></p>
					</div>
					<!-- <div>
						<p class="title">App {{$t('foot.upload')}}</p>
					</div> -->
				</div>
				<p class="foot-bottom">{{$t('foot.tip')}}</p>
			</div>
		</div>

</template>
<script>
export default {
    data(){
        return{

        }
    }
}
</script>
<style lang="less">
.foot-box{
    background-color: #1B1924;
    padding: 20px 0;
    margin-top: 60px;
    color: #FFFFFF;
    h3{
        font-weight: inherit;
    }
    .footLayout{
        display: flex;
        flex-direction: row;
    }
    .far{
        align-items: center;
        justify-content: space-between;
    }
    ul {
        li{
            margin-right: 12px;
            &:nth-last-child(1){
                margin: 0;
            }
            a{
                display: inline-block;
            }
        }
    }
    .foot-center{
        border-top: 1px solid #3B3B3B;
        border-bottom: 1px solid #3B3B3B;
        margin: 20px 0;
        padding: 20px 0;
        .logo{
            width: 110px;
            height: 40px;
            margin-right: 120px;
        }
        .title{
            color: #8E8E8E;
            &>a{
                color:#8E8E8E;
            }
        }
        &>div{
            width: 20%;
            // margin-right: 80px;
        }
    }
    .verticalBar a{
        cursor: pointer;
        display: inline-block;
        color: #FFFFFF;
    }
    .foot-bottom{
        color: #8E8E8E;
    }
}

</style>
