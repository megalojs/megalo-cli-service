const webpack = require('webpack')
const romoveFile = require('rimraf')
const EnvPlugin = require('@megalo/env-plugin')
const createBaseConfig = require('./createBaseConfig')
const { mergeUserConfig, defaultConfig } = require('./mergeUserConfig')
const { contextDir } = require('./util')

// 在process.env中注入你配置的环境变量，可在后面的nodejs代码中直接使用环境变量
const EnvPluginInstance = new EnvPlugin()
// 创建webpack配置
const config = createBaseConfig(defaultConfig)
// 将插件配置到webpack的plugins选项中，在项目中你可以使用你配置的环境变量了
config.plugins.unshift(EnvPluginInstance)
// 合并、并处理用户定义的webpack配置（megalo.config.js）
mergeUserConfig(config)

romoveFile(`${contextDir}/dist-${process.env.PLATFORM}/*`, error => {
  if (error) throw error
  webpack(config, () => { })
})
