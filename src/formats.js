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
 * @type Object.<string>
 * @private
 *
 * Collection of presets.
 */
const presets = {}

/**
 * @function
 * @public
 *
 * Ressign or disable specific format.
 *
 * @param {string} key The name of the format
 * @param {string | boolean} format The format string
 */
function assign (key, format) {
  validator('formatLabel', key)
  validator('format', format)

  formats[key] = presets[format] || format
}

/**
 * @function
 * @public
 *
 * Add a format preset to collection.
 *
 * @param {string} key The name of the preset
 * @param {string | boolean} format The format string to be preset
 *
 * @throws The passed key already exists
 */
function preset (key, format) {
  validator('format', format)

  if (presets[key] !== undefined) {
    throw new SyntaxError('It is not allowed to override existing presets.')
  }

  presets[key] = format
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

preset('log.tiny', '({ message::message, timestamp::time, level::level, environment::environment })')
preset('error.tiny', '({ error::error, timestamp::time, level::level, environment::environment })')
preset('response.tiny', ':time :method :remoteAddress :url :status :payload (:responseTime ms)')
preset('server.tiny', ':time :level :message')
preset('server.info', ':time :level :message :host[uri]')

assign('log', 'log.tiny')
assign('request-error', 'error.tiny')
assign('response', 'response.tiny')
assign('onPostStart', 'server.tiny')
assign('onPostStop', 'server.tiny')

module.exports = {
  preset,
  assign,
  get
}

