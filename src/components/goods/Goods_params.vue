<template>
 <div>
    <!-- 面包屑导航 -->
   <el-breadcrumb separator=">" >
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>  
   </el-breadcrumb>
   <!-- 卡片 -->
   <el-card>
    <el-alert
    title="注意:只允许为第三级分类设置参数信息！"
    type="warning" 
    show-icon :closable="false">
    </el-alert>
    <!-- 级联选择器 -->
    <el-row :gutter="10">
      <el-col>
        <span>请选择商品分类：</span>
         <el-cascader
          expand-trigger="hover"
          :options="cateList"
          :props="cataParams"
          v-model="vmodelCateArray"
          @change="cascaderChange" change-on-select  >
        </el-cascader>
      </el-col>
    </el-row>
    <!-- 底部标签页 -->
    <el-tabs v-model="activeName" @tab-click="tabsClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="mini" :disabled="isDisabled" @click="paramsClick">添加参数</el-button>
        <el-table
          :data="manyDate"
          style="width: 100%" border stripe >
          <!-- 展开行   > -->
          <el-table-column type="expand">
            <!-- 用template模板作用域插槽获取当下值所有内容 -->
            <template v-slot="scope">
              <el-tag type="primary" v-for="(item,index) in scope.row.attr_vals" :key="index" closable close-transition @close="removeParams(index,scope.row)">{{item}}</el-tag>
              <!-- 添加attr_vals样式 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="mini"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>

          <el-table-column type="index" label="#"></el-table-column>
          
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click='deleteParams(scope.row.attr_id)'>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" size="mini" :disabled="isDisabled" @click="elementClick">添加属性</el-button>

         <el-table
          :data="onlyDate"
          style="width: 100%" border stripe >
          <!-- 展开行   > -->
          <el-table-column type="expand">
            <!-- 用template模板作用域插槽获取当下值所有内容 -->
            <template v-slot="scope">
              <el-tag type="primary" v-for="(item,index) in scope.row.attr_vals" :key="index" closable close-transition @close="removeParams(index,scope.row)">{{item}}</el-tag>
              <!-- 添加attr_vals样式 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="mini"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>

          <el-table-column type="index" label="#"></el-table-column>
          
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          
          <el-table-column label="操作">
            <!-- 编辑和删除要获取属性id和数据，要通过模板作用域插槽获取 -->
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
            </template>
          
          </el-table-column>
        </el-table>
      </el-tab-pane>
      
  </el-tabs>
  <!-- 添加动态参数弹出框 -->
  <el-dialog
    title="添加动态参数"
    :visible.sync="paramsdialogVisible"
    size="tiny"
    @close="closeParams"
    >
    <!-- 弹出框表单 -->
    <el-form :model="ruleFormParams" :rules="rulesParams" ref="ruleFormParamsRef" label-width="100px" class="demo-ruleForm">
      <el-form-item label="动态参数" prop="attr_name">
        <el-input v-model="ruleFormParams.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="paramsdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addParams">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 添加静态属性弹出框 -->
  <el-dialog
    title="添加静态属性"
    :visible.sync="elementdialogVisible"
    size="tiny"
    @close="closeElement"
    >
    <!-- 静态属性弹出框表单 -->
    <el-form :model="ruleFormElement" :rules="rulesElement" ref="ruleFormElementRef" label-width="100px" class="demo-ruleForm">
      <el-form-item label="静态属性" prop="attr_name">
        <el-input v-model="ruleFormElement.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="elementdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addElement">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 编辑参数弹出框 -->
  <el-dialog
    :title="'修改'+titleText"
    :visible.sync="addDialogVisible"
    size="tiny"
    @close="closeAdd"
    >
    <!-- 编辑弹出框表单 -->
    <el-form :model="addFormElement" :rules="rulesadd" ref="ruleFormAddRef" label-width="100px" >
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="addFormElement.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editParamsForm">确 定</el-button>
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
    //  保存获取到的商品分类数据数组
    cateList:[],
    // 级联选择器的配置数据对象
    cataParams:{
      value:'cat_id',
      label:'cat_name',
      children:'children'
    },
    // 级联双向绑定数组
    vmodelCateArray:[],
    // 默认显示标签页
    activeName:'many',
    // 保存动态参数信息数组
    manyDate:[],
    // 保存静态属性数据数组
    onlyDate:[],
    // 动态参数弹出框显示和隐藏
    paramsdialogVisible:false,
    // 静态属性弹出框显示和隐藏
    elementdialogVisible:false,
   
    // 添加参数的表单数据对象
    ruleFormParams:{
      attr_name:''
    },
    // 添加静态属性的表单数据对象
    ruleFormElement:{
      attr_name:''
    },
    // 添加动态参数验证规则
    rulesParams:{
      attr_name:[
         { required: true, message: '请输入添加的动态参数', trigger: 'blur' }
      ]
    },
    // 添加静态属性验证规则
    rulesElement:{
      attr_name:[
         { required: true, message: '请输入添加的静态属性', trigger: 'blur' }
      ]
    },
    // 编辑按钮弹出框的显示和隐藏
    addDialogVisible:false,
    //编辑参数表单数据对象
    addFormElement:{},
    // 编辑参数表单验证规则
    rulesadd:{
      attr_name:[
         { required: true, message: '请输入修改的参数名称', trigger: 'blur' }
      ]
    }
   }
  },
  created() {
    // 组件页面加载获取商品分类数据
    this.getCateList();
  },
  methods: {
    async getCateList(){
      const {data:res}=await this.$axios.get('categories');
      if(res.meta.status!=200) return this.$message.error('获取商品分类数据失败！')
      this.cateList=res.data
    },
    // 监听级联选择器改变事件
    cascaderChange(){
      // 当级联选择器选中值发生改变时，调用函数获取选中id参数
      this.getParamsDate()
    },
    // 点击切换tabs标签页
    tabsClick(){
      // 当点击切换标签页时，调用函数获取动态参数和静态属性
      this.getParamsDate()
    },
    // 获取动态参数和静态属性
    async getParamsDate(){
      // 如果vmodelCateArray数组不等于3，表示选择的不是第三级分类
      if(this.vmodelCateArray.length!==3){
        // 清空vmodelCateArray数组
        this.vmodelCateArray=[];
        // 清空参数和属性信息
        this.manyDate=[]
        this.onlyDate=[]
        return this.$message.error('只允许为第三级分类设置相关参数')
      }
      // 否则，是第三级分类 发送对应API请求，获取参数信息
      const {data:res}=await this.$axios.get(`categories/${this.cateId}/attributes`,{
        params:{sel:this.activeName}
      })
      if(res.meta.status!=200) return this.$message.error('获取分类参数信息失败！')
      
      // 为res.data循环，取出每个参数，获取参数中attr_vals值
      res.data.forEach(item=>{
        item.attr_vals=item.attr_vals ? item.attr_vals.split(' ') : [];
        // 点击切换文本框，多个参数间会共用一个文本框，所有要为每一个参数都定义一个只属于自己的布尔值和value值
        item.inputVisible=false;
        item.inputValue=''
      })
      console.log(res.data)
      // 判断获取数据是动态参数还是静态属性
      if(this.activeName==='many'){
        this.manyDate=res.data;
      }else{
        this.onlyDate=res.data
      }
    },
    // 点击添加参数按钮
    paramsClick(){
      this.paramsdialogVisible=true
    },
    // 点击添加属性按钮
    elementClick(){
      this.elementdialogVisible=true
    },
    // 添加动态参数弹出框关闭重置事件
    closeParams(){
      this.$refs.ruleFormParamsRef.resetFields();
    },
    // 添加静态属性弹出框关闭重置事件
    closeElement(){
      this.$refs.ruleFormElementRef.resetFields();
    },
    // 提交添加动态参数按钮
     addParams(){
      // 先进行预校验
      this.$refs.ruleFormParamsRef.validate(async val=>{
        if(!val) return;
        // 通过 发送对应API 将添加的参数保存到数据库中
        const {data:res}=await this.$axios.post(`categories/${this.cateId}/attributes`,{
            attr_name:this.ruleFormParams.attr_name,
            attr_sel:this.activeName
        })
        if(res.meta.status!=201) return this.$message.error('添加参数失败！')
        // 否则添加参数成功
        this.$message.success('添加参数成功！')
        this.paramsdialogVisible=false
        this.getParamsDate();
      })
    },
    // 提交添加静态属性
    addElement(){
      // 预验证
      this.$refs.ruleFormElementRef.validate(async val=>{
        if(!val) return 
        // 否则 发起日俺家属性请求
        const {data:res}=await this.$axios.post(`categories/${this.cateId}/attributes`,{
          attr_name:this.ruleFormElement.attr_name,
          attr_sel:this.activeName
        })
        if(res.meta.status!=201) return this.$message.error('添加属性失败！')
        // 否则 添加成功
        this.$message.success('添加属性成功！')
        this.getParamsDate()
        this.elementdialogVisible=false
      })
    },
    // 编辑参数按钮
    async editParams(attr_id){
      this.addDialogVisible=true
      // 根据id  发送请求  获取编辑中表单数据对象
      const {data:res}=await this.$axios.get(`categories/${this.cateId}/attributes/${attr_id}`,{
        params:{
          attr_sel:this.activeName
        }
      })
      if(res.meta.status!=200) return this.$message.error('获取参数信息失败！')
      // 否则，将获取到的参数信息赋值给参数表单数据对象
      this.addFormElement=res.data;

    },
    // 编辑弹出框的关闭重置事件
    closeAdd(){
      this.$refs.ruleFormAddRef.resetFields();
    },

    // 编辑参数确定提交按钮
    editParamsForm(){
      this.$refs.ruleFormAddRef.validate(async val=>{
        if(!val) return 
        // 发送API请求，将编辑的新参数名称保存到服务器中
        const {data:res}=await this.$axios.put(`categories/${this.cateId}/attributes/${this.addFormElement.attr_id}`,{
          attr_name:this.addFormElement.attr_name,
          attr_sel:this.activeName
        })
        console.log(res)
        if(res.meta.status!=200) return this.$message.error('修改参数失败！')
        // f否则  修改成功
        this.$message.success('修改参数成功！')
        this.getParamsDate();
        this.addDialogVisible=false
      })
    },
    // 删除按钮 根据id删除对应的参数
    async deleteParams(attr_id){
      const confirmResult=await this.$confirm('是否删改该参数?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error=>error)
        // 如果不等于confirm，说明点击了取消
        if(confirmResult!=='confirm') return this.$message.info('取消删除')
        // 否则 点击确定删除，发送API请求
        const {data:res}=await this.$axios.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if(res.meta.status!=200) return this.$message.error('删除参数失败！')
        // 否则 删除成功
        this.$message.success('删除参数成功！')
        this.getParamsDate();
    },
    // 点击按钮切换input框
    showInput(row){
      row.inputVisible=true;
      // $nextTick  当页面的元素被重新渲染后，才会执行回调函数中的代码，当点击button按钮后，input元素在页面还未被渲染，只有通过nextTick函数
      // 自动获取焦点
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    
    // input输入框回车键事件
    handleInputConfirm(row){
      // 判断输入值是否为空
      if(row.inputValue.trim().length===0){
        // 输入为空
        row.inputValue='';
        row.inputVisible=false
        // 不做任何处理  返回
        return
      }
      // 否则 将value值push到attr_vals中
      row.attr_vals.push(row.inputValue)
      row.inputValue=''
      row.inputVisible=false
      // 调用函数 将数据保存到数据库中
      this.addParamsMysql(row)
    },
    // 将修改的参数项保存到数据库中
    async addParamsMysql(row){
      const {data:res}=await this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })
      if(res.meta.status!=200) return this.$message.error('修改参数失败！')
      this.$message.success('修改参数成功！')
    },
    // 删除参数项 保存到数据库中
    removeParams(index,row){
      row.attr_vals.splice(index,1);
      this.addParamsMysql(row)
    }
  },
  computed: {
    // 不是三级分类，禁用按钮
    isDisabled(){
      if(this.vmodelCateArray.length!==3){
        return true
      }else{
        return false
      }
    },
    // 传入三级分类id 获取参数信息
    cateId(){
      if(this.vmodelCateArray.length===3){
        return this.vmodelCateArray[2]
      }else{
        return null
      }
    },
    // dialog 标题
    titleText(){
      if(this.activeName==='many'){
        return '动态参数'
      }else{
        return '静态属性'
      }
    }
  },
  components: {

  }
 }
</script>

<style scoped>
  .el-breadcrumb{
    font-size: 12px;
  }
  .el-row{
    margin-top: 20px;
    font-size: 14px;
    
  }
  .el-cascader{
    width: 27%;
  }
  .el-tabs{
    margin-top: 20px;
  }
  .el-tab-pane{
    font-size: 14px;
  }
  .el-table{
    margin-top: 20px;
  }
  .el-table-column{
    font-size: 14px;
  }
  .el-tag{
    margin:10px 5px 10px 0;
    
  }
  .input-new-tag{
    width: 120px;
  }
</style>
