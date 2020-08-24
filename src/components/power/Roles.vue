<template>
 <div>
    <!-- 面包屑导航 -->
   <el-breadcrumb separator=">" >
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色管理</el-breadcrumb-item>  
  </el-breadcrumb>
  <el-card>
    <!-- 添加角色按钮 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="dialogVisibleRoles=true">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 点击添加角色按钮弹出框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisibleRoles"
      size="tiny"
      @close="roleAdd"
     >
     <!-- 添加角色表单数据 -->
      <el-form :model="AddformRoles" :rules="addRoleRules" ref="ruleFormRefRole" label-width="90px" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="AddformRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="AddformRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRoles = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <el-table :data="rolesList" border stripe highlight-current-row>
      <!-- 点击展开列 -->
      <el-table-column type="expand">
        <template v-slot="scope">
          <el-row :class="['rowbottom',index==0? 'rowtop': '','acenter']"  v-for="(item1,index) in scope.row.children" :key="item1.id">
            <!-- 一级菜单 -->
            <el-col :span="5">
              <el-tag closable  @close="removeRight(scope.row,item1.id)">
                {{item1.authName}}
              </el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二级和三级菜单 -->
            <el-col :span="19">
              <!-- 二级菜单 -->
              <el-row  v-for="(item2,index2) in item1.children" :key="item2.id"  :class="[index2==0 ? '': 'rowtop','acenter']">
                <el-col :span="6">
                  <el-tag type="success" closable  @close="removeRight(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 三级菜单 -->
                <el-col :span="18">
                  <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable  @close="removeRight(scope.row,item3.id)">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template v-slot="scope">
          <div>
             <el-button type="primary" icon="el-icon-edit" size="mini" @click="editClick(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeClick(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRightClick(scope.row)">分配权限</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑角色信息弹出层 -->
     <el-dialog
      title="编辑角色信息"
      :visible.sync="dialogVisibleEdit1"
      size="tiny"
      @close="closeDialog"
     >
      <el-form :model="editInfo" :rules="rulesEdit1" ref="ruleFormEditRef" label-width="90px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editInfo.roleName" ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit1 = false">取 消</el-button>
        <el-button type="primary"  @click="editorClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹出框 -->
    <el-dialog
      title="分配权限列表"
      :visible.sync="showRightDialogVisible"
      size="tiny"
      >
      <!-- 权限列表弹出框的树形结构 -->
      <el-tree :data="rightList" :props="treeProps" ref="treeRef" show-checkbox node-key="id" default-expand-all :default-checked-keys='treeKeys'></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleRight">确 定</el-button>
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
    //  将角色列表保存到数组中
    rolesList:[],
    // 编辑用户的信息
    editInfo:{},
    // 编辑角色弹出框
    dialogVisibleEdit1:false,
    // 添加角色表单数据
    AddformRoles:{
      roleName:'',
      roleDesc:''
    },
    // 添加角色默认弹出框
    dialogVisibleRoles:false,
    // 分配权限弹出框的显示和隐藏，默认隐藏
    showRightDialogVisible:false,
    // 保存roleId,即当点击哪个角色，就先获取到这个角色的Id
    roleId:'',
    // 权限列表树形结构的数据属性绑定对象
    treeProps:{
      label:'authName',
      children:'children'
    },
    // 根据id默认勾选选中的权限节点
    treeKeys:[],
    // 保存获取到的权限列表
    rightList:[],
    // 编辑角色信息规则
    rulesEdit1:{
      roleName:[
        { required: true, message: '请输入角色名称', trigger: 'blur' }
      ],
      roleDesc:[
        { required: true, message: '请输入角色描述', trigger: 'blur' }
      ]
    },
    // 添加角色表单规则
    addRoleRules:{
      roleName:[
         { required: true, message: '角色名称', trigger: 'blur' }
      ],
      roleDesc:[
         { required: true, message: '角色描述', trigger: 'blur' }
      ]
    }
   }
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList(){
      // 发送对应的API接口，获取角色列表数据
      const {data:res}=await this.$axios.get('roles');
      if(res.meta.status!=200) return this.$message.error('获取角色列表失败！')
      this.rolesList=res.data;
      // console.log(this.rolesList)
    },
    // 点击编辑角色按钮
    async editClick(id){
      // dialog弹出框显示
      this.dialogVisibleEdit1=true;
      // 发送对应的API请求,获取对应角色信息
      const {data:res}=await this.$axios.get('roles/'+id);
      // console.log(res)
      if(res.meta.status!=200) return this.$message.error("获取角色信息失败！")
      this.editInfo=res.data;
      // console.log(this.editInfo)
    },
    // 点击编辑确定按钮
     editorClick(){
      // 角色信息规则预验证
      this.$refs.ruleFormEditRef.validate( async val=>{
        // console.log(val)
        if(!val) return;
        const {data:res}=await this.$axios.put('roles/'+this.editInfo.roleId,{
          roleName:this.editInfo.roleName,
          roleDesc:this.editInfo.roleDesc
        })
        // console.log(res)
        if(res.meta.status!=200) return this.$message.error("修改角色信息失败!");
        // 否则关闭弹出框
        this.dialogVisibleEdit1=false;
        // 重新渲染角色列表
        this.getRolesList();
        this.$message.success("修改角色信息成功!")
      })
    },
    // 关闭编辑角色弹出框重置事件
    closeDialog(){
      this.$refs.ruleFormEditRef.resetFields();
    },
    // 删除角色
    async removeClick(id){
      // removeRole返回的时promise,用async和await进行简化
      const removeRole=await this.$confirm('是否删除该角色?','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>error)
        // console.log(removeRole)
        if(removeRole!='confirm') return this.$message.info('已取消删除');
        // 否则就发送对应的API请求,就删除的角色数据保存在数据库中
        const {data:res}=await this.$axios.delete('roles/'+id);
        // console.log(res)
        if(res.meta.status!=200) return this.$message.error('删除角色失败!');
        this.$message.success('删除角色成功');
        // 删除成功后重新加载角色列表
        this.getRolesList();
    },
    // 添加角色提交事件
    addRole(){
      this.$refs.ruleFormRefRole.validate(async val=>{
        if(!val) return;
        const {data:res}=await this.$axios.post('roles',this.AddformRoles)
        // console.log(res)
        if(res.meta.status!=201) return this.$message.error('添加角色失败!');
        // 否则关闭添加角色弹出框
        this.dialogVisibleRoles=false;
        // 重新加载渲染角色列表
        this.getRolesList();
        // 提示添加角色成功
        this.$message.success('添加角色成功!')
      })
    },
    // 关闭添加角色弹出框重置事件
    roleAdd(){
      this.$refs.ruleFormRefRole.resetFields();
    },
    // 根据id删除对应的权限  需要传角色id和权限id
    async removeRight(roleId,rightId){
       const result=await this.$confirm('是否确定移除此权限?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>error)
        if(result!='confirm') return this.$message.info('取消移除权限！')
        const {data:res}=await this.$axios.delete(`roles/${roleId.id}/rights/${rightId}`)
        // console.log(res)
        // res.data返回的是最新的权限数据，所以把它直接赋值给roleId.children即可
        roleId.children=res.data
        

    },
    // 点击分配权限弹出框
    async showRightClick(role){
      // 保存当前点击的角色Id
      this.roleId=role.id;
      this.showRightDialogVisible=true;
      // 发送对应的API请求分配权限列表
      const {data:res}=await this.$axios.get('rights/tree')
      // console.log(res)
      if(res.meta.status!=200) return this.$message.error('权限列表获取失败！')
      // 将获取到的权限列表保存在定义在data中的权限列表数组中
      this.rightList=res.data
      // 先清空数组,避免其他角色三级id勾选
      this.treeKeys=[]
      // 调用getTreeId函数，获取三级节点id， 添加到treekeys数组中
      this.getTreeId(role,this.treeKeys)
    },
    // 通过遍历，遍历获取角色下的所有三级权限的id，并保存到treeKeys数组中
    getTreeId(role,arr){
      // 如果没有children属性，说明当前就是第三级权限，直接就三级权限id添加到数组中
      if(!role.children) return arr.push(role.id);
      // 否则不上三级权限，就遍历有children属性的
      role.children.forEach(item =>{
        this.getTreeId(item,arr)
      })
    },
    // 点击确定提交分配权限
    async addRoleRight(){
      // 保存被选中id数组和半选id数组   ...展开运算符，
      const keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];
      // 将keys数组用 ， 进行分割成字符串
      const keysSrt=keys.join(',');
      // 发送对应的API请求，将分配权限保存到数据库中 返回值是promise，用async和await进行简化
      const {data:res}=await this.$axios.post(`roles/${this.roleId}/rights`,{rids:keysSrt});
      if(res.meta.status!=200) return this.$message.error("分配权限失败！")
      // 否则  授权成功  关闭弹出框
      this.showRightDialogVisible=false;
      // 重新加载角色列表
      this.getRolesList();
      this.$message.success('分配权限成功！')
    },
  },
  components: {

  }
 }
</script>

<style scoped>
  .el-breadcrumb{
    font-size: 12px;
  }
  .el-card{
    margin-top: 20px;
  }
  .el-table{
    margin-top: 20px;
  }
  .el-tag{
    margin: 8px;
  }
  .rowbottom{
    border-bottom: 1px solid #eee;
  }
  .rowtop{
    border-top:1px solid #eee ;
  }
  .acenter{
    display: flex;
    align-items: center;
  }
</style>
