<template>
  <div>
    <el-container>
      <el-main>
        <!-- <div>{{evaluateTaskList[1].anocator}}</div> -->
        <el-row  :gutter="20">
          <el-col :span="6" v-for="(task, index) in evaluateTaskList" :key="index" style="padding: 5px;">
            <el-card >
              <div>
                <!-- <span>{{tag.tagname}}</span> -->
                图片数量：{{task.imgcount}}<br/>
                标注者：{{task.anocator}}<br/>
                <el-button  type="text" class="button" @click="checkSingleImg(task)">单图检查</el-button>
                <el-button  type="text" class="button" @click="checkSingleLabel(task)">单标签检查</el-button><br/>
                <el-button type="danger" plain size="small" @click="showAssignTaskDialog(tag)">重标</el-button>
                <el-button type="success" plain size="small" @click="showAssignTaskDialog(tag)">保存</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  data(){
    return{
      evaluateTaskList:[
        {'imgcount':23,'anocator':"Jeff"},
        {'imgcount':66,'anocator':"henry"},
        {'imgcount':46,'anocator':"nake"},
        {'imgcount':88,'anocator':"mary"},
        {'imgcount':233,'anocator':"timi"},
        {'imgcount':789,'anocator':"lixiang"},
        {'imgcount':896,'anocator':"sandy"},
        {'imgcount':565,'anocator':"oven"},
        {'imgcount':234,'anocator':"stiven"}
      ],
    }
  },
  methods:{
    backLast(){
      this.$router.go(-1);
    },
    getEvaluateSize(){
      return this.evaluateTaskList.length;
    },
    checkSingleLabel(task){
      this.$router.push({name:'anotateQualityLabelCheckList'});
    },
    checkSingleImg(task){
      this.$router.push({name:'anotateQualityImgCheck'});
    },
    getEvaluteTaskList(){
      var params = new URLSearchParams();
        this.$axios({
            method: 'post',
            url:"/task/getEvaluateTasks",
            data:params
        })
        .then(res => {
          if(res.data.code == 200){

          }else{
          }
        })
        .catch(err => {
          console.log("error:" + err);
          // alert("服务器出现故障，请稍后再试！");
        });
    }
  },
  created(){
    this.getEvaluteTaskList();
  }
}
</script>
<style scoped>

</style>

