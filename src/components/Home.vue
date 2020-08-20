<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>后台管理系统</div>
      <el-button :plain="true" type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div :title="isCollapse?'展开菜单':'收起菜单'" id="collapse" @click="collapseClick"><i class="el-icon-more"></i></div>
        <el-menu active-text-color="#ffd04b" background-color="#333744" text-color="#fff" unique-opened :collapse='isCollapse' :collapse-transition="false" :router="true" :default-active="isActive">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id +''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconList[item.id]"></i>
              <!-- 导航文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+childItem.path" v-for="childItem in item.children" :key="childItem.path" @click="isActiveClick('/'+childItem.path)">
               <template slot="title">
              <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 导航文本 -->
                <span>{{childItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
 export default {
  name: 'Home',
  data () {
   return {
     menuList:[],
     iconList:{
       '125':'iconfont icon-user',
       '103':'iconfont icon-tijikongjian',
       '101':'iconfont icon-shangpin',
       '102':'iconfont icon-danju',
       '145':'iconfont icon-baobiao',
      
     },
     isCollapse:false,
    //  被激活的点击链接
     isActive:''
   }
  },
  components: {

  },
  created() {
    this.getMenuList();
    // 2.页面一被创建，就取出session中保存的链接地址
    this.isActive=window.sessionStorage.getItem('isActiveClass');
  },
  methods: {
    // 点击退出登录按钮
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
      },
      // 获取左侧所有菜单栏
      async getMenuList(){
        const {data:res}=await this.$axios.get('menus');
        if(res.meta.status!=200) return this.$message.error(res.meta.msg)
        // console.log(res)
        this.menuList=res.data
      },
      collapseClick(){
        this.isCollapse=!this.isCollapse
      },
      isActiveClick(isActive){
        // 1.当点击二级菜单时，把点击的链接地址先保存在session中
        window.sessionStorage.setItem('isActiveClass',isActive);
        // 3.重新赋值
        this.isActive=isActive
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
  .el-menu{
      border-right: none;
    }
  .el-main{
    background-color: #eaedf1;
  }
  .iconfont{
    margin-right: 10px;
  }
  #collapse{
    color:#fff;
    cursor: pointer;
    background-color: #4a5064;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
 
</style>
