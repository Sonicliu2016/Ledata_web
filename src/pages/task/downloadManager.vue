<template>
  <div class="content">
    <el-row>
      <div class="content1 bg-purple-dark">
        <el-button type="primary" @click="downloadAllFiles">下载全部照片</el-button>
      </div>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="content2 bg-purple-dark">
          <el-row>
            <span>输入图片名字范围查找并下载图片：</span>
          </el-row>
          <el-row>
            <input class="numInput" v-model="firstNum" type="number" placeholder="请输入起始数字" ></input>
            <span>—</span>
            <input class="numInput" v-model="secondNum" type="number" placeholder="请输入结束数字"></input>
          </el-row>
          <el-row>
            <el-button type="primary" @click="searchImgAndDownload">查找并下载照片</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="content3 bg-purple-dark">
          <el-row>
            <span>输入标签名字查找并下载图片：</span>
          </el-row>
          <el-row>
            <input class="tagInput" v-model="searchTag" placeholder="请输入标签"></input>
          </el-row>
          <el-row>
            <el-button type="primary" @click="searchTagAndDownload">查找标签并下载照片</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
 export default {
   data () {
     return {
       downloadAllFilesUrl:'downloadallfiles',
       firstNum:'',
       secondNum:'',
       searchTag:'',
     }
   },
   methods: {
     //下载所有照片的压缩文件
     downloadAllFiles(){
       var params = new URLSearchParams();
       // params.append('username', this.editUserForm.username); 
       this.$axios({
           method: 'post',
           url:this.downloadAllFilesUrl,
           data:params,
           responseType: 'blob' // 表明返回服务器返回的数据类型
        })
       .then(res=>{
         console.log("请求成功:" + res.data.code);
         if(res.data.code == 200){
           this.download(res);
         }
       })
       .catch(err=>{
         console.log("error:" + err);
         alert("服务器出现故障，请稍后再试！");
       })
     },
     //搜索范围然后下载图片
     searchImgAndDownload(){
       if(this.strIsNull(this.firstNum) || this.strIsNull(this.secondNum)){
         this.$message.error('请输入起始和结束范围！');
       }else if(this.firstNum >= this.secondNum){
         this.$message.error('请输入合适的范围！');
       }else{
         var params = new URLSearchParams();
       // params.append('username', this.editUserForm.username); 
         this.$axios({
           method: 'post',
           url:this.downloadAllFilesUrl,
           data:params,
           responseType: 'blob' // 表明返回服务器返回的数据类型
         })
        .then(res=>{
          console.log("请求成功:" + res.data.code);
          if(res.data.code == 200){
            this.download(res);
          }
        })
        .catch(err=>{
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试！");
        })
      }
     },
     searchTagAndDownload(){
       if(this.strIsNull(this.searchTag)){
         this.$message.error('请输入标签名称！');
       }else{
         
       }
     },
     // 下载文件
     download (data) {
       if (!data) {
          return;
       }
       let blob = new Blob([data]);
       let filename = '我的照片.rar';
       let url = window.URL.createObjectURL(blob);
       let aTag = document.createElement('a');
       aTag.download = fileName;
       aTag.style.display = 'none';
       aTag.href = url;
       document.body.appendChild(aTag);
       aTag.click();
       URL.revokeObjectURL(url);
       document.body.removeChild(aTag)
    },
    //判断字符串是否为空
    strIsNull(str){
      return (str.length === 0 || !str.trim()); 
    },
   },
   components: {

   }
 }
</script>

<style scoped>
  .el-row {
    margin-bottom: 5px;
  }
  
  .content1,
  .content3{
    min-height:6vh;
    padding: 15px;
    text-align: center;
    line-height: 4vh;
  }
  .content2{
    min-height:20vh;
    padding: 15px;
    text-align: center;
    line-height: 5vh;
  }

  .tagInput,
  .el-input{
    width: 150px;
    height: 30px;
  }
  .numInput{
    width: 150px;
    height: 30px;
  }

  /* 去除webkit中input的type="number"时出现的上下图标 */
  .numInput::-webkit-outer-spin-button,
  .numInput::-webkit-inner-spin-button {
      -webkit-appearance: none;
  }
  .numInput[type="number"]{
      -moz-appearance: textfield;
  }

  .content3{
    min-height:30vh;
  }

  .bg-purple-dark {
    /* background: rgb(159, 203, 241); */
  }
</style>
