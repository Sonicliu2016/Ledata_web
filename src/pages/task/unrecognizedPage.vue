<template>
 <div>
  <el-row  :gutter="20">
    <el-col :span="4" v-for="(task, index) in 32" :key="index" style="padding: 5px;">
      <el-card>
        <div class="img-box">
          <img v-bind:src="url"/>
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
       url:'http://10.5.11.127:8080/static/img/upload/machine/106.jpg',
       getUnrecognizedImgUrl:'',
       
     }
   },
   methods: {
     getImgs(){
       var params = new URLSearchParams();
      //  params.append('assignusername', task);
      //  params.append('tasktype','0');
       this.$axios({
           method: 'post',
           url:this.getUnrecognizedImgUrl,
           data:params
       })
       .then(res=>{
         console.log("请求成功:" + res.data.code);
         if(res.data.code == 200){
           
         }else{
           this.$message.error('获取信息失败！');
         }
       })
       .catch(err=>{
         console.log("出现error:" + err);
         alert("服务器出现故障，请稍后再试！");
       })
     }
   },
   components: {

   },
   created(){

   },
   mounted(){
     
   }
 }
</script>

<style>
  .img-box {
    width: 100%;
    height: 200px;
    position: relative;
    z-index: 1;
    background-color:#ebeef5;
  }
  .img-box img {
    position: relative;
    max-width: 100%;
    max-height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
  }
 
</style>
