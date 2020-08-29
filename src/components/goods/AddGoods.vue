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
        title="添加商品信息"
        type="info" 
        center 
        show-icon 
        :closable='false'>
      </el-alert>
      <!-- 步骤进度条 -->
      <el-steps :space="200" :active="activeIndex-0" align-center center >
        <el-step title="基本信息" ></el-step>
        <el-step title="商品参数" ></el-step>
        <el-step title="商品属性" ></el-step>
        <el-step title="商品图片" ></el-step>
        <el-step title="商品内容" ></el-step>
        <el-step title="完成" ></el-step>
      </el-steps>
      <!-- 左侧纵向标签页 -->
      <!-- 表单tabs标签页 -->
      <el-form 
      :model="addForm" 
      :rules="addFormrules" 
      ref="addFormRef" 
      label-width="100px" 
      class="demo-ruleForm" label-position='top'>
      <el-tabs :tab-position="'left'" v-model='activeIndex' :before-leave="beforeTabs" @tab-click="tabClick">
        <el-tab-pane label="基本信息" name='0'>
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
           <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
          </el-form-item>
           <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
          </el-form-item>
           <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
          </el-form-item>
           <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="cateList" :props='cateProps'
                v-model="addForm.goods_cat"
                @change="handleChange" change-on-select>
              </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name='1'>

          <!-- 渲染参数表单  循环取出每个参数 -->
          <el-form-item :label="item.attr_name" v-for="item in this.manyData" :key="item.attr_id">
            <!-- 循环取出参数下的每个值 -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="item1" v-for="(item1,index) in item.attr_vals" :key="index" border ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name='2'>
          <el-form-item :label="item.attr_name" v-for="item in this.onlyData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name='3'>
          <!-- 上传图片 -->
          <!-- 上传图片组件没有调用axios 无效token值，要手动添加请求头-->
          <el-upload
            :action="upLoadUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture" :headers="addHeaders" :on-success="handleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name='4'>
          <!-- 富文本编辑器 -->
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <el-button type="primary" @click="addGood">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 预览图片弹出框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imgdialogVisible"
      size="tiny">
      <img :src="clickImgUrl" alt="" class="imgStyle">
    </el-dialog>
   </el-card>
 </div>
</template>

