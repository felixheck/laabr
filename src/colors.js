const chalk = require('chalk')
const utils = require('./utils')

/**
 * @type Array.<Function>
 * @private
 *
 * Ranked list of status colors.
 */
const statusColors = [
  chalk.green,
  chalk.green,
  chalk.green,
  chalk.yellow,
  chalk.red,
  chalk.red
]

/**
 * @type Array.<Function>
 * @private
 *
 * Ranked list of level colors.
 */
const levelColors = [
  chalk.grey,
  chalk.blue,
  chalk.green,
  chalk.yellow,
  chalk.red,
  chalk.red
]

/**
 * @function
 * @public
 *
 * Get `chalk` builder function related to the status
 * code of the response. If there is no response object,
 * get a no-op function. If enable the `basic` mode,
 * just get the index.
 *
 * @param {Object} data The data aggregated by `pino`
 * @param {boolean} [basic=false] Request the basic index
 * @returns {number | Function} The index or the related builder function
 */
function getStatusColor (data, basic = false) {
  const code = data.res && data.res.statusCode
  const range = parseInt(code / 100)

  return basic ? range : statusColors[range] || utils.noop
}

/**
 * @function
 * @public
 *
 * Get `chalk` builder function related to the logging
 * level. If there is a logging level out of range,
 * get a no-op function. If enable the `basic` mode,
 * just get the index.
 *
 * @param {Object} level The level extracted of the aggregated data
 * @param {boolean} [basic=false] Request the basic index
 * @returns {number | Function} The index or the related builder function
 */
function getLevelColor ({ level }, basic = false) {
  const range = parseInt((level / 10) - 1)

  return basic ? range : levelColors[range] || utils.noop
}

/**
 * @function
 * @public
 *
 * Get all `chalk` builder functions for colorizing
 * console outputs based on the aggregated data. If
 * get calculation gets skipped – in case of JSONs or
 * for debugging needs – just get a map of no-ops.
 * `status` is used for status code related colorization.
 * `level` is used for logging level related colorization.
 * `dim` is used for a dimmed colorization.
 *
 * @param {Object} data The data aggregated by `pino`
 * @param {any} [skip=false] Skip the color calculation
 * @returns {Object.<Function>} The map of colorization functions
 */
function get (data, skip = false) {
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
