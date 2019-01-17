<template>
<div>
  <el-row :gutter="20">
    <el-col :span="4" v-for="(img,index) in images" :key="index">
      <img class="small-img" v-bind:src=baseurl+img.media_url @click="handleClick(img.media_url,img.media_md5)">
      </el-col>
  </el-row>
  <Modal title="未识别图片" v-model="showModal" footer-hide>
    <img class="big-img" :src="clickedImage" v-if="showModal" style="width: 100%">
    <div align="center">
      <el-button type="primary" @click="recycleImg()">撤回</el-button>
      <el-button type="danger" @click="deleteImage()">彻底删除</el-button>
    </div>
  </Modal>
</div>
</template>

<script>
import Global from '../../common/global.vue';
export default {
  data() {
    return {
      baseurl: '',
      url: 'static/img/upload/machine/106.jpg',
      getUnrecognizedImgUrl: '/label/getDeletedImgs',
      clearDeletedImgUrl: '/label/cleanDeletedImg',
      recycleDeletedImgUrl: '/label/recycleDeletedImg',
      images: [],
      showModal: false,
      clickedImage: "",
      clickedMd5: "",
    }
  },
  methods: {
    handleClick(url, md5) {
      this.clickedImage = this.baseurl + url;
      this.clickedMd5 = md5
      this.showModal = true;
    },
    getImgs() {
      var params = new URLSearchParams();
      this.$axios({
          method: 'post',
          url: this.getUnrecognizedImgUrl,
          data: params
        })
        .then(res => {
          console.log("请求成功:" + res.data.code);
          if (res.data.code == 200) {
            var datas = res.data.data;
            this.images.splice(0, this.images.length);
            for (var i = 0; i < datas.length; i++) {
              var timestamp = new Date().getTime();
              this.images.push({
                'media_url': datas[i].MediaNetUrl + "?" + timestamp,
                'media_md5': datas[i].MediaMD5,
              })
            }
          } else {
            this.$message.error('获取信息失败！');
          }
        })
        .catch(err => {
          console.log("出现error:" + err);
          alert("服务器出现故障，请稍后再试！");
        })
    },
    recycleImg() {
      var params = new URLSearchParams();
      params.append("md5", this.clickedMd5);
      this.$axios({
          method: 'post',
          url: this.recycleDeletedImgUrl,
          data: params
        })
        .then(res => {
          console.log("请求成功:" + res.data.code);
          if (res.data.code == 200) {
            this.getImgs()
          } else {
            this.$message.error('操作失败！');
          }
          this.showModal = false;
        })
        .catch(err => {
          console.log("出现error:" + err);
          alert("服务器出现故障，请稍后再试！");
        })
    },
    deleteImage() {
      var params = new URLSearchParams();
      params.append("md5", this.clickedMd5);
      this.$axios({
          method: 'post',
          url: this.clearDeletedImgUrl,
          data: params
        })
        .then(res => {
          console.log("请求成功:" + res.data.code);
          if (res.data.code == 200) {
            this.getImgs()
          } else {
            this.$message.error('删除失败！');
          }
          this.showModal = false;
        })
        .catch(err => {
          console.log("出现error:" + err);
          alert("服务器出现故障，请稍后再试！");
        })
    }
  },
  components: {

  },
  created() {
    this.baseurl = Global.BASE_URL;
    this.getImgs();
  },
  mounted() {

  }
}
</script>

<style>
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

.small-img {
  width: 100%;
  height: 230px;
  object-fit: cover;
}

.big-img {
  max-height: 400px;
  object-fit: contain;
}
</style>
