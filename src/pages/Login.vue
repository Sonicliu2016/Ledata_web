<template>
<div class="login-background">
  <div class="login">
    <div class="left-login">
      <div>CV数据标注系统</div>
      <img src="../assets/Lenovo1.png" width="150px">
      <div style="font-size: 80px;font-weight: 600;height:68px;margin-top:-24px">Research</div>
      <div style="font-size: 64px;font-weight: 600;margin-top:10px">联想研究院</div>
      <div style="font-size: 24px;font-weight: 300;margin-top:-10px">AI LAB<br>Lenovo Research Shenzhen Branch<br></div>
      <div style="font-size: 18px;">为了更佳的访问体验，推荐使用谷歌和火狐浏览器</div>
    </div>
    <div class="right-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container" @keyup.enter.native="login">
        <el-form-item prop="username">
          <p>Username</p>
          <el-input type="text" v-model="ruleForm.username" auto-complete="off">
            <!-- <i slot="prefix" class="dbm d-icon-username"></i> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <p>Password</p>
          <el-input type="password" v-model="ruleForm.password" auto-complete="off">
            <!-- <i slot="prefix" class="dbm d-icon-password"></i> -->
          </el-input>
        </el-form-item>
        <!-- <el-checkbox v-model="isAutoLogin" checked class="remember">自动登录</el-checkbox> -->
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="login" :loading="logining">Sign in</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</div>
</template>

<script>
import User from '../modules/UserModule.js';
// import responseInterceptors from '@/main.js';
var user = User;
export default {
  data() {
    return {
      logining: false,
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{
          required: true,
          message: "Please enter your username",
          trigger: "blur"
        }],
        password: [{
          required: true,
          message: "Please enter your password",
          trigger: "blur"
        }]
      },
      isAutoLogin: true,
      loginData: [],
      url: 'user/login',
    }
  },
  methods: {
    login() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // console.log("name:" + this.ruleForm.username + "-->pwd:" + this.ruleForm.password);
          var params = new URLSearchParams();
          params.append('username', this.ruleForm.username); //你要传给后台的参数值 key/value
          params.append('password', this.ruleForm.password);
          this.$axios({
              method: 'post',
              url: this.url,
              data: params
            })
            .then(res => {
              console.log("请求成功:" + res.data.code);
              if (res.data.code == 200) {
                this.loginData = res.data.data;
                // 在这里把用户名和token保存起来
                // localStorage.setItem("current_user",this.ruleForm.username);
                // localStorage.setItem("currentUser_token",user_token);
                user.methods.setUserName(this.ruleForm.username);
                user.methods.setUserRole(res.data.data.UserRole);
                this.$router.push({
                  name: 'home'
                });
              } else {
                alert("账号或密码错误！");
              }
            })
            .catch(err => {
              console.log("error:" + err);
              alert("服务器出现故障，请稍后再试！");
            })
        }
      });

    }
  },
}
</script>

<style>
html,
body {
  height: 100%;
  margin: 0px;
  min-width: 1000px;
}

.login-background {
  /* display: block; */
  width: 100%;
  height: 100%;
  background-image: url(../assets/background.jpg);
  padding: 0;
  background-repeat: no-repeat;
  background-size: cover;
  index: 0;
  /* background-color: rgb(252, 71, 223); */
}

.login {
  background-color: rgba(255, 255, 255, 0.5);
  width: 1000px;
  min-width: 500px;
  height: 100%;
  margin: auto;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: Center;
}

.left-login {
  float: left;
  font-size: 32px;
  color: rgba(0, 0, 0, 0.85);
  font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
    sans-serif;
  font-weight: 600;
  margin-top: -10vh;
  margin-right: 20px;
  /* display: table-cell; */
}

.right-login {
  float: right;
  width: 420px;
  height: 300px;
  /* line-height: 0; */
  /* margin-bottom: 0; */
  margin-top: -10vh;
  margin-left: 20px;
}

.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  line-height: 0;
}
</style>
