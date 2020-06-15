

import i18n from '@/i18n/index'

//验证码状态

export default function codeStatus(codeStatus,callback){
    var tip = "";
	switch (codeStatus){
		case 100:
			tip = i18n.t('codeTxt.error')
			break;
		case 400:
			tip = i18n.t('codeTxt.errorRequire')
			break;
		case 404:
			tip = i18n.t('codeTxt.noFind')
			break;
		case 500:
			tip = i18n.t('codeTxt.serviceError')
			break;
		case 1001:
			tip = 'unauthorized operation'
			break;
		case 2001:
			tip = i18n.t('codeTxt.codeError')
			break;
		case 2002:
			tip = i18n.t('codeTxt.transPwd')
			break;
		case 2003:
			tip = i18n.t('recharge.setPwd')
			break;
		case 2004:
			tip = i18n.t('codeTxt.noAuthentication')
			break;
		case 20041:
			tip = i18n.t('codeTxt.authentication')
			break;
		case 20042:
			tip = i18n.t('codeTxt.waitAuthent')
			break;
		case 2005:
			tip = i18n.t('codeTxt.noWallet')
			break;
		case 2006:
			tip = i18n.t('codeTxt.oldPwd')
			break;
		case 2007:
			tip = i18n.t('codeTxt.noRecomment')
			break;
		case 2008:
			tip = i18n.t('form.pwdDifferent')
			break;
		case 2009:
			tip = i18n.t('codeTxt.loginPwdError')
			break;
		case 2010:
			tip = i18n.t('codeTxt.accountOr') 
			break;
		case 2011:
			tip = i18n.t('codeTxt.userNoFind') 
			break;
		case 2012:
			tip = i18n.t('codeTxt.hasAcount') 
			break;
		case 2013:
			tip = i18n.t('codeTxt.hasEmail') 
			break;
		case 2014:
			tip = i18n.t('codeTxt.hasPhone') 
			break;
		case 2015:
			tip = 'Not yet open'
			break;
		case 2016:
			tip = i18n.t('codeTxt.AccountDisable') 
			break;
		case 3001:
			tip = i18n.t('codeTxt.lowWithdraw') 
			break;
		case 3002:
			tip = i18n.t('codeTxt.appleWait') 
			break;
		case 3003:
			tip = i18n.t('codeTxt.addressError') 
			break;
		case 3004:
			tip = i18n.t('codeTxt.lowBuy') 
			break;
		case 4001:
			tip = i18n.t('verification.myself') 
			break;
		case 4002:
			tip = i18n.t('codeTxt.cancelOrder')
			break;
		case 4003:
			tip = i18n.t('codeTxt.noOrder')
			break;
		case 4004:
			tip = i18n.t('codeTxt.closeOrder')
			break;
		case 2017:
			tip = i18n.t('codeTxt.accountExit')
			break;
		case 2018:
			tip = ''
			break;
		case 2019:
			tip = ''
			break;
		case 2020:
			tip = i18n.t('codeTxt.withdrawNum')
			break;
		case 2021:
			tip = i18n.t('codeTxt.placeOrder')
			break;
		case 2022:
			tip =  i18n.t('codeTxt.orderExit')
			break;
		case 2023:
			tip = i18n.t('codeTxt.profileHigh')
			break;
		case 2024:
			tip = i18n.t('codeTxt.lossLow')
			break;
		case 2025:
			tip = i18n.t('codeTxt.profileLow')
			break;
		case 2026:
			tip = i18n.t('codeTxt.lossHigh')
			break;
		case 2027:
			tip = i18n.t('codeTxt.inviteError')
			break;
		case 2028:
			tip = ''
			break;
		case 2029:
			tip = i18n.t('codeTxt.transferNum')
			break;
		case 2030:
			tip = i18n.t('codeTxt.transactionBusy')
			break;
		case 2031:
			tip = 'Under funding'
			break;
		case 2032:
			tip = i18n.t('codeTxt.updatePwd')
			break;
		case 2033:
			tip = i18n.t('codeTxt.updateTranscat')
			break;
		case 2034:
			tip = i18n.t('codeTxt.withdrawWait')
			break;
		case 2035:
			tip = 'Received address saved'
			break;
		case 2036:
			tip = 'Ship to address modified'
			break;
		case 2037:
			tip = 'Ship to address deleted'
			break;
		case 2038:
			tip = i18n.t('codeTxt.examine')
			break;
		case 2039:
			tip = i18n.t('codeTxt.binding')
			break;
		case 2040:
			tip = i18n.t('codeTxt.addSuccess')
			break;
		case 2041:
			tip = i18n.t('codeTxt.trasferSuccess')
			break;
		case 2042:
			tip = 'Draw success'
			break;
		case 2043:
			tip = i18n.t('assets.cancelEntrust')
			break;
		case 2044:
			tip = i18n.t('assets.cancelSuccess')
			break;
		case 2045:
			tip = i18n.t('codeTxt.orderSuccess')
			break;
		case 2046:
			tip = i18n.t('assets.cancelSuccess')
			break;
		case 2047:
			tip = i18n.t('person.updatePwd')
			break;
		case 2048:
			tip = 'Completed'
			break;
		default:
			break;
	}
	
	callback(tip)
}