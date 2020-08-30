<template>
 <div>
    <!-- 面包屑导航 -->
   <el-breadcrumb separator=">" >
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>  
  </el-breadcrumb>
  <!-- 卡片 -->
  <el-card>
    <!-- 搜索框 -->
    <el-row :gutter="10">
      <el-col :span="8">
        <!-- 后台没有返回模糊查询数据 -->
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getorderList">
          <el-button slot="append" icon="el-icon-search" @click="getorderList"></el-button>
        </el-input> 
      </el-col>
    </el-row>
    <el-table :data='orderList' border stripe >
      <el-table-column label="#" type="index">
      </el-table-column>
      <el-table-column width="320px" label="订单编号" prop="order_number">
      </el-table-column>
      <el-table-column width="115px" label="订单价格" prop="order_price">
      </el-table-column>
      <el-table-column width="90px" label="是否付款" prop="pay_status">
        <template v-slot="scope">
          <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="90px" label="是否发货" prop="is_send">
      </el-table-column>
      <el-table-column width="180px" label="下单时间" prop="create_time">
        <template v-slot="scope">
          {{scope.row.create_time | showDate}}
        </template>
      </el-table-column>
       <el-table-column width="130px" label="操作">
         <template v-slot="scope">
           <el-tooltip class="item" effect="dark" content="修改订单地址" placement="top">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="addressEdit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="物流信息" placement="top">
            <el-button size="mini" type="success" icon="el-icon-location" @click="progress"></el-button>
          </el-tooltip>
         </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
  <!-- 编辑订单地址弹出框 -->
  <el-dialog
    title="修改地址"
    :visible.sync="addressDialog"
    size="tiny" @close="closeAddress"
    >
    <el-form :model="addressForm" :rules="addressrules" ref="addressRef" label-width="100px" >
      <el-form-item label="省市区/县" prop="address1">
      <!-- 省市区级联选择器 -->
        <el-cascader
          expand-trigger="hover"
          :options="citydata"
          v-model="addressForm.address1"
         >
        </el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="address2">
        <el-input v-model="addressForm.address2"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addressDialog = false">取 消</el-button>
      <el-button type="primary" @click="addressDialog = false">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 物流信息弹出框 -->
  <el-dialog
    title="物流信息"
    :visible.sync="progressDialog"
    size="tiny"
   >
   <!-- 物流信息进度 -->
   <div>排序：
     <el-radio-group v-model="reverse">
      <el-radio :label="true">倒序</el-radio>
      <el-radio :label="false">正序</el-radio>
    </el-radio-group>
   </div>
   
   <el-timeline :reverse='reverse'>
     <el-timeline-item v-for="(activity,index) in progressInfo" :key="index" :timestamp='activity.time'>
       {{activity.context}}
     </el-timeline-item>
   </el-timeline>
  </el-dialog>
 </div>
</template>

<script>
 import {formatDate} from '../../common/utils'
 import citydata from './citydata'
 export default {
  name: '',
  data () {
   return {
    //  参数查询对象
     queryInfo:{
       query:'',
       pagenum:1,
       pagesize:10
     },
    //  订单列表
    orderList:[],
    // 订单总数
    total:0,
    // 编辑订单地址弹出框的显示和隐藏
    addressDialog:false,
    // 编辑地址表单对象
    addressForm:{
      address1:[],
      address2:''
    },
    // 地址表单验证规则
    addressrules:{
      address1:[
         { required: true, message: '请选择省市区县', trigger: 'blur' }
      ],
      address2:[
         { required: true, message: '请输入详细地址', trigger: 'blur' }
      ]
    },
    // 级联选择器省市区
    citydata,
    // 物流信息弹出框显示和隐藏
    progressDialog:false,
    // 物流信息
    progressInfo:[],
    reverse:true
   }
  },
  created() {
    this.getorderList();
  },
  methods: {
    async getorderList(){
      const {data:res}=await this.$axios.get('orders',{
        params:this.queryInfo
      })
      console.log(res)
      if(res.meta.status!=200) return this.$message.error('获取订单列表失败')
      this.orderList=res.data.goods;
      this.total=res.data.total
    },
    // 当页条数发送改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getorderList()
    },
    // 当页码发生变化
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getorderList()
    },
    // 点击编辑订单地址按钮
     addressEdit(){
      this.addressDialog=true
    },
    // 关闭编辑地址弹出框重置时间
    closeAddress(){
      this.$refs.addressRef.resetFields()
    },
    // 点击物流信息
    async progress(){
      this.progressDialog=true
      // 发送请求物流信息
      const {data:res}=await this.$axios.get('/kuaidi/'+1106975712662)
      if(res.meta.status!==200) return this.$message.error('获取物流信息失败！')
      this.progressInfo=res.data
      console.log(this.progressInfo)
    }
  },
  filters:{
    showDate(value){
      const data=new Date(value * 1000)
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
    margin-top: 20px;
  }
  .el-pagination{
    margin-top:20px
  }
  .el-cascader{
    width: 100%;
  }
  .el-timeline{
    margin-top: 20px;
  }
</style>
