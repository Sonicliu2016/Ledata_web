import Vue from 'vue';
import VueRouter from 'vue-router';
//路由切换页面
import Head from './components/head.vue';
import Login from './pages/Login.vue';
import NotFound from './pages/404.vue';
import Home from './pages/home.vue';
import UserList from './pages/user/userList.vue';
import TaskList from './pages/task/taskLists.vue';
import TaskAssign from './pages/task/taskAssign.vue';
import EvaluateTaskList from './pages/task/evaluateTaskList.vue';
import TaggingImage from './pages/task/taggingImage.vue';
import VerificationTask from './pages/task/verificationTask.vue';
import AnotateQualityLabelCheckList from './pages/task/AnotateQualityLabelCheckList.vue';
import AnotateQualityImgCheck from './pages/task/AnotateQualityImgCheck.vue'
import DownloadManager from './pages/dataSet/downloadManager.vue';
import DataSet from './pages/dataSet/dataSet.vue';
import ClassifyImages from './pages/dataSet/classifyImages.vue';
import LabelTask from './pages/task/labelTask.vue';
import VerifyTask from './pages/task/verifyTask.vue';
import UserDetail from './pages/user/userDetail.vue';
import UnrecognizedPage from './pages/task/unrecognizedPage.vue';
import User from './modules/UserModule.js';
import Bus from './bus';
import VideoDataSet from './pages/dataSet/videoDataSet.vue';
import UpdateInfo from './pages/updateInfo.vue';

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
    redirect:'/taskList',
    meta: {
      requireLogin: true,
    },
    children:[
      {name:'updateInfo',path:'/updateInfo',component:UpdateInfo},
      {name:'userList',path:'/userList',component:UserList},
      {name:'taggingImg',path:'/taggingImg',component:TaggingImage},
      {name:'taskList',path:'/taskList',component:TaskList,
        redirect:'/labelTask',
        children:[
                  {name:'labelTask',path:'/labelTask',component:LabelTask},
                  {name:'verifyTask',path:'/verifyTask',component:VerifyTask},
                  {name:'taskAssign',path:'/taskAssign',component:TaskAssign},
                  {name:'unrecognized',path:'/unrecognized',component:UnrecognizedPage},
                  {name:'evaluateTaskList',path:'/evaluateTaskList',component:EvaluateTaskList},
                  ]
      },
      {name:'verificationTask',path:'/verificationTask',component:VerificationTask},
      {name:'userDetail',path:'/userDetail',component:UserDetail},
      {name:'downloadManager',path:'/downloadManager',component:DownloadManager},
      {name:"dataSet",path:'/dataSet',component:DataSet},
      {name:"videoDataSet",path:'/videoDataSet',component:VideoDataSet},
      {name:"classifyImages",path:'/classifyImages',component:ClassifyImages},
      {name:'anotateQualityLabelCheckList',path:'/anotateQualityLabelCheckList',component:AnotateQualityLabelCheckList},
      {name:'anotateQualityImgCheck',path:'/anotateQualityImgCheck',component:AnotateQualityImgCheck},
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
