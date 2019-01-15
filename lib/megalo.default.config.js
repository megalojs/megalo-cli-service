/**
 * 处理用户定义的megalo.config.js，将其合并导出成default.js
 */

const merge = require('lodash/merge')
const { contextDir, checkFileExistsSync } = require('./util')

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
if (checkFileExistsSync(userConfigPath)) {
  const userConfig = require(userConfigPath)
  merge(defaultConfig, userConfig)
}

module.exports = defaultConfig
