<template>
<div>

  <div class="login-page">
    <div class=logo>
      <img src="../assets/Lenovo.png">
      <h2>Lenovo Research SZ , AI Lab<br>V 1.0.0 </h2>
    </div>
    <div class="page-content">

      <div class="info">
        <!-- 注意引用图片的方式 -->
        <img src="../assets/logo-blue.png">
        <span>CV数据标注平台</span>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <div class="title">
          <h3>账号密码登录</h3>
        </div>
        <el-form-item prop="username">
          <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="请输入账号">
            <!-- <i slot="prefix" class="dbm d-icon-username"></i> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码">
            <!-- <i slot="prefix" class="dbm d-icon-password"></i> -->
          </el-input>
        </el-form-item>
        <!-- <el-checkbox v-model="isAutoLogin" checked class="remember">自动登录</el-checkbox> -->
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="login" :loading="logining">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</div>
</template>

<script>
import User from '../modules/UserModule.js';
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
          message: "请输入账号",
          trigger: "blur"
        }],
        password: [{
          required: true,
          message: "请输入密码",
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
          console.log("name:" + this.ruleForm.username + "-->pwd:" + this.ruleForm.password);
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
  components: {

  }
}
</script>

<style scoped>
.login-page {
  width: 100%;
  height: 100%;
  background-image: url('../assets/login-back.svg');
  /* background-color: brown; */
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}

.page-content {
  position: absolute;
  width: 400px;
  height: 540px;
  margin: auto;
  top: 112px;
  right: 0;
  left: 0;
}

.info {
  text-align: center;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: Center;
  font-size: 32px;
  color: rgba(0, 0, 0, 0.85);
  font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
    sans-serif;
  font-weight: 600;
}

.info>.img {
  padding-bottom: 3px;
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
}

.login-container>.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.remember {
  margin: 0px 0px 35px 0px;
}

.logo {
  position: absolute;
  right: 10px;
  bottom: 0;
  text-align: center;
  /* display: flex; */
  color: #000000;
  display: block;
}

</style>
