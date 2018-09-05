<template>
    <div class="tagging-img">
      <div class="box">
        <div class="img-box">
          <!-- <img src="http://10.5.11.127:8080/" + {{curTask.media_url}}/> -->
          <img v-bind:src="baserul+curTask.media_url" />
          <!-- <img src="http://pic2016.5442.com:82/2016/0120/16/3.jpg%21960.jpg"/> -->
          <!-- <img src="static/img/upload/machine/0036.jpg"/> -->
          <!-- <img src="http://h.hiphotos.baidu.com/zhidao/pic/item/0b46f21fbe096b637948dd670d338744ebf8acb0.jpg"/> -->
          <!-- <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533731103890&di=78dec1f0391d3bb1e478e67051c282f1&imgtype=0&src=http%3A%2F%2Fimg008.hc360.cn%2Fy4%2FM03%2F9C%2FCF%2FwKhQiFTyp1yECzkDAAAAAGM5rfM432.jpg"/> -->
          <button type="button" class="el-carousel__arrow el-carousel__arrow--left"
            @click="setCurrent(curTask,-1)">
            <i class="el-icon-arrow-left"></i>
          </button>
          <button type="button" class="el-carousel__arrow el-carousel__arrow--right"
            @click="setCurrent(curTask,1)">
            <i class="el-icon-arrow-right"></i>
          </button>
        </div>
        <div class='select-tag-box'>
          <span>已选分类：</span>
          <span class="only-select-tag-box">
            <el-tag
              @click.native="setSelect(tag)"
              @keyup.delete.native="deleteSelectTag()"
              :props="selectLabelsProps"
              v-for="tag in curEditTask.tags"
              :key="tag.name"
              closable
              @close="remove(tag)"
              is-focusable
              :type="tag.type">
              {{tag.cluster_name}}
            </el-tag>
          </span>
          <div class="commit-box">
            <span class="commit-btn-box">
              <el-button type="danger" round>删除</el-button>
              <el-button type="warning" round>错误</el-button>
              <el-button type="primary" round @click="submitAnnotateTask">提交</el-button>
            </span>
          </div>
        </div>
      </div>

      <el-tabs v-model="activeTabName" type="border-card" >
        <el-tab-pane label="标注任务列表" name="first">
          <span style="float:right;font-size:12px;color:gray;padding:5px;">{{taskProgress}}</span>
          <el-table
            ref="singleTable"
            :data="taskList"
            height="500px"
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              property="media_url"
              label="URL"
              width="120">
            </el-table-column>
            <el-table-column  label="标签">
              <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.tags" :key="index">
                  {{item.cluster_name}} </span>
              </template>
            </el-table-column>
            <el-table-column
              property="status"
              label="状态"
              width="120"
              :filters="[{ text: '未标', value: '未标'}, { text: '已标', value: '已标'}, { text: '错误', value: '错误'}, { text: '删除', value: '删除'}]"
              :filter-method="filterTaskStatusHandler">
            </el-table-column>
            <el-table-column
              property="date"
              label="更新日期">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="标签列表" name="second">
          <div class="el-transfer-panel__filter el-input el-input--small el-input--prefix ">
            <span class="el-input__prefix">
              <i class="el-input__icon el-icon-search"></i>
            </span>
            <input v-model="searchTv" type="text" v-on:input ="searchAssociate" autocomplete="off"
              @keyup="sous($event)" @keydown.down="down" @keydown.up.prevent="up" @keyup.alt.83="submitAnnotateTask"
              placeholder="请输入标签名称" class="el-input__inner" @keyup.enter="addFromSearch2Select()">
          </div>
          <div class="associate-label_ul">
            <ol >
              <li class="el-dropdown-menu__item" v-for="(label,index) in associateLabels" v-bind:key="index"
                @click="setSearchText(label)" :class="{bgc: index == nowInAssociates}">
                {{ label }}
              </li>
            </ol>
          </div>

          <div class="el-transfer-panel__header">所有分类</div>
            <el-tree :data="data4" :props="allLabelsProps" class="vertical-scroll">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <i class="el-icon-circle-plus" @click="() => addToSelect(node.label)"></i>
                </span>
              </span>
            </el-tree>
        </el-tab-pane>
      </el-tabs>

    </div>
</template>

