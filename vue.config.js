module.exports = {
  chainWebpack : config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production',config => {
      config
      .entry('app')
      .clear()
      .add('./src/main-prod.js')
      // 只有发布模式才通过webpack的externals节点来配置并加载外部的 CDN 资源
      config.set('externals',{
        vue:'Vue',
        'vue-router':'VueRouter',
        axios:'axios',
        lodash:'_',
        echarts:'echarts',
        nprogress:'nprogress',
        'vue-quill-editor':'VueQuillEditor'
 
      })
      config.plugin('html').tap(args=>{
        args[0].isProd=true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
      .entry('app')
      .clear()
      .add('./src/main-dev.js')
      config.plugin('html').tap(args=>{
        args[0].isProd=false
        return args
      })
    })
  }
}