<template>
<router-view> </router-view>
</template>

<script>
 export default {
   name:"App",
   data () {
     return {
       
     }
   },
   methods: {

   },
   components: {

   },
   watch:{
     // 请求过程中出现登录状态改变则跳转登录页面
   },
   //组件创建后,  数据已经完成初始化，但是DOM还未生成
   created(){
    //  this.$router.push('/goods/goods'); // 页面加载时跳转
   },
   //数据装载DOM上后，各种数据已经就位,将数据渲染到DOM上，DOM已经生成
   mounted(){
     
   },
   //声明组件
   components:{

   }
 }
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
