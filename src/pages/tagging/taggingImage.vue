<template>
    <div class="tagging-img">
      <div class="box">
        <div class="img-box">
          <img src="http://pic2016.5442.com:82/2016/0120/16/3.jpg%21960.jpg"/>
          <!-- <img src="http://img2.imgtn.bdimg.com/it/u=2136986566,2595509978&fm=27&gp=0.jpg"/> -->
          <!-- <img src="http://h.hiphotos.baidu.com/zhidao/pic/item/0b46f21fbe096b637948dd670d338744ebf8acb0.jpg"/> -->
          <!-- <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533731103890&di=78dec1f0391d3bb1e478e67051c282f1&imgtype=0&src=http%3A%2F%2Fimg008.hc360.cn%2Fy4%2FM03%2F9C%2FCF%2FwKhQiFTyp1yECzkDAAAAAGM5rfM432.jpg"/> -->
          <button type="button" class="el-carousel__arrow el-carousel__arrow--left">
            <i class="el-icon-arrow-left"></i>
          </button>
          <button type="button" class="el-carousel__arrow el-carousel__arrow--right">
            <i class="el-icon-arrow-right"></i>
          </button>
        </div>
        <div class='select-tag-box'>
          <span>已选分类：</span>
          <span class="only-select-tag-box">
            <el-tag
              v-on:click.native="setSelect(tag)"
              v-for="tag in selectTags"
              :key="tag.name"
              closable
              @close="remove(tag)"
              is-focusable
              :type="tag.type">
              {{tag.name}}
            </el-tag>
          </span>
        </div>
      </div>
      <div class="all-tags-box">
        <div class="el-transfer-panel__header">
          所有分类</div>
        <el-tree :data="data4" :props="defaultProps">
          <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <i class="el-icon-circle-plus" @click="() => append(node,data)"></i>
        </span>
      </span>
        </el-tree>
      </div>
    </div>
</template>

<script>
export default {
  data() {

    return {
      selectTags: [
        { name: "标签一", type: "" },
        { name: "标签二", type: "success" },
        { name: "标签三", type: "info" },
        { name: "标签四", type: "warning" },
        { name: "标签五", type: "danger" }
      ],
      defaultProps: {
          children: 'ClusterChilds',
          label: 'EnglishStr'
      },
      // data4: []
      data4 : []
    };
  },
  methods:{
    append(node,data) {
      var label2=node.label;
            console.log("请求成功:" + label2);
        for(var i=0;i < this.selectTags.length;i++){
          if(label2 == this.selectTags[i].name){
            console.log("不能重复添加:" + this.selectTags[i].name);
            this.$message({
              showClose: true,
              message: '不能重复添加',
              type: 'error'
            });
            return;
          }
        }
        this.selectTags.push({ name: label2, type: "" });
        console.log("添加成功");
    },
    remove(tag){
      this.selectTags.splice(this.selectTags.indexOf(tag),1);
    },
    setSelect(tag){
      console.log("选择了："+tag);
      for(var i=0;i < this.selectTags.length;i++){
        this.selectTags[i].type="";
      }
      tag.type="danger";
    },
    getLableList(){
      this.$axios.post('http://10.5.11.127:8080/label/getallcluster',{
              // username: 'admin'
            },
            {
              //跨域请求配置参数
              headers:{
                'Content-Type':'application/x-www-form-urlencoded',
              }
            })
            .then(res=>{
              console.log("请求成功:" + res.data.ChineseStr);

              console.log("请求成功:" + res.data.ClusterChilds);
              this.data4 = JSON.parse(JSON.stringify(res.data.ClusterChilds));
              // if(res.data.code == 200){
              //   this.loginData = res.data.data;
              //   this.$router.push({
              //     // name:'home'
              //   });
              // }else{
              //   alert("账号或密码错误！");
              // }
            })
            .catch(err=>{
              console.log("error:" + err);
              alert("服务器出现故障，请稍后再试！");
            })
    }
  },
  created(){
    console.log('create==================');
    this.getLableList();
  }
};
</script>
<style scope>
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
  width: 100%;
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
  background-color: #aae9e9e9;
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
.all-tags-box {
  width: 45%;
  float: left;
  margin-left: 30px;

}
.el-transfer-panel__header {
  padding: 10px 10px;
  font-weight: bold;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}
.el-tree-node__label {
  font-size: 16px;
}
.el-button.is-circle{
  width: 2px;
  height: 2px;
}
</style>
