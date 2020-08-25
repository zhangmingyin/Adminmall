<template>
 <div>
    <!-- 面包屑导航 -->
   <el-breadcrumb separator=">" >
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>  
   </el-breadcrumb>
   <!-- 卡片区域 -->
   <el-card>
     <!-- 添加分类按钮 -->
     <el-row :gutter="10">
       <el-col :span="6">
         <el-button type="primary" @click="addCategory">添加分类</el-button>
       </el-col>
     </el-row>
     <!-- 商品分类表单  样式element未提供 安装第三方插件 vue-table-with-tree-grid-->
     <!-- :selection-type="false" 隐藏复选框 -->
     <tree-table :data="categoryList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border stripe>
       <!-- 是否有效 -->
       <template #isValidity="scope">
         
           <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:#409eff"></i>
           <i class="el-icon-error" v-else style="color:red"></i>
         
       </template>
        <!-- 序列号 -->
      <template #order="scope">
        <div>
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if='scope.row.cat_level===1'>二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </div>
      </template>
      <!-- 操作 -->
      <template #opt="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope.row.cat_id)">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCage(scope.row.cat_id)">删除</el-button>
      </template>
     </tree-table>
     <!-- 底部分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
   </el-card>
   <!-- 添加分类弹出框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="showAddCategory"
      size="tiny"
      @close="closeCateDate"
      >
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
         <el-form-item label="父级分类：">
           <!-- 父级分类级联选择器  options指父级分类的数据对象  prop指定级联选择器的配置信息对象  change-on-select 指可选中任何级别的值-->
           <el-cascader
            expand-trigger="hover"
            :options="CateDateList"
            :props="cateProps"
            v-model="selectedOptionsProps"
            @change="handleChangeCate" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddCategory = false">取 消</el-button>
        <el-button type="primary" @click="addcateGory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类弹出框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCagedialogVisible"
      size="tiny"
     >
      <el-form :model="editCateruleForm" :rules="editCaterules" ref="editCateruleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateruleForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCagedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCatesubmit">确 定</el-button>
      </span>
    </el-dialog>
 </div>
</template>

