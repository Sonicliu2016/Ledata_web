import Vue from 'vue';
import VueRouter from 'vue-router';
//引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//主体
import App from './App.vue';

//路由切换页面
import Login from './pages/Login.vue';
import NotFound from './pages/404.vue';


//注册全局组件


//安装插件
Vue.use(VueRouter);//挂载路由
Vue.use(ElementUI);//挂载ElementUI


//创建路由对象并配置路由规则
let router = new VueRouter({
  routes:[
    {name:'login',path:'/login',component:Login},
     //首页重定向，设置默认首页页面
    {path: '/',redirect:{name:'login'}},
    // 404页面(当输入地址错误时，显示404页面)
    { path: '*', component: NotFound }
  ]
});

new Vue({
  el: '#app',
  router,//这里可以简写
  render: h => h(App)
})
