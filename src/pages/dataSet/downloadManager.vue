<template>
<div class="content">
  <el-row :gutter="20" type="flex" justify="center" style="padding: 10px; ">
    <el-col :xs="12" :sm="8" :md="6" :lg="6" :span="4">
      <el-card>
        <div class="downLoad-card">
          <img src="../../assets/download.png">
          <div style="position: relative;top: 25%;">
            <el-button type="primary" @click="downZipAllFiles">下载全部照片</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="12" :sm="8" :md="6" :lg="6" :span="4">
      <el-card>
        <div class="downLoad-card">
          <img src="../../assets/download.png">
          <br>
          <span>一共有{{totalCount}}张图片</span>
          <br>
          <span>输入图片名字范围查找并下载图片：</span>
          <br>
          <input class="numInput" v-model="firstNum" type="number" placeholder="请输入起始数字"></input>
          <br>
          <span>to</span>
          <br>
          <input class="numInput" v-model="secondNum" type="number" placeholder="请输入结束数字"></input>
          <br>
          <div style="margin-top: 10px;">
            <el-button type="primary" @click="searchNumAndDownload">查找并下载照片</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="12" :sm="8" :md="6" :lg="6" :span="4">
      <el-card>
        <div class="downLoad-card">
          <img src="../../assets/download.png">
          <br>
          <span>输入标签名查找并下载图片：</span>
          <br>
          <div>
            <el-input placeholder="请输入标签" v-model="searchTag" v-on:input="searchAssociate" @keydown.native.down="down" @keydown.native.up.prevent="up" clearable style="">
            </el-input>
            <el-button type="primary" @click="downZipClusterFiles">查找并下载</el-button>

            <div class="associate-label_ul">
              <ol>
                <li class="el-dropdown-menu__item" v-for="(tag,index) in associateLabels" v-bind:key="index" @click="setSearchText(tag.cluster_name)" :class="{bgc: index == nowInAssociates}">
                  {{ tag.cluster_name }}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
    <!-- <el-col :xs="12" :sm="8" :md="6" :lg="6" :span="4">
      <el-card>
        <div class="downLoad-card">
          <img src="../../assets/download.png">
          <br>
          <div style="position: relative;top: 25%;">
            <el-button type="primary" @click="exportDownloadList">导出下载列表</el-button>
          </div>
        </div>
      </el-card>
    </el-col> -->
  </el-row>

</div>
</template>

