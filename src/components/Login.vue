<template>
 <div class="login_container">
   <div class="login_box">
     <h3>用户登录/Login</h3>
     <!-- 登录表单 -->
     <el-form ref="formRef" :rules="loginFormRules" label-width="0px" class="login_form" :model="loginForm">
       <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input v-model="loginForm.username"  placeholder="请输入用户名" prefix-icon="iconfont icon-user"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input  v-model="loginForm.password" type="password"  placeholder="请输入密码" prefix-icon="iconfont icon-3702mima"></el-input>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-form-item class="btns">
        <el-button type="primary" @click="loginClick">登录</el-button>
        <el-button type="info" @click="btnClick">重置</el-button>
      </el-form-item>
     
     </el-form>
   </div>
 </div>
</template>

<script>
 export default {
  name: '',
  data () {
   return {
     loginForm:{
       username:'admin',
       password:'123456'
     },
    //  表单验证的规则校验
     loginFormRules:{
      //  验证用户名规则
       username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
       ],
      //  验证密码规则
       password:[
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
       ]
     }
   }
  },
  methods: {
    // 点击重置
    btnClick(){
      this.$refs.formRef.resetFields()
    },
    // 登录前表单数据的预验证
    loginClick(){
      // validate函数接收一个回调函数，其中一个参数为布尔值，为true表示通过验证
      this.$refs.formRef.validate(async val =>{
        // console.log(val);
        if(!val) return;
        const {data:res}=await this.$axios.post('login',this.loginForm);
        // console.log(res)
        if(res.meta.status!=200) return this.$message.error('用户名不存在或者密码错误！')
        this.$message.success('登录成功！')
        // 登录成功后将用户token保存在客户端sessionStorage中，因为除登陆外的其他API接口，必须在登录之后才能访问，token是登录之后服务器返回的唯一身份令牌
        // local storage是持久化的存储机制 token只应该在当前网页打开期间生效，而session Storage属于一次会话，是会话期间的存储机制

        //保存token
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home')
      })
    }
  },
  components: {

  }
 }
</script>

<style scoped>
  .login_container{
    height: 100%;
    background: url(../assets/img/timg.gif) no-repeat 0 0 ;
    background-size: 100% 100%;
    color: #fff;
  }
  .login_box{
    width: 300px;
    height: 300px;
    background-color:rgba(255, 255, 255, .5);
    box-shadow: 0 0 8px #ccc;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 10px;
   
  }
  .login_form{
    position: absolute;
    bottom: 10px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
 
  h3{
    height: 38px;
    font-size: 18px;
    color: #9b745c;
    font-family: "microsoft yahei";
    text-align: center;
    line-height: 38px;
    margin-top: 14px;
    font-weight: normal;
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
</style>
