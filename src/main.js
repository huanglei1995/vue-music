import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazy from 'vue-lazyload'
import 'vue-awesome/icons/flag'
import 'vue-awesome/icons'
import store from './store/index'
import Icon from 'vue-awesome/components/Icon'
import './assets/stylus/icon.styl'
// import fastclick from 'fastclick'

Vue.config.productionTip = false
Vue.component('icon', Icon)
// fastclick.attach(document.body)
Vue.use(VueLazy, {
  loading: require('./assets/logo.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
