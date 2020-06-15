import Vue from 'vue'
import Router from 'vue-router'
import login from '@/view/login'
import register from '@/view/register'
import forget from '@/view/forget'
import index from '@/view/index'
import home from '@/view/home'
import legalCoin from '@/view/legalCoin'
import transaction from '@/view/transaction'
import order from '@/view/order'
import assets from '@/view/assets'
import contact from '@/view/contact'
import article from '@/view/article'
import person from '@/view/person'
import realName from '@/view/realName'
import set from '@/view/set'
import agreement from '@/view/agreement'
import privacy from '@/view/privacy'
import notice from '@/view/notice'
import updateAssets from '@/view/updateAssets'
import updateLogin from '@/view/updateLogin'
import email from '@/view/email'
import detail from '@/view/detail'
Vue.use(Router)

//解决路由中添加了相同的路由
const routerPush  = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush .call(this, location).catch(err => err)
}


export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: index,
      children:[{
        path: '',
        name: 'home',
        component: home,
        meta: ['首页'],
      },{
        path:'/login',
        name:'login',
        component:login,
        meta:['登录']
      },{
        path:'/register',
        name:'register',
        component:register,
        meta:['注册']
      },{
        path:'/forget',
        name:'forget',
        component:forget,
        meta:['忘记密码']
      },{
        path:'/legalCoin',
        name:'legalCoin',
        component:legalCoin,
        meta:['法币']
      },{
        path:'/transaction',
        name:'transaction',
        component:transaction,
        meta:['合约交易']
      },{
        path:'/order',
        name:'order',
        component:order,
        meta:['合约交易订单']
      },{
        path:'/assets',
        name:'assets',
        component:assets,
        meta:['资产']
      },{
        path:'/contact',
        name:'contact',
        component:contact,
        meta:['新手指南']
      },{
        path:'/detail',
        name:'detail',
        component:detail,
        meta:['详情']
      },{
        path:'/article',
        name:'article',
        component:article,
        meta:['关于我们']
      },{
        path:'/agreement',
        name:'agreement',
        component:agreement,
        meta:['用户协议']
      },{
        path:'/privacy',
        name:'privacy',
        component:privacy,
        meta:['隐私条例']
      },{
        path:'/notice',
        name:'notice',
        component:notice,
        meta:['公告']
      },{
        path:'/person',
        name:'',
        component:person,
        children:[{
	        path: '/',
	        name: 'realName',
	        component: realName,
	        meta: ['个人中心'],
	      },{
	        path: '/set',
	        name: 'set',
	        component: set,
          meta: ['安全中心'],
	      },{
	        path: '/updateAssets',
	        name: 'updateAssets',
	        component: updateAssets,
	        meta: ['修改资产密码'],
	      },{
	        path: '/updateLogin',
	        name: 'updateLogin',
	        component: updateLogin,
	        meta: ['修改登录密码'],
	      },{
	        path: '/email',
	        name: 'email',
	        component: email,
	        meta: ['绑定邮箱'],
	      }]
      }]
    }
  ],
  scrollBehavior (to, from, savedPosition) {//savedPosition通过浏览器前进、后退按钮时触发
    return { x: 0, y: 0 }
  }
})
