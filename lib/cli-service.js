#!/usr/bin/env node

// 检查nodeJs版本
const semver = require('semver')
const { error } = require('./util')
const requiredVersion = require('../package.json').engines.node
if (!semver.satisfies(process.version, requiredVersion)) {
  error(
    `You are using Node ${process.version}, but @megalo/cli-service ` +
    `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
  )
  process.exit(1)
}

const webpack = require('webpack')
const romoveFile = require('rimraf')
const minimist = require('minimist')
const { mergeUserConfig } = require('./mergeUserConfig')
const { contextDir } = require('./util')
let webpackConfig

// 获取控制台传参
const argv = minimist(process.argv.slice(2))
const mode = argv.mode || 'development'
if (mode === 'development') {
  webpackConfig = require('./webpack.dev.config')
} else {
  webpackConfig = require('./webpack.build.config')
}

// 合并、并处理用户定义的webpack配置（megalo.config.js）
mergeUserConfig(webpackConfig)

romoveFile(`${contextDir}/dist-${process.env.PLATFORM}/*`, error => {
  if (error) throw error
  webpack(webpackConfig, () => { })
})
