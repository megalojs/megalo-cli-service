const path = require('path')
const chalk = require('chalk')
const padStart = require('string.prototype.padstart')

// 上下文目录（项目根目录）
const contextDir = path.resolve(process.cwd(), '.')
function resolve (...args) {
  return path.resolve(contextDir, ...args)
}

exports.contextDir = contextDir
exports.resolve = resolve

// 格式化输出
const format = (label, msg) => {
  return msg.split('\n').map((line, i) => {
    return i === 0
      ? `${label} ${line}`
      : padStart(line, chalk.reset(label).length)
  }).join('\n')
}

const chalkTag = msg => chalk.bgBlackBright.white.dim(` ${msg} `)

exports.error = (msg, tag = null) => {
  console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)))
  if (msg instanceof Error) {
    console.error(msg.stack)
  }
}

exports.info = (msg, tag = null) => {
  console.log(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg))
}
