<template>
  <div class = "ui-header">
    <el-row :gutter="1" type="flex" class="row-bg el-row-three">
      <el-col :span="4">
        <div class="logo-content">
          <img class="logo" src="../assets/logo.png">
          <span class="title">LeData</span>
        </div>
      </el-col>

      <el-col :span="17">
        <div class="nav-content">
          <!-- 导航菜单 -->
          <el-menu :default-active="$router.path" router class="el_menu" mode="horizontal" text-color="#fff" active-text-color="#ffd04b" background-color="#545c64">
            <template  v-for="(item,i) in navList">
              <el-submenu :index="item.name" v-if="item.hasChild">
                <template slot="title">{{item.menuName}}</template>
                <el-menu-item v-for="(itemChild,index) in item.children" :index="itemChild.name" :key="index">
            　　  {{itemChild.menuName}}
                </el-menu-item>
              </el-submenu>
              <el-menu-item :index="item.name" v-else>
                {{item.menuName}}
              </el-menu-item>
            </template>

          </el-menu>

          <!-- <el-menu :default-active="activeIndex" class="el_menu" mode="horizontal" @select="handleSelect"
                    text-color="#fff" active-text-color="#ffd04b" background-color="#545c64">

            <el-menu-item index="1" class="menu_title" v-show="isAdmin">
              <router-link :to="{name:'userList'}">用户管理</router-link>
            </el-menu-item>

            <el-menu-item index="2" class="menu_title">
              <router-link :to="{name:'taskList'}">任务管理</router-link>
            </el-menu-item>

            <el-submenu index="4" class="menu_title">
              <template slot="title">标注任务</template>
              <router-link :to="{name:'taggingImg'}">
                <el-menu-item index="4-1">标注任务</el-menu-item>
              </router-link>
              <router-link :to="{name:'verificationTask'}">
                <el-menu-item index="4-2">验证任务</el-menu-item>
              </router-link>
            </el-submenu>

          </el-menu> -->
          <!-- 导航菜单 -->
        </div>
      </el-col>

      <el-col :span="3">
        <div class="user-content">
          <el-dropdown @command="handleCommand">
            <span class="userinfo">{{username}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item command="usercenter">个人中心</el-dropdown-item> -->
              <el-dropdown-item command="logout">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
 import User from '../modules/UserModule.js';
 var user = User;
 export default {
   data () {
     return {
      username:'',
      activeIndex: '2',
      isAdmin:true,
      navList:[
        {name:'userList',menuName:'用户管理',hasChild:false},
        {name:'taskList',menuName:'任务管理',hasChild:false},
        {name:'userDetail',menuName:'用户任务详情',hasChild:false},
        {name:'downloadManager',menuName:'下载管理',hasChild:false},
        {name:'taggingImg',menuName:'我的任务',hasChild:true,
              children:[
                {name:'taggingImg',menuName:'标注任务'},
                {name:'verificationTask',menuName:'验证任务'}
              ]
        },
        {name:'helpDoc',menuName:'帮助',hasChild:false}
      ],
    };
   },
   methods: {
      handleCommand(command){
        if(command == "logout"){
          console.log("注销登录");
          user.methods.removeUser();
          this.$router.push({
                  name:'login'
                });
        }
      },
      getNavIndex(){
        this.activeIndex = this.$store.state.navIndex;
      },
      deleteFromList(list,menuName){
        for(var i = 0; i<list.length; i++){
          if(list[i].menuName == menuName){
            list.splice(i,1);
          }
        }
      }
   },
   components: {

   },
   created(){
     this.username = user.methods.getUserName();
     if(user.methods.isAdmin()){
       this.isAdmin = true;
     }else{
       this.isAdmin = false;
       this.deleteFromList(this.navList,'用户管理');
       this.deleteFromList(this.navList,'用户任务详情');
       this.deleteFromList(this.navList,'下载管理');
      //  this.navList.shift();
     }
   },
   watch:{
     '$store.state.navIndex':function(){
      //  this.getNavIndex();
     },
   }
 }
</script>

<style scoped>

 .ui-header{
   height: 64px;
   line-height: 64px;
   width: 100%;
   background-color: rgb(84, 92, 100);
   top: 0;
   left: 0;
 }

  .logo-content,
  .nav-content,
  .user-content {
    background-color: rgb(84, 92, 100);
    border-radius: 4px;
    min-height: 64px;
    max-height: 64px;
    min-width: 100px;
  }

  .user-content{
    text-align: center;
  }

  .logo-content > .logo{
    width: 40px;
    height: 40px;
    border-radius: 50px;
    margin-top: 12px;
    margin-left: 20px;
    margin-right: 10px;
    float: left;
    position: relative;
  }

  .logo-content > .title{
    font-size: 18px;
    font-weight: bold;
    color: azure;
    line-height: 64px;
  }

  .el-dropdown{
    width: 100px;
    height: 64px;
    text-align: center;
  }

  .el-dropdown >.userinfo{
    color: #fff;
    font-size: 18px;
  }

  /*导航菜单*/
  .el-menu {
    height: 64px;
    border-right: solid 0px;
    list-style: none;
    position: relative;
    float: right;
  }

  .menu_title {
    width: 150px;
    text-align: center;
  }

  .el-dropdown-menu__item{
    list-style-type:none;
  }

  /* 去掉router-link链接文字的下划线 */
  a {
    text-decoration: none;
  }
</style>
