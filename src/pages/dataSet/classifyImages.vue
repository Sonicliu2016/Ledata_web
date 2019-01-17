<template>
<div class="classifyimages">
  <h1 style="text-align:center;margin-bottom:10px;">
    {{className}}
  </h1>

  <el-row :gutter="20">
    <el-col :span="4" v-for="(img,index) in images" :key="index">
      <img class="small-img" v-bind:src=baseurl+img.media_url @click="handleClick(img.media_url)">
      </el-col>
  </el-row>
  <Modal title="View Image" v-model="showModal" footer-hide>
    <img class="big-img" :src="clickedImage" v-if="showModal" style="width: 100%">
    </Modal>
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
      images: [],
      showModal: false,
      timestamp: '',
    }
  },
  methods: {
    handleClick(img) {
      this.clickedImage = this.baseurl + img;
      this.showModal = true;
    },
    getMediasByClusterName() {
      var params = new URLSearchParams();
      params.append("clusterName", this.className);
      this.$axios({
          method: 'post',
          url: '/label/getMediasByClusterName',
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
        })
        .catch(err => {

        });
    }
  },
  created() {
    this.className = this.$route.params.tagId;
    this.baseurl = Global.BASE_URL;
    this.getMediasByClusterName();
    console.log("classifyImages : tagid : " + this.className + " v" + this.baseurl);
  }
}
</script>

<style scoped>
.classifyimages {
  padding: 30px;
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
