<template>
  <el-table
    :data="userList"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="date"
      align="center"
      label="注册时间"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      align="center"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="telphone"
      align="center"
      label="联系方式">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      align="center"
      width="500">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        <el-button type="text" size="small">编辑</el-button>
        <el-button
          @click.native.prevent="deleteUser(scope.$index, userList)"
          type="text"
          size="small">
          移除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      }
    },
    data() {
      return {
        userList: [{
          date: '2016-05-02',
          name: '王小虎',
          telphone: '12345678888',
        }, {
          date: '2016-05-04',
          name: '王小虎',
          telphone: '12345678888'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          telphone: '12345678888',
        }, {
          date: '2016-05-03',
          name: '王小虎',
          telphone: '12345678888'
        }]
      }
    }
  }
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
