# @megalo/cli-service
:hammer_and_wrench: megalo的开箱即用webpack小程序脚手架配置，内置megalo生态的部分插件，并提供用户自定义配置的入口(megalo for vue-cli3插件出来之前的临时替代方案)
## 特性
- 零配置可用
- 可根据自己的需求修改webpack原始配置
- 内置了小程序项目常用的基础设施配置，满足基本需求
- 项目配置分离，零耦和，配置插件化

## 安装
`@megalo/cli-service` 依赖 `@megalo/entry`、`@megalo/env-plugin`、`@megalo/target` 、`@megalo/template-compiler`
```bash
npm i @megalo/entry @megalo/env-plugin @megalo/target @megalo/template-compiler @megalo/cli-service -D
```

## 使用

在项目根目录的`package.json`文件中的`scripts`选项加上一条:
```json
"scripts": {
  "dev:wechat": "megalo-cli-service --mode development --platform wechat"
}
```

运行命令:
```bash
npm run dev:wechat
```

控制台参数文档参考[这里](https://github.com/megalojs/megalo-env-plugin#%E6%8E%A7%E5%88%B6%E5%8F%B0%E5%8F%82%E6%95%B0)

## 修改配置

如果你觉得webpack配置不满足项目需求，你可以在项目根目录下，新建一个`megalo.config.js`文件，书写自己的配置并导出，目前该配置文件的默认配置如下（均为选填）：
```js
module.exports = {
  // 构件生产模式时的配置（仅在process.env.NODE_ENV === 'production' 时该选项生效）
  build: {
    // 生成分析报告
    bundleAnalyzerReport: false,
    // 生成sourceMap 'none' 或者 'cheap-source-map'
    sourceMap: 'none'
  },
  configureWebpack: config => {
    // 你可以在这里修改webpack的配置并返回,或者直接创建一个新的webpack配置对象返回;
    // 你的配置将被 webpack-merge 合并 (https://github.com/survivejs/webpack-merge)
    return config
  },
  // 原生小程序组件存放目录，默认为src/native
  // 如果你有多个平台的原生组件，你应当在此目录下再新建几个子文件夹，我们约定，子文件夹名和平台的名字一致:
  // 微信小程序组件则命名为 'wechat'，支付宝为'alipay', 百度为 'swan'
  // 如果只有一个平台，则无需再新建子文件夹
  nativeDir: '/src/native'
}

```
###

## 注意
`@megalo/cli-service` 对项目目录结构有一定要求, 例如：
- `src` 目录下一定要有 `index.js` 文件,作为入口

## demo
https://github.com/bigmeow/megalo-demo

## TODO
- 集成到 `megalo-cli`
- typescript 支持

## 更新记录
- ［0.1.1 ］ 修复windows路径兼容问题
- ［0.1.2 ］ 内置 `@megalo/api` 插件的webpack配置; 内置 `px2rpx-loader`,将`px`单位统一转换成`rpx`单位,默认转换比例为: 1px ==>  2rpx
