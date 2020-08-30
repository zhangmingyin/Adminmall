<template>
 <div>
    <!-- 面包屑导航 -->
   <el-breadcrumb separator=">" >
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>  
   </el-breadcrumb>
   <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getgoodsList">
          <el-button slot="append" icon="el-icon-search" @click="getgoodsList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addGoods">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 商品列表表格 -->
    <el-table :data="goodsList" style="width: 100%" border stripe highlight-current-row>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
     
      <el-table-column label="创建时间" prop="add_time" width="140px">
        <template v-slot="scope">
           <!-- 通过过滤器 将时间戳转时间格式化 -->
          {{scope.row.add_time | showDate}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template v-slot="scope">
          <!-- 编辑 -->
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoods(scope.row.goods_id)"></el-button>
          </el-tooltip>
          <!-- 删除 -->
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row.goods_id)"></el-button>
          </el-tooltip>
        </template>
        
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="queryInfo.pagenum"
    :page-sizes="[5, 10, 20, 30]"
    :page-size="queryInfo.pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total" background >
    </el-pagination>
   </el-card>
   <!-- 编辑商品弹出框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="isdialogVisible"
      size="tiny"
      @close="closeEdit"
      >
      <el-form :model="goodsInfo" :rules="goodsInforules" ref="goodsInforuleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="goodsInfo.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="goodsInfo.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="goodsInfo.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="goodsInfo.goods_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsClick">确 定</el-button>
      </span>
    </el-dialog>
 </div>
</template>

<script>
import {formatDate} from '../../common/utils'
 export default {
  name: '',
  data () {
   return {
    //  商品列表请求参数
     queryInfo:{
       query:'',
       pagenum:1,
       pagesize:10
     },
    //  将获取的商品列表数据保存到goodsList数组中
      goodsList:[],
      // 保存商品总数量
      total:0,
      // 编辑弹出框的显示和隐藏
      isdialogVisible:false,
      // 编辑商品的表单数据对象
      goodsInfo:{},
      // 编辑商品表单验证
      goodsInforules:{
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
        ]
      }
   }
  },
  created() {
    this.getgoodsList()
  },
  methods: {
    // 发送请求获取商品数据列表
    async getgoodsList(){
      const {data:res}=await this.$axios.get('goods',{params:this.queryInfo});
      console.log(res)
      if(res.meta.status!=200) this.$message.error('获取商品列表失败！')
      // this.$message.success('获取商品列表成功');
      // 将数据保存到data中
      this.goodsList=res.data.goods;
      this.total=res.data.total
    },
    // 当页码数量发生改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize;
      this.getgoodsList()
    },
    // 当 当页数值发生改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage;
      this.getgoodsList();
    },
    // 根据id删除商品
    async removeGoods(id){
      const result=await this.$confirm('是否删除该商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(result!='confirm') return this.$message.info('取消删除')
        // 否则 点击确定删除 发送请求，将删除后的新数据保存在数据库中
        const {data:res}=await this.$axios.delete('goods/'+id);
        if(res.meta.status!=200) return this.$message.error('删除商品失败')
        // 否则 删除成功
        this.$message.success('删除成功');
        this.getgoodsList();
    },
    // 根据id编辑商品
    async editGoods(id){
      this.isdialogVisible=true
      // 发送请求获取商品数据
      const {data:res}=await this.$axios.get('goods/'+id)
      // console.log(res)
      if(res.meta.status!=200) return this.$message.error('获取商品信息失败')
      this.goodsInfo=res.data 
    },
    // 提交编辑商品信息
    editGoodsClick(){
      this.$refs.goodsInforuleFormRef.validate(async val=>{
        if(!val) return 
        // 发送请求，将编辑的商品信息保存到数据库中
        const {data:res}=await this.$axios.put(`goods/${this.goodsInfo.goods_id}`,this.goodsInfo)
        console.log(res)
        if(res.meta.status!=200) return this.$message.error('修改商品信息失败')
        this.$message.success('修改商品信息成功')
        this.isdialogVisible=false
        this.getgoodsList()
      })
      
    },
    // 编辑商品弹出框关闭重置
    closeEdit(){
      this.$refs.goodsInforuleFormRef.resetFields();
    },
    // 添加商品
    addGoods(){
      this.$router.push('/goods/addgoods')
    }
  },
  // 过滤器   将时间戳转为时间格式化字符串
  filters:{
    showDate(value){
      const data=new Date(value * 1000);
      return formatDate(data,'yyyy-MM-dd hh:mm:ss')
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
  .el-table{
    font-size: 12px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
 
</style>
