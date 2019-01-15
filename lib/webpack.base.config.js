const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const createMegaloTarget = require('@megalo/target')
const compiler = require('@megalo/template-compiler')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { pagesEntry } = require('@megalo/entry')
const EnvPlugin = require('@megalo/env-plugin')
const { contextDir, info, getCssExt, checkFileExistsSync } = require('./util')
const appMainFile = `${contextDir}/src/index.js`

// 在process.env中注入你配置的环境变量，可在后面的nodejs代码中直接使用环境变量
// 注意：实例创建后，这之后的webpack配置里可直接使用process.env.PLATFORM 和 process.env.NODE_ENV，所以它放在最前面执行
const EnvPluginInstance = new EnvPlugin()
const platform = process.env.PLATFORM
const NODE_ENV = process.env.NODE_ENV
info(`当前编译平台: ${platform}`)
info(`环境变量NODE_ENV: ${NODE_ENV}`)

const isDEV = NODE_ENV === 'development'
const cssExt = getCssExt(platform)

const cssLoaders = [
  MiniCssExtractPlugin.loader,
  'css-loader'
]

const config = {
  mode: 'none',

  target: createMegaloTarget({
    compiler: Object.assign(compiler, {}),
    platform,
    htmlParse: {
      templateName: 'octoParse',
      src: `${contextDir}/node_modules/octoparse/lib/platform/${platform}`
    }
  }),

  entry: {
    'app': appMainFile,
    ...pagesEntry(appMainFile)
  },

  output: {
    path: `${contextDir}/dist-${platform}/`,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].js',
    pathinfo: false
  },

  optimization: {
    noEmitOnErrors: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]|megalo[\\/]/,
          name: 'vendor',
          chunks: 'initial'
        },
        common: {
          name: 'common',
          minChunks: 2
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  },

  resolve: {
    extensions: ['.vue', '.js', '.json'],
    alias: {
      'vue': 'megalo',
      '@': `${contextDir}/src`
    }
  },

  module: {
    noParse: /^(vue|vuex)$/,
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: cssLoaders
      },
      {
        test: /\.less$/,
        use: [
          ...cssLoaders,
          'less-loader'
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          ...cssLoaders,
          'stylus-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          ...cssLoaders,
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              // TODO 这里有个小bug, static的图片会生成在dist下面的src目录，子包的图片会生成在子包下的src目录，不影响分包策略，仅仅是路径看着有些别扭
              name: '[path][name].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
    EnvPluginInstance,
    new MiniCssExtractPlugin({
      filename: `static/css/[name].${cssExt}`
    }),
    new CopyWebpackPlugin([
      {
        context: `src/native/${platform}/`,
        from: `**/*`,
        to: `${contextDir}/dist-${platform}/native`
      }
    ]),
    new webpack.ProgressPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your miniprogram application has been compiled successfully`],
        notes: isDEV ? [] : [`The compiled files are in directory dist-${platform}  (*^▽^*) Enjoy it~`]
      },
      onErrors: function (severity, errors) {
        if (severity !== 'error') {
          return
        }
        console.log('(⊙﹏⊙) \n', errors[0].webpackError)
      },
      clearConsole: true,
      additionalFormatters: [],
      additionalTransformers: []
    })
  ]
}

if (checkFileExistsSync(contextDir + '/.eslintrc.js')) {
  config.module.rules.push({
    enforce: 'pre',
    test: /\.(vue|(j|t)sx?)$/,
    exclude: [/node_modules/],
    use: [
      {
        loader: 'eslint-loader',
        options: {
          extensions: [
            '.js',
            '.jsx',
            '.vue'
          ],
          cache: true,
          emitWarning: true,
          emitError: true
        }
      }
    ]
  })
}

module.exports = config
