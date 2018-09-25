<template>
  <div class="homecontent">
    <header-vue></header-vue>
    <router-view></router-view>
  </div>
</template>

<script>
import User from '../modules/UserModule.js';
var user = User;
export default {
  data() {
    return {
      getAllUserUrl:'http://10.5.11.127:8080/user/getalluser',
      userList: [],
    };
  },
  methods: {
    // 获取用户列表
    getUserList(){
      console.log("home--->收到子类请求:");
      var params = new URLSearchParams();
      params.append('username', 'admin'); 
      params.append('page', 0);
      params.append('pageSize', 100);
      this.$axios({
          method: 'post',
          url:this.getAllUserUrl,
          data:params
      })
      .then(res=>{
        console.log("home请求成功:" + res.data.code);
        if(res.data.code == 200){
          var userinfo = res.data.data.userinfo;
          console.log(userinfo);
          this.userList.splice(0,this.userList.length); //先清空数组
          user.methods.removeAllUsers();
          for(var i = 0;i<userinfo.length;i++){
            this.userList.push({
              'createtime':userinfo[i].Created,
              'username':userinfo[i].UserName,
              'password':userinfo[i].UserPass,
              'showDelete':userinfo[i].UserName == "admin" ? false:true,
            });
          }
          //保存所有用户信息
          user.methods.storeUsers(this.userList);
        }else{
          this.$message.error('获取信息失败！');
        }
      })
      .catch(err=>{
        console.log("error:" + err);
        alert("服务器出现故障，请稍后再试！");
      })
    },
  },
  created(){
    this.getUserList();
  },
  watch:{

  },
  components: {

  }
};
</script>

<style scoped>

</style>
