  // 定义空数组 判断时开发阶段还是发布阶段
  const prodPlugins=[];
  // 如果process.env.NODE_ENV==='production' 说明是发布阶段
  if(process.env.NODE_ENV==='production'){
    // 是发布阶段就push配置插件
    prodPlugins.push('transform-remove-console')
  }
  module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // 是发布阶段就添加配置插件  否则什么都不做
    ...prodPlugins
  ]
}
