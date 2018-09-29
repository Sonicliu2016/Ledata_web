<template>
  <div>
    <el-container>
      <el-header>
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
        <div>
          <el-tabs type="card" @tab-click="onTabClick">
              <el-tab-pane v-for="tab in tabs" :label="tab.name" :key="tab.name"></el-tab-pane>
          </el-tabs>
          <!-- <keep-alive> -->
            <router-view></router-view>
          <!-- </keep-alive> -->
        </div>
      </el-main>

      <el-dialog title="正在上传图片" :visible.sync="showUploadProgress">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="uploadPro"></el-progress>

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
        tabs:[
          {name:'标签任务'},
          {name:'验证任务'}
          ],
        userList:[],
        filesList:[], //选中要上传的图片
        waitUpLoadList:[],//等待上传的图片列表
        showUploadProgress:false,
        uploadPro:0, //上传的进度
        totalCount:0, //要上传的总数量
        limit:1000, //单次上传限制图片张数
        username:'',
        isShowTask:true, //如果是admin就展示任务列表，如果是普通用户，就不展示
      }
    },
    methods:{
      uploadSuccess(response, file, fileList){
        console.log("uploadSuccess-->response:" + response + "-->filename:" + file.name + "-->url:" + file.url);
        var index = this.findIndex(this.waitUpLoadList,file.url);
        if(index > -1){
          this.waitUpLoadList.splice(index,1); //删除指定下标的元素
        }
        var uploadedCount = this.totalCount - this.waitUpLoadList.length;
        this.uploadPro = (Math.round(parseFloat(uploadedCount) / parseFloat(this.totalCount) * 10000) / 100.00);
        if(this.waitUpLoadList.length == 0){
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
      findIndex(files,url){
        for(var i = 0;i<files.length;i++){
          if(files[i].url == url){
            return i;
          }
        }
        return -1;
      },
      onTabClick(tab,e){
        if(this.tabs[tab.index].name == '标签任务'){
          this.$router.push({
                  name:'labelTask'
                });
        }else if(this.tabs[tab.index].name == '验证任务'){
          this.$router.push({
                  name:'verifyTask'
                });
        }
        console.log(this.tabs[tab.index].name);
      },
    },
    created(){
      this.userList = this.$parent.userList; //获取用户列表
      this.username = user.methods.getUserName();
      if(this.username == "admin"){
        this.isShowTask = true;
      }else{
        this.isShowTask = false;
      }
      console.log("tasklist-->create-->userList:" + this.userList.length);
    },
    mounted(){
      
    },
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
