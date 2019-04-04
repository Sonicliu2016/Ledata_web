<template>
<div class="dataset">
  <div class="search_box">
    <el-input placeholder="请输入标签名" v-model="searchTv" v-on:input="searchAssociate" @keyup.native.enter="searchResult()" @keydown.native.down="down" @keydown.native.up.prevent="up" clearable>
      <el-button slot="append" type="primary" icon="el-icon-search" @click="searchResult()"></el-button>
    </el-input>
    <div class="associate-label_ul" v-show="isShow">
      <ol>
        <li class="el-dropdown-menu__item" v-for="(tag,index) in associateLabels" v-bind:key="index" @click="setSearchText(tag.cluster_name)" :class="{bgc: index == nowInAssociates}">
          {{ tag.cluster_name }}
        </li>
      </ol>
    </div>
  </div>

  <el-row :gutter="20" style="float:left;width:100%">
    <el-col :span="2" v-for="(tag, index) in showTagList" :key="index" style="padding: 5px;">
      <el-card style="height:80px;display: flex;justify-content:center;align-items:Center;cursor: pointer;">
        <div class="tag" @click="seeDetail(tag)">
          {{tag.cluster_name}}<br />
          {{tag.count}}<br />
        </div>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  data() {
    return {
      searchTv: '',
      nowInAssociates: -1,
      associateLabels: [],
      allTagsList: [],
      showTagList: [],
      isShow: false,
    }
  },
  methods: {
    getAllTagList() {
      var params = new URLSearchParams();
      this.$axios({
          method: 'post',
          url: '/video/getVideoClustersCount',
          data: params
        })
        .then(res => {
          this.allTagsList = res.data.data.clusters;
          this.showTagList = this.allTagsList;
          console.log("this.allTagsList: " + this.allTagsList.length);
        })
        .catch(err => {

        });
    },
    seeDetail(tag) {
      this.$router.push({
        name: 'classifyVideos',
        params: {
          tagId: tag.cluster_name,
          tagCount: tag.count
        }
      })
    },
    searchAssociate() {
      this.associateLabels = [];
      if (this.searchTv == "") {
        this.isShow = false;
      } else {
        this.isShow = true;
        for (var i = 0; i < this.allTagsList.length; i++) {
          var label = this.allTagsList[i].cluster_name;
          if (this.searchTv != "" && label.toLowerCase().indexOf(this.searchTv.toLowerCase()) != -1) {
            this.associateLabels.push(this.allTagsList[i]);
            // this.showTagList.push(this.allTagsList[i]);
          }
        }
      }

    },
    setSearchText(cluster_name) {
      this.searchTv = cluster_name;
      this.searchAssociate();
      this.isShow = false;
    },
    searchResult() {
      if (this.associateLabels.length != 0) {
        this.showTagList = this.associateLabels;
        // this.associateLabels = [];
      } else {
        this.getAllTagList();
      }

    },
    down: function() {
      console.log("按下了 keycode ： down");
      this.nowInAssociates++;
      if (this.nowInAssociates >= this.associateLabels.length) {
        this.nowInAssociates = -1;
      }
      this.searchTv = this.associateLabels[this.nowInAssociates].cluster_name;
    },
    // ↑ 选择值，控制 li 的 .bgc
    up: function() {
      console.log("按下了 keycode ： up");
      this.nowInAssociates--;
      if (this.nowInAssociates < -1) {
        this.nowInAssociates = this.associateLabels.length - 1;
      }
      this.searchTv = this.associateLabels[this.nowInAssociates].cluster_name;
    }
  },
  created() {
    this.getAllTagList();

    console.log("this.showTagList: " + this.showTagList.length);
  }
}
</script>

<style scoped>
.dataset {
  padding: 30px;
}

.search_box {
  width: 30%;
  float: right;
}

.tag {
  text-align: center;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}

.associate-label_ul {
  width: 250px;
  max-height: 500px;
  overflow-y: scroll;
  margin-top: 0px;
  padding-left: 16px;
  background-color: aliceblue;
  list-style-type: decimal;
  border: black 2px;
  position: absolute;
  z-index: 1;
}

.bgc {
  background-color: skyblue;
}
</style>
