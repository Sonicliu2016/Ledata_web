<template>
<div class="tagging-img">
  <div class="box">
    <div>{{curTask.status}}</div>

    <div class="img-box">
      <img v-bind:src="baseurl + curEditTask.media_url" />
      <button type="button" class="el-carousel__arrow el-carousel__arrow--left" @click="setCurrent(curTask,-1)">
        <i class="el-icon-arrow-left"></i>
      </button>
      <button type="button" class="el-carousel__arrow el-carousel__arrow--right" @click="setCurrent(curTask,1)">
        <i class="el-icon-arrow-right"></i>
      </button>
    </div>

    <div class='select-tag-box'>
      <div class="only-select-tag-box">
        <span>已选分类：</span>
        <el-tag @click.native="setSelect(tag)" @keyup.delete.native="deleteSelectTag()" :props="selectLabelsProps" v-for="tag in curEditTask.tags" :key="tag.name" closable @close="remove(tag)" is-focusable :type="tag.type">
          {{tag.cluster_name}}
        </el-tag>
      </div>
      <div style="display:inline-block">
        <div class="button-box">
          <span>
            <span class="commit-box">
              <el-button type="danger" round @click="submitAnnotateTask(3)">删除</el-button>
              <!-- <el-button type="warning" round @click="submitAnnotateTask(2)">错误</el-button> -->
              <el-button type="primary" round @click="submitAnnotateTask(1)">提交</el-button>
              <el-button type="warning" round @click="editCommon()" v-show="!editing">编辑常用</el-button>
              <el-button type="warning" round plain @click="editCommon()" v-show="editing">保存常用</el-button>
            </span>
            <span class="complete-box">
              <el-button type="success" size="big" @click="showCompleteDialog">
                完成任务
              </el-button>
            </span>
          </span>
        </div>
        <!-- <span class="commonly-box"> -->
        <span v-for="item in common">
          <el-input size="medium" v-model="item.value" v-show="editing"></el-input>
          <el-button size="medium" plain v-show="!editing" @click="addToSelect(item.value)">{{item.value}}</el-button>
        </span>
        <!-- </span> -->
      </div>
    </div>
  </div>

  <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
    <span>确定要完成该批任务吗？</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="centerDialogVisible = false">继续浏览</el-button>
      <el-button type="primary" @click="clickComplete">完成任务</el-button>
    </span>
  </el-dialog>

  <el-tabs v-model="activeTabName" type="border-card" style="position:positive;z-index:-1;">

    <el-tab-pane label="标注任务列表" name="first">
      <el-progress :text-inside="true" :stroke-width="18" :percentage=progress style="width:100%;"></el-progress>
      <!-- <el-button type="success" size="small" style="width:18%;float:left；margin-left:18px;" @click="completeTask">
          完成任务
        </el-button> -->
      <span style="float:right;font-size:12px;color:gray;padding:5px;">{{taskProgress}}</span>
      <el-table ref="singleTable" :data="taskList" height="500px" highlight-current-row @current-change="handleCurrentChange" style="width: 100%">
        <el-table-column property="id" label="编号" width="50">
        </el-table-column>
        <el-table-column property="media_url" label="URL" width="180">
        </el-table-column>
        <el-table-column property="mainCluster" label="主标签">
          <!-- <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.tags" :key="index">
                  {{item.cluster_name}} </span>
              </template> -->
        </el-table-column>
        <el-table-column property="status" label="状态" width="120" :filters="[{ text: '未标', value: '未标'}, { text: '已标', value: '已标'}, { text: '错误', value: '错误'}, { text: '删除', value: '删除'}]" :filter-method="filterTaskStatusHandler">
        </el-table-column>
      </el-table>
    </el-tab-pane>

    <el-tab-pane label="标签列表" name="second">
      <el-progress :text-inside="true" :stroke-width="18" :percentage=progress style="width:100%;"></el-progress>
      <!-- <el-button type="success" size="small" style="width:18%;float:left；margin-left:18px;" @click="completeTask">
          完成任务
        </el-button> -->
      <div class="el-transfer-panel__filter el-input el-input--small el-input--prefix " style="margin-top:10px;">
        <span class="el-input__prefix">
          <i class="el-input__icon el-icon-search"></i>
        </span>
        <input v-model="searchTv" type="text" v-on:input="searchAssociate" autocomplete="off" @keydown.down="down" @keydown.up.prevent="up" @keyup.alt.83="submitAnnotateTask(1)" placeholder="请输入标签名称" class="el-input__inner" @keyup.enter="addFromSearch2Select()">

        <div class="associate-label_ul">
          <ol>
            <li class="el-dropdown-menu__item" v-for="(label,index) in associateLabels" v-bind:key="index" @click="setSearchText(label)" :class="{bgc: index == nowInAssociates}">
              {{ label }}
            </li>
          </ol>
        </div>
      </div>

      <!-- <div class="el-transfer-panel__header">所有分类</div>
        <el-tree :data="data4" :props="allLabelsProps" accordion class="vertical-scroll">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <i class="el-icon-circle-plus" @click="() => addToSelect(node.label)"></i>
            </span>
          </span>
        </el-tree> -->
      <!-- <el-input placeholder="请输入标签名称" v-model="filterText">
        </el-input> -->
      <el-tree class="vertical-scroll" :data="data4" :props="allLabelsProps" highlight-current accordion :expand-on-click-node="false" :filter-node-method="filterNode" @node-click="handleNodeClick" node-key="id" ref="tree">
      </el-tree>
    </el-tab-pane>
  </el-tabs>

