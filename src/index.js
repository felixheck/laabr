const pkg = require('../package.json')
const logger = require('./logger')
const formats = require('./formats')
const tokens = require('./tokens')
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
      console.error(err)
      process.exit(1)
    }

    return next()
  })
}

plugin.attributes = {
  pkg
}

module.exports.plugin = plugin
module.exports.format = formats.assign
module.exports.token = tokens.assign
