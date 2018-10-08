<template>
  <div class="parent-layout">
    <div class="box">
        <div class="img-box">
          <img v-bind:src="baseurl+curImg.MediaNetUrl" />
          <button type="button" class="el-carousel__arrow el-carousel__arrow--left"
            @click="setCurrent(curImg,-1)">
            <i class="el-icon-arrow-left"></i>
          </button>
          <button type="button" class="el-carousel__arrow el-carousel__arrow--right"
            @click="setCurrent(curImg,1)">
            <i class="el-icon-arrow-right"></i>
          </button>
        </div>
        <div class='select-tag-box'>
          <span class="only-select-tag-box">
            <el-tag
              :props="selectLabelsProps"
              v-for="tag in curImg.tags"
              :key="tag.name">
              {{tag}}
            </el-tag>
          </span>
        </div>
      </div>
      <el-table
        class="table-list"
        ref="singleTable"
        :data="imgList"
        height="500px"
        highlight-current-row
        @current-change="handleCurrentChange">
        <el-table-column
          property="Id"
          label="编号"
          width="50">
        </el-table-column>
        <el-table-column
          property="MediaNetUrl"
          label="URL"
          width="180">
        </el-table-column>
        <el-table-column property="MediaMasterCluster" label="主标签">
        </el-table-column>
      </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      baseurl:"http://10.5.11.127:8080/",
      taskId:-1,
      curImg:{},
      imgList:[]
    }
  },
  methods:{
    getSingleImgTaskList(){
      var params = new URLSearchParams();
      params.append('taskid', this.taskId);
        this.$axios({
            method: 'post',
            url:"/task/getEvaluateTaskSinglePicCheck",
            data:params
        })
        .then(res => {
          if(res.data.code == 200){
            this.imgList = res.data.data.picinfos;
            this.curImg = this.imgList[0];
          }else{

          }
        })
        .catch(err => {
          console.log("error:" + err);
        });
    },
    setCurrent(row,i) {
      // this.onRowClick(row)
      console.log("选择了 ： "+this.taskList.indexOf(row));
      var index = this.taskList.indexOf(row);
      if(index != -1){
        if(i == 1){
          if(index+1 >= this.taskList.length){
            this.showMsg("已是最后一个任务");
          }else{
            row = this.taskList[index+1];
          }
        }else if(i == -1){
          if(index-1 < 0){
            this.showMsg("已是第一个任务");
          }else{
            row = this.taskList[index-1];
          }
        }
      }
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.curImg = this.requestForImgDetail(val.MediaMD5);
    },
    requestForImgDetail(mediamd5){
      console.log("md5:"+mediamd5);
      var params = new URLSearchParams();
      params.append("mediamd5",mediamd5);
      this.$axios({
        method:'post',
        url:"/task/",
        data:params
      })
      .then(res => {
        if(res.data.code == 200){
          this.curEditTask = res.data.data;
        }
      })
      .catch(err =>{
        console.log("requestForImgDetail, taskId:"+taskId+" error:"+err);
      });
    }
  },
  created(){
    this.taskId = this.$route.params.taskId;
    this.getSingleImgTaskList();
  }
}
</script>
<style>
.parent-layout{
  padding: 30px;
}
.box {
  float: left;
  width: 65%;
  overflow: hidden;
}
.img-box {
  width: 100%;
  height: 500px;
  position: relative;
  z-index: 1;
  background: url(../../assets/img_bg.png);
  /* background-color: #aae9e9e9; */
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
.select-tag-box {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  background-color: white;
}
.only-select-tag-box {
  width: 100px;
  height: 100px;
}
.table-list{
  width: 30%;
  float: right;
}
</style>
