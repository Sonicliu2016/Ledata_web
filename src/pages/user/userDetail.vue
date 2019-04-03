<template>
<div class="content">
  <el-row :gutter="20">
    <el-col :span="4" v-for="(task, index) in userDetails" :key="index" style="padding: 5px;">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{task.username}}</span>
        </div>
        <div>
          <span class="task-title">标签任务：</span>
          <!-- <p>已完成 <span style="color:#409EFF">{{task.labelTaskCompleted}}</span>张</p> -->
          <p>图片 <span style="color:#f00">{{task.imageLabel}}</span> 张 &nbsp 视频 <span style="color:#f00">{{task.videoLabel}}</span>个</p>
          <!-- <div>{{'已完成 ' + task.labelTaskCompleted + '张'}}</div>
            <div>{{'未完成 ' + task.labelTaskUndone + '张'}}</div> -->
          <span class="task-title">验证任务：</span>
          <!-- <p>已完成 <span style="color:#409EFF">{{task.verifyTaskCompleted}}</span>张</p> -->
          <p>图片 <span style="color:#f00">{{task.imageVerify}}</span>张 &nbsp 视频 <span style="color:#f00">{{task.videoVerify}}</span>个</p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  data() {
    return {
      userDetails: [],
      userTaskDetailUrl: 'task/getAllUserTaskState',
    }
  },
  methods: {
    getUserDetails() { //查看用户的任务完成情况
      this.userDetails.splice(0, this.userDetails.length); //先清空数组
      var params = new URLSearchParams();
      this.$axios({
          method: 'post',
          url: this.userTaskDetailUrl,
          data: params
        })
        .then(res => {
          console.log("请求成功:" + res.data.code);
          if (res.data.code == 200) {
            var userDetail = res.data.data;
            for (var i = 0; i < userDetail.length; i++) {
              this.userDetails.push({
                'username': userDetail[i].user_name,
                'imageLabel': userDetail[i].image_label_task_count,
                'imageVerify': userDetail[i].image_verify_task_count,
                'videoLabel': userDetail[i].video_label_task_count,
                'videoVerify': userDetail[i].video_complete_count
              });
            }
          } else {
            this.$message.error('请求失败！');
          }
        })
        .catch(err => {
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试！");
        })
    }
  },
  components: {

  },
  created() {},
  mounted() {
    this.getUserDetails();
  },
  watch: {
    '$parent.userList': function() {
      this.getUserDetails();
    }
  }
}
</script>

<style scoped>
.content {
  padding: 15px;
  text-align: center;
}

/* .task{
    height: 250px;
    display:flex;
    justify-content:center;
    align-items:center;
  } */

.clearfix {
  color: #409EFF;
}

.task-title {
  font-size: 18px;
  font-weight: bold;
}

.box-card {
  /* width: 250px; */
}
</style>
