<template>
 <div>
   <el-button type="text" @click="loginOut">退出登录</el-button>
 </div>
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

 
</style>
