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
  } else if (contains(data.tags, 'uncaught')) {
    return formats.uncaught
  } else if (data.req) {
    return formats.request
  }

  return formats.log
}

/**
 * @function
 * @public
 *
 * Initialize formats and presets passed as options to plugin.
 *
 * @param {Object} [optionPresets = {}] The defined presets
 * @param {Object} [optionFormats = {}] The defined formats
 */
function init (optionPresets = {}, optionFormats = {}) {
  Object.keys(optionPresets).forEach((key) => preset(key, optionPresets[key]))
  Object.keys(optionFormats).forEach((key) => assign(key, optionFormats[key]))
}

preset('log.tiny', ':time :level :message')
preset('log.tinyjson', '{ message::message, timestamp::time, level::level, environment::environment }')
preset('error.tiny', ':time :level :error')
preset('error.tinyjson', '{ error::error, timestamp::time, level::level, environment::environment }')
preset('error.stackjson', '{ error::error, timestamp::time, level::level, environment::environment, stack::error[stack] }')
preset('error.json', '{ error::error, timestamp::time, level::level, environment::environment, source::error[source] }')
preset('response.tiny', ':time :method :remoteAddress :url :status :payload (:responseTime ms)')
preset('server.info', ':time :level :message at: :host[uri]')

assign('log', 'log.tinyjson')
assign('request', 'log.tinyjson')
assign('request-error', 'error.tinyjson')
assign('response', 'response.tiny')
assign('onPostStart', 'server.info')
assign('onPostStop', 'server.info')
assign('uncaught', 'error.json')

module.exports = {
  preset,
  assign,
  get,
  init
}
