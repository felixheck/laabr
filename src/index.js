const pkg = require('../package.json')
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
 */
async function register (server, options) {
  options = validator('options', options)

  options.preformatter = options.preformatter || ((x) => x)
  options.postformatter = options.postformatter || ((x) => x)

  formats.init(options.presets, options.formats)
  tokens.init(options.tokens)
  utils.handleUncaught(server, options.handleUncaught)

  await server.register(logger(options))

  if (options.override) {
    utils.override(server)
  }
}

module.exports = {
  plugin: { register, pkg },
  format: formats.assign,
  preset: formats.preset,
  token: tokens.assign,
  register,
  pkg
}
