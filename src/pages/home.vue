<template>
 <div>
   <el-container>
      <el-header>
        <span class="header_title">LEDATA</span>
        <!-- start ============================== -->
        <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <!-- <router-link :to="{name:'userList'}"> -->
            <!-- <router-link :to="{name:'userList'}" ><el-menu-item index="1">用户管理</el-menu-item></router-link> -->
            <el-menu-item index="1"><router-link :to="{name:'userList'}" >用户管理</router-link></el-menu-item>
          <!-- </router-link> -->

          <el-submenu index="2">
            <template slot="title">图片管理</template>
            <router-link :to="{name:'mediaList'}"><el-menu-item index="2-1">图片列表</el-menu-item></router-link>

            <el-menu-item index="2-2">删除图片</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">标注管理</template>
            <el-menu-item index="3-1">选项1</el-menu-item>
            <el-menu-item index="3-2">选项2</el-menu-item>
            <el-menu-item index="3-3">选项3</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">标注任务</template>
            <router-link :to="{name:'taggingImage'}">
              <el-menu-item index="4-1">标注图片</el-menu-item>
            </router-link>
            <el-menu-item index="4-2">选项2</el-menu-item>
            <el-menu-item index="4-3">选项3</el-menu-item>
          </el-submenu>
        </el-menu>
    <!-- stop ============================-->
      </el-header>
  <el-container>

    <el-main><router-view></router-view></el-main>
  </el-container>
</el-container>
 </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  components: {}
};
</script>

<style>
.el-header,
.el-footer {
  background-color: rgb(84, 92, 100);
  color: #333;
  line-height: 60px;
  float: left;
}
.header_title {
  font-weight: bold;
  color: aliceblue;
}
.el-main {
  height: 100%;
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.header_title {
  float: left;
}

.el-menu {
  border-right: solid 1px #e6e6e6;
  list-style: none;
  position: relative;
  margin: 0;
  padding-left: 0;
  float: right;
}
a {
  text-decoration: none;
}
</style>
