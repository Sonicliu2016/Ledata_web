<template>
  <div>
    <el-container>
      <el-main>
        <!-- <div>{{evaluateTaskList[1].anocator}}</div> -->
        <el-row  :gutter="20">
          <el-col :span="6" v-for="(task, index) in evaluateTaskList" :key="index" style="padding: 5px;">
            <el-card >
              <div>
                <!-- <span>{{tag.tagname}}</span> -->
                图片数量：{{task.TaskCount}}<br/>
                标注者：{{task.UserName}}<br/>
                <el-button  type="text" class="button" @click="checkSingleImg(task)">单图检查</el-button>
                <el-button  type="text" class="button" @click="checkSingleLabel(task)">单标签检查</el-button><br/>
                <el-button type="danger" plain size="small" @click="relabelEvaluateTaskToAnnotate(task)">重标</el-button>
                <el-button type="success" plain size="small" @click="submitEvaluateTask(task)">保存</el-button>
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
  data(){
    return{
      evaluateTaskList:[],
    }
  },
  methods:{
    backLast(){
      this.$router.go(-1);
    },
    getEvaluateSize(){
      return this.evaluateTaskList.length;
    },
    checkSingleLabel(task){
      this.$router.push({
        name:'anotateQualityLabelCheckList',
        params:{
          taskId:task.TaskUniqueId
        }
      });
    },
    checkSingleImg(task){
      this.$router.push({
        name:'anotateQualityImgCheck',
        params:{
          taskId:task.TaskUniqueId
        }
      });
    },
    getEvaluteTaskList(){
      var params = new URLSearchParams();
      this.$axios({
          method: 'post',
          url:"/task/getEvaluateTasks",
          data:params
      })
      .then(res => {
        if(res.data.code == 200){
          this.evaluateTaskList = res.data.data.tasks;
        }else{
        }
      })
      .catch(err => {
        console.log("getEvaluteTaskList , error:" + err);
        // alert("服务器出现故障，请稍后再试！");
      });
    },
    relabelEvaluateTaskToAnnotate(task){
      var params = new URLSearchParams();
      params.append("taskid",task.TaskUniqueId);
      this.$axios({
          method: 'post',
          url:"/task/relabelEvaluateTaskToAnnotate",
          data:params
      })
      .then(res => {
        if(res.data.code == 200){
          console.log("请求成功，重标");
          this.getEvaluteTaskList();
        }else{
          console.log("请求失败，重标 code"+res.data.code);
        }
      })
      .catch(err => {
        console.log("relabelEvaluateTaskToAnnotate , error:" + err);
        // alert("服务器出现故障，请稍后再试！");
      });
    },
    submitEvaluateTask(task){
      var params = new URLSearchParams();
      params.append("taskid",task.TaskUniqueId);
      this.$axios({
          method: 'post',
          url:"/task/submitEvaluateTask",
          data:params
      })
      .then(res => {
        if(res.data.code == 200){
          console.log("请求成功，保存");
          this.getEvaluteTaskList();
        }else{
          console.log("请求失败，保存 code"+res.data.code);
        }
      })
      .catch(err => {
        console.log("submitEvaluateTask , error:" + err);
        // alert("服务器出现故障，请稍后再试！");
      });
    }
  },
  created(){
    this.getEvaluteTaskList();
  }
}
</script>
<style scoped>

</style>

