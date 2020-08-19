<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>后台管理系统</div>
      <el-button type="info" @click="loginOut">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside width="200px">
        <el-menu active-text-color="#ffd04b" background-color="#333744" text-color="#fff">
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 导航文本 -->
              <span>导航一</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="1-4-1">
               <template slot="title">
              <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 导航文本 -->
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
 export default {
  name: 'Home',
  data () {
   return {

   }
  },
  components: {

  },
  methods: {
      loginOut() {
        this.$confirm('退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出登录成功!'
          });
          window.sessionStorage.clear();
          this.$router.push('/login')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出登录'
          });          
        });
      }
    }
 }
</script>

<style scoped>
  .home_container{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    display: flex;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    justify-content: space-between;
    align-items: center;
  }
  .el-header div{
    display: flex;
    align-items: center;
  }
  .el-aside{
    background-color: #333744;
  }
  .el-main{
    background-color: #eaedf1;
  }
</style>
