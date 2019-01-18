<template>
<div>
  <el-row :gutter="20" type="flex" justify="center">
    <el-col :xs="12" :sm="8" :md="6" :lg="6" :span="6" v-for="(task, index) in tasksList" :key="index" style="padding: 20px;">
      <el-card>
        <div class="task" style="cursor: pointer;" @click="taskDetail(task.taskowner)">
          <img src="../../assets/logo-blue.png">
          <span style="font-size:20px">{{task.taskname}}</span>
          <!-- <el-button style="position:absolute; margin-top: 25px;" type="text" class="button" @click="taskDetail(task.taskowner)">点击查看详情</el-button> -->
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
      tasksList: [],
    }
  },
  methods: {
    setTaskList() {
      this.tasksList.splice(0, this.tasksList.length); //先清空数组
      this.tasksList.push({
        'taskowner': 'noallo',
        'taskname': '未分配的任务列表'
      });
      // this.tasksList.push({'taskowner':'alloed','taskname':'已分配的任务列表'});
      // this.tasksList.push({'taskowner':'evaluated','taskname':'评价任务'});
      // this.tasksList.push({'taskowner':'unrecognized','taskname':'未识别图片列表'});
    },
    taskDetail(taskowner) {
      console.log("点击taskDetail:" + taskowner);
      if (taskowner == 'noallo' || taskowner == 'alloed') {
        this.$router.push({
          name: 'taskAssign',
          params: {
            ownr: taskowner,
            taskType: '1', //0为标注任务,1为验证任务
          },
        });
      }
    },
  },
  components: {

  },
  created() {

  },
  mounted() {
    this.setTaskList();
  },
}
</script>

<style scoped>
.task {
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
