<template>
  <div class="content">
    <el-row class="top_content">
      <el-button type="primary" @click="AddUserDialog">添加用户</el-button>
    </el-row>

    <el-row class="main_content">
      <el-table
        :data="userList"
        style="width: 100%;"
        align="center"
        :row-class-name="tableRowClassName">
        <el-table-column
          align="center"
          label="创建时间"
          width="300">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.createtime | convertDate}}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="账号"
          width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.username }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          width="100"
          label="密码">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.password }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="角色"
          width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{scope.row.role}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          width="500">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editUserDialog(scope.$index, scope.row)">修改用户密码</el-button>
            <el-button @click="deleteUserDialog(scope.row)" type="text" size="small" v-show="scope.row.showDelete">删除该用户</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 新增用户对话框 -->
    <el-dialog title="新增用户" :visible.sync="showAddUserDialog">
      <el-form :model="addUserForm">
        <el-form-item label="用户名:" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码:" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.passWord" auto-complete="off"></el-input>
        </el-form-item>
        <template>
          <el-radio v-model="addUserForm.role" label="0">标注员</el-radio>
          <el-radio v-model="addUserForm.role" label="1">管理员</el-radio>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addNewUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="showEditUserDialog">
      <el-form :model="editUserForm">
        <el-form-item label="用户名:" :label-width="formLabelWidth">
          {{editUserForm.username}}
        </el-form-item>
        <el-form-item label="新密码:" :label-width="formLabelWidth">
          <el-input v-model="editUserForm.newpass" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除用户对话框 -->
    <el-dialog title="删除用户" :visible.sync="showDeleteUserDialog">
      <span>要删除用户{{deleteUsername}}吗？</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDeleteUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import User from '../../modules/UserModule.js';
  var user = User;
  export default {
    data() {
      return {
        addNewUserUrl:'user/create',
        editUserUrl:'user/updateuserpass',
        deleteUserUrl:'user/deleteuser',
        showAddUserDialog:false,
        showEditUserDialog:false,
        showDeleteUserDialog:false,
        isShow:true,
        userList: [],
        formLabelWidth: '80px',
        addUserForm:{
          userName:'',
          passWord:'',
          role:'0' //添加用户默认选项
        },
        editUserForm:{
          userName:'',
          oldpass:'',
          newpass:'',
        },
        deleteUsername:'',
      }
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex%2 === 0) {
          return 'warning-row';
        } else {
          return 'success-row';
        }
      },
      deleteUserDialog(row) {
        console.log("删除:" + row.username);
        this.deleteUsername = row.username;
        this.showDeleteUserDialog = true;
      },
      editUserDialog(index,row){
        console.log("修改:" + index + "----->" + row.username);
        this.editUserForm.username = row.username;
        this.editUserForm.oldpass = row.password;
        this.editUserForm.newpass = '';
        this.showEditUserDialog = true;
      },
      //修改用户密码
      editUser(){
        var params = new URLSearchParams();
        params.append('username', this.editUserForm.username);
        params.append('oldpass', this.editUserForm.oldpass);
        params.append('newpass', this.editUserForm.newpass);
        this.$axios({
            method: 'post',
            url:this.editUserUrl,
            data:params
        })
        .then(res=>{
          console.log("请求成功:" + res.data.code);
          if(res.data.code == 200){
            this.$message({message: '密码修改成功!', type: 'success'});
            this.$parent.getUserList();
            this.showEditUserDialog = false;
          }else{
            this.$message.error('密码修改失败！');
            this.showEditUserDialog = false;
          }
        })
        .catch(err=>{
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试！");
        })
      },
      deleteUser(){
        var params = new URLSearchParams();
        params.append('requestUserName', this.$parent.curUserName);
        params.append('deleteUserName', this.deleteUsername);
        this.$axios({
            method: 'post',
            url:this.deleteUserUrl,
            data:params
        })
        .then(res=>{
          console.log("请求成功:" + res.data.code);
          if(res.data.code == 200){
            this.$message({message: '删除用户成功!', type: 'success'});
            this.$parent.getUserList();
            this.showDeleteUserDialog = false;
          }else{
            this.$message.error('删除用户失败！');
            this.showDeleteUserDialog = false;
          }
        })
        .catch(err=>{
          console.log("error:" + err);
          alert("服务器出现故障，请稍后再试！");
        })
      },
      AddUserDialog(){
        this.showAddUserDialog = true;
      },
      //添加新用户
      addNewUser(){
        if(this.strIsNull(this.addUserForm.userName) || this.strIsNull(this.addUserForm.passWord)){
          this.$message.error('新增用户名和密码不能为空！');
        }else if(this.trim(this.addUserForm.userName) == "noallo" || this.trim(this.addUserForm.userName) == "alloed"){//noallo:未分配，alloed：已分配
          this.$message.error('该用户名不能使用，请换其他用户名！');
        }else{
          this.addUserForm.userName = this.addUserForm.userName.replace(/\s+/g, "");
          this.addUserForm.passWord = this.addUserForm.passWord.replace(/\s+/g, "");
          console.log("添加新用户:" + this.addUserForm.userName + "--->" + this.addUserForm.passWord+ "--->" + this.addUserForm.role);
          var params = new URLSearchParams();
          params.append('username', this.addUserForm.userName);
          params.append('userpass', this.addUserForm.passWord);
          params.append('userrole', this.addUserForm.role);
          this.$axios({
              method: 'post',
              url:this.addNewUserUrl,
              data:params
          })
          .then(res=>{
            console.log("请求成功:" + res.data.code);
            if(res.data.code == 200){
              this.$message({message: '成功添加新用户!', type: 'success'});
              this.$parent.getUserList();
              this.showAddUserDialog = false;
              this.addUserForm.userName = '';
              this.addUserForm.passWord = '';
              this.addUserForm.role = '0';
            }else{
              this.$message.error('该用户已存在！');
            }
          })
          .catch(err=>{
            console.log("error:" + err);
            alert("服务器出现故障，请稍后再试！");
          })
        }
      },
      //判断字符串是否为空
      strIsNull(str){
        return (str.length === 0 || !str.trim());
      },
      //去掉字符串中的空格符
      trim(str){
        return str.replace(/\s*/g,"");
      }
    },
    created(){
      this.$store.state.navIndex = '1';
    },
    //数据装载DOM上后，各种数据已经就位,将数据渲染到DOM上，DOM已经生成
    mounted(){
      console.log("userlist-->mounted");
      this.userList = this.$parent.userList;
    },
  }
</script>

<style scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  /* .content{
    min-height:100vh;
    display:flex
  }

  .top_content{
    height: 15vh;
  }*/

  .el-table{
    min-height: 600px;
    border-spacing: 0;
    border-collapse:separate;/* 如果值为collapse，则element表格下方会出现滚动条*/
  }

  .el-row{
    padding: 15px;
    text-align: center;
  }
</style>
