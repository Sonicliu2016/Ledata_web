<template>
  <div>
    <el-container>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="6" v-for="(task, index) in evaluateTaskList" :key="index" style="padding: 5px;">
            <el-card :class="{ selectcard:changeSelectedColor == index}">
              <div>
                图片数量：{{task.TaskCount}} <br/>
                标注者：{{task.UserName}} <br/>
                和机器标注一致的数量：{{task.SameCount}} <br/>
                删除的图片数量：{{task.DeletedCount}} <br/>
                <el-button type="text" class="button" @click="checkSingleImg(task,index)">单图检查</el-button>
                <el-button type="text" class="button" @click="checkSingleLabel(task,index)">单标签检查</el-button><br/>
                <el-button type="danger" plain size="small" @click="showDialog(task,1)">重标</el-button>
                <el-button type="success" plain size="small" @click="showDialog(task,0)">保存</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      evaluateTaskList: [],
      changeSelectedColor:-1,
      getDeletedCountAndSameCountsUrl:'/task/getEvaluateTaskDeleteCountAndSameCount',
    }
  },
  methods: {
    showMsg(msg, msgType) {
      this.$message({
        showClose: true,
        message: msg,
        type: msgType
      });
    },
    backLast() {
      this.$router.go(-1);
    },
    getEvaluateSize() {
      return this.evaluateTaskList.length;
    },
    checkSingleLabel(task,index) {
      this.$router.push({
        name: 'anotateQualityLabelCheckList',
        params: {
          taskId: task.TaskUniqueId
        }
      });
      sessionStorage.setItem("selectdIndex", index);
    },
    checkSingleImg(task,index) {
      this.$router.push({
        name: 'anotateQualityImgCheck',
        params: {
          taskId: task.TaskUniqueId
        }
      });
      sessionStorage.setItem("selectdIndex", index);
    },
    getEvaluteTaskList() {
      var params = new URLSearchParams();
      this.$axios({
          method: 'post',
          url: "/task/getEvaluateTasks",
          data: params
        })
        .then(res => {
          if (res.data.code == 200) {
            this.evaluateTaskList = res.data.data.tasks;
          }
        })
        .catch(err => {
          console.log("getEvaluteTaskList , error:" + err);
          // alert("服务器出现故障，请稍后再试！");
        });
    },
    // getDeletedCountAndSameCounts(taskId){
    //   var params = new URLSearchParams();
    //   params.append("taskid", taskId);
    //   this.$axios({
    //       method: 'post',
    //       url: this.getDeletedCountAndSameCountsUrl,
    //       data: params
    //     })
    //     .then(res => {
    //       if (res.data.code == 200) {
    //         var taskid = res.data.data.taskId;
    //         var deletedCount = res.data.data.deletedCount;
    //         var sameCount = res.data.data.sameCount;
    //         for(var i=0; i < this.evaluateTaskList.length;i++){
    //           if(this.evaluateTaskList[i].TaskUniqueId == taskid){
    //              var evaluateItem = new Map();
    //              evaluateItem.set("deletedCount",deletedCount);
    //              evaluateItem.set("sameCount",sameCount);
    //              evaluateItem.set("TaskUniqueId",this.evaluateTaskList[i].TaskUniqueId);
    //              evaluateItem.set("TaskCount",this.evaluateTaskList[i].TaskCount);
    //              evaluateItem.set("UserName",this.evaluateTaskList[i].UserName);
    //              this.EvaluateTaskLists.push(evaluateItem);
    //           }
    //         }
    //       }          
    //     })
    //     .catch(err => {
    //       console.log("getEvaluteTaskList , error:" + err);
    //       // alert("服务器出现故障，请稍后再试！");
    //     });
    // },
    showDialog(task, type) {
      var content = "";
      var msg = "";
      if (type == 0) {
        content = "确定要保存该任务吗？";
        msg = "保存成功！";
      } else {
        content = "确定要重置该任务吗？";
        msg = "重置成功！";
      }
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type == 0) {
          this.submitEvaluateTask(task);
        } else if (type == 1) {
          this.relabelEvaluateTaskToAnnotate(task);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    relabelEvaluateTaskToAnnotate(task) {
      var params = new URLSearchParams();
      params.append("taskid", task.TaskUniqueId);
      this.$axios({
          method: 'post',
          url: "/task/relabelEvaluateTaskToAnnotate",
          data: params
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log("请求成功，重标");
            this.showMsg("返回重标成功");
            this.getEvaluteTaskList();
          } else {
            this.showMsg("返回重标失败，code:" + res.data.code);
            console.log("请求失败，重标 code" + res.data.code);
          }
        })
        .catch(err => {
          this.showMsg("返回重标失败，error:" + err);
          console.log("relabelEvaluateTaskToAnnotate , error:" + err);
          // alert("服务器出现故障，请稍后再试！");
        });
    },
    submitEvaluateTask(task) {
      var params = new URLSearchParams();
      params.append("taskid", task.TaskUniqueId);
      this.$axios({
          method: 'post',
          url: "/task/submitEvaluateTask",
          data: params
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log("请求成功，保存");
            this.showMsg("保存成功");
            this.getEvaluteTaskList();
          } else {
            this.showMsg("保存失败，code:" + res.data.code);
            console.log("请求失败，保存 code" + res.data.code);
          }
        })
        .catch(err => {
          this.showMsg("error:" + err);
          console.log("submitEvaluateTask , error:" + err);
          // alert("服务器出现故障，请稍后再试！");
        });
    }
  },
  mounted(){
    this.DeletedCountAndSameCounts = new Map();
    this.getEvaluteTaskList();
  },
  created() {
    var selectdIndex = sessionStorage.getItem("selectdIndex")
    if (selectdIndex != null){
      this.changeSelectedColor = selectdIndex;
    }    
  }
}
</script>

<style scoped>
.card {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    background-color: #ebeef5;
}

.selectcard {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    background-color: #ebeef5;
}

/* .el-card {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    background-color: #ebeef5;
} */

/* .el-card .flag {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: red;
} */
</style>
