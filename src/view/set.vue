<template>
	<div class="safeCenter_div">
		<ul>
			<li>
				<div class="title leftSpread">
					<img src="../assets/money-icon.png" alt="" />
					<span>{{$t('recharge.asset')}}</span>
				</div>
				<p>{{$t('person.assetsTip')}}</p>
				<router-link class="themeClass" to="updateAssets">{{$t('person.reset')}}</router-link>
			</li>
			<li>
				<div class="title leftSpread">
					<img src="../assets/loginPwd-icon.png" alt="" />
					<span>{{$t('form.loginPwd')}}</span>
				</div>
				<p>{{$t('person.loginTip')}}</p>
				<router-link class="themeClass" to="updateLogin">{{$t('person.update')}}</router-link>
			</li>
      <li>
        <div class="title leftSpread">
          <img src="../assets/email-icon.png" alt="" />
          <span>{{$t('person.email')}}</span>
        </div>
        <p>{{$t('person.emailTip')}}</p>
        <router-link class="themeClass" to="email">{{$t('person.once')}}</router-link>
      </li>
      <li>
        <div class="title leftSpread">
          <img src="../assets/invite.jpg" alt="" style="height: 30px;"/>
          <span>{{$t('person.invite')}}</span>
        </div>
        <p>{{$t('person.inviteTip')}}:{{inviteCode}}</p>
        <el-button @click="copy" class="themeClass copy" :data-clipboard-text="inviteCode">{{$t('assets.copyAddress')}}</el-button>
      </li>
		</ul>
	</div>
</template>

<script>
import ClipboardJS from 'clipboard'
export default {
  data() {
    return {
      inviteCode: ''
    }
  },
  created () {
    const clipboard = new ClipboardJS('.copy')
    clipboard.on('success', e => {
      this.$message({
        type: 'success',
        message: this.$t('assets.copySuccess')
      })
    })
    clipboard.on('error', e => {
      this.$message.error(this.$t('assets.copyFail'));
    })
    this.inviteCode = window.location.origin + '/#/register?inviteCode=' + btoa(sessionStorage.getItem('inviteCode'))
  },
  methods: {
    copy() {
    }
  }
}
</script>

<style lang="less">
.safeCenter_div{
	ul {
		flex-wrap: wrap;
		display: flex;
		li{
			background-color: #1C1C27;
			border-radius: 4px;
			width: 44%;
			margin: 0 60px 60px 0;
			padding:20px;
			&:nth-child(2n){
				margin-right: 0;
			}
			.themeClass{
				height: 40px;
				line-height: 40px;
				display: inline-block;
				background-color: #87D8EA !important;
				border-radius: 4px;
				width: 100%;
				color: #ffffff;
				text-align: center;
				margin-top: 40px;
        padding: 0;
			}
			.title{
				span{
					font-size: 16px;
					padding-left:12px;
				}
			}
			p{
				color: #C3C3C3;
			}
		}
	}
}
</style>
