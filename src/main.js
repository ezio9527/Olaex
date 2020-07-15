// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import i18n from './i18n'

import App from './App'
import router from './router'
import './plugin'

Vue.config.productionTip = false

import less from 'less'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/index.js'

import './js/jquery-3.2.1.min.js'

Vue.use(less)

Vue.use(ElementUI)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  components: { App },
  template: '<App/>'
})
