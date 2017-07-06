const hapiPino = require('hapi-pino')
const escape = require('js-string-escape')
const pino = require('pino')
const colors = require('./colors')
const formats = require('./formats')
const tokens = require('./tokens')
const utils = require('./utils')

/**
 * @type RegExp
 * @private
 *
 * The regular expression to extract tokens
 */
const re = /:(\w{2,})(?:\[([^\]]+)])?/g

/**
 * @function
 * @private
 *
 * Compile the passed format string based on the aggregated
 * data and further options, see below. If the format is
 * disabled, get the stringified data. Otherwise get a the
 * evaluated and – if necessary – stringified format string.
 *
 * @param {string | boolean} format The format to be compiled
 * @param {Object.<Function>} tokens The list of all registered tokens
 * @param {boolean} isJSON The format is a JSON-like string
 * @param {string | number} space The indentation for `JSON.stringify`
 * @param {Object} data The data aggregated by `pino`
 * @returns {string} The compiled format string
 */
/* eslint-disable no-eval */
function compile (format, tokens, isJSON, space, data) {
  if (format === false) {
    return JSON.stringify(data, null, space)
  }

  const js = escape(format).replace(re, (m, name, arg) => {
    const tokenArgs = 'Array.prototype.slice.call(arguments).slice(4)'
    const template = `tokens[${utils.stringify(name)}](...(${tokenArgs}), ${utils.stringify(arg)}) || undefined`
    const token = tokens[name]

    if (!token) {
      return isJSON ? utils.stringify(m) : m
    } else if (!isJSON) {
      const interim = eval(template)
      return typeof interim === 'object' ? utils.stringify(interim) : interim
    }

    return template
  })

  if (isJSON) {
    return JSON.stringify(eval(js), null, space)
  }

  return js
}
/* eslint-enable no-eval */

/**
 * @function
 * @private
 *
 * Get the configuration for the `pino` logger based
 * on the passed `laabr` options.
 *
 * @param {Object} options The `laabr` plugin related options
 * @returns {Object} The overriden `pino` configs
 */
function getLoggerConfig (options) {
  return Object.assign(options.pino, {
    browser: {},
    timestamp: true,
    prettyPrint: {
      formatter: (data) => {
        const format = formats.get(data)
        const isJSON = utils.isJSON(format)
        const pictor = colors.get(data, isJSON || !options.colored)

        return compile(format, tokens, isJSON, options.indent, data, pictor)
      }
    }
  })
}

/**
 * @function
 * @private
 *
 * Get the configuration for the `hapi-pino` plugin based
 * on the passed `laabr` options.
 *
 * @param {Object} options The `laabr` plugin related options
 * @returns {Object} The overriden `hapi-pino` configs
 */
function getPluginConfig (options, loggerConfig) {
  return Object.assign(options.plugin, {
    instance: pino(loggerConfig, options.stream),
    prettyPrint: false,
    mergeHapiLogData: false
  })
}

/**
 * @function
 * @public
 *
 * Compose the `hapi-pino` plugin registration object based
 * on the passed `laabr` options and a prio `pino` instance.
 *
 * @param {Object} options The `laabr` plugin related options
 * @returns {Object.<Function|Object>} The composed plugin registration object
 */
function get (options) {
  const loggerConfig = getLoggerConfig(options)
  const pluginConfig = getPluginConfig(options, loggerConfig)

  return {
    register: hapiPino,
    options: pluginConfig
  }
}

module.exports = get
