const chalk = require('chalk')
const utils = require('./utils')

const statusColors = [
  chalk.green,
  chalk.green,
  chalk.green,
  chalk.yellow,
  chalk.red,
  chalk.red
]

const levelColors = [
  chalk.grey,
  chalk.blue,
  chalk.green,
  chalk.yellow,
  chalk.red,
  chalk.red
]

function getStatusColor (data, basic = false) {
  const code = data.res && data.res.statusCode
  const range = parseInt(code / 100)

  return basic ? range : statusColors[range] || utils.noop
}

function getLevelColor ({ level }, basic = false) {
  const range = parseInt((level / 10) - 1)

  return basic ? range : levelColors[range] || utils.noop
}

function get (data, skip) {
  return {
    status: skip ? utils.noop : getStatusColor(data),
    level: skip ? utils.noop : getLevelColor(data),
    dim: skip ? utils.noop : chalk.grey
  }
}

module.exports = {
  getStatus: getStatusColor,
  getLevel: getLevelColor,
  get
}