<script>
import Global from '../../common/global';
var global = Global;
export default {
  data() {
    return {
      //通知图片开始压缩
      downloadAllZipUrl: 'file/downloadAllZip',
      downloadClusterZipUrl: 'file/downloadZipByCluster',
      downloadNumZipUrl: 'file/downloadZipByNum',
      exportDownloadListUrl: 'file/getDownloadList',
      getMediaTotalCountUrl: 'label/getMediaCountFromDownload',
      getBigFileUrl: 'file/getBigFile',
      firstNum: '',
      secondNum: '',
      searchTag: '',
      file_urls: [],
      zips_url: [],
      totalCount: 0,
      associateLabels: [],
      allTagsList: [],
      nowInAssociates: -1,
    }
  },
  methods: {
    getMediaTotalCount() {
      var params = new URLSearchParams();
      this.$axios({
          method: 'post',
          url: this.getMediaTotalCountUrl,
          data: params,
        })
        .then(res => {
          console.log("请求成功:" + res.data.code);
          if (res.data.code == 200) {
            this.totalCount = res.data.data.count;
          }
        })
        .catch(err => {
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试！");
        })
    },
    getAllTagList() {
      var params = new URLSearchParams();
      this.$axios({
          method: 'post',
          url: '/label/getAllClustersCount',
          data: params
        })
        .then(res => {
          this.allTagsList = res.data.data.clusters;
        })
        .catch(err => {

        });
    },
    searchAssociate() {
      this.associateLabels = [];
      for (var i = 0; i < this.allTagsList.length; i++) {
        var label = this.allTagsList[i].cluster_name;
        if (this.searchTag != "" && label.toLowerCase().indexOf(this.searchTag.toLowerCase()) != -1) {
          this.associateLabels.push(this.allTagsList[i]);
        }
      }
    },
    setSearchText(cluster_name) {
      this.searchTag = cluster_name;
      this.searchAssociate();
    },
    down: function() {
      console.log("按下了 keycode ： down");
      this.nowInAssociates++;
      if (this.nowInAssociates >= this.associateLabels.length) {
        this.nowInAssociates = -1;
      }
      this.searchTag = this.associateLabels[this.nowInAssociates].cluster_name;
    },
    // ↑ 选择值，控制 li 的 .bgc
    up: function() {
      console.log("按下了 keycode ： up");
      this.nowInAssociates--;
      if (this.nowInAssociates < -1) {
        this.nowInAssociates = this.associateLabels.length - 1;
      }
      this.searchTag = this.associateLabels[this.nowInAssociates].cluster_name;
    },
    downZipAllFiles() {
      var params = new URLSearchParams();
      this.$axios({
          method: 'post',
          url: this.downloadAllZipUrl,
          data: params,
        })
        .then(res => {
          console.log("请求成功:" + res.data.code);
          if (res.data.code == 200) {
            this.zips_url = res.data.data.zips_url;
            if (this.zips_url.length > 0) {
              for (var i = 0; i < this.zips_url.length; i++) {
                this.downFile(this.zips_url[i].zip_url);
              }
            } else {
              this.$message.error('没有可下载的照片！');
            }
          }
        })
        .catch(err => {
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试！");
        })
    },
    downFile(url) {
      console.log("下载文件:", url);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.style.height = 0;
      iframe.src = global.BASE_URL + this.getBigFileUrl + "?path=" + url;
      document.body.appendChild(iframe);
      setTimeout(() => {
        iframe.remove();
      }, 5 * 60 * 1000);
    },
    searchNumAndDownload() {
      console.log(this.firstNum + "------" + this.secondNum + "------" + (this.firstNum >= this.secondNum))
      if (this.strIsNull(this.firstNum) || this.strIsNull(this.secondNum)) {
        this.$message.error('请输入起始和结束范围！');
      } else if (Number(this.firstNum) >= Number(this.secondNum)) {
        this.$message.error('请输入合适的范围！');
      } else {
        var params = new URLSearchParams();
        params.append('startNum', this.firstNum);
        params.append('endNum', this.secondNum);
        this.$axios({
            method: 'post',
            url: this.downloadNumZipUrl,
            data: params,
          })
          .then(res => {
            console.log("请求成功:" + res.data.code);
            if (res.data.code == 200) {
              if (res.data.data != "") {
                this.zips_url = res.data.data.zips_url;
                if (this.zips_url.length > 0) {
                  for (var i = 0; i < this.zips_url.length; i++) {
                    this.getFileFromService(this.zips_url[i].zip_url);
                    this.$message({
                      message: '正在开始下载！',
                      type: 'success'
                    });
                  }
                } else {
                  this.$message.error('没有可下载的照片！');
                }
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
              }
            }
          })
          .catch(err => {
            console.log("error:" + err);
            alert("服务器出现故障，请稍后再试！");
          })
      }
    },

    //查找标签并下载照片
    downZipClusterFiles() {
      var params = new URLSearchParams();
      params.append('clusterName', this.searchTag);
      this.$axios({
          method: 'post',
          url: this.downloadClusterZipUrl,
          data: params,
        })
        .then(res => {
          console.log("请求成功:" + res.data.code);
          if (res.data.code == 200) {
            if (res.data.data != "") {
              this.zips_url = res.data.data.zips_url;
              if (this.zips_url.length > 0) {
                for (var i = 0; i < this.zips_url.length; i++) {
                  this.getFileFromService(this.zips_url[i].zip_url);
                  this.$message({
                    message: '正在开始下载！',
                    type: 'success'
                  });
                }
              } else {
                this.$message.error('没有可下载的照片！');
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
            }
          }
        })
        .catch(err => {
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试！");
        })
    },
    getFileFromService(url) {
      console.log("开始下载:", url)
      window.location.href = global.BASE_URL + this.getBigFileUrl + "?path=" + url;
    },
    downloadFile(url) {
      let blob = new Blob([url]);
      var a = document.createElement("a"), //创建a标签
        e = document.createEvent("MouseEvents"); //创建鼠标事件对象
      //         e.initEvent("click", false, false); //初始化事件对象
      a.href = window.URL.createObjectURL(blob); //设置下载地址
      a.download = this.getTime() + ".xml"; //设置下载文件名
      console.log("------------->" + this.getTime() + ".xml");
      a.click()
      URL.revokeObjectURL(a.href)
      //         a.dispatchEvent(e); //给指定的元素，执行事件click事件
    },
    getTime() {
      var myDate = new Date(); //获取系统当前时间
      var year = myDate.getFullYear();
      var month = (myDate.getMonth() + 1);
      var day = myDate.getDate();
      var hour = myDate.getHours();
      var minute = myDate.getMinutes();
      var second = myDate.getSeconds();
      return (year + "-" + this.getFullNUm(month) + "-" + this.getFullNUm(day) + "_" + this.getFullNUm(hour) + "：" + this.getFullNUm(minute) + "：" + this.getFullNUm(second));
    },
    getFullNUm(time) {
      if ((time + "").length < 2) {
        return "0" + time;
      }
      return time;
    },
    exportDownloadList() {
      var params = new URLSearchParams();
      this.$axios({
          method: 'get',
          url: this.exportDownloadListUrl,
          data: params,
        })
        .then(res => {
          this.downloadFile(res.data)
        })
        .catch(err => {
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试！");
        })
    },
    //判断字符串是否为空
    strIsNull(str) {
      return (str.length === 0 || !str.trim());
    },
  },
  created() {
    this.getMediaTotalCount();
    this.getAllTagList();
  },
  components: {

  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 5px;
}

.content1,
.content3 {
  min-height: 6vh;
  padding: 15px;
  text-align: center;
  line-height: 4vh;
}

.content2 {
  min-height: 20vh;
  padding: 15px;
  text-align: center;
  line-height: 5vh;
}

.content4 {
  min-height: 6vh;
  text-align: center;
  line-height: 4vh;
}

.tagInput,
.el-input {
  width: 180px;
  height: 40px;
  font-size: 15px;
  float: left;
  left: 8%;
}

.numInput {
  width: 150px;
  height: 30px;
}

/* 去除webkit中input的type="number"时出现的上下图标 */
.numInput::-webkit-outer-spin-button,
.numInput::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.numInput[type="number"] {
  -moz-appearance: textfield;
  font-size: 15px;
}

.content3 {
  min-height: 30vh;
}

.bg-purple-dark {
  /* background: rgb(159, 203, 241); */
}

.downLoad-card {
  height: 300px;
  font-size: 17px;
  text-align: center;
  position: relative;
}

.associate-label_ul {
  width: 180px;
  max-height: 180px;
  overflow-y: scroll;
  margin-top: 0px;
  background-color: aliceblue;
  list-style-type: decimal;
  border: black 2px;
  position: absolute;
  z-index: 1;
  left: 8%;
}
</style>
