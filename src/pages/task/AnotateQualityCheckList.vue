<template>
  <div class='quality-check'>
    <el-dropdown split-button type="primary" @click="handleClick">
      更多菜单
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>food</el-dropdown-item>
        <el-dropdown-item>person</el-dropdown-item>
        <el-dropdown-item>park</el-dropdown-item>
        <el-dropdown-item>fire</el-dropdown-item>
        <el-dropdown-item>car</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div style="float:right">
      <el-button type="danger">验证</el-button>
      <el-button type="success">通过</el-button>
    </div>
    <el-row  :gutter="30">
      <el-col :span="12" style="padding: 10px; ">
        <el-card style="height:500px">
          <div slot="header" class="clearfix" style="position:flex">
            <span>Machine</span>
            <el-button style="float: right; padding: 3px 0" type="text">全选</el-button>
          </div>
          <div style="overflow-y:hiden">
            <el-row :gutter="10">
              <el-col :span="8" v-for="(m,index) in mechineList" :key="index" style="padding: 5px; ">
                <el-card :body-style="{ padding: '0px' }">
                  <div class="img-box" @click="toogle(m)">
                    <img v-bind:src="baseurl+m.media_url"/>
                    <img class="flag" v-show="m.isSelected" src="../../assets/icon_selected.png">
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" style="padding: 5px; ">
        <el-card>
          <div slot="header" class="clearfix" style="position:flex">
            <span>Human</span>
            <el-button style="float: right; padding: 3px 0" type="text">全选</el-button>
          </div>
          <div>
            <el-row :gutter="10">
              <el-col :span="8" v-for="(m,index) in mechineList" :key="index" style="padding: 5px; ">
                <el-card :body-style="{ padding: '0px' }">
                  <div class="img-box" @click="toogle(m)">
                    <img v-bind:src="baseurl+m.media_url"/>
                    <img class="flag" v-show="m.isSelected" src="../../assets/icon_selected.png">
                  </div>
                </el-card>
              </el-col>
            </el-row>
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
      baseurl:"http://10.5.11.127:8080/",
      mechineList:[
        {"media_url":"static/img/upload/machine/test_526.jpg","isSelected":false},
        {"media_url":"static/img/upload/machine/test_206.jpg","isSelected":true},
        {"media_url":"static/img/upload/machine/test_301.jpg","isSelected":false},
        {"media_url":"static/img/upload/machine/test_424.jpg","isSelected":false},
        {"media_url":"static/img/upload/machine/test_712.jpg","isSelected":false},
        {"media_url":"static/img/upload/machine/test_526.jpg","isSelected":false},
        {"media_url":"static/img/upload/machine/test_206.jpg","isSelected":true},
        {"media_url":"static/img/upload/machine/test_301.jpg","isSelected":false},
        {"media_url":"static/img/upload/machine/test_424.jpg","isSelected":false},
        {"media_url":"static/img/upload/machine/test_712.jpg","isSelected":false},
        {"media_url":"static/img/upload/machine/test_526.jpg","isSelected":false},
        {"media_url":"static/img/upload/machine/test_206.jpg","isSelected":true},
        {"media_url":"static/img/upload/machine/test_301.jpg","isSelected":false},
        {"media_url":"static/img/upload/machine/test_424.jpg","isSelected":false},
        {"media_url":"static/img/upload/machine/test_712.jpg","isSelected":false},
        {"media_url":"static/img/upload/machine/test_332.jpg","isSelected":false}
      ]
    }
  },
  methods:{
    toogle(task){
        if(task.isSelected){
          task.isSelected = false;
        }else{
          task.isSelected = true;
        }
      }
  }
}
</script>
<style scoped>
.quality-check{
  margin: 30px;
}
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
.img-box .flag{
  position: absolute;
  padding:1000px;
  background-color: rgba(0,0,0,0.3);
}
</style>
