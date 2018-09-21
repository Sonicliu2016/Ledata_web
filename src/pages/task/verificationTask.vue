<template>
  <div>
    <h2 class="title">请标记下列不是{{verifyClassName}}的图片</h2>

    <div class="verify-complete">
      <el-button type="success">验证完成，换一批</el-button>
    </div>
    <el-row  :gutter="20">
      <el-col :span="4" v-for="(task, index) in articles" :key="index" style="padding: 5px; ">
        <el-card :body-style="{ padding: '0px' }" >
          <div class="img-box" @click="toogle(task)">
            <img v-bind:src="baserul+task.media_url" />
            <img class="flag" v-show="task.isSelected" src="../../assets/icon_jia_red.png">
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        baserul:"http://10.5.11.127:8080/",
        verifyClassName:"person",
        articles:[
          {"media_url":"static/img/upload/machine/test_526.jpg","isSelected":false},
          {"media_url":"static/img/upload/machine/test_206.jpg","isSelected":true},
          {"media_url":"static/img/upload/machine/test_301.jpg","isSelected":false},
          {"media_url":"static/img/upload/machine/test_424.jpg","isSelected":false},
          {"media_url":"static/img/upload/machine/test_712.jpg","isSelected":false},
          {"media_url":"static/img/upload/machine/test_332.jpg","isSelected":false},
          {"media_url":"static/img/upload/machine/test_453.jpg","isSelected":false},
          {"media_url":"static/img/upload/machine/test_203.jpg","isSelected":false}
        ]
      };
    },
    methods:{
      toogle(task){
        if(task.isSelected){
          task.isSelected = false;
        }else{
          task.isSelected = true;
        }
      }
    },
    created(){

    }
  }
</script>

<style scoped>
.title{
  width:100%;
  text-align: center;
  padding-top: 20px;
  font-size: 20px;
  color: dimgray;
}
.verify-complete{
  text-align: right;
  margin-right: 20px;
}
.img-box {
  width: 100%;
  height: 300px;
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
.img-box .flag{
  position: absolute;
  padding:1000px;
  background-color: rgba(0,0,0,0.3);
}
</style>
