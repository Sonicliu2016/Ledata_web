<template>
  <div>
    <el-container>
      <el-header>
        <!--  -->
        <el-upload class="upload-demo" 
                    ref="upload" 
                    multiple 
                    name="files[]" 
                    action="uploadfiles" 
                    :limit="limit" 
                    :on-success="uploadSuccess" 
                    :on-error="uploadError" 
                    :on-progress="uploadProgress" 
                    :file-list="filesList" 
                    :on-change="changeFile" 
                    :before-upload="beforeUpload" 
                    :on-exceed="onExceed" 
                    :show-file-list="false" >
          <el-button slot="trigger" size="medium" type="primary">上传图片</el-button>
        </el-upload>
      </el-header>

      <el-main v-show="isShowTask">
        <!-- 任务列表 -->
        <el-row  :gutter="20">
          <el-col :span="6" v-for="(task, index) in tasksList" :key="index" style="padding: 5px;">
            <el-card>
              <!-- <router-link :to="{name:'taskAssign'}"> -->
              <div class="task">
                <span>{{task.taskname}}</span>
                <el-button style="position:absolute; margin-top: 25px;" type="text" class="button" @click="taskDetail(task.taskowner)">点击查看详情</el-button>
              </div>
              <!-- </router-link :to="{name:'taskAssign'}"> -->
            </el-card>
          </el-col>
        </el-row>
      </el-main>

      <!-- 上传预览 -->
      <!-- <el-dialog :visible.sync="dialogVisible" width="80%">
        <el-row v-for="(ro, ro_id) in rows" :key="ro_id" class="imagelist">
          <el-col :span="5" v-for="(co, co_id) in cols[ro_id]" :key="co_id">
            <el-card :body-style="{ padding: '0px' }">
              <div class="img2" :style="{backgroundImage: 'url(' + filesList[ro_id * col + co_id].url + ')', backgroundSize:'contain'}"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-dialog> -->

      <el-dialog title="正在上传图片" :visible.sync="showUploadProgress">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="uploadPro"></el-progress>

      </el-dialog>

      <el-dialog :title="userTaskTitle" :visible.sync="showUserDetail">
        <el-form :model="userTaskDetail">
          <el-form-item label="已完成">
            <span>({{userTaskDetail.completed}}张)</span>
          </el-form-item>
          <el-form-item label="未完成">
            <span>({{userTaskDetail.undone}}张)</span>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="showUserDetail = false">关闭</el-button>
          <!-- <el-button type="primary" @click="assignTask">确 定</el-button> -->
        </div>
      </el-dialog>

    </el-container>
  </div>
</template>

