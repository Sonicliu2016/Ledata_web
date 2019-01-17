<template>
<div class='quality-check'>
  <el-dropdown split-button type="primary">
    {{labelName}}
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(label,index) in labels" :key="index" @click.native="itemClick(index)">{{label.cluster_name}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
  <div style="float:right">
    <el-button type="danger" @click="toVerification()">验证</el-button>
  </div>
  <el-row :gutter="30">
    <el-col :span="12" style="padding: 10px; ">
      <el-card>
        <div slot="header" class="clearfix" style="position:flex">
          <span>Machine</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="selectAll(0)">{{mSelectTv}}</el-button>
        </div>
        <div style="overflow-y:hiden">
          <el-row :gutter="10">
            <el-col :span="8" v-for="(m,index) in machineList" :key="index" style="padding: 5px; ">
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
          <el-button style="float: right; padding: 3px 0" type="text" @click="selectAll(1)">{{hSelectTv}}</el-button>
        </div>
        <div>
          <el-row :gutter="10">
            <el-col :span="8" v-for="(m,index) in humanList" :key="index" style="padding: 5px; ">
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
import Global from '../../common/global.vue';
export default {
  data() {
    return {
      baseurl: "",
      taskId: -1,
      labelName: "更多",
      labels: [],
      mSelectTv: "全选",
      hSelectTv: "全选",
      machineList: [],
      humanList: [],
      selectList: [],
      noSelectList: []
    }
  },
  methods: {
    showMsg(msg, msgType) {
      this.$message({
        showClose: true,
        message: msg,
        type: msgType
      });
    },
    itemClick(index) {
      this.labelName = this.labels[index].cluster_name;
      this.getEvaluateTaskSingleLabelInfo(this.labelName);
    },
    toogle(task) {
      if (task.isSelected) {
        task.isSelected = false;
      } else {
        task.isSelected = true;
      }
    },
    //获取某个列表选中的item
    getSelected() {
      this.selectList = [];
      this.noSelectList = [];
      for (var i = 0; i < this.machineList.length; i++) {
        if (this.machineList[i].isSelected) {
          this.selectList.push(this.machineList[i].img_md5);
        } else {
          this.noSelectList.push(this.machineList[i].img_md5);
        }
      }
      for (var i = 0; i < this.humanList.length; i++) {
        if (this.humanList[i].isSelected) {
          this.selectList.push(this.humanList[i].img_md5);
        } else {
          this.noSelectList.push(this.humanList[i].img_md5);
        }
      }
    },
    isAllSelected(type) {
      var m = 0;
      var tarList = [];
      if (type == 0) {
        tarList = this.machineList;
      } else {
        tarList = this.humanList;
      }
      for (var i = 0; i < tarList.length; i++) {
        if (tarList[i].isSelected) {
          m++;
        } else {
          break;
        }
      }

      if (m <= tarList.length - 1) {
        return false;
      }
      return true;
    },
    selectAll(type) {
      var tarList = [];
      if (type == 0) {
        tarList = this.machineList;
      } else {
        tarList = this.humanList;
      }
      if (this.isAllSelected(type)) {
        for (var i = 0; i < tarList.length; i++) {
          tarList[i].isSelected = false;
        }
        if (type == 0) {
          this.mSelectTv = "全选";
        } else {
          this.hSelectTv = "全选";
        }
      } else {
        for (var i = 0; i < tarList.length; i++) {
          tarList[i].isSelected = true;
        }
        if (type == 0) {
          this.mSelectTv = "取消全选";
        } else {
          this.hSelectTv = "取消全选";
        }
      }
    },
    toVerification() {
      this.getSelected();
      var params = new URLSearchParams();
      params.append("taskid", this.taskId);
      params.append("clustername", this.labelName);
      params.append("checklist", this.selectList);
      params.append("nochecklist", this.noSelectList);
      this.$axios({
          method: 'post',
          url: "/task/recvEvaluateTaskSingleLabelInfo",
          data: params
        })
        .then(res => {
          if (res.data.code == 200) {
            this.showMsg("验证暂存成功");
          } else {
            this.showMsg("验证暂存失败");
          }
        })
        .catch(err => {
          this.showMsg("验证暂存失败");
          console.log("toVerification,  error:" + err);
        })
    },
    getEvaluateTaskSingleLabelCluster() {
      var params = new URLSearchParams();
      params.append("taskid", this.taskId);
      this.$axios({
          method: 'post',
          url: "/task/getEvaluateTaskSingleLabelCluster",
          data: params
        })
        .then(res => {
          if (res.data.code == 200) {
            this.labels = res.data.data.clusters;
            if (this.labels.length > 0) {
              this.labelName = this.labels[0].cluster_name;
              this.getEvaluateTaskSingleLabelInfo(this.labelName);
            }
          }
        })
        .catch(err => {
          console.log("getEvaluateTaskSingleLabelCluster,  error:" + err);
        });
    },
    getEvaluateTaskSingleLabelInfo(clustername) {
      var params = new URLSearchParams();
      params.append("taskid", this.taskId);
      params.append("clustername", clustername);
      this.$axios({
          method: 'post',
          url: "/task/getEvaluateTaskSingleLabelInfo",
          data: params
        })
        .then(res => {
          if (res.data.code == 200) {
            var machines = res.data.data.machines;
            this.machineList.splice(0, this.machineList.length);
            for (var i = 0; i < machines.length; i++) {
              this.machineList.push({
                "media_url": machines[i].MediaNetUrl,
                "img_md5": machines[i].MediaMD5,
                "isSelected": machines[i].EnterVerify
              });
            }
            var humans = res.data.data.humans;
            this.humanList.splice(0, this.humanList.length);
            console.log("getEvaluateTaskSingleLabelInfo: " + humans.length);
            for (var i = 0; i < humans.length; i++) {
              this.humanList.push({
                "media_url": humans[i].MediaNetUrl,
                "img_md5": humans[i].MediaMD5,
                "isSelected": humans[i].EnterVerify
              });
            }
          }
        })
        .catch(err => {
          console.log("getEvaluateTaskSingleLabelInfo,  error:" + err);
        });
    }

  },
  created() {
    this.baseurl = Global.BASE_URL;
    this.taskId = this.$route.params.taskId;
    console.log("taskID:" + this.taskId);
    this.getEvaluateTaskSingleLabelCluster();
  }
}
</script>

<style scoped>
.quality-check {
  margin: 30px;
}

.img-box {
  width: 100%;
  height: 200px;
  position: relative;
  z-index: 1;
  background-color: #ebeef5;
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

.img-box .flag {
  position: absolute;
  padding: 1000px;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
