import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'

import Feature from './components/Feature.vue'
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import Today from './components/Today.vue'
import _History from './components/History.vue'
import Forget from './components/Forget.vue'

const routes = [
  { path: '/', component: Feature },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/today', component: Today },
  { path: '/history', component: _History },
  { path: '/forget', component: Forget }
]

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

Vue.config.productionTip = false

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
