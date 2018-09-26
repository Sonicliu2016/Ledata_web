<template>
 <div>
   <el-row  :gutter="20">
    <el-col :span="6" v-for="(task, index) in tasksList" :key="index" style="padding: 5px;">
      <el-card>
        <div class="task">
          <span>{{task.taskname}}</span>
          <el-button style="position:absolute; margin-top: 25px;" type="text" class="button" @click="taskDetail(task.taskowner)">点击查看详情</el-button>
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
       tasksList:[],
     }
   },
   methods: {
     setTaskList(){
        this.tasksList.splice(0,this.tasksList.length); //先清空数组
        this.tasksList.push({'taskowner':'noallo','taskname':'未分配的任务列表'});
        // this.tasksList.push({'taskowner':'alloed','taskname':'已分配的任务列表'});
        this.tasksList.push({'taskowner':'evaluated','taskname':'评价任务'});
        this.tasksList.push({'taskowner':'unrecognized','taskname':'未识别图片列表'});
      },
      taskDetail(taskowner){
        console.log("点击taskDetail:" + taskowner);
        if(taskowner == 'noallo' || taskowner == 'alloed'){
          this.$router.push({
                  name:'taskAssign',
                  params:{
                    ownr:taskowner,
                  },
                });

        }else if(taskowner == 'evaluated'){
          this.$router.push({
            name:'evaluateTaskList'
          })

        }else if(taskowner == 'unrecognized'){


        }
      },
   },
   components: {

   },
   created(){

   },
   mounted(){
     this.setTaskList();
    },
 }
</script>

<style scoped>
  .task{
    height: 250px;
    display:flex;
    justify-content:center;
    align-items:center;
  }

</style>
