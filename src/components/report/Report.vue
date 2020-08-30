<template>
 <div>
    <!-- 面包屑导航 -->
   <el-breadcrumb separator=">" >
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>  
  </el-breadcrumb>
  <el-card>
    <!-- 为Echarts准备DOM元素 -->
    <div id="main" style="width:700px;height:400px"></div>
  </el-card>
 </div>
</template>

<script>
 import echarts from 'echarts'
//  导入第三方插件 lodash 合并图表数据
 import _ from 'lodash'
 export default {
  name: '',
  data () {
   return {
    //  合并的图表数据
    options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
   }
  },
  created() {
    
  },
  methods: {
    
  },
   // 只有在mounted生命周期中，页面上的元素才真正的渲染完毕
  async mounted() {
    // 初始化echarts实列
    var myEcharts=echarts.init(document.getElementById('main'))
    const {data:res}=await this.$axios.get('reports/type/1')
    console.log(res)
    if(res.meta.status!==200) return this.$message.error('获取图表数据失败')
    // 配置echarts图表数据 由后台数据合并 使用插件lodash合并
    const optionResult=_.merge(res.data,this.options)
    // 将配置好的图表数据传给实列的setOption方法展示图表数据
    myEcharts.setOption(optionResult)
  },
  components: {

  }
 }
</script>
  
<style scoped>
  .el-card{
    margin-top: 20px;
  }
 
</style>