<script>
export default {
  data() {
    return {
      baserul:"http://10.5.11.127:8080/",
      activeTabName:"first",
      taskProgress:"",
      searchTv:"",
      searchTvs:[],
      allLabelsProps: {
        children: "ClusterChilds",
        label: "EnglishStr"
      },
      selectLabelsProps: {
        name: "cluster_name"
      },
      associateLabels:[],
      nowInAssociates:-1,
      data4: [],
      allLabelsArray:[],
      curTask:{},
      curEditTask:{},
      taskList:[
        {
          "media_md5": "78b0a31a8cc84a3c62f8e34d46f40903",
          "media_url": "static/img/upload/machine/0037.jpg",
          "status":'已标',
          "tags": [
            {
              "cluster_name": "person",
              "cluster_id": 1
            },
            {
              "cluster_name": "smile",
              "cluster_id": 2
            }
          ]
        },
        {
          "media_md5": "78b0a31a8cc84a3c62f8e34d46f40903",
          "media_url": "static/img/upload/machine/0036.jpg",
          "status":'未标',
          "tags": [
            {
              "cluster_name": "person",
              "cluster_id": 1
            },
            {
              "cluster_name": "smile",
              "cluster_id": 2
            }
          ]
        },
        {
          "media_md5": "78b0a31a8cc84a3c62f8e34d46f40903",
          "media_url": "static/img/upload/machine/0039.jpg",
          "status":'错误',
          "tags": [
            {
              "cluster_name": "person",
              "cluster_id": 1
            },
            {
              "cluster_name": "smile",
              "cluster_id": 2
            }
          ]
        },
        {
          "media_md5": "78b0a31a8cc84a3c62f8e34d46f40903",
          "media_url": "static/img/upload/machine/0040.jpg",
          "status":'删除',
          "tags": [
            {
              "cluster_name": "person",
              "cluster_id": 1
            },
            {
              "cluster_name": "smile",
              "cluster_id": 2
            }
          ]
        },
        {
          "media_md5": "78b0a31a8cc84a3c62f8e34d46f40903",
          "media_url": "static/img/upload/machine/0041.jpg",
          "status":'已标',
          "tags": [
            {
              "cluster_name": "person",
              "cluster_id": 1
            },
            {
              "cluster_name": "smile",
              "cluster_id": 2
            }
          ]
        },
        {
          "media_md5": "78b0a31a8cc84a3c62f8e34d46f40903",
          "media_url": "static/img/upload/machine/0042.jpg",
          "status":'错误',
          "tags": [
            {
              "cluster_name": "person",
              "cluster_id": 1
            },
            {
              "cluster_name": "smile",
              "cluster_id": 2
            }
          ]
        },
        {
          "media_md5": "78b0a31a8cc84a3c62f8e34d46f40903",
          "media_url": "static/img/upload/machine/0043.jpg",
          "status":'删除',
          "tags": [
            {
              "cluster_name": "person",
              "cluster_id": 1
            },
            {
              "cluster_name": "smile",
              "cluster_id": 2
            }
          ]
        },
        {
          "media_md5": "78b0a31a8cc84a3c62f8e34d46f40903",
          "media_url": "static/img/upload/machine/0044.jpg",
          "status":'未标',
          "tags": [
            {
              "cluster_name": "person",
              "cluster_id": 1
            },
            {
              "cluster_name": "smile",
              "cluster_id": 2
            }
          ]
        }
      ]
    };
  },
  watch: {
    // 当 lists 中的值变化时
    // 清除的选择到的 li
    associateLabels: function(nw,old){
      console.log("watch associateLabels new : "+nw+" old: "+old);
      if(old != nw)
        this.now = -1;
    }
  },
  methods: {
    // 展示消息
    showMsg(msg,msgType){
      this.$message({
            showClose: true,
            message: msg,
            type: msgType
          });
    },
    addFromSearch2Select(){
      this.searchTvs=[];
      var strs = new Array();
      strs = this.searchTv.split(" ");
      for(var i=0;i<strs.length;i++){
        var s = strs[i];
        var num= s.replace(/[^0-9]/ig,"");
        var labelPart = s.replace(/[^a-z]+/ig,"");
        this.getAssociateList(labelPart);
        if(this.associateLabels.length >0){
          if(num>this.associateLabels.length){
            num=this.associateLabels.length;
          }
          if(num<=0){
            num=1;
          }
          this.searchTvs.push(this.associateLabels[num-1]);
        }
      }
      console.log("addFromSearch2Select :"+this.searchTvs.length);
      for(var i=0; i< this.searchTvs.length;i++){
        this.addToSelect(this.searchTvs[i]);
      }
      this.associateLabels=[];
      this.searchTv="";
    },
    // 添加tag到已选
    addToSelect(labelStr) {
      console.log("请求成功:" + labelStr);
      if(this.allLabelsArray.indexOf(labelStr) == -1){
        this.showMsg("无法添加"+labelStr+"，此标签不存在","warning");
        return;
      }
      // this.curEditTask = JSON.parse(JSON.stringify(this.curTask));
      for (var i = 0; i < this.curEditTask.tags.length; i++) {
        if (labelStr == this.curEditTask.tags[i].cluster_name) {
          console.log("不能重复添加:" + this.curEditTask.tags[i].cluster_name);
          this.showMsg(this.curEditTask.tags[i].cluster_name+"已添加","warning");
          return;
        }
      }
      this.findAllLabels(this.data4,labelStr,"");
      // this.curEditTask.tags.push({ cluster_name: labelStr, type: "" });
      console.log("添加成功");
    },
    findAllLabels(labelsStr,tarLabel,parentLabel){
      for(var i = 0; i < labelsStr.length;i++){
        var mLabel = labelsStr[i];
        if(mLabel.EnglishStr == tarLabel){
          if(parentLabel != ""){
            this.curEditTask.tags.push({ cluster_name: parentLabel, type: "" });
          }
          this.curEditTask.tags.push({ cluster_name: mLabel.EnglishStr, type: "" });
          break;
        }
        if(mLabel.ClusterChilds!="[]"){
          this.findAllLabels(mLabel.ClusterChilds,tarLabel,mLabel.EnglishStr);
        }
      }
    },
    // 从已选tag中删除
    remove(tag) {
      this.curEditTask.tags.splice(this.curEditTask.tags.indexOf(tag), 1);
    },
    // 设置已选tag列表中，tag为选中状态
    setSelect(tag) {
      console.log("选择了：" + tag);
      for (var i = 0; i < this.curEditTask.tags.length; i++) {
        this.curEditTask.tags[i].type = "";
      }
      tag.type = "danger";
    },
    // 点击”->“选择下一个
    seleceNext(tag) {
      console.log("选择了 下一个：" + this.curEditTask.tags.indexOf(tag) + 1);
      setSelect(this.curEditTask.tags[this.curEditTask.tags.indexOf(tag) + 1]);
    },
    deleteSelectTag() {
      for (var i = 0; i < this.curEditTask.tags.length; i++) {
        if (this.curEditTask.tags[i].type == "danger") {
          remove(this.curEditTask.tags[i]);
        }
      }
    },
    //单击item时，将item的label加入到input选项中
    setSearchText(label){
      this.searchTv=label;
    },
    // 监听到搜索框内容变化时，调用获取联想列表
    searchAssociate(){
      var strs = new Array();
      strs = this.searchTv.split(" ");
      if(strs.length > 0){
        var s = strs[strs.length-1];
        var labelPart = s.replace(/[^a-z]+/ig,"");
        this.getAssociateList(labelPart);
      }
    },
    getAssociateList(text){
      this.associateLabels=[];
      for(var i=0; i<this.allLabelsArray.length;i++){
        var label = this.allLabelsArray[i];
        if(text!="" && label.indexOf(text)!=-1){
          this.associateLabels.push(label);
        }
      }
      this.associateLabels.sort(function(m,n){
        if(m.slice(0,1) == text.slice(0,1)){
          return -1;
        }else if(n.slice(0,1) == text.slice(0,1)){
          return 1;
        }else{
          return 0;
        }
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
      this.curTask = val;
      this.curEditTask = JSON.parse(JSON.stringify(val));
    },
    formatter(row, column) {
        return row.status;
    },
    filterTaskStatus(value, row) {
        return row.status === value;
    },
    filterTaskStatusHandler(value, row, column) {
      console.log("filterTaskStatusHandler: "+value);
      const property = column['property'];
      return row[property] === value;
    },
    // 获取所有标签列表
    getLableList() {
      this.$axios
        .post(
          "label/getallcluster",
          {
            // username: 'admin'
          },
          {
            //跨域请求配置参数
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          console.log("请求成功:" + res.data.ChineseStr);

          console.log("请求成功:" + res.data.ClusterChilds);
          this.data4 = res.data.ClusterChilds;
          this.allLabelsArray=[]
          this.transFormAllLabel2Array(this.data4);
          // this.data4 = JSON.parse(JSON.stringify(res.data.ClusterChilds));
          // if(res.data.code == 200){
          //   this.loginData = res.data.data;
          //   this.$router.push({
          //     // name:'home'
          //   });
          // }else{
          //   alert("账号或密码错误！");
          // }
        })
        .catch(err => {
          console.log("error:" + err);
          // alert("服务器出现故障，请稍后再试！");
        });
    },
    // 获取当前用户任务列表
    getAnnotateTaskList() {
      this.$axios
        .post(
          // "/task/getTaskByUserName",
          "/task/getAnnotateTask",
          {
            page:1,
            pagesize:100000,
            assignusername:'lixiang',
            username: "lixiang"
          },
          {
            //跨域请求配置参数
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          if(res.data.code == 200){
            // this.curTask = JSON.parse(JSON.stringify(res.data.data));
            this.setCurrent(this.taskList[0],0);
            console.log("请求成功: getAnnotateTaskList" + this.curTask);
            this.refreshTaskProgress();
            this.$router.push({
              // name:'home'
            });
          }else{
            showMsg("获取任务失败！","error")
          }
        })
        .catch(err => {
          console.log("error:" + err);
          // alert("服务器出现故障，请稍后再试！");
        });
    },
    refreshTaskProgress(){
      this.taskProgress="共"+this.taskList.length+"个，未标："+this.filterTaskList(0).length
                                +"，错误："+this.filterTaskList(2).length+"，删除："+this.filterTaskList(3).length;
    },
    filterTaskList(a){
      if(a == 0){
        return this.taskList.filter(function(item){
          return item.status == "未标";
        });
      }else if(a == 1){
        return this.taskList.filter(function(item){
          return item.status == "已标";
        });
      }else if(a == 2){
        return this.taskList.filter(function(item){
          return item.status == "错误";
        });
      }else if(a == 3){
        return this.taskList.filter(function(item){
          return item.status == "删除";
        });
      }
    },
    //提交当前任务
    submitAnnotateTask(){
      console.log("点击了提交");
      this.curTask.tags = JSON.parse(JSON.stringify(this.curEditTask.tags));
      this.curTask.status = "已标";
      this.setCurrent(this.curTask,1);
      this.refreshTaskProgress();
      // this.$axios.post(
      //   "/task/submitAnnotateTask",
      // )
    },
    transFormAllLabel2Array(labelsStr){
      for(var i=0;i< labelsStr.length;i++){
        var mLabel = labelsStr[i];
        if(mLabel.EnglishStr != ""){
          this.allLabelsArray.push(mLabel.EnglishStr);
        }
        if(mLabel.ClusterChilds!="[]"){
          this.transFormAllLabel2Array(mLabel.ClusterChilds);
        }
      }
    },
    sous: function(ev){
      console.log("按下了 keycode ： "+ev.keycode);
    },
    down: function(){
      console.log("按下了 keycode ： down");
      this.nowInAssociates++;
      if(this.nowInAssociates >= this.associateLabels.length)
        this.nowInAssociates = -1;
      // this.inpt = this.lists[this.now];
    },
    // ↑ 选择值，控制 li 的 .bgc
    up: function(){
      console.log("按下了 keycode ： up");
      this.nowInAssociates--;
      if(this.nowInAssociates < -1)
        this.nowInAssociates = this.associateLabels.length - 1;
      // this.inpt = this.lists[this.now];
    }
  },

  created() {
    console.log("create==================");
    this.getLableList();
    this.getAnnotateTaskList();
  }
};
</script>
<style scope>
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: red;
  /* background-color: #99a9bf; */
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.tagging-img {
  padding: 30px;
}
.box {
  float: left;
  width: 50%;
  overflow: hidden;
}
.img-box {
  width: 100%;
  height: 500px;
  position: relative;
  z-index: 1;
  background-color: #aae9e9e9;
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
.el-tag {
  margin: 5px 5px;
}
.el-tabs__content{
  height: 100%;
  overflow-y: scroll;
}
.el-tabs{
  float: right;
  width:45%;
  overflow-y: hidden;
}
.all-tags-box {
  width: 300px;
  float: left;
  margin-left: 30px;
  display: block;
}
.el-transfer-panel__header {
  margin-top: 10px;
  padding: 10px 10px;
  font-weight: bold;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}
.el-tree-node__label {
  font-size: 16px;
}
.commit-box{
  width:100%;
  padding: 5px 0;
}
.commit-btn-box{
  position: relative;
  left: 50%;
  transform: translateX(-150%);
}
.el-transfer-panel__filter{
  margin: 0px;
}
.el-transfer-panel__filter .el-input__inner{
  font-size: 16px;
}
.el-tabs__nav-scroll{
  margin-left: 30px;
}
.associate-label_ul{
  width: 250px;
  max-height: 500px;
  overflow-y:scroll;
  margin-top: 0px;
  padding-left: 16px;
  background-color:aliceblue;
  list-style-type:decimal;
  border: black 2px;
  position: absolute;
  z-index: 1;
}
.bgc {
  background-color: skyblue;
}
ol{
  margin-left: 20px;
}
.el-dropdown-menu__item{
  list-style:decimal;
}
.associate-label_li{
  position: relative;
  background-color:aliceblue;
  /* list-style-type:none; */
  padding: 5px;
}
.all-labels{
  width: 300px;
  margin-top: 16px;
  position: absolute;
  z-index:-1;
}
.vertical-scroll{
  max-height: 550px;
  overflow-y: auto;
}
</style>
