<template>
<div class="ui-header">
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
          <template v-for="(item,i) in navList">
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
    <el-col :span="1">
      <div class="download-content" v-if="isAdmin">
        <el-dropdown>
          <i class="el-icon-download" style="padding-top:20px;font-size: 25px;color:#fff"></i>
          <el-dropdown-menu slot="dropdown">
            <el-table :data="downloadList" class="downloadTable" align="center" border height="400">
              <el-table-column prop="zip_name" label="下载名称" width="180" align="center">
              </el-table-column>
              <el-table-column prop="downloadStatus" label="下载状态" width="100" align="center">

              </el-table-column>
              <el-table-column label="操作" width="100" align="center">
                <div slot-scope="scope">
                  <i class="el-icon-loading" v-show='scope.row.zip_url==""'></i>
                  <el-button @click="downloadFile(scope.row)" type="text" v-show='scope.row.zip_url!=""'>下载</el-button>
                  <!-- <el-button @click="deleteDownload(scope.row)" type="text">删除</el-button> -->
                  <div @click="deleteDownload(scope.row)" style="cursor: pointer;display:inline" v-show='scope.row.zip_url!=""'>
                    <i class="el-icon-close"></i>
                  </div>
                </div>
              </el-table-column>
            </el-table>
          </el-dropdown-menu>
        </el-dropdown>
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
            <el-dropdown-item command="helpDoc">使用指南</el-dropdown-item>
            <el-dropdown-item command="updateInfo">版本信息</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>

  </el-row>
</div>
</template>

<script>
import Global from '../common/global';
var global = Global;
import User from '../modules/UserModule.js';
var user = User;
import Bus from '../bus'; //中央总线用于和download传输当前正在进行的任务数
export default {
  data() {
    return {
      getBigFileUrl: 'file/getBigFile',
      signal: 0,
      downloadNum: 0,
      downloadList: [],
      baseUrl: '',
      helpDocUrl: '',
      username: '',
      activeIndex: 'userList',
      isAdmin: true,
      navList: [{
          name: 'userList',
          menuName: '用户管理',
          hasChild: false
        },
        {
          name: 'task',
          menuName: '任务管理',
          hasChild: true,
          children: [{
              name: 'taskList',
              menuName: '图片任务管理'
            },
            {
              name: 'videoTaskList',
              menuName: '视频任务管理'
            }
          ]
        },
        {
          name: 'userDetail',
          menuName: '用户任务详情',
          hasChild: false
        },
        {
          name: 'downloadManager',
          menuName: '数据管理',
          hasChild: true,
          children: [{
              name: 'downloadManager',
              menuName: '下载'
            },
            {
              name: 'dataSet',
              menuName: '图片数据集'
            },
            {
              name: 'videoDataSet',
              menuName: '视频数据集'
            },
          ]
        },
        {
          name: 'taggingImg',
          menuName: '我的任务',
          hasChild: true,
          children: [{
              name: 'taggingImg',
              menuName: '图片标注任务'
            },
            {
              name: 'verificationTask',
              menuName: '图片验证任务'
            },
            {
              name: 'taggingVideo',
              menuName: '视频标注任务'
            }
          ]
        }
      ],
    };
  },
  methods: {
    //发送正在压缩的任务数
    sendToDownload() {
      Bus.$emit('num', this.downloadNum);
    },
    getDownloadList() {
      var params = new URLSearchParams();
      params.append('userName', this.username);
      this.$axios({
          method: 'post',
          url: '/file/getDownloadTaskList',
          data: params,
        })
        .then(res => {
          console.log("请求下载列表成功:" + res.data.code);
          if (res.data.code == 200) {
            if (res.data.data != "") {
              this.downloadList = res.data.data.zips_url;
              this.downloadNum = 0;
              for (var i = 0; i < this.downloadList.length; i++) {
                if (this.downloadList[i].zip_url == "") {
                  this.downloadList[i].downloadStatus = "正在压缩";
                  this.downloadNum++;
                } else {
                  this.downloadList[i].downloadStatus = "压缩完毕";
                }
              }
              this.sendToDownload();
              if (this.downloadNum > 0) {
                //等待一段时间再查询一次任务列表
                this.sleep(3000).then(() => {
                  this.getDownloadList();
                })
                console.log("有任务执行");
              }
            } else {
              this.downloadList = [];
            }
          }

        })
        .catch(err => {
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试");
        })
    },
    //等待函数
    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },
    downloadFile(row) {
      window.location.href = global.BASE_URL + this.getBigFileUrl + "?path=" + row.zip_url;
    },
    deleteDownload(row) {
      console.log(row);
      var params = new URLSearchParams();
      params.append('zipName', row.zip_name);
      this.$axios({
          method: 'post',
          url: '/file/deleteDownloadTask',
          data: params
        })
        .then(res => {
          console.log("删除成功:" + res.data.code);
          if (res.data.code == 200) {
            this.getDownloadList();
          }
        })
        .catch(err => {
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试！");
        })
    },
    handleCommand(command) {
      if (command == "logout") {
        console.log("注销登录");
        user.methods.removeUser();
        this.$router.push({
          name: 'login'
        });
      } else if (command == "helpDoc") {
        this.$showPDF(this.helpDocUrl);
      } else if (command == "updateInfo") {
        this.$router.push({
          name: 'updateInfo'
        });
      }
    },
    getNavIndex() {
      this.activeIndex = this.$store.state.navIndex;
    },
    deleteFromList(list, menuName) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].menuName == menuName) {
          list.splice(i, 1);
        }
        if (list[i].hasChild) {
          for (var j = 0; j < list[i].children.length; j++) {
            if (list[i].children[j].menuName == menuName) {
              list[i].children.splice(j, 1);
            }
          }
        }
      }
    }
  },
  components: {

  },
  created() {
    this.baseUrl = global.BASE_URL;
    this.helpDocUrl = this.baseUrl + 'static/pdf/ledataHelpDoc.pdf';
    this.username = user.methods.getUserName();
    this.signal = 0;
    if (user.methods.isAdmin()) {
      this.isAdmin = true;
      this.getDownloadList();
    } else {
      this.isAdmin = false;
      this.deleteFromList(this.navList, '用户管理');
      this.deleteFromList(this.navList, '用户任务详情');
      this.deleteFromList(this.navList, '下载');
      //  this.navList.shift();
    }

  },
  mounted() {
    //接受download新任务产生的信号量
    Bus.$on('signal', (e) => {
      this.signal = this.signal + e;
      console.log("signal " + this.signal);
    })
  },
  watch: {
    '$store.state.navIndex': function() {
      //  this.getNavIndex();
    },
    //监视信号量改变，触发 created 之后的第一次查询
    signal() {
      this.getDownloadList();
    }
  }
}
</script>

<style scoped>
.ui-header {
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

.user-content {
  text-align: center;
}

.logo-content>.logo {
  width: 40px;
  height: 40px;
  border-radius: 50px;
  margin-top: 12px;
  margin-left: 20px;
  margin-right: 10px;
  float: left;
  position: relative;
}

.logo-content>.title {
  font-size: 18px;
  font-weight: bold;
  color: azure;
  line-height: 64px;
}

.el-dropdown {
  width: 100px;
  height: 64px;
  text-align: center;
}

.el-dropdown>.userinfo {
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

.el-dropdown-menu__item {
  list-style-type: none;
}

.downloadTable {
  width: 100%;
  height: 400px;
  /* overflow-y: scroll; */
  text-align: center;
  /* padding: 5px; */
}
/* 去掉router-link链接文字的下划线 */
a {
  text-decoration: none;
}
</style>
