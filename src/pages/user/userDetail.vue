<template>
 <div class="content">
   <el-row  :gutter="20">
      <el-col :span="4" v-for="(task, index) in userDetails" :key="index" style="padding: 5px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{task.username}}</span>
          </div>
          <div>
            <span class="task-title">标签任务：</span>
            <p>已完成 <span style="color:#409EFF">{{task.labelTaskCompleted}}</span>张</p>
            <p>未完成 <span style="color:#f00">{{task.labelTaskUndone}}</span>张</p>
            <!-- <div>{{'已完成 ' + task.labelTaskCompleted + '张'}}</div>
            <div>{{'未完成 ' + task.labelTaskUndone + '张'}}</div> -->
            <span class="task-title">验证任务：</span>
            <p>已完成 <span style="color:#409EFF">{{task.verifyTaskCompleted}}</span>张</p>
            <p>未完成 <span style="color:#f00">{{task.verifyTaskUndone}}</span>张</p>
          </div>
        </el-card>
      </el-col>
   </el-row>
 </div>
</template>

<script>
 export default {
   data () {
     return {
       userList:[],
       userDetails:[],
       userTaskDetailUrl:'task/getUserTasksInfo',
     }
   },
   methods: {
     getUserDetails(){
       this.userDetails.splice(0,this.userDetails.length); //先清空数组
       for(var i = 0;i<this.userList.length;i++){
         this.selectUserDetail(this.userList[i].username);
       }
     },
     selectUserDetail(taskowner){ //查看用户的任务完成情况
       var params = new URLSearchParams();
       params.append('username', taskowner);
       this.$axios({
             method: 'post',
             url:this.userTaskDetailUrl,
             data:params
         })
       .then(res=>{
           console.log("请求成功:" + res.data.code);
           if(res.data.code == 200){
             var LabelTasks = res.data.data.LabelTasks;
             var VerifiTasks = res.data.data.VerifiTasks;
             var label_completed = 0;
             var label_uncomplete = 0;
             var verify_completed = 0;
             var verify_uncomplete = 0;
             for(var i = 0;i<LabelTasks.length;i++){
               label_completed += LabelTasks[i].TaskCompeteCount;
               label_uncomplete += LabelTasks[i].TaskCount - LabelTasks[i].TaskCompeteCount;
             }
             for(var j = 0;j<VerifiTasks.length;j++){
               verify_completed += VerifiTasks[j].TaskCompeteCount;
               verify_uncomplete += VerifiTasks[j].TaskCount - VerifiTasks[j].TaskCompeteCount;
             }
             this.userDetails.push({'username':taskowner,'labelTaskCompleted':label_completed,'labelTaskUndone':label_uncomplete,'verifyTaskCompleted':verify_completed,'verifyTaskUndone':verify_uncomplete});
           }else{
             this.$message.error('请求失败！');
           }
         })
       .catch(err=>{
           console.log("error:" + err);
           alert("服务器出现故障，请稍后再试！");
         })
      }
   },
   components: {

   },
   created(){
     this.userList = this.$parent.userList;
   },
   mounted(){
     this.getUserDetails();
   },
   watch:{
     '$parent.userList':function(){
       this.getUserDetails();
     }
   }
 }
</script>

<style scoped>
  .content{
    padding: 15px;
    text-align: center;
  }

  /* .task{
    height: 250px;
    display:flex;
    justify-content:center;
    align-items:center;
  } */

  .clearfix{
    color: #409EFF;
  }

  .task-title{
    font-size: 18px;
    font-weight:bold;
  }
  .box-card {
    /* width: 250px; */
  }
</style>
