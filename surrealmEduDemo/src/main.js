import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import loding from './loading'
import toasted from './toasted'
import VueI18n from 'vue-i18n'
import gFunction from './globalFunction'
import VueSocketIO from 'vue-socket.io'

import './assets/scss/main.scss'

Vue.use(gFunction); 
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: localStorage.getItem("nowLanguageID") || 'zh-TW', // 語言標識
  messages: {
    'zh-TW': require('./assets/lang/zh'),
    'en-US': require('./assets/lang/en')
  }
})
Vue.config.productionTip = false;
Vue.use(new VueSocketIO({
  debug: false,
  //connection: 'http://192.168.1.174:3000',
  //connection: 'https://socketiouat.surreal.com.tw',
  connection: 'https://socketio.surreal.com.tw',

  options: {
    path: "",
    autoConnect: false,
  }
}))

new Vue({
  router,
  store,
  loding,
  toasted,
  i18n,
  gFunction,
  render: h => h(App)
}).$mount('#app')

