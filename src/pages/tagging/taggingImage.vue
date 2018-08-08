<template>
    <div>
      <div class='imge'>

        <el-carousel indicator-position="none">
          <el-carousel-item v-for="item in 4" :key="item">
          <img src="http://pic2016.5442.com:82/2016/0120/16/3.jpg%21960.jpg">
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
<style>
.imge{
  width: 50%;
  background-color: red;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