<script>
  import User from '../../modules/UserModule.js';
  var user = User;
  export default {
    data(){
      return{
        col:4,  //设定一行显示4张图片
        rows:0, //一共有几行
        cols:[],//每一行的列数
        filesList:[], //选中要上传的图片
        waitUpLoadList:[],//等待上传的图片列表
        dialogVisible: false,
        showUploadProgress:false,
        uploadPro:0, //上传的进度
        totalCount:0, //要上传的总数量
        limit:1000, //单次上传限制图片张数
        userList: [],
        username:'',
        isShowTask:true, //如果是admin就展示任务列表，如果是普通用户，就不展示
        showUserDetail:false, //点击查看用户的任务详情
        userTaskTitle:'', //点击查看用的任务详情的标题
        userTaskDetailUrl:'task/getUserTasksInfo',
        tasksList:[],
        userTaskDetail:{
          completed:0,
          undone:0,
        }
      }
    },
    methods:{
      uploadSuccess(response, file, fileList){
        console.log("uploadSuccess-->response:" + response + "-->filename:" + file.name + "-->url:" + file.url);
        var index = this.findIndex(this.waitUpLoadList,file.url);
        if(index > -1){
          this.waitUpLoadList.splice(index,1); //删除指定下标的元素
        }
        // this.calRowCols();
        var uploadedCount = this.totalCount - this.waitUpLoadList.length;
        this.uploadPro = (Math.round(parseFloat(uploadedCount) / parseFloat(this.totalCount) * 10000) / 100.00);
        if(this.waitUpLoadList.length == 0){
          // this.dialogVisible = false;
          this.showUploadProgress = false;
          this.$message({message: '图片上传完毕!', type: 'success'});
        }
      },
      uploadError(err, file, fileList){
        console.log("uploadError-->err:" + err + "-->filename:" + file.name);
      },
      uploadProgress(event, file, fileList){
        console.log("uploadProgress-->event:" + event.percent + "-->filename:" + file.name + "--->fileList:" + fileList.length + "---->剩下：" + this.waitUpLoadList.length);
      },
      changeFile(file, fileList){
        this.filesList = [].concat(fileList);
      },
      // 图片准备上传时()
      beforeUpload(file){
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        if (isJPG || isPNG) {
          if(this.filesList.length > 0){
            this.waitUpLoadList = [].concat(this.filesList);
            this.totalCount = this.filesList.length;
            this.showUploadProgress = true;
            // this.calRowCols();
            // this.dialogVisible = true;
          }
        }else{
            this.$message.error('上传图片只能是JPG或者PNG格式!');
        }
        return isJPG || isPNG;
      },
      // 文件超出个数限制时
      onExceed(files, fileList){
        this.$message.error('一次最多上传'+this.limit + '张照片!');
      },
      calRowCols(){  //计算上传过程中的图片展示的行列数
        //算出会有多少行
        this.rows = Math.ceil(this.waitUpLoadList.length / this.col);
        //再计算出每一行有几列
        if(this.waitUpLoadList.length <= this.col){  //一行时
          this.cols[0] = this.waitUpLoadList.length;
        }else{  //多行时
          for(var i = 0;i < this.rows; i++){
            this.cols[i] = this.col;
          }
          this.cols[this.rows-1] = this.waitUpLoadList.length % this.col;
        }
      },
      findIndex(files,url){
        for(var i = 0;i<files.length;i++){
          if(files[i].url == url){
            return i;
          }
        }
        return -1;
      },
      taskDetail(taskowner){
        console.log("taskDetail:" + taskowner);
        if(taskowner == 'noallo' || taskowner == 'alloed' || taskowner == 'verify'){
          this.$router.push({
                  name:'taskAssign',
                  params:{
                    dataObj:taskowner,
                  },
                });
        } else{
          this.showUserDetail = true;
          this.userTaskTitle = taskowner + "的任务详情";
          this.selectUserDetail(taskowner);
        }
      },
      selectUserDetail(taskowner){ //查看用户的任务完成情况
        var params = new URLSearchParams();
        params.append('username', taskowner);
        // params.append('assignusername', this.taskForm.taskOwner);
        this.$axios({
              method: 'post',
              url:this.userTaskDetailUrl,
              data:params
          })
        .then(res=>{
            console.log("请求成功:" + res.data.code);
            if(res.data.code == 200){
              this.userTaskDetail.completed = res.data.data.completed;
              this.userTaskDetail.undone = res.data.data.uncomplete;
            }else{
              this.$message.error('请求失败！');
            }
          })
        .catch(err=>{
            console.log("error:" + err);
            alert("服务器出现故障，请稍后再试！");
          })
      },
      setUserList(){
        this.tasksList.splice(0,this.tasksList.length); //先清空数组
        this.tasksList.push({'taskowner':'noallo','taskname':'未分配的任务列表'});
        this.tasksList.push({'taskowner':'alloed','taskname':'已分配的任务列表'});
        this.tasksList.push({'taskowner':'verify','taskname':'待验证的任务列表'});
        for(var i=0;i<this.userList.length;i++){
          this.tasksList.push({'taskowner':this.userList[i].username,'taskname':this.userList[i].username+'的任务列表'});
        }
      }
    },
    created(){
      this.$store.state.navIndex = '2';
      this.userList = this.$parent.userList;
      this.username = user.methods.getUserName();
      if(this.username == "admin"){
        this.isShowTask = true;
      }else{
        this.isShowTask = false;
      }
    },
    mounted(){
     console.log("tasklist----->mounted:" + this.tasksList.length);
     this.setUserList();
    },
    watch:{
      '$parent.userList':function(){
        this.setUserList();
      }
    }
  }
</script>

<style scoped>
  .el-header {
      width: 100%;
      height: 65px;
      padding: 15px;
      text-align: center;
  }

  .el-main {
      /* background-color: #e9eef3; */
      color: #333;
      text-align: center;
  }

  .el-dialog,
  .imagelist {
      text-align: center;
  }

  .image {
      width: 250px;
      height: 250px;
      display: block;
  }

  .img2 {
      width: 200px;
      height: 250px;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100px auto;
  }

  .task{
    height: 250px;
    display:flex;
    justify-content:center;
    align-items:center;
  }

  .el-card{
    /* background: rgb(159, 203, 241); */
  }
</style>
