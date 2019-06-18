<template>
<div class="classify-videos">
  <h1 style="text-align:center;margin-bottom:10px;">
    {{className}}
  </h1>
  <div v-loading="loading" element-loading-text="视频加载中">
    <el-pagination @current-change="getMediasByClusterName()" :current-page.sync="currentPage" layout="prev, pager, next, jumper" :total="this.pageToatl">
    </el-pagination>
    <el-row :gutter="20">
      <el-col :span="4" v-for="(video,index) in videos" :key="index">
        <img class="all-video" v-bind:src=baseurl+video.cover_url @click="handleClick(video)">
      </el-col>
    </el-row>
    <Modal title="View Video" v-model="showModal" footer-hide>
      <video class="click-video" :src="clickedVideo" v-if="showModal" style="width: 100%" controls autoplay>
      </video>
      <button type="button" class="el-carousel__arrow el-carousel__arrow--left" style="top:30px;left:40%" @click="hadleChange(-1)">
        <i class="el-icon-arrow-left"></i>
      </button>
      <button type="button" class="el-carousel__arrow el-carousel__arrow--right" style="top:30px;right:40%" @click="hadleChange(1)">
        <i class="el-icon-arrow-right"></i>
      </button>
    </Modal>
    <el-pagination @current-change="getMediasByClusterName()" :current-page.sync="currentPage" layout="prev, pager, next, jumper" :total="this.pageToatl">
    </el-pagination>
  </div>
</div>
</template>

<script>
import Global from '../../common/global.vue';
export default {
  data() {
    return {
      getPageVideoUrl: '/video/getPageVideosByClusterName',
      baseurl: '',
      className: '',
      clickedVideo: "",
      clickedNumber: '',
      videos: [],
      showModal: false,
      timestamp: '',
      currentPage: 1,
      pageToatl: '',
      pageSize: 48,
      loading: true,
    }
  },
  methods: {
    handleClick(video) {
      this.clickedNumber = this.videos.indexOf(video);
      this.clickedVideo = this.baseurl + video.video_url;
      this.showModal = true;
    },
    hadleChange(i) {
      if (i == 1) {
        if (this.clickedNumber + i >= this.pageSize) {
          this.$message({
            message: '已是最后一个视频',
            showClose: true,
          });
        } else {
          this.clickedNumber++;
          this.clickedVideo = this.baseurl + this.videos[this.clickedNumber].video_url;
        }
      }
      if (i == -1) {
        if (this.clickedNumber + i < 0) {
          this.$message({
            message: '已是第一个视频',
            showClose: true,
          });
        } else {
          this.clickedNumber--;
          this.clickedVideo = this.baseurl + this.videos[this.clickedNumber].video_url;
        }
      }
    },
    getMediasByClusterName() {
      this.loading = true;
      var params = new URLSearchParams();
      params.append("clusterName", this.className);
      params.append("pageIndex", this.currentPage);
      params.append("pageSize", this.pageSize);
      this.$axios({
          method: 'post',
          url: this.getPageVideoUrl,
          data: params
        })
        .then(res => {
          var okMedias = res.data.data.ok_videos;
          this.videos.splice(0, this.videos.length);
          for (var i = 0; i < okMedias.length; i++) {
            var timestamp = new Date().getTime();
            this.videos.push({
              'cover_url': okMedias[i].cover_path,
              'video_md5': okMedias[i].md5,
              'video_url': okMedias[i].video_path,
            })
          }
          this.loading = false;
        })
        .catch(err => {

        });
    }
  },
  created() {
    this.className = this.$route.params.tagId;
    this.pageToatl = Math.ceil(this.$route.params.tagCount / this.pageSize) * 10;
    this.baseurl = Global.BASE_URL;
    this.getMediasByClusterName();

    console.log("classifyImages : tagid : " + this.className + " pageToatl :" + this.pageToatl + " v" + this.baseurl);
  }
}
</script>

<style scoped>
.classify-videos {
  height: 100%;
  padding: 30px;
  text-align: center;
}

.all-video {
  width: 100%;
  height: 230px;
  object-fit: cover;
  cursor: pointer;
}

.click-video {
  /* height: 50%; */
  max-height: 420px;
  object-fit: contain;
}

.el-carousel__arrow {
  background-color: rgba(31, 45, 61, 0.6);
}
</style>
