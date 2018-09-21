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
     //将数组转成json存储
     storeUsers(users){ 
       sessionStorage.setItem("users",window.JSON.stringify(users));
     },
     getAllUsers(){
       return window.JSON.parse(sessionStorage.getItem("users"));
     },
     removeAllUsers(){
       sessionStorage.removeItem("users");
     }
   },
   components: {

   }
 }

