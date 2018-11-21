<template>
  <div class="content">
    <el-row>
      <div class="content1 bg-purple-dark">
        <el-button type="primary" @click="notifyZipAllFiles">下载全部照片</el-button>
      </div>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="content2 bg-purple-dark">
          <el-row>
            <span>输入图片名字范围查找并下载图片：</span>
          </el-row>
          <el-row>
            <input class="numInput" v-model="firstNum" type="number" placeholder="请输入起始数字"></input>
            <span>—</span>
            <input class="numInput" v-model="secondNum" type="number" placeholder="请输入结束数字"></input>
          </el-row>
          <el-row>
            <el-button type="primary" @click="searchNumAndNotifyZip">查找并下载照片</el-button>
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
            <el-button type="primary" @click="searchTagAndNotifyZip">查找标签并下载照片</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="content4 bg-purple-dark">
          <el-row>
            <el-button type="primary" @click="exportDownloadList">导出下载列表</el-button>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
 import Global from '../../common/global'; 
 var global = Global;
 export default {
   data () {
     return {
       //通知图片开始压缩
       notifyZipAllFilesUrl:'file/notifyZipAllFile',
       downloadAllZipUrl:'file/downloadAllZip',
       notifyZipClusterUrl:'file/notifyZipCluster',
       downloadClusterZipUrl:'file/downloadZipByCluster',
       notifyZipNumUrl:'file/notifyZipNums',
       downloadNumZipUrl:'file/downloadZipByNum',
       exportDownloadListUrl:'file/getDownloadList',
       firstNum:'',
       secondNum:'',
       searchTag:'',
       file_urls:[],
       zips_url:[],
     }
   },
   methods: {
     notifyZipAllFiles(){
       var params = new URLSearchParams();
       this.$axios({
           method: 'post',
           url:this.notifyZipAllFilesUrl,
           data:params,
        })
        .then(res=>{
         console.log("请求成功:" + res.data.code);
         if(res.data.code == 200){
           //延迟2s去获取压缩结果
           setTimeout(this.downZipAllFiles, 2000);
         }
       })
       .catch(err=>{
         console.log("error:" + err);
         alert("服务器出现故障，请稍后再试！");
       })
     },
     downZipAllFiles(){
        var params = new URLSearchParams();
        this.$axios({
           method: 'post',
           url:this.downloadAllZipUrl,
           data:params,
        })
        .then(res=>{
         console.log("请求成功:" + res.data.code);
         if(res.data.code == 200){
           this.zips_url = res.data.data.zips_url;
           console.log("zips_url-->" + this.zips_url);
            if(this.zips_url.length > 0){
                for(var i = 0;i<this.zips_url.length;i++){
                  this.downFile(global.BASE_URL + this.zips_url[i].zip_url);
            }
          }else{
            this.$message.error('没有可下载的照片！');
          }
         }
       })
       .catch(err=>{
         console.log("error:" + err);
         alert("服务器出现故障，请稍后再试！");
       })
     },
     
     searchNumAndNotifyZip(){
       console.log(this.firstNum + "------" + this.secondNum + "------" + (this.firstNum >= this.secondNum))
       if(this.strIsNull(this.firstNum) || this.strIsNull(this.secondNum)){
         this.$message.error('请输入起始和结束范围！');
       }else if(Number(this.firstNum) >= Number(this.secondNum)){
         this.$message.error('请输入合适的范围！');
       }else{
         var params = new URLSearchParams();
         params.append('startNum', this.firstNum);
         params.append('endNum', this.secondNum);
         this.$axios({
           method: 'post',
           url:this.notifyZipNumUrl,
           data:params,
          })
          .then(res=>{
          console.log("请求成功:" + res.data.code);
          if(res.data.code == 200){
            //延迟2s去获取压缩结果
            setTimeout(this.downNumZip, 2000);
          }
        })
        .catch(err=>{
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试！");
         })
       }
     },
     
     //搜索范围然后下载图片
     downNumZip(){
        var params = new URLSearchParams();
        params.append('startNum', this.firstNum);
        params.append('endNum', this.secondNum);
        this.$axios({
          method: 'post',
          url:this.downloadNumZipUrl,
          data:params,
        })
        .then(res=>{
         console.log("请求成功:" + res.data.code);
         if(res.data.code == 200){
           this.zips_url = res.data.data.zips_url;
           console.log("zips_url-->" + this.zips_url);
            if(this.zips_url.length > 0){
                for(var i = 0;i<this.zips_url.length;i++){
                  this.downFile(global.BASE_URL + this.zips_url[i].zip_url);
            }
          }else{
            this.$message.error('没有可下载的照片！');
          }
         }
       })
     },

     searchTagAndNotifyZip(){
       if(this.strIsNull(this.searchTag)){
         this.$message.error('请输入标签名称！');
        }else{
         var params = new URLSearchParams();
         params.append('clusterName', this.searchTag);
         this.$axios({
           method: 'post',
           url:this.notifyZipClusterUrl,
           data:params,
          })
          .then(res=>{
          console.log("请求成功:" + res.data.code);
          if(res.data.code == 200){
            //延迟2s去获取压缩结果
            setTimeout(this.downZipClusterFiles, 2000);
          }
        })
        .catch(err=>{
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试！");
         })
       }
     },

     downZipClusterFiles(){
        var params = new URLSearchParams();
        params.append('clusterName', this.searchTag);
        this.$axios({
           method: 'post',
           url:this.downloadClusterZipUrl,
           data:params,
        })
        .then(res=>{
         console.log("请求成功:" + res.data.code);
         if(res.data.code == 200){
           this.zips_url = res.data.data.zips_url;
           console.log("zips_url-->" + this.zips_url);
            if(this.zips_url.length > 0){
                for(var i = 0;i<this.zips_url.length;i++){
                  this.downFile(global.BASE_URL + this.zips_url[i].zip_url);
            }
          }else{
            this.$message.error('没有可下载的照片！');
          }
         }
       })
       .catch(err=>{
         console.log("error:" + err);
         alert("服务器出现故障，请稍后再试！");
       })
     },
     downFile(imgsrc){
        var a = document.createElement("a"), //创建a标签
        e = document.createEvent("MouseEvents"); //创建鼠标事件对象
        e.initEvent("click", false, false); //初始化事件对象
        a.href = imgsrc;  //设置下载地址
        a.download = "";  //设置下载文件名
        a.dispatchEvent(e); //给指定的元素，执行事件click事件
     },
     downloadFile(url){
       let blob = new Blob([url]);
        var a = document.createElement("a"), //创建a标签
        e = document.createEvent("MouseEvents"); //创建鼠标事件对象
//         e.initEvent("click", false, false); //初始化事件对象
        a.href = window.URL.createObjectURL(blob);  //设置下载地址
        a.download = "downloadList.xml";  //设置下载文件名
        a.click()
        URL.revokeObjectURL(a.href)
//         a.dispatchEvent(e); //给指定的元素，执行事件click事件
    },

    exportDownloadList(){
      var params = new URLSearchParams();
       this.$axios({
           method: 'get',
           url:this.exportDownloadListUrl,
           data:params,
        })
        .then(res=>{
         this.downloadFile(res.data)
        })
        .catch(err=>{
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试！");
       })
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
.content3 {
    min-height: 6vh;
    padding: 15px;
    text-align: center;
    line-height: 4vh;
}
.content2 {
    min-height: 20vh;
    padding: 15px;
    text-align: center;
    line-height: 5vh;
}

.content4 {
    min-height: 6vh;
    text-align: center;
    line-height: 4vh;
}

.tagInput,
.el-input {
    width: 150px;
    height: 30px;
}
.numInput {
    width: 150px;
    height: 30px;
}

/* 去除webkit中input的type="number"时出现的上下图标 */
.numInput::-webkit-outer-spin-button,
.numInput::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
.numInput[type="number"] {
    -moz-appearance: textfield;
}

.content3 {
    min-height: 30vh;
}

.bg-purple-dark {
    /* background: rgb(159, 203, 241); */
}
</style>
