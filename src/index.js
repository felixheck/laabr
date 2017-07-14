const pkg = require('../package.json')
const correlator = require('./correlator')
const formats = require('./formats')
const logger = require('./logger')
const tokens = require('./tokens')
const utils = require('./utils')
const validator = require('./validator')

/**
 * @function
 * @public
 *
 * Initialize the plugin `laabr` and register therefor
 * the necessary dependendies/plugins.
 *
 * @param {Hapi.Server} server The created server instance
 * @param {Object} options The plugin related options
 * @param {Function} next The callback to proceed
 */
function plugin (server, options, next) {
  options = validator('options', options)

  server.register(logger(options), (err) => {
    if (err) {
      return next(err)
    }

    if (options.override) {
      utils.override(server)
    }

    correlator.init(module.exports, server, options)

    return next()
  })
}

plugin.attributes = {
  pkg
}

module.exports.plugin = plugin
module.exports.format = formats.assign
module.exports.preset = formats.preset
module.exports.token = tokens.assign
