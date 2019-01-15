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
```json
"scripts": {
  "dev:wechat": "megalo-cli-service --mode development --platform wechat"
}
```

运行命令:
```bash
npm run dev:wechat
```

控制台参数文档参考[这里](https://github.com/megalojs/megalo-env-plugin#%E6%8E%A7%E5%88%B6%E5%8F%B0%E5%8F%82%E6%95%B0)

## demo
https://github.com/bigmeow/megalo-demo
