<template>
  <div class="dataset">
    <div class="search_box">
      <Input search enter-button v-model="searchTv" placeholder="请输入标签名"
      v-on:input ="searchAssociate" @keyup.native.enter="searchResult()"/>
      <div class="associate-label_ul">
        <ol >
          <li class="el-dropdown-menu__item" v-for="(tag,index) in associateLabels" v-bind:key="index"
            @click="setSearchText(tag.cluster_name)" >
            {{ tag.cluster_name }}
          </li>
        </ol>
      </div>
    </div>

    <el-row  :gutter="20" style="float:left;width:100%">
      <el-col :span="2" v-for="(tag, index) in showTagList" :key="index" style="padding: 5px;">
        <el-card >
          <div class="tag" @click="seeDetail(tag)">
            {{tag.cluster_name}}<br/>
            {{tag.count}}<br/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data(){
    return{
      searchTv:'',
      associateLabels:[],
      allTagsList:[],
      showTagList:[]
    }
  },
  methods:{
    seeDetail(tag){
      this.$router.push({
        name:'classifyImages',
        params:{
          tagId:tag.cluster_name
        }
      })
    },
    searchAssociate(){
      this.associateLabels=[];
      for(var i=0; i<this.allTagsList.length;i++){
        var label = this.allTagsList[i].cluster_name;
        if(this.searchTv!="" && label.toLowerCase().indexOf(this.searchTv.toLowerCase())!=-1){
          this.associateLabels.push(this.allTagsList[i]);
          // this.showTagList.push(this.allTagsList[i]);
        }
      }
    },
    searchResult(){
      this.showTagList = this.associateLabels;
      this.associateLabels=[];
    },
    getAllTagList(){
      var params = new URLSearchParams();
      this.$axios({
        method:'post',
        url:'/label/getAllClustersCount',
        data:params
      })
      .then(res => {
        this.allTagsList = res.data.data.clusters;
        this.showTagList = this.allTagsList;
        console.log("this.allTagsList: "+this.allTagsList.length);
      })
      .catch(err => {

      });
    }
  },
  created(){
    this.getAllTagList();

    console.log("this.showTagList: "+this.showTagList.length);
  }
}
</script>
<style scoped>
.dataset{
  padding: 30px;
}
.search_box{
  width: 30%;
  background-color: aquamarine;
  float: right;
}
.tag{
  text-align: center;
}
.associate-label_ul{
  width: 250px;
  max-height: 500px;
  overflow-y:scroll;
  margin-top: 0px;
  padding-left: 16px;
  background-color:aliceblue;
  list-style-type:decimal;
  border: black 2px;
  position: absolute;
  z-index: 1;
}
</style>
