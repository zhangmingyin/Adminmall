<template>
 <div>
   <!-- 面包屑导航 -->
   <el-breadcrumb separator=">" >
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>  
  </el-breadcrumb>
  <el-card>
    <el-table :data="rightsList" border stripe highlight-current-row height="370">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template v-slot="scope">
          <div>
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
 </div>
</template>

<script>
 export default {
  name: '',
  data () {
   return {
    //  定义保存权限列表数据
     rightsList:[]
   }
  },
  created() {
    // 调用获取权限列表函数，在组件刚加载时就获取数据
    this.getRihtsList();
  },
  methods: {
    // 返回的时一个promise对象，所以用async和await进行简化
    async getRihtsList(){
      // 发送权限列表数据API请求
      const {data:res}=await this.$axios.get('rights/list');
      if(res.meta.status!=200) return this.$message.error('获取权限列表失败！');
      // 否则 获取成功就将获取成功的数据保存在data定义的权限列表数据中
      this.rightsList=res.data;
      console.log(this.rightsList)
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
  .el-card{
    margin-top: 20px;
  }
  
</style>
