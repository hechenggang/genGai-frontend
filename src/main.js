import Vue from 'vue';
import App from './App.vue';

// 导入路由系统
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// 导入路由所需组件
import Feature from './components/Feature.vue';
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';
import Today from './components/Today.vue';
import _History from './components/History.vue';
import Forget from './components/Forget.vue';
import Setting  from './components/Setting.vue';

// 新建路由所需参数
let routes = [
  { path: '/', component: Feature },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/today', component: Today },
  { path: '/history', component: _History },
  { path: '/forget', component: Forget },
  { path: '/setting', component: Setting },

];

// 实例化路由
let router = new VueRouter({
  routes
});

// 挂载气泡插件
import Push from './components/public/push/push.js';
Vue.use(Push);

// 生产环境提醒
// Vue.config.productionTip = false;

// 实例化Vue
new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app');
