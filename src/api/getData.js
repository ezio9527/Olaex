import fetch from '@/config/fetch'

/**
* 获取行情
*/
export const klineApi = data => fetch('/api/common/kline',data,false)

/**
 * 获取验证码
 */
export const sendMsgApi = data => fetch('/api/getMsg',data,false)

/**
 * 获取验证码2
 */
export const sendApi = () => fetch('/api/getMsg',{},true)

/**
 * 区号
 */
export const areaNumApi = () => fetch('/api/common/phoneCode',{},false)

/**
 * 注册
 */
export const registerApi = data => fetch('/api/register',data,false);

/**
 * 登陆
 */
export const loginApi = data => fetch('/api/login', data, false);

/***
 * 忘记密码
 */
export const updatePwdApi = data => fetch('/api/forgetPwd',data,false);

/**
 * 修改资产,登录密码
 */
export const updateAssetApi = data => fetch('/api/pwd',data,true);

/**
 * 绑定账号
 */
export const bindAccountApi = data => fetch('/api/bindAccount',data,true);

/**
 * 钱包资产
 */
export const walletApi = data => fetch('/api/wallet',data,true);

/**
 * 余币宝利息列表
 */
export const earningsApi = data => fetch('/api/surplus',data,true);

/**
 * 余币宝收益列表
 */
export const earnListApi = data => fetch('/api/surplus/list',data,true);

/**
 * 余币宝资产
 */
export const earnApi = data => fetch('/api/surplus/user',data,true);

/**
 * 划转到余币宝
 */
export const earnInApi = data => fetch('/api/surplus/rollIn',data,true);

/**
 * 从余币宝划转出来
 */
export const earnOutApi = data => fetch('/api/surplus/rollOut',data,true);

/**
 * 充币地址
 */
export const rechargeAddressApi = () => fetch('/api/platformAddress',{},true);

/**
 * 充币
 */
export const rechargeApi = data => fetch('/api/recharge',data,true);

/**
 * 充币、提币记录
 */
export const coinRecordApi = data => fetch('/api/coinRecord',data,true);

/**
 * 提币
 */
export const withdrawCoinApi = data => fetch('/api/withdrawCoin',data,true);

/**
 * 提币页面信息
 */
export const withdrawPageApi = data => fetch('/api/withdrawPage',data,true);

/**
 * 添加，删除提币钱包地址
 */
export const addAddressApi = data => fetch('/api/coin',data,true);

/**
 * 钱包地址
 */
export const walletAddressApi = data => fetch('/api/coinList',data,true);

/**
 *内部转账页面信息
 */
export const transferPageApi = () => fetch('/api/transferPage',{},true);

/**
 *内部转账
 */
export const transfersApi = data => fetch('/api/transfer',data,true);

/**
 *内部转账记录
 */
export const transfersRcordApi = data => fetch('/api/transferRecordFlow',data,true);

/**
 * 资产划转页面信息
 */
export const convertPageApi = data => fetch('/api/convertPage ',data,true);

/**
 * 资产划转
 */
export const convertApi = data => fetch('/api/convert',data,true);

/**
 * 图片上传
 */
export const fileUploadApi = data => fetch('/api/upload/file',data,true);

/**
 * 首页内容
*/
//banner图
export const bannerApi = ()  => fetch('/api/common/carousel',{},false);

/**
 *合作平台
 */
export const partenApi = () => fetch('/api/common/partenshipList',{},false);

/**
 * 币种行情
 */
export const ticketApi = () => fetch('/api/common/huobiTicket',{},false);

/**法币页面 */
/**
 * 法币信息
 */
export const legalInformApi = () => fetch('/api/legalPage',{},true);

/**
 * 购买法币
 */
export const buyLegalApi = () => fetch('/api/legal',{},true);

/**
 * 购买法币记录
 */
export const buyLegalRecordApi = data => fetch('/api/legalList',data,true);

/**
 * 用户模块
*/
export const userInformApi = () => fetch('/api/info',{},true);

//实名认证
export const certificationApi = data => fetch('/api/verify',data,true);

//流水记录
export const assetsRecordApi = data => fetch('/api/cashflow',data,true);

//转币
// export const transferApi = data => fetch('/api/collect/transfer',data,true);

/**合约模块 */
/**
 * 合约列表
 */
export const contractListApi = data => fetch('/api/contractList',data,true);

/**
 *  币种深度行情
 */
export const tradeListApi = data => fetch('/api/common/tradeList',data,false);

/**
 * 取消委托
 */
export const cancelListApi = data => fetch('/api/cancelContract',data,true);

/**
 * 平仓
 */
export const outContractApi = data => fetch('/api/outContract',data,true);

/**
 * 设置止盈止损
 */
export const contractPlApi = data => fetch('/api/contractPl',data,true);

/**
 * 杠杆倍率列表
 */
export const leverageApi = data => fetch('/api/leverage',data,true);

/**
 * 合约页面信息
 */
export const contractPageApi = data => fetch('/api/contractPage',data,true)

/**
 * 合约交易
 */
export const contractApi = data => fetch('/api/contract',data,true)

/**
 * 退出登录
 */
export const userOutApi = () => fetch('/api/logout',{},true);

/**
 * 用户协议
 */
export const agreementApi = () => fetch('/api/common/declares',{},false);

/**
 * 关于我们
 */
export const aboutApi = data => fetch('/api/common/article',data,false);

/**
 * 新手指南，帮助中心
 */
export const helpApi = data => fetch('/api/common/problem',data,false);

/**
 * 官方公告
 */
export const noticeApi = data => fetch('/api/common/newsList',data,false);

/**
 * 借币
 */
export const borrowApi = data => fetch('/api/borrow',data,true);

/**
 * 借币信息查询
 */
export const borrowInfoApi = data => fetch('/api/borrow/basic',data,true);

/**
 * 还币
 */
export const repayApi = data => fetch('/api/repay',data,true);

/**
 * 杠杆交易买入卖出
 */
export const leverApi = data => fetch('/api/currency',data,true);

/**
 * 撤销杠杆交易买入卖出
 */
export const leverCancelApi = data => fetch('/api/cancelCurrency',data,true);

/**
 * 杠杆交易详情
 */
export const leverPageApi = data => fetch('/api/currencyPage',data,true);

/**
 * 杠杆交易记录
 */
export const leverRecordApi = data => fetch('/api/currencyRecord',data,true);
