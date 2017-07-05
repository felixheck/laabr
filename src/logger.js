const hapiPino = require('hapi-pino')
const escape = require('js-string-escape')
const pino = require('pino')
const colors = require('./colors')
const formats = require('./formats')
const tokens = require('./tokens')
const utils = require('./utils')

const re = /:(\w{2,})(?:\[([^\]]+)])?/g

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

function getPluginConfig (options, loggerConfig) {
  return Object.assign(options.plugin, {
    instance: pino(loggerConfig, options.stream),
    prettyPrint: false,
    mergeHapiLogData: false
  })
}

function get (options) {
  const loggerConfig = getLoggerConfig(options)
  const pluginConfig = getPluginConfig(options, loggerConfig)

  return {
    register: hapiPino,
    options: pluginConfig
  }
}

module.exports = get
