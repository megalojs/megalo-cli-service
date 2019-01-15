const fs = require('fs')
const webpackMerge = require('webpack-merge')
const merge = require('lodash/merge')
const { contextDir } = require('./util')

const defaultConfig = {
  build: {
    // 生成分析报告
    bundleAnalyzerReport: false,
    // 生成sourceMap
    sourceMap: false
  },
  configureWebpack: undefined
}

const userConfigPath = contextDir + '/megalo.config.js'
if (fs.existsSync(userConfigPath)) {
  const userConfig = require(userConfigPath)
  merge(defaultConfig, userConfig)
}

/** 处理过的用户自定义配置 */
exports.defaultConfig = defaultConfig

/** 合并用户修改后的webpack配置 */
exports.mergeUserConfig = (webpackBaseConfig) => {
  process.env.NODE_ENV === 'production' && mergeBuildConfig(webpackBaseConfig)
  // 合并用户自定义webpack配置
  if (typeof defaultConfig.configureWebpack === 'function') {
    const returnConfig = defaultConfig.configureWebpack(webpackBaseConfig)
    // 若没有直接修改传入进去的配置，而是返回了一个新的配置对象，就merge处理
    if (returnConfig && returnConfig !== webpackBaseConfig) {
      webpackBaseConfig = webpackMerge(webpackBaseConfig, returnConfig)
    }
  }
}

function mergeBuildConfig (webpackBaseConfig) {
  if (defaultConfig.build.bundleAnalyzerReport === true) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackBaseConfig.plugins.push(new BundleAnalyzerPlugin())
  }
}
