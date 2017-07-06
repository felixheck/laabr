const { contains } = require('./utils')
const validator = require('./validator')

/**
 * @type Object.<string>
 * @private
 *
 * Collection of formats.
 */
const formats = {}

/**
 * @function
 * @public
 *
 * Ressign or disable specific format.
 *
 * @param {string} key The name of the format
 * @param {string | boolean} token The format string
 */
function assign (key, format) {
  validator('formatLabel', key)
  validator('format', format)

  formats[key] = format
}

/**
 * @function
 * @public
 *
 * Get format based on the passed in data.
 * Select format based on specific properties/values.
 * If no format could be found, get the `log` format.
 *
 * @param {Object} data The data aggregated by `pino`
 * @returns {string} The respective format string
 */
function get (data) {
  if (data.msg === 'request completed') {
    return formats.response
  } else if (data.msg === 'request error') {
    return formats['request-error']
  } else if (contains(data.msg, 'server started')) {
    return formats.onPostStart
  } else if (contains(data.msg, 'server stopped')) {
    return formats.onPostStop
  }

  return formats.log
}

assign('log', '({ message::message, timestamp::time, level::level, environment::environment })')
assign('request-error', '({ error::error, timestamp::time, level::level, environment::environment })')
assign('response', ':time :method :remoteAddress :url :status :payload (:responseTime ms)')
assign('onPostStart', ':time :level :message')
assign('onPostStop', ':time :level :message')

module.exports = {
  assign,
  get
}