</div>
</template>

<script>
import User from '../../modules/UserModule.js';
import Global from '../../common/global.vue';
var user = User;
export default {
  data() {
    return {
      imgUrl: "",
      centerDialogVisible: false,
      showDiaCount: 0,
      filterText: '',
      baseurl: "",
      currentUser: "",
      activeTabName: "first",
      taskProgress: "",
      searchTv: "",
      searchTvs: [],
      progress: 0,
      allLabelsProps: {
        children: "ClusterChilds",
        label: "ShowStr"
      },
      selectLabelsProps: {
        name: "cluster_name"
      },
      associateLabels: [],
      nowInAssociates: -1,
      data4: [],
      taskId: -1,
      allLabelsArray: [],
      curTask: {},
      curEditTask: {
        media_url: "",
        tags: []
      },
      taskList: [],
      touchtime: '',
      editing: false,
      common: [{
          value: '（常用标签）'
        },
        {
          value: '（常用标签）'
        },
        {
          value: '（常用标签）'
        },
      ],

    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    editCommon() {
      if (this.editing) {
        this.editing = false;

      } else {
        this.editing = true;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.ShowStr.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log("点击标签:" + data.EnglishStr)
      this.addToSelect(data.EnglishStr)
    },
    // 展示消息
    showMsg(msg, msgType) {
      this.$message({
        showClose: true,
        message: msg,
        type: msgType
      });
    },
    addFromSearch2Select() {
      this.searchTvs = [];
      var strs = new Array();
      strs = this.searchTv.split(" ");
      for (var i = 0; i < strs.length; i++) {
        var s = strs[i];
        var num = s.replace(/[^0-9]/ig, "");
        var labelPart = s.replace(/[^a-z]+/ig, "");
        this.getAssociateList(labelPart);
        if (this.associateLabels.length > 0) {
          if (num > this.associateLabels.length) {
            num = this.associateLabels.length;
          }
          if (num <= 0) {
            num = 1;
          }
          this.searchTvs.push(this.associateLabels[num - 1]);
        }
      }
      console.log("addFromSearch2Select :" + this.searchTvs.length);
      for (var i = 0; i < this.searchTvs.length; i++) {
        this.addToSelect(this.searchTvs[i]);
      }
      this.associateLabels = [];
      this.searchTv = "";
    },
    // 添加tag到已选
    addToSelect(labelStr) {
      console.log("请求成功:" + labelStr);
      if (this.allLabelsArray.indexOf(labelStr) == -1) {
        this.showMsg("无法添加" + labelStr + "，此标签不存在", "warning");
        return;
      }
      // this.curEditTask = JSON.parse(JSON.stringify(this.curTask));
      this.findAllLabels(this.data4, labelStr, "");
      console.log("添加成功");
    },
    findAllLabels(labelsStr, tarLabel, parentLabel) {
      for (var i = 0; i < labelsStr.length; i++) {
        var mLabel = labelsStr[i];
        if (mLabel.EnglishStr == tarLabel) {
          if (parentLabel != "") {
            if (!this.checkLabelExist(parentLabel)) {
              this.curEditTask.tags.push({
                cluster_name: parentLabel,
                type: ""
              });
            }
          }
          if (!this.checkLabelExist(mLabel.EnglishStr)) {
            this.curEditTask.tags.push({
              cluster_name: mLabel.EnglishStr,
              type: ""
            });
          }
          break;
        }
        if (mLabel.ClusterChilds != "[]") {
          this.findAllLabels(mLabel.ClusterChilds, tarLabel, mLabel.EnglishStr);
        }
      }
    },
    //核查标签是否已存在
    checkLabelExist(labelStr) {
      for (var i = 0; i < this.curEditTask.tags.length; i++) {
        if (labelStr == this.curEditTask.tags[i].cluster_name) {
          console.log("不能重复添加:" + this.curEditTask.tags[i].cluster_name);
          this.showMsg(this.curEditTask.tags[i].cluster_name + "已添加", "warning");
          return true;
        }
      }
      return false;
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
    setSearchText(label) {
      if (new Date().getTime() - this.touchtime < 500) {
        console.log("dblclick");
        this.addToSelect(label)
      } else {
        this.touchtime = new Date().getTime();
        console.log("click")
        this.searchTv = label;
      }
    },
    // 监听到搜索框内容变化时，调用获取联想列表
    searchAssociate() {
      var strs = new Array();
      strs = this.searchTv.split(" ");
      if (strs.length > 0) {
        var s = strs[strs.length - 1];
        var labelPart = s.replace(/[^a-z]+/ig, "");
        this.getAssociateList(labelPart);
      }
    },
    getAssociateList(text) {
      this.associateLabels = [];
      for (var i = 0; i < this.allLabelsArray.length; i++) {
        var label = this.allLabelsArray[i];
        if (text != "" && label.toLowerCase().indexOf(text.toLowerCase()) != -1) {
          this.associateLabels.push(label);
        }
      }
      this.associateLabels.sort(function(m, n) {
        if (m.slice(0, 1) == text.slice(0, 1)) {
          return -1;
        } else if (n.slice(0, 1) == text.slice(0, 1)) {
          return 1;
        } else {
          return 0;
        }
      });
    },
    setCurrent(row, i) {
      var index = this.taskList.indexOf(row);
      var rest = this.filterTaskList(0).length;
      if (index != -1) {
        if (i == 1) {
          if (index + 1 >= this.taskList.length) {
            this.showMsg("已是最后一张图片");
          } else {
            row = this.taskList[index + 1];
          }
        } else if (i == -1) {
          if (index - 1 < 0) {
            this.showMsg("已是第一张图片");
          } else {
            row = this.taskList[index - 1];
          }
        }
      }
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.curTask = val;
      // this.curEditTask = JSON.parse(JSON.stringify(val));
      this.curEditTask = this.requestForTaskDetail(val.media_md5);
    },
    formatter(row, column) {
      return row.status;
    },
    filterTaskStatus(value, row) {
      return row.status === value;
    },
    filterTaskStatusHandler(value, row, column) {
      console.log("filterTaskStatusHandler: " + value);
      const property = column['property'];
      return row[property] === value;
    },
    // 获取所有标签列表
    getLableList() {
      this.$axios
        .post(
          "label/getallcluster", {}, {
            //跨域请求配置参数
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(res => {
          this.data4 = res.data.ClusterChilds;
          this.allLabelsArray = []
          this.transFormAllLabel2Array(this.data4);
        })
        .catch(err => {
          console.log("error:" + err);
        });
    },

    // 获取当前用户任务列表
    getAnnotateTaskList() {
      var params = new URLSearchParams();
      params.append('username', this.currentUser);
      this.$axios({
          method: 'post',
          url: "/task/getAnnotateTask",
          data: params
        })
        .then(res => {
          if (res.data.code == 200) {
            this.taskId = res.data.data.taskid;
            var tasks = res.data.data.taskinfo;
            this.taskList.splice(0, this.taskList.length);
            if (tasks != null) {
              for (var i = 0; i < tasks.length; i++) {
                var timestamp = new Date().getTime();
                this.taskList.push({
                  'id': tasks[i].Id,
                  'media_url': tasks[i].MediaNetUrl + "?" + timestamp,
                  'media_md5': tasks[i].MediaMD5,
                  'status': this.getTaskStatus(tasks[i].MediaAnnotatedState),
                  'mainCluster': tasks[i].MediaMasterCluster
                })
              }
              console.log(this.taskList);
              this.setCurrent(this.taskList[0], 0);
            } else {
              this.curTask = [];
              this.curEditTask = [];
              this.$alert('请联系管理员分配任务', '无标注任务', {
                confirmButtonText: '确定',
                center: true
              });
            }
            this.refreshTaskProgress();
          } else {
            showMsg("获取任务失败！", "error")
          }
        })
        .catch(err => {
          console.log("error:" + err);
          // alert("服务器出现故障，请稍后再试！");
        });
    },
    // 根据任务Id获取任务详情信息
    requestForTaskDetail(mediamd5) {
      var params = new URLSearchParams();
      params.append("mediamd5", mediamd5);
      this.$axios({
          method: 'post',
          url: "/label/getClustersById",
          data: params
        })
        .then(res => {
          console.log("requestForTaskDetail 请求成功");
          if (res.data.code == 200) {
            this.curEditTask = res.data.data;
          }
        })
        .catch(err => {
          console.log("requestForTaskDetail, taskId:" + taskId + " error:" + err);
        });
    },
    refreshTaskProgress() {
      this.taskProgress = "共" + this.taskList.length + "个，未标：" + this.filterTaskList(0).length +
        "，错误：" + this.filterTaskList(2).length + "，删除：" + this.filterTaskList(3).length;
      this.progress = (this.taskList.length - this.filterTaskList(0).length) * 100 / this.taskList.length;
      this.progress = this.progress.toFixed(2);
    },
    getTaskStatus(status) {
      switch (status) {
        case 0:
          return "未标";
        case 1:
          return "已标";
        case 2:
          return "错误";
        case 3:
          return "删除";
      }
    },
    filterTaskList(a) {
      if (a == 0) {
        return this.taskList.filter(function(item) {
          return item.status == "未标";
        });
      } else if (a == 1) {
        return this.taskList.filter(function(item) {
          return item.status == "已标";
        });
      } else if (a == 2) {
        return this.taskList.filter(function(item) {
          return item.status == "错误";
        });
      } else if (a == 3) {
        return this.taskList.filter(function(item) {
          return item.status == "删除";
        });
      }
    },
    showCompleteDialog() {
      console.log("点击提交：" + this.taskList.length);
      if (this.taskList.length > 0) {
        this.centerDialogVisible = true;
      } else {
        this.showMsg("当前没有任务需要提交！");
      }
    },

    clickComplete() {
      this.centerDialogVisible = false;
      var rest = this.filterTaskList(0).length;
      console.log("rest:" + rest);
      if (rest == 0) {
        this.completeTask();
      } else {
        this.showMsg("还有" + this.filterTaskList(0).length + "张未标，提交失败");
      }
    },
    //提交当前任务 submitType:(1:提交 2：错误 3：删除)
    submitAnnotateTask(submitType) {
      var params = new URLSearchParams();
      params.append("type", submitType);
      params.append("clusters", this.transFormTags2Str(this.curEditTask.tags));
      params.append("username", this.currentUser);
      params.append("tasktype", 0);
      params.append("mediamd5", this.curEditTask.media_md5);
      console.log("requestForTaskDetail 请求ready:" + this.transFormTags2Str(this.curEditTask.tags));
      this.$axios({
          method: 'post',
          url: "/task/submitAnnotateTask",
          data: params
        })
        .then(res => {
          console.log("requestForTaskDetail 请求成功" + res.data.code);
          if (res.data.code == 200) {
            // this.curEditTask = res.data.data;
            console.log("点击了提交 before:" + this.curTask.MediaNetUrl);
            // this.curTask.tags = JSON.parse(JSON.stringify(this.curEditTask.tags));
            this.curTask.status = this.getTaskStatus(submitType);
            // this.initShowCount(submitType);
            this.setCurrent(this.curTask, 1);
            this.refreshTaskProgress();
          }
        })
        .catch(err => {
          console.log("requestForTaskDetail, taskId:" + taskId + " error:" + err);
        });
      //
    },
    transFormTags2Str(tagsJson) {
      var str = "";
      for (var i = 0; i < tagsJson.length; i++) {
        str += (tagsJson[i].cluster_name + ",");
      }
      console.log("transFormTags2Str: " + str);
      return str;
    },
    transFormAllLabel2Array(labelsStr) {
      for (var i = 0; i < labelsStr.length; i++) {
        var mLabel = labelsStr[i];
        if (mLabel.EnglishStr != "") {
          this.allLabelsArray.push(mLabel.EnglishStr);
        }
        if (mLabel.ClusterChilds != "[]") {
          this.transFormAllLabel2Array(mLabel.ClusterChilds);
        }
      }
    },
    completeTask() {
      var params = new URLSearchParams();
      params.append("taskid", this.taskId);
      console.log("taskid: " + this.taskId)
      this.$axios({
          method: 'post',
          url: "/task/completeAnnotateTask",
          data: params
        })
        .then(res => {
          console.log("requestForTaskDetail 请求成功" + res.data.code);
          if (res.data.code == 200) {
            // this.curEditTask = res.data.data;
            console.log("点击了提交 before:" + this.curTask.MediaNetUrl);
            // this.curTask.tags = JSON.parse(JSON.stringify(this.curEditTask.tags));
            this.getAnnotateTaskList();
          } else {
            this.showMsg("网络错误，提交失败 code:" + res.data.code);
          }
        })
        .catch(err => {
          console.log("requestForTaskDetail, taskId:" + taskId + " error:" + err);
          this.showMsg("网络错误，提交失败 error:" + err);
        });
    },
    down: function() {
      console.log("按下了 keycode ： down");
      this.nowInAssociates++;
      if (this.nowInAssociates >= this.associateLabels.length) {
        this.nowInAssociates = -1;
      }
      this.searchTv = this.associateLabels[this.nowInAssociates];
    },
    // ↑ 选择值，控制 li 的 .bgc
    up: function() {
      console.log("按下了 keycode ： up");
      this.nowInAssociates--;
      if (this.nowInAssociates < -1) {
        this.nowInAssociates = this.associateLabels.length - 1;
      }
      this.searchTv = this.associateLabels[this.nowInAssociates];
    }
  },

  created() {
    this.baseurl = Global.BASE_URL;
    this.touchtime = new Date().getTime();
    this.currentUser = user.methods.getUserName(); //获取当前登录的用户
    this.imgUrl = "../assets/img_bg.png"
    this.getLableList();
    this.getAnnotateTaskList();
    console.log("username:" + this.currentUser);
  }
};
</script>

<style scoped>
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

.el-carousel__arrow {
  background-color: rgba(31, 45, 61, 0.6);
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
  display: inline;
}

.el-tag {
  margin: 5px 5px;
}

.el-tabs__content {
  height: 100%;
  overflow-y: scroll;
}

.el-tabs {
  float: right;
  width: 45%;
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

.button-box {
  float: left;
  width: 75%;
  padding: 5px 0;
  text-align: center;
}

.commonly-box {
  width: 25%;
  float: right;
  text-align: center;
  padding: 5px 0;
}



.commit-box {
  display: block;
}

.complete-box {
  display: block;
  margin-top: 20px;
}

.el-transfer-panel__filter {
  margin: 0px;
}

.el-transfer-panel__filter .el-input__inner {
  font-size: 16px;
}

.el-tabs__nav-scroll {
  margin-left: 30px;
}

.associate-label_ul {
  width: 250px;
  max-height: 500px;
  overflow-y: scroll;
  margin-top: 0px;
  padding-left: 16px;
  background-color: aliceblue;
  list-style-type: decimal;
  border: black 2px;
  position: absolute;
  z-index: 1;
}

.bgc {
  background-color: skyblue;
}

ol {
  margin-left: 20px;
}

.el-dropdown-menu__item {
  list-style: decimal;
}

.associate-label_li {
  position: relative;
  background-color: aliceblue;
  /* list-style-type:none; */
  padding: 5px;
}

.all-labels {
  width: 300px;
  margin-top: 16px;
  position: absolute;
  z-index: -1;
}

.vertical-scroll {
  max-height: 550px;
  overflow-y: auto;
}

@media only screen and (min-width: 1200px) {}

@media only screen and (min-width: 768px) and (max-width: 991px) {}

@media only screen and (max-width: 767px) {}

@media only screen and (-webkit-min-device-pixel-ratio: 1.3),
only screen and (-o-min-device-pixel-ratio: 13/10),
only screen and (min-resolution: 120dpi) {}
</style>