<script>
 export default {
  name: '',
  data () {
   return {
    //  查询参数
    queryInfo:{
      type:3,
      pagenum:1,
      pagesize:5
    },
    //  商品分类数据
    categoryList:[],
    // 商品分类数据总数
    total:0,
    // 表格每列数据
    columns:[
      {
        label:'分类名称',
        prop:'cat_name'
      }, 
      {
        label:"是否有效",
        // type 指定为template模板
        type:'template',
        // 插槽
        template:'isValidity'
      },
      // 排序
      {
        label:'序列号',
        type:'template',
        template:'order'
      },
      // 排序
      {
        label:'操作',
        type:'template',
        template:'opt'
      }
    ],
    // 添加分类弹出框的显示和隐藏
    showAddCategory:false,
    // 添加分类表单数据对象
    addCateForm:{
      // 将要添加的分类名称
      cat_name:'',
      // 父级分类id 0表示默认添加一级分类
      cat_pid:0,
      // 默认添加的是一级分类
      cat_level:0
    },
    // 分类表单数据验证规则
    addCateFormRules:{
      cat_name:[
         { required: true, message: '请输入分类名称', trigger: 'blur' }
      ]
    },
    // 保存父级分类列表数据
    CateDateList:[],
    // 级联选择器所显示的配置对象
    cateProps:{
      value:'cat_id',
      label:'cat_name',
      children:'children'
    },
    // 保存级联选择器选中该值id数组
    selectedOptionsProps:[],

    //  编辑分类弹出框的显示和隐藏
    editCagedialogVisible:false,
    // 编辑分类表单数据对象
    editCateruleForm:{
      
    },
    // 编辑分类表单验证规则
    editCaterules:{
      cat_name:[
        { required: true, message: '请输入分类名称', trigger: 'blur' }
      ]
    }
   }
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    async getCategoryList(){
      const {data:res}=await this.$axios.get('categories',{params:this.queryInfo});
      if(res.meta.status!=200) return this.$message.error('获取分类列表失败！');
      // console.log(res)
      // 否则 获取成功，就获取到的分类列表数据保存到categoryList数组中
      this.categoryList=res.data.result;
      // 保存分类列表总数
      this.total=res.data.total
    },
    // 监听pagesize的改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize;
      // size改变，重新加载数据列表
      this.getCategoryList()
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage,
      this.getCategoryList();
    },
    // 点击添加分类事件
    addCategory(){
      // 弹出框显示立即加载父级分类列表数据
      this.getCateDate()
      this.showAddCategory=true
    },
    // 父级分类数据列表请求
    async getCateDate(){
      const {data:res}=await this.$axios.get('categories',{params:{type:2}})
      // console.log(res)
      if(res.meta.status!=200) return this.$message.error('获取分类列表失败！');
      this.CateDateList=res.data

    },
    // 父级分类级联选择器发生改变事件
    handleChangeCate(){
     
      // 当级联选择器发生改变时，添加分类表单数据对象的父id和分类等级应该随之改变
      // 如果保存级联选择器选中该值id数组长度大于0，表示有选中父级分类
      if(this.selectedOptionsProps.length>0){
        // 重新给父级id赋值
        this.addCateForm.cat_pid=this.selectedOptionsProps[this.selectedOptionsProps.length-1];
        // 重新给分类等级赋值
        this.addCateForm.cat_level=this.selectedOptionsProps.length;
        // 将结果返回
        return
      }else{
        // 否则
         this.addCateForm.cat_pid=0;
          this.addCateForm.cat_level=0
      }
    },
    // 添加分类确定提交事件
    addcateGory(){
      // 表单预验证
      this.$refs.addCateFormRef.validate(async val=>{
        if(!val) return
        // 发送对应API请求，将添加的分类数据保存到数据库中
        const {data:res}=await this.$axios.post('categories',this.addCateForm)
        if(res.meta.status!=201) return this.$message.error("添加分类失败！")
        this.$message.success("添加分类成功！")
        this.getCategoryList();
        this.showAddCategory=false
      })
    },
    // 关闭添加分类弹出框重置事件
    closeCateDate(){
      this.$refs.addCateFormRef.resetFields();
      // 重置  清空级联选择器选中id数组
      this.selectedOptionsProps=[];
      // 重置 将分类表单数据对象中的cat_pid和cat_level清空
      this.addCateForm.cat_level=0
      this.addCateForm.cat_pid=0

    },
    // 编辑分类点击事件
    async editCate(id){
      this.editCagedialogVisible=true
      // 发送请求，拿到对应的分类信息，保存到editCateruleForm分类信息数据对象中
      const {data:res}=await this.$axios.get('categories/'+id)
      if(res.meta.status!=200) return this.$message.error('分类信息获取失败！')
      this.editCateruleForm=res.data
    },
    // 编辑分类确定提交按钮
     editCatesubmit(){
      // 预验证表单规则是否通过
      this.$refs.editCateruleFormRef.validate(async val=>{
        if(!val) return
          const {data:res}=await this.$axios.put('categories/'+this.editCateruleForm.cat_id,{
          cat_name :this.editCateruleForm.cat_name
        })
        if(res.meta.status!=200) return this.$message.error('修改分类失败！')
        this.$message.success("修改分类成功！")
        this.getCategoryList();
        this.editCagedialogVisible=false
      })
      
    },
    // 删除分类
    async removeCage(id){
        const result=await this.$confirm('是否删除该分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        // console.log(result)
        if(result!='confirm') return this.$message.info('取消删除')
        const {data:res}=await this.$axios.delete('categories/'+id);
        if(res.meta.status!=200) return this.$message.error('删除分类失败！')
        this.$message.success('分类删除成功！')
        this.getCategoryList()
    }

  },
  components: {

  }
 }
</script>

<style scoped>
  .el-card{
    margin-top: 20px;
  }
  .el-row{
    margin-bottom: 20px;
  }
  .el-breadcrumb{
    font-size: 12px;
  }
  .el-pagination{
    margin-top: 20px;
  }
  .el-cascader{
    width: 100%;
  }
</style>
