import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Axios from 'axios'

Vue.use(ElementUI)
Vue.prototype.$axios = Axios

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})