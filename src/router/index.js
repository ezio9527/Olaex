import Vue from 'vue'
import Router from 'vue-router'
import index from '@/view/index'
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
        component: () => import('@/view/home'),
        meta: ['首页'],
      },{
        path:'/login',
        name:'login',
        component: () => import('@/view/login'),
        meta:['登录']
      },{
        path:'/register',
        name:'register',
        component: () => import('@/view/register'),
        meta:['注册']
      },{
        path:'/forget',
        name:'forget',
        component: () => import('@/view/forget'),
        meta:['忘记密码']
      },{
        path:'/legalCoin',
        name:'legalCoin',
        component: () => import('@/view/legalCoin'),
        meta:['法币']
      },{
        path:'/earn',
        name:'earn',
        component: () => import('@/view/earn'),
        meta:['余币宝']
      },{
        path:'/transaction',
        name:'transaction',
        component: () => import('@/view/transaction'),
        meta:['合约交易']
      },{
        path:'/lever-transaction',
        name:'leverTransaction',
        component: () => import('@/view/leverTransaction'),
        meta:['杠杆交易']
      },{
        path:'/order',
        name:'order',
        component: () => import('@/view/order'),
        meta:['合约交易订单']
      },{
        path:'/assets',
        name:'assets',
        component: () => import('@/view/assets'),
        meta:['资产']
      },{
        path:'/contact',
        name:'contact',
        component: () => import('@/view/contact'),
        meta:['新手指南']
      },{
        path:'/detail',
        name:'detail',
        component: () => import('@/view/detail'),
        meta:['详情']
      },{
        path:'/article',
        name:'article',
        component: () => import('@/view/article'),
        meta:['关于我们']
      },{
        path:'/agreement',
        name:'agreement',
        component: () => import('@/view/agreement'),
        meta:['用户协议']
      },{
        path:'/privacy',
        name:'privacy',
        component: () => import('@/view/privacy'),
        meta:['隐私条例']
      },{
        path:'/notice',
        name:'notice',
        component: () => import('@/view/notice'),
        meta:['公告']
      },{
        path:'/person',
        name:'',
        component: () => import('@/view/person'),
        children:[{
	        path: '/',
	        name: 'realName',
          component: () => import('@/view/realName'),
	        meta: ['个人中心'],
	      },{
	        path: '/set',
	        name: 'set',
          component: () => import('@/view/set'),
          meta: ['安全中心'],
	      },{
	        path: '/updateAssets',
	        name: 'updateAssets',
          component: () => import('@/view/updateAssets'),
	        meta: ['修改资产密码'],
	      },{
	        path: '/updateLogin',
	        name: 'updateLogin',
          component: () => import('@/view/updateLogin'),
	        meta: ['修改登录密码'],
	      },{
	        path: '/email',
	        name: 'email',
          component: () => import('@/view/email'),
	        meta: ['绑定邮箱'],
	      }]
      }]
    }
  ],
  scrollBehavior (to, from, savedPosition) {//savedPosition通过浏览器前进、后退按钮时触发
    return { x: 0, y: 0 }
  }
})
