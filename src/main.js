import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vant.js'

Vue.config.productionTip = false
Vue.prototype.$imgServerUrl = 'http://cdn.xv1998.cn/'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
