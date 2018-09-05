<template>
  <div>
    <el-container>
      <el-header>
        <el-button type="primary" @click="backLast">返回任务列表</el-button>
      </el-header>

      <el-main >
        <el-row  :gutter="20">
          <el-col :span="6" v-for="(tag, index) in tagsList" :key="index" >
            <el-card >
              <div class="tag">
                <!-- <span>{{tag.tagname}}</span> -->
                {{tag.cluster_name}}<br/>
                {{tag.count}}<br/>
                <el-button type="text" @click="showAssignTaskDialog(tag)">分配</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <div v-show="noTask">
          没有任务
        </div>
      </el-main>

      <el-dialog title="任务分配" :visible.sync="showAssignTask">
        
        <el-form :model="taskForm">
          <el-form-item label="标签" :label-width="formLabelWidth">
            <span>{{taskForm.tagName}}({{taskForm.maxCount}}张)</span>
          </el-form-item>
          <el-form-item label="分配给用户" :label-width="formLabelWidth">
            <el-select v-model="taskForm.taskOwner" placeholder="请选择用户">
              <el-option v-for="(user,index) in userList" :value="user.username" :key="index"> 
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分配数量" :label-width="formLabelWidth">
            <el-input-number v-model="taskForm.assignCount" :max="taskForm.maxCount" :min="1"  style="width:215px"></el-input-number>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="showAssignTask = false">取 消</el-button>
          <el-button type="primary" @click="assignTask">确 定</el-button>
        </div>
      </el-dialog>


    </el-container>
  </div>
</template>

<script>
  import User from '../../modules/UserModule.js';
  var user = User;
  export default {
   data () {
     return {
       tagsList:[],
       userList:[],
       taskName:'', //记录当前是已分配的任务还是未分配的任务
       currentUser:'',//当前登录的用户
       getAllTagsUrl:'http://10.5.11.127:8080/task/getTaskCluster',
       assignTaskUrl:'http://10.5.11.127:8080/task/assignTaskToUser',
       showAssignTask:false,
       noTask:false,
       taskForm:{
         tagName:'', //当前被分配的标签
         taskOwner:'', //任务分配给了谁
         assignCount:1, //分配了多少张
         maxCount:0,
       },
       formLabelWidth: '120px',
     }
   },
   methods: {
     backLast(){
       this.$router.go(-1);
     },
     showAssignTaskDialog(tag){
       this.showAssignTask = true;
       this.taskForm.tagName = tag.cluster_name;
       this.taskForm.maxCount = tag.count;
     },
     assignTask(){
       var params = new URLSearchParams();
       params.append('username', this.currentUser);
       params.append('assignusername', this.taskForm.taskOwner);
       params.append('allowed', this.taskName);
       params.append('count', this.taskForm.assignCount);
       params.append('clustername', this.taskForm.tagName);
       this.$axios({
            method: 'post',
            url:this.assignTaskUrl,
            data:params
        })
       .then(res=>{
          console.log("请求成功:" + res.data.code);
          if(res.data.code == 200){
            this.$message({message: '任务分配成功!', type: 'success'});
          }else{
            this.$message.error('任务分配失败！');
          }
        })
       .catch(err=>{
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试！");
        })
       this.showAssignTask = false;
     },
     getTags(task){
        var params = new URLSearchParams();
        params.append('assignusername', task);
        this.$axios({
            method: 'post',
            url:this.getAllTagsUrl,
            data:params
        })
        .then(res=>{
          console.log("请求成功:" + res.data.code);
          if(res.data.code == 200){
            var tags = res.data.data.clusters;
            console.log(tags);
            this.tagsList.splice(0,this.userList.length); //先清空数组
            this.tagsList = tags;
            if(this.tagsList != null){
              this.noTask = false;
            }else{
              this.noTask = true;
            }
          }else{
            this.$message.error('获取信息失败！');
          }
        })
        .catch(err=>{
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试！");
        })
      },
   },
   components: {

   },
   //组件创建后,  数据已经完成初始化，但是DOM还未生成
   created(){
     let routerParam = this.$route.params.dataObj;
     this.taskName = routerParam; //获取是已分配还是未分配的任务
     this.userList = this.$parent.userList; //获取用户列表
     this.currentUser = user.methods.getUserName(); //获取当前登录的用户
     console.log("taskAssign:-->" + this.taskName);
   },
   //数据装载DOM上后，各种数据已经就位,将数据渲染到DOM上，DOM已经生成
   mounted(){
     this.getTags(this.taskName);

   },
 }
</script>

<style scoped>
  .el-header{
    padding: 15px;
    text-align: center;
  }
 
  .el-main{
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .el-main > .noTask{
    width: 150px;
    margin:0 auto;
  }

  /* .tag{
    width: 50px;
    text-align: center;
  } */
</style>
