<template>
 <div>
   <!-- 面包屑导航 -->
   <el-breadcrumb separator=">" >
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>  
  </el-breadcrumb>
  <!-- 卡片区域  -->
  <el-card class="box-card">
    <!-- input输入框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <div>
             <el-input placeholder="请输入内容" v-model="paramsInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
             </el-input>
          </div>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4"><div><el-button type="primary" icon="search" @click="dialogVisible=true">添加用户</el-button></div></el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table
        :data="userList" border stripe>
        <!-- 表格索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          >
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
          >
        </el-table-column>
        <el-table-column
          label="状态"
          >
          <!-- 定义作用域插槽接受当前数据 -->
          <template v-slot="scope">
            <!-- 通过scope.row.mg_state获取当前数据的布尔值 -->
            <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope" >
             <el-tooltip :enterable="false" effect="dark" content="编辑" placement="top">
               <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip> 
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paramsInfo.pagenum"
      :page-sizes="[1, 2, 5, 10,20]"
      :page-size="paramsInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      size="tiny"
      >
      <el-form :model="Addform" :rules="formAddRules" ref="ruleFormRef" label-width="70px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="Addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="Addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="Addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model.number="Addform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
</el-dialog>

  </el-card>
 </div>
</template>

<script>
 export default {
  name: '',
  data () {
   return {
    //  请求用户列表所需要的参数对象
     paramsInfo:{
       query:'',
       pagenum:1,
       pagesize:2
     },
    //  用户列表
     userList:[],
    //  用户数量
     total:0,
    // 添加用户弹出框的显示和隐藏
     dialogVisible:false,
    //  添加新用户表单数据
    Addform:{
      username:'',
      password:'',
      email:'',
      mobile:''
    },
    // 表单验证规则
    formAddRules:{
      username:[
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur' }
      ],
      password:[
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
      ],
      email:[
         { required: true, message: '请输入邮箱地址', trigger: 'blur' },
         { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' },
         {  pattern: /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/,
            message: '请输入正确的邮箱格式',
            trigger: 'blur'
        }
      ],
      mobile:[
        { required: true, message: '手机号不能为空'},
        { type: 'number', message: '手机号必须为数字值'},
        {  pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            message: '手机号格式不对',
            trigger: 'blur'
        }
      ]
    }
   }
  },
  computed: {
  },
  components: {

  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList(){
      const {data:res}= await this.$axios.get('users',{params:this.paramsInfo});
      if(res.meta.status!=200) return this.$message.error('获取用户列表失败');
      this.userList=res.data.users;
      this.total=res.data.total
      // console.log(res)
    },
    // 监听页条数的改变时间
    handleSizeChange(newSize){
      this.paramsInfo.pagesize=newSize;
      // 根据newSize的变化，重新发起数据请求
      this.getUserList()
    },
    // 监听页面的改变时间
    handleCurrentChange(newPage){
      this.paramsInfo.pagenum=newPage
      // 根据newPage的变化，重新发起数据请求
      this.getUserList()
    },
    // 监听switch 的change 时间
    async stateChange(userInfo){
      // console.log(userInfo)
      // 调用对应的API接口，把最新修改的状态保存在数据库中
      const {data : res}=await this.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      // console.log(res)
      if(res.meta.status!=200){
        userInfo.mg_state=!userInfo.mg_state
        return this.$message.error("修改用户状态失败！")
      }
      this.$message.success("修改用户状态成功！")
    }
  },
 }
</script>

<style scoped>
  .el-breadcrumb{
    font-size: 14px;
  }
  .el-card{
    margin-top: 20px;
  }
  .el-table{
    margin-top: 15px;
    font-size: 12px;
  }
  .el-pagination{
    margin-top: 15px;
  }
</style>
