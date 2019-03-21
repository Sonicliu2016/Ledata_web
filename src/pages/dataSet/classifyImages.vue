<template>
<div class="classifyimages">
  <h1 style="text-align:center;margin-bottom:10px;">
    {{className}}
  </h1>
  <div v-loading="loading" element-loading-text="图片加载中">
    <el-pagination @current-change="getMediasByClusterName()" :current-page.sync="currentPage" layout="prev, pager, next, jumper" :total="this.pageToatl">
    </el-pagination>
    <el-row :gutter="20">
      <el-col :span="4" v-for="(img,index) in images" :key="index">
        <img class="small-img" v-bind:src=baseurl+img.media_url @click="handleClick(img)">
      </el-col>
    </el-row>
    <Modal title="View Image" v-model="showModal" footer-hide>
      <img class="big-img" :src="clickedImage" v-if="showModal" style="width: 100%">
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
      baseurl: '',
      className: '',
      clickedImage: "",
      clickedNumber: '',
      images: [],
      showModal: false,
      timestamp: '',
      currentPage: 1,
      pageToatl: '',
      pageSize: 48,
      loading: true,
    }
  },
  methods: {
    handleClick(img) {
      this.clickedNumber = this.images.indexOf(img);
      this.clickedImage = this.baseurl + img.media_url;
      this.showModal = true;
    },
    hadleChange(i) {
      if (i == 1) {
        if (this.clickedNumber + i >= this.pageSize) {
          this.$message({
            message: '已是最后一张图片',
            showClose: true,
          });
        } else {
          this.clickedNumber++;
          this.clickedImage = this.baseurl + this.images[this.clickedNumber].media_url;
        }
      }
      if (i == -1) {
        if (this.clickedNumber + i < 0) {
          this.$message({
            message: '已是第一张图片',
            showClose: true,
          });
        } else {
          this.clickedNumber--;
          this.clickedImage = this.baseurl + this.images[this.clickedNumber].media_url;
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
          url: '/label/getPageMediasByClusterName',
          data: params
        })
        .then(res => {
          // this.images = res.data.data.ok_medias;
          // console.log("this.allTagsList: " + this.images.length);
          var okMedias = res.data.data.ok_medias;
          this.images.splice(0, this.images.length);
          for (var i = 0; i < okMedias.length; i++) {
            var timestamp = new Date().getTime();
            this.images.push({
              'media_url': okMedias[i].media_img_neturl + "?" + timestamp,
              'media_md5': okMedias[i].md5,
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
.classifyimages {
  padding: 30px;
  text-align: center;
}

.small-img {
  width: 100%;
  height: 230px;
  object-fit: cover;
}

.big-img {
  max-height: 800px;
  object-fit: contain;
}

.el-carousel__arrow {
  background-color: rgba(31, 45, 61, 0.6);
}
</style>
