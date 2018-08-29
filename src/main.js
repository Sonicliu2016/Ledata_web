import Vue from 'vue';
//引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入Axios(cnpm install axios)
import Axios from 'axios';
//引入Moment(npm install moment --save)
import Moment from 'moment';
//主体
import App from './App.vue';
import Global from './common/global.vue'
import router from './router'

//给Vue原型挂载一个属性
Vue.prototype.global=Global;
Axios.defaults.baseURL=Global.BASE_URL;
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$axios = Axios;

Vue.filter('convertDate',function(value){
  return Moment.unix(value).format('YYYY-MM-DD HH:mm:ss');
});


//安装插件
Vue.use(ElementUI);//挂载ElementUI

new Vue({
  el: '#app',
  router,//这里可以简写
  render: h => h(App)
})
