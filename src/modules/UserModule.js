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
     setUserRole(role){
      localStorage.setItem("is_admin",role);
     },
     getUserRole(){
      return localStorage.getItem("is_admin");
     },
     isAdmin(){
       if(this.getUserRole() == 0){
         return false;
       }else{
         return true;
       }
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