<script>
// 安装第三方插件
 import _ from 'lodash'
 export default {
  name: '',
  data () {
   return {
     activeIndex:'0',
    //  添加的商品表单数据对象
     addForm:{
       goods_name:'',
       goods_price:0,
       goods_weight:0,
       goods_number:0,
      //  商品分类数组
       goods_cat:[],
       // 上传图片数组
       pics:[],
      //  商品的详情介绍
       goods_introduce:'',
      //  提交添加商品时的参数和属性
       attrs:[]

     },
    //  添加商品表单验证规则
    addFormrules:{
      goods_name:[
        { required: true, message: '请输入商品名称', trigger: 'blur' }
      ],
      goods_price:[
        { required: true, message: '请输入商品价格', trigger: 'blur' }
      ],
      goods_weight:[
        { required: true, message: '请输入商品重量', trigger: 'blur' }
      ],
      goods_number:[
        { required: true, message: '请输入商品数量', trigger: 'blur' }
      ],
      // 商品分类验证规则
      goods_cat:[
        { required: true, message: '请选择商品分类', trigger: 'blur' }
      ]
    },
    // 商品分类数据
    cateList:[],
    // 级联选择器数据配置对象
    cateProps:{
      label:'cat_name',
      value:'cat_id',
      children:'children'
    },
    // 商品参数数据
    manyData:[],
    // 商品属性数据
    onlyData:[],
    // 图片上传到后台的url地址
    upLoadUrl:'http://127.0.0.1:8888/api/private/v1/upload',
     // 上传图片headers请求头
    addHeaders:{
      Authorization:window.sessionStorage.getItem('token')
    },
    // 保存预览图片地址
    clickImgUrl:'',
    // 预览图片弹出框的显示和隐藏
    imgdialogVisible:false
   }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList(){
      const {data:res}=await this.$axios.get('categories');
      if(res.meta.status!=200) return this.$message.error('获取商品分类数据失败！')
      // 否则  获取成功
      this.cateList=res.data;
      // console.log(this.cateList)
    },
    // 级联选择器发生改变事件
    handleChange(){
      console.log(this.addForm.goods_cat)
      if(this.addForm.goods_cat.length!==3){
        this.addForm.goods_cat=[]
        return this.$message.error('只允许选择第三级分类！');
      }
      // console.log(this.addForm.goods_cat)
    },
    // 点击tabs标签页切换标签时判断是否选择了分类
    beforeTabs(activeName,oldActiveName){
      // activeName表示即将要进入的标签页，oldActiveName表示即将要离开的当页
      // ==0表示即将离开index为0的标签页 并且已选择第三级分类
      if(oldActiveName==='0' && this.addForm.goods_cat.length!==3){
        this.$message.error('请选择商品分类')
        // 禁止往后操作
        return false
      }
    },
    // 点击商品参数 获取商品参数数据列表
    async tabClick(){
      // 判断是否选中的是商品参数
      if(this.activeIndex==='1'){
        const {data:res}=await this.$axios.get(`categories/${this.cateID}/attributes`,{
          params:{sel:'many'}
        })
        if(res.meta.status!=200) return this.$message.error('获取参数列表失败！')
        // 取出attr_vals字符串，用空格分割成数组
        res.data.forEach(item=>{
          // 循环返回的每个参数，取出每个参数的attr_vals
          item.attr_vals=item.attr_vals? item.attr_vals.split(' ') :[]
        })
        this.manyData=res.data;
        console.log(this.manyData)
      }else if(this.activeIndex==='2'){
        const {data:res}=await this.$axios.get(`categories/${this.cateID}/attributes`,{
          params:{
            sel:'only'
          }
        })
        if(res.meta.status!=200){
          return this.$message.error('获取商品属性失败')
        }
        this.onlyData=res.data
        console.log(this.onlyData)
      }
    },
    //点击图片预览事件
    handlePreview(file){
      this.clickImgUrl=file.response.data.url;
      this.imgdialogVisible=true
    },
    // 点击图片删除事件
    handleRemove(file){
      // file 删除成功服务器返回的信息
      // 获取删除的这张图片的临时地址
      const filePath=file.response.data.tmp_path;
      // 查找对应项的索引值  findIndex()
      const index=this.addForm.pics.findIndex(index=>{
        // 如果索引值的pic等于filePath findIndex方法就会把索引返回
        index.pic==filePath
      })
      this.addForm.pics.splice(index,1)
      console.log(this.addForm)
    },
    // 图片上传成功事件
    handleSuccess(res){
      // res 上传成功服务器返回的信息
      // console.log(res.data.tmp_path)
      const picsInfo={ pic : res.data.tmp_path};
      this.addForm.pics.push(picsInfo)
      console.log(this.addForm)
    },
    // 提交添加商品
    addGood(){
      this.$refs.addFormRef.validate(async val=>{
        if(!val){
          return this.$message.error('请添加必要的商品信息')
        }
        // 对添加的商品分类数组做处理 调用第三方插件_.cloneDeep() 把this.addForm深拷贝一份出来 处理成字符串
        const newForm=_.cloneDeep(this.addForm)
        // 提交添加商品goods_cat是个字符串，用join函数转成字符串
        newForm.goods_cat=newForm.goods_cat.join(',')
        // 处理attrs中的manydate数据数组
        this.manyData.forEach(item=>{
          // 将每个item里的attr_id和attr_vals赋值狗日请求数据
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
          }
          // 将处理好的数据添加到数组中
          this.addForm.attrs.push(newInfo)
        })
        // 处理onlydate数组
        this.onlyData.forEach(item=>{
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        newForm.attrs=this.addForm.attrs
       
        // 发送请求 添加商品
        const {data:res}=await this.$axios.post('goods',newForm)
        console.log(res)
        if(res.meta.status===400) return this.$message.warning("商品名称已存在")
        if(res.meta.status!=201) return this.$message.error('添加商品失败！')
        this.$message.success('添加商品成功！')
        // 跳转回商品列表页面
        this.$router.push('/goods')
      })
    }
  },
  components: {

  },
  computed: {
    // 分类id
    cateID(){
      if(this.addForm.goods_cat.length===3){
        // 为3，表示有第三级分类
        return this.addForm.goods_cat[2]
      }else{
        return null
      }
    }
  },
 }
</script>

<style scoped>
  .el-breadcrumb{
    font-size: 12px;
    margin-bottom: 20px;
  }
  .el-steps{
    margin-top: 20px;
  }
  .el-tabs{
    margin-top: 20px;
  }
  .el-checkbox{
    margin:0 10px 0 0 !important
  }
  .imgStyle{
    width:100%
  }
  
  .el-button{
    margin-top: 20px;
  }
</style>
