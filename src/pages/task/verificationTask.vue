<template>
<div>
  <h2 class="title">请标记下列是{{verifyClassName}}的图片</h2>

  <div class="verify-complete">
    <el-button type="success" @click="verifyComplete()">验证完成，换一批</el-button>
  </div>
  <el-row :gutter="20">
    <el-col :span="4" v-for="(task, index) in imgList" :key="index" style="padding: 5px; ">
      <el-card :body-style="{ padding: '0px' }">
        <div class="img-box" @click="toogle(task)">
          <img v-bind:src="baseurl+task.media_url" />
          <img class="flag" v-show="task.isSelected" src="../../assets/icon_selected.png">
          </div>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>

<script>
import Global from '../../common/global.vue';
import User from '../../modules/UserModule.js';
var user = User;
export default {
  data() {
    return {
      baseurl: "",
      curUser: "",
      taskId: -1,
      verifyClassName: "xx",
      compareName:"xxx",
      selectedLsit: [],
      unSelectedList: [],
      imgList: [],
    };
  },
  methods: {
    showMsg(msg, msgType) {
      this.$message({
        showClose: true,
        message: msg,
        type: msgType
      });
    },
    toogle(task) {
      if (task.isSelected) {
        task.isSelected = false;
      } else {
        task.isSelected = true;
      }
    },
    getVerifyTask() {
      var params = new URLSearchParams();
      params.append("username", this.curUser);
      params.append("tasklimit", 12);
      this.$axios({
          method: 'post',
          url: "/task/getVerifyTask",
          data: params
        })
        .then(res => {
          if (res.data.code == 200) {
            var tasks = res.data.data.taskinfo;
            this.taskId = res.data.data.taskid;
            this.verifyClassName = res.data.data.taskcluster;
            if(this.compareName != this.verifyClassName){
              this.$message({
                message: '注意！现在标记的是'+this.verifyClassName+'的图片',
                showClose: true,
                type: 'warning'
              });
              this.compareName=this.verifyClassName;
            }
            this.imgList.splice(0, this.imgList.length);
            for (var i = 0; i < tasks.length; i++) {
              var timestamp = new Date().getTime();
              this.imgList.push({
                'media_url': tasks[i].MediaNetUrl + "?" + timestamp,
                'isSelected': false,
                'img_md5': tasks[i].MediaMD5
              })
            }
          }
        })
        .catch(err => {
          console.log("getVerifyTask,  error:" + err);
        })
    },
    getSelectedList() {
      this.selectedLsit = [];
      this.unSelectedList = [];
      for (var i = 0; i < this.imgList.length; i++) {
        if (this.imgList[i].isSelected) {
          this.selectedLsit.push(this.imgList[i].img_md5);
        } else {
          this.unSelectedList.push(this.imgList[i].img_md5);
        }
      }
    },
    verifyComplete() {
      console.log("hahahahha");
      this.getSelectedList();
      var params = new URLSearchParams();
      params.append("taskid", this.taskId);
      params.append("username", this.curUser);
      params.append("checklist", this.selectedLsit);
      params.append("nochecklist", this.unSelectedList);
      params.append("clustername", this.verifyClassName);
      this.$axios({
          method: 'post',
          url: "/task/submitVerifyTask",
          data: params
        })
        .then(res => {
          if (res.data.code == 200) {
            this.getVerifyTask();
          } else {
            this.showMsg("所有图片已验证完毕");
          }
        })
        .catch(err => {
          this.showMsg("error:" + err);
          console.log("verifyComplete,  error:" + err);
        })
    }
  },
  created() {
    this.baseurl = Global.BASE_URL;
    this.curUser = user.methods.getUserName();
    this.getVerifyTask();
  }
}
</script>

<style scoped>
.title {
  width: 100%;
  text-align: center;
  padding-top: 20px;
  font-size: 20px;
  color: dimgray;
}

.verify-complete {
  text-align: right;
  margin-right: 20px;
}

.img-box {
  width: 100%;
  height: 300px;
  position: relative;
  z-index: 1;
  background-color: #ebeef5;
}

.img-box img {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.img-box .flag {
  position: absolute;
}
</style>
