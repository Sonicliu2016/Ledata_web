import Vue from 'vue';
import VueRouter from 'vue-router';
//路由切换页面
import Head from './components/head.vue';
import Login from './pages/Login.vue';
import NotFound from './pages/404.vue';
import Home from './pages/home.vue';
import UserList from './pages/user/userList.vue';
import TaskList from './pages/task/taskList.vue';
import TaskAssign from './pages/task/taskAssign.vue';
import TaggingImage from './pages/tagging/taggingImage.vue';
import User from './modules/UserModule.js';

//注册全局组件
Vue.component('headerVue', Head);
//挂载路由
Vue.use(VueRouter)

var user = User;
const routes = [
  {name:'login',path:'/login',component:Login},
  //首页重定向，设置默认首页页面
  {path: '/',redirect:{name:'login'}},
  {name:'home',path:'/home',component:Home,
    redirect:'/home/taskList',
    meta: {
      requireLogin: true,
    },
    children:[
      {name:'userList',path:'userList',component:UserList},
      {name:'taskList',path:'taskList',component:TaskList},
      {name:'taggingImage',path:'taggingImg',component:TaggingImage},
      {name:'taskAssign',path:'taskAssign',component:TaskAssign}
    ]
  },
  // 404页面(当输入地址错误时，显示404页面)
  {path: '*', component: NotFound }
];

const router = new VueRouter({
    routes
});

const whiteList = ['/login', '*']; // 免登白名单

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireLogin)) {  // 判断该路由是否需要登录权限
    var username = user.methods.getUserName();
    console.log("判断token" + user.methods.getUserName());
    if(username != null && username !=""){
      next();
    }else{
      next({
        path: '/login', // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }else {
    next();
  }
})

export default router;