<template>
<div>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="6" v-for="(task, index) in evaluateTaskList" :key="index" style="padding: 5px;">
          <el-card>
            <span style="font-weight:bold"> 任务编号：{{task.task_id}} <br />标注者：{{task.marker}}</span>
            <div>
              视频数量：{{task.video_count}} <br />
              和机器标注一致的数量：{{task.sameas_machine_count}} <br />
              删除的视频数量：{{task.deleted_count}} <br />
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
      changeSelectedColor: -1,
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
    getEvaluteTaskList() {
      var params = new URLSearchParams();
      this.$axios({
          method: 'post',
          url: "/video/getAllVideoEvaluateTask",
          data: params
        })
        .then(res => {
          if (res.data.code == 200) {
            this.evaluateTaskList = res.data.data;
          }
        })
        .catch(err => {
          console.log("getEvaluteTaskList , error:" + err);
          // alert("服务器出现故障，请稍后再试！");
        });
    },
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
      params.append("taskId", task.task_id);
      this.$axios({
          method: 'post',
          url: "/video/remarkEvaluateTask",
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
      params.append("taskId", task.task_id);
      this.$axios({
          method: 'post',
          url: "/video/saveEvaluateTask",
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
  mounted() {
    this.DeletedCountAndSameCounts = new Map();
    this.getEvaluteTaskList();
  },
  created() {}
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
</style>
