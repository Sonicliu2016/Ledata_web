 export default {
   data () {
     return {
       
     }
   },
   methods: {
     setUserName(user_name){
       // 在这里把用户名和token保存起来
       localStorage.setItem("current_user",user_name);
     },
     getUserName(){
       return localStorage.getItem("current_user");
     },
     removeUser(){
       localStorage.removeItem("current_user");
     },
   },
   components: {

   }
 }

