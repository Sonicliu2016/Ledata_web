<template>
<div class="tagging-video">
  <div class="box">
    <div>{{curTask.status}}</div>

    <div class="video-box">
      <el-row>
        <el-col :span="12">
          <video id="myvideo1" :src="videoSrc" :poster="videoImg" :muted="true" class="video-each-box">
            your browser does not support the video tag
          </video>
        </el-col>
        <el-col :span="12">
          <video id="myvideo2" :src="videoSrc" :poster="videoImg" :muted="true" currentTime=2 class="video-each-box">
            your browser does not support the video tag
          </video>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <video id="myvideo3" :src="videoSrc" :poster="videoImg" :muted="true" class="video-each-box">
            your browser does not support the video tag
          </video>
        </el-col>
        <el-col :span="12">
          <video id="myvideo4" :src="videoSrc" :poster="videoImg" :muted="true" class="video-each-box">
            your browser does not support the video tag
          </video>
        </el-col>
      </el-row>
      <button type="button" class="el-carousel__arrow el-carousel__arrow--left" @click="setCurrent(curTask,-1)">
        <i class="el-icon-arrow-left"></i>
      </button>
      <button type="button" class="el-carousel__arrow el-carousel__arrow--right" @click="setCurrent(curTask,1)">
        <i class="el-icon-arrow-right"></i>
      </button>
    </div>

    <div class='select-tag-box'>
      <span>已选分类：</span>
      <span class="only-select-tag-box">
        <el-tag :props="selectLabelsProps" v-for="tag in curEditTask.video_tags" :key="tag.name" closable @close="remove(tag)" is-focusable :type="tag.type">
          {{tag}}
        </el-tag>
      </span>
      <div class="button-box">
        <span class="commit-box">
          <el-button type="danger" round @click="submitAnnotateTask(2)">删除</el-button>
          <!-- <el-button type="warning" round @click="submitAnnotateTask(2)">错误</el-button> -->
          <el-button type="primary" round @click="submitAnnotateTask(1)">提交</el-button>
          <el-button type="primary" style="float: right;" @click="setStart();playVideo()" v-show="start==false">播放</el-button>
          <el-button type="danger" style="float: right;" @click="setStop()" v-show="start==true">停止</el-button>
        </span>
        <span class="complete-box">
          <el-button type="success" size="big" @click="showCompleteDialog">
            完成任务
          </el-button>
        </span>
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
      <span style="float:right;font-size:12px;color:gray;padding:5px;margin-left: auto; margin-right: auto;">{{taskProgress}}</span>
      <el-table ref="singleTable" :data="allTaskList" height="500px" highlight-current-row @current-change="handleCurrentChange" style="width: 100%">
        <el-table-column property="id" label="编号" width="50">
        </el-table-column>
        <el-table-column property="videos_md5" label="MD5" width="360">
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
      <div style="margin:10px;">
        <span class="el-input__prefix">
          <i class="el-input__icon el-icon-search"></i>
        </span>
        <el-input v-model="searchTv" size="medium" prefix-icon="el-icon-search" style="font-size: 16px;" clearable type="text" v-on:input="searchAssociate" autocomplete="off" @keydown.down="down" @keydown.up.prevent="up" @keyup.alt.83="submitAnnotateTask(0)"
          placeholder="请输入标签名称" @keyup.enter="addFromSearch2Select()">
        </el-input>
        <div class="associate-label_ul" v-show="isShow">
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
import User from '../../../modules/UserModule.js';
import Global from '../../../common/global.vue';
var user = User;
import Bus from '../../../bus';
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
        children: "tag_children",
        label: "tag_show_str"
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
      allTaskList: [],
      touchtime: '',
      videoSrc: '',
      // videoSrc: baseurl + curEditTask.media_url,
      // videoImg: 'http://static.fdc.com.cn/avatar/usercenter/5996999fa093c04d4b4dbaf1_162.jpg',
      videoImg: '',
      start: false,
      isShow: false,
      _dom1: '',
      _dom2: '',
      _dom3: '',
      _dom4: '',
    };
  },
  // watch: {
  //   filterText(val) {
  //     this.$refs.tree.filter(val);
  //   },
  // },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.ShowStr.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      console.log("点击了标签:" + data.tag_en_str)
      this.addToSelect(data.tag_en_str)
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
      console.log("请求添加成功:" + labelStr);
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
        if (mLabel.tag_en_str == tarLabel) {
          if (parentLabel != "") {
            if (!this.checkLabelExist(parentLabel)) {
              this.curEditTask.video_tags.push(parentLabel);
            }
          }
          if (!this.checkLabelExist(mLabel.tag_en_str)) {
            this.curEditTask.video_tags.push(mLabel.tag_en_str);
          }
          break;
        }
        if (mLabel.ClusterChilds != "[]") {
          this.findAllLabels(mLabel.tag_children, tarLabel, mLabel.tag_en_str);
        }
      }
    },
    //核查标签是否已存在
    checkLabelExist(labelStr) {
      for (var i = 0; i < this.curEditTask.video_tags.length; i++) {
        if (labelStr == this.curEditTask.video_tags[i]) {
          console.log("不能重复添加:" + this.curEditTask.video_tags[i]);
          this.showMsg(this.curEditTask.video_tags[i] + "已添加", "warning");
          return true;
        }
      }
      return false;
    },
    // 从已选tag中删除
    remove(tag) {
      this.curEditTask.video_tags.splice(this.curEditTask.video_tags.indexOf(tag), 1);
    },
    //单击item时，将item的label加入到input选项中
    setSearchText(label) {
      if (new Date().getTime() - this.touchtime < 500) {
        console.log("dblclick");
        this.isShow = false;
        this.addToSelect(label)
      } else {
        this.touchtime = new Date().getTime();
        console.log("click")
        this.searchTv = label;
      }
    },
    // 监听到搜索框内容变化时，调用获取联想列表
    searchAssociate() {
      if (this.searchTv == "") {
        this.isShow = false;
      } else {
        this.isShow = true;
        var strs = new Array();
        strs = this.searchTv.split(" ");
        if (strs.length > 0) {
          var s = strs[strs.length - 1];
          var labelPart = s.replace(/[^a-z]+/ig, "");
          this.getAssociateList(labelPart);
        }
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
    //在列表中前后切换当前任务
    setCurrent(row, i) {
      var index = this.allTaskList.indexOf(row);
      var rest = this.filterTaskList(0).length;
      if (index != -1) {
        if (i == 1) {
          if (index + 1 >= this.allTaskList.length) {
            this.showMsg("已是最后一张图片");
          } else {
            row = this.allTaskList[index + 1];
          }
        } else if (i == -1) {
          if (index - 1 < 0) {
            this.showMsg("已是第一张图片");
          } else {
            row = this.allTaskList[index - 1];
          }
        }
      }
      this.$refs.singleTable.setCurrentRow(row);
    },
    //列表点击选择当前任务
    handleCurrentChange(val) {
      this.curTask = val;
      this.requestForTaskDetail(val.videos_md5);
      if (this.curEditTask.video_tags == null) {
        this.curEditTask.video_tags = [];
      }
      this._dom1 = document.getElementById('myvideo1');
      this._dom2 = document.getElementById('myvideo2');
      this._dom3 = document.getElementById('myvideo3');
      this._dom4 = document.getElementById('myvideo4');
      // this._dom1.controls = true;
      // this._dom2.controls = true;
      // this._dom3.controls = true;
      // this._dom4.controls = true;
      this._dom1.muted = true;
      this._dom2.muted = true;
      this._dom3.muted = true;
      this._dom4.muted = true;
    },
    //等待播放时长，然后重新进行定位并播放
    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },
    //定位各个视频的起点，进行播放
    playVideo() {
      console.log("play,start:" + this.start);
      if (this.start == true) {
        this._dom1.currentTime = 0;
        this._dom1.play();
        this._dom2.currentTime = 3;
        this._dom2.play();
        this._dom3.currentTime = 6;
        this._dom3.play();
        this._dom4.currentTime = 9;
        this._dom4.play();
        this.sleep(3000).then(() => {
          this.pauseVideo();
        })
      }
    },
    pauseVideo() {
      this._dom1.pause();
      this._dom2.pause();
      this._dom3.pause();
      this._dom4.pause();
      this.playVideo();
    },
    //循环播放的开关
    setStart() {
      this.start = true;
    },
    setStop() {
      console.log("setStop");
      this.start = false;
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
          "video/getAllVideoTags",
        )
        .then(res => {
          this.data4 = res.data.data;
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
      params.append('userName', this.currentUser);
      this.$axios({
          method: 'post',
          url: "/video/getVideoLabelTasks",
          data: params
        })
        .then(res => {
          if (res.data.code == 200) {
            var tasks = res.data.data;
            this.allTaskList.splice(0, this.allTaskList.length);
            if (tasks != null) {
              this.taskId = res.data.data[0].task_id;
              for (var i = 0; i < tasks[0].videos.length; i++) {
                this.allTaskList.push({
                  'id': i + 1,
                  // 'video_count': tasks[i].video_count,
                  'videos_md5': tasks[0].videos[i].video_md5,
                  'status': this.getTaskStatus(tasks[0].videos[i].tag_status),
                })
              }
              console.log(this.allTaskList);
              // this.requestForTaskDetail(this.allTaskList[0].id)
              this.setCurrent(this.allTaskList[0], 0);
            } else {
              this.curTask = [];
              this.curEditTask = [];
              this.videoSrc = "";
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
    requestForTaskDetail(md5) {
      var params = new URLSearchParams();
      params.append("md5", md5);
      params.append("userName", this.currentUser);
      this.$axios({
          method: 'post',
          url: "/video/getVideoAndTagsByMd5",
          data: params
        })
        .then(res => {
          if (res.data.code == 200) {
            this.curEditTask = res.data.data;
            if (this.curEditTask.video_tags == null) {
              this.curEditTask.video_tags = [];
            }
            this.videoSrc = this.baseurl + this.curEditTask.video_url;
          } else {
            showMsg("获取任务失败！", "error")
          }
        })
        .catch(err => {
          console.log("requestForTaskDetail, error:" + err);
        });
    },
    refreshTaskProgress() {
      this.taskProgress = "共" + this.allTaskList.length + "个，未标：" + this.filterTaskList(0).length +
        "，删除：" + this.filterTaskList(2).length;
      this.progress = ((this.allTaskList.length - this.filterTaskList(0).length) * 100 / this.allTaskList.length).toFixed(2);
    },
    getTaskStatus(status) {
      switch (status) {
        case 0:
          return "未标";
        case 1:
          return "已标";
        case 2:
          return "删除";
      }
    },
    filterTaskList(a) {
      if (a == 0) {
        return this.allTaskList.filter(function(item) {
          return item.status == "未标";
        });
      } else if (a == 1) {
        return this.allTaskList.filter(function(item) {
          return item.status == "已标";
        });
      } else if (a == 2) {
        return this.allTaskList.filter(function(item) {
          return item.status == "删除";
        });
      }
    },
    showCompleteDialog() {
      console.log("点击提交：" + this.allTaskList.length);
      if (this.allTaskList.length > 0) {
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
        this.showMsg("还有" + this.filterTaskList(2).length + "张未标，提交失败");
      }
    },
    //提交当前任务 submitType:(0:提交 1：删除)
    submitAnnotateTask(submitType) {
      var params = new URLSearchParams();
      params.append("submitType", submitType);
      params.append("tagStr", this.transFormTags2Str(this.curEditTask.video_tags));
      params.append("userName", this.currentUser);
      params.append("videoMd5", this.curEditTask.video_md5);
      console.log("requestForTaskDetail 请求ready:" + this.transFormTags2Str(this.curEditTask.video_tags));
      this.$axios({
          method: 'post',
          url: "/video/submitVideoTags",
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
        str += (tagsJson[i] + ",");
      }
      console.log("transFormTags2Str: " + str);
      return str;
    },
    transFormAllLabel2Array(labelsStr) {
      for (var i = 0; i < labelsStr.length; i++) {
        var mLabel = labelsStr[i];
        if (mLabel.tag_en_str != "") {
          this.allLabelsArray.push(mLabel.tag_en_str);
        }
        if (mLabel.tag_children != "[]") {
          this.transFormAllLabel2Array(mLabel.tag_children);
        }
      }
      // console.log(this.data4);
    },
    completeTask() {
      var params = new URLSearchParams();
      params.append("taskId", this.taskId);
      params.append("userName", this.currentUser);
      console.log("taskid: " + this.taskId);
      this.$axios({
          method: 'post',
          url: "/video/completeVideoLabelTask",
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
    this.start = false;
    console.log("username:" + this.currentUser);
  },
  mounted() {
    Bus.$on('stop', (e) => {
      this.start = e
    })
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

.tagging-video {
  padding: 30px;
}

.box {
  float: left;
  width: 50%;
  overflow: hidden;
}

.video-box {
  width: 1000px;
  height: 500px;
  position: relative;
  z-index: 1;
  background: url(../../../assets/img_bg.png);
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  padding: 0px;
  /* background-color: #aae9e9e9; */
}

.video-each-box {
  height: 250px;
  width: 90%;

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
  width: 100%;
  padding: 5px 0;
  text-align: center;
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
