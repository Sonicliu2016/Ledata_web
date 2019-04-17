<template>
<div>
  <el-container>
    <el-header>
      <el-row :gutter="10" type="flex" justify="center" style="padding: 10px; ">
        <el-col :xs="8" :sm="4" :md="4" :lg="4" :span="4">
          <el-upload class="upload-demo" ref="upload" multiple name="videos" :action="string" :limit="limit" :file-list="filesList" :on-exceed="onExceed" :show-file-list="false" :http-request="uploadFile">
            <el-card shadow="hover">
              <div class="upload-card" style="cursor: pointer;">
                <img src="../../../assets/video.png">
                <sapn style="font-size:20px">视频上传</sapn>
              </div>
            </el-card>
          </el-upload>
        </el-col>
        <!-- <el-col :xs="8" :sm="4" :md="4" :lg="4" :span="4">
          <el-upload class="upload-demo">
            <el-card shadow="hover">
              <div class="upload-card" style="cursor: pointer;">
                <img src="../../assets/video.png">
                <sapn style="font-size:20px">视频上传</sapn>
              </div>
            </el-card>
          </el-upload>
        </el-col> -->
      </el-row>
      <el-upload class="upload-demo" :action="uploadJsonUrl" name="json" :show-file-list="false" :on-success="uploadJsonSuccess" v-show="isShowTask">
        <div>
          点击上传json文件
        </div>
      </el-upload>
    </el-header>

    <el-main v-show="isShowTask">
      <div>
        <el-tabs type="card" @tab-click="onTabClick">
          <el-tab-pane v-for="tab in tabs" :label="tab.name" :key="tab.name"></el-tab-pane>
        </el-tabs>
        <!-- <keep-alive> -->
        <router-view></router-view>
        <!-- </keep-alive> -->
      </div>
    </el-main>

    <el-dialog title="正在上传视频" :visible.sync="showUploadProgress">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="uploadPro"></el-progress>

    </el-dialog>
  </el-container>
</div>
</template>

<script>
import User from '../../../modules/UserModule.js';
import Global from '../../../common/global';
var user = User;
var global = Global;
export default {
  data() {
    return {
      tabs: [{
          name: '标签任务'
        },
        {
          name: '验证任务'
        }
      ],
      uploadUrl: '',
      userList: [],
      filesList: [], //选中要上传的视频
      waitUpLoadList: [], //等待上传的视频列表
      showUploadProgress: false,
      uploadPro: 0, //上传的进度
      totalCount: 0, //要上传的总数量
      limit: 50, //单次上传限制视频个数
      username: '',
      isShowTask: true, //如果是admin就展示任务列表，如果是普通用户，就不展示
    }
  },
  methods: {
    // 视频的上传
    uploadFile(item) {
      const isMP4 = item.file.type === 'video/mp4';
      this.totalCount = 0;
      this.uploadPro = 0;
      this.waitUpLoadList.push({
        'fileName': item.file.name,
      })
      if (isMP4) {
        this.totalCount = this.waitUpLoadList.length;
        this.showUploadProgress = true;

        let FormDatas = new FormData();
        FormDatas.append('video', item.file);
        FormDatas.append('userName', this.username);
        this.$axios({
          method: 'post',
          url: this.uploadUrl,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: FormDatas
        }).then((res) => {
          if (res.data.code == 200) {
            this.uploadSuccess(item.file);
          }
        })
      } else {
        this.$message.error('上传视频只能是MP4格式:' + file.name);
      }
      return isMP4;
    },
    //上传视频成功后对上传进度的更新
    uploadSuccess(file) {
      var index = this.findIndex(this.waitUpLoadList, file.name);
      if (index > -1) {
        this.waitUpLoadList.splice(index, 1); //删除指定下标的元素
      }
      var uploadedCount = this.totalCount - this.waitUpLoadList.length;
      this.uploadPro = (Math.round(parseFloat(uploadedCount) / parseFloat(this.totalCount) * 10000) / 100.00);
      if (this.waitUpLoadList.length == 0) {
        this.showUploadProgress = false;
        this.$message({
          message: '视频上传完毕!',
          type: 'success'
        });
        setTimeout("window.location.reload()", 3000);
      }
    },
    // 文件超出个数限制时
    onExceed(files, fileList) {
      this.$message.error('一次最多上传' + this.limit + '个视频!');
    },
    //定位上传完毕的视频，删除待上传列表对应数组
    findIndex(files, name) {
      console.log("-1");
      for (var i = 0; i < files.length; i++) {
        if (files[i].fileName == name) {
          return i;
        }
      }
      return -1;
    },
    onTabClick(tab, e) {
      if (this.tabs[tab.index].name == '标签任务') {
        this.$router.push({
          name: 'videoLabelTask'
        });
      } else if (this.tabs[tab.index].name == '验证任务') {
        this.$router.push({
          name: 'videoVerifyTask'
        });
      }
      console.log(this.tabs[tab.index].name);
    },
  },
  created() {
    this.userList = this.$parent.userList; //获取用户列表
    this.username = user.methods.getUserName();
    this.uploadUrl = global.BASE_URL + 'file/uploadVideo';
    this.uploadJsonUrl = global.BASE_URL + 'task/uploadJson';
    if (user.methods.isAdmin()) {
      this.isShowTask = true;
    } else {
      this.isShowTask = false;
    }
    console.log("tasklist-->create-->userList:" + this.userList.length + "--->url:" + this.uploadUrl);
  },
  mounted() {

  },
}
</script>

<style scoped>
.el-header {
  width: 100%;
  height: 200px !important;
  padding: 15px;
  text-align: center;
}

.el-main {
  /* background-color: #e9eef3; */
  color: #333;
  text-align: center;
}

.el-dialog,
.imagelist {
  text-align: center;
}

.image {
  width: 250px;
  height: 250px;
  display: block;
}

.img2 {
  width: 200px;
  height: 250px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100px auto;
}


.el-card {
  /* background: rgb(159, 203, 241); */
}

.upload-card {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
