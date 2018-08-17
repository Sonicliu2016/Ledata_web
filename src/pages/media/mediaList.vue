<template>
  <div>
    <el-container>
      <el-header>
        <!--  -->
        <el-upload class="upload-demo" 
                    ref="upload" 
                    multiple 
                    name="files[]" 
                    action="http://10.5.11.127:8080/uploadfiles" 
                    :limit="limit" 
                    :on-success="uploadSuccess" 
                    :on-error="uploadError" 
                    :on-progress="uploadProgress" 
                    :file-list="filesList" 
                    :on-change="changeFile" 
                    :before-upload="beforeUpload" 
                    :on-exceed="onExceed" 
                    :show-file-list="false" >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
        </el-upload>
      </el-header>
      <el-main>Main</el-main>

      <!-- 上传预览 -->
      <el-dialog :visible.sync="dialogVisible" width="80%">
        <!-- 总共有多少行 -->
        <el-row v-for="(ro, ro_id) in rows" :key="ro_id" class="imagelist">
          <!-- col总共分24份，这里将filesList分割成一个二维数组，算出每行有多少列 -->
          <el-col :span="5" v-for="(co, co_id) in cols[ro_id]" :key="co_id">
            <el-card :body-style="{ padding: '0px' }">
              <!-- <div class="img2" :style="{backgroundImage: 'url(' + filesList[ro_id * col + co_id].url + ')' }"></div> -->
              <div class="img2" :style="{backgroundImage: 'url(' + filesList[ro_id * col + co_id].url + ')', backgroundSize:'contain'}"></div>
              <!-- <img :src="filesList[ro_id * col + co_id].url" class="image"> -->
              <!-- {{ro}}:{{co}}:{{ro_id}}:{{co_id}} -->
            </el-card>
          </el-col>
        </el-row>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
export default {
    data(){
        return{
          col:4,  //设定一行显示4张图片
          rows:0, //一共有几行
          cols:[],//每一行的列数
          filesList:[], //选中要上传的图片
          waitUpLoadList:[],//等待上传的图片列表
          dialogVisible: false,
          limit:500, //单次上传限制图片张数
        }
    },
    methods:{
      uploadSuccess(response, file, fileList){
        console.log("uploadSuccess-->response:" + response + "-->filename:" + file.name + "-->url:" + file.url);
        var index = this.findIndex(this.waitUpLoadList,file.url);
        if(index > -1){
          this.waitUpLoadList.splice(index,1); //删除指定下标的元素
        }
        this.calRowCols();
        if(this.waitUpLoadList.length == 0){
          this.dialogVisible = false;
          this.$message({message: '图片上传完毕!', type: 'success'});
        }
      },
      uploadError(err, file, fileList){
        // console.log("uploadError-->err:" + err + "-->filename:" + file.name);
      },
      uploadProgress(event, file, fileList){
        console.log("uploadProgress-->event:" + event.percent + "-->filename:" + file.name + "--->fileList:" + fileList.length);
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
            this.calRowCols();
            this.dialogVisible = true;
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
      submitUpload() {
        this.$refs.upload.submit();
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
      //判断未上传文件列表中是否有指定图片，并返回下标
      findIndex(files,url){
        for(var i = 0;i<files.length;i++){
          if(files[i].url == url){
            return i;
          }
        }
        return -1;
    }
  }
}
</script>

<style scoped>
.el-header {
    width: 100%;
    height: 60px;
    text-align: center;
    background-color: #b3c0d1;
    background: lawngreen;
}

.el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
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
</style>
