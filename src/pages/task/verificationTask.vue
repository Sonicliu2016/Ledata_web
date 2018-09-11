<template>
  <div>
    <h2 class="title">请标记下列不是{{verifyClassName}}的图片</h2>

    <div class="verify-complete">
      <a href="aaa">验证完成，换一批</a>
    </div>
    <el-row  :gutter="20">
      <el-col :span="6" v-for="(task, index) in articles" :key="index" style="padding: 5px; ">
        <el-card :body-style="{ padding: '0px' }">
          <div class="img-box">
            <img class="" src="../../assets/icon_jia_red.png">
            <a v-bind:href="task" target="_blank"><img v-bind:src="baserul+task" /></a>
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
        articles:["static/img/upload/machine/0036.jpg","static/img/upload/machine/0037.jpg",
        "static/img/upload/machine/0038.jpg","static/img/upload/machine/0039.jpg",
        "static/img/upload/machine/0048.jpg","static/img/upload/machine/0051.jpg"]
      };
    },
    methods:{

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
  background-color:white;
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
