const pkg = require('../package.json')
const logger = require('./logger')
const formats = require('./formats')
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
  if (options.plugin) {
    options.hapiPino = options.plugin
    delete options.plugin

    console.warn('`options.plugin` will be deprecated soon. Use `options.hapiPino` instead')
  }

  options = validator('options', options)

  server.register(logger(options), (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    if (options.override) {
      utils.override(server)
    }

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
