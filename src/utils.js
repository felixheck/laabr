const errorStackParser = require('error-stack-parser')

/**
 * @function
 * @public
 *
 * Check if the variable is a string/Array and contains
 * the request search term
 *
 * @param {string | Array} data The variable to be searched
 * @param {*} search The search term to be found
 *
 * @returns {boolean} Whether the variable contains the search term
 */
function contains (data, search) {
  return data && data.includes && data.includes(search)
}

/**
 * @function
 * @public
 *
 * Check if the variable is a JSON-like string.
 * Have to be surrounded with a combination of
 * brackets and curly braces.
 *
 * @param {string} data The string to be searched
 *
 * @returns {boolean} Whether the variable is JSON-alike
 */
function isJSON (data) {
  return data && data.startsWith('{') && data.endsWith('}')
}

/**
 * @function
 * @public
 *
 * No operation. Pass the variable through.
 *
 * @param {*} data The data to be passed through
 * @returns {*} The passed through data
 */
function noop (data) {
  return data
}

/**
 * @function
 * @private
 *
 * Wrapper for the `pino`/`hapi` server log event.
 *
 * @param {Hapi.Server} server The created server instance
 * @param {string} level The logging level
 * @param {Array} data The data to be logged
 */
function wrapper (server, level, ...data) {
  server.log(level, data.length === 1 ? data[0] : data)
}

/**
 * @function
 * @public
 *
 * Override several `console` methods with `pino` ones
 * to enable logging everywhere.
 *
 * @param {Hapi.Server} server The created server instance
 */
function override (server) {
  ['trace', 'log', 'info', 'warn', 'error', 'debug'].forEach(method => {
    const target = method === 'log' ? 'debug' : method
    console[method] = wrapper.bind(undefined, server, target)
  })
}

/**
 * @function
 * @public
 *
 * Stringify the data, surround data with quotes
 * and escape inner quotes if necessary.
 *
 * @param {*} data The data to be stringified
 * @returns {str} The stringified data
 */
function stringify (data) {
  return String(JSON.stringify(data))
}

/**
 * @function
 * @public
 *
 * Objectify the object/error and its properties.
 *
 * @param {Object|Error} obj The object to be parsed
 * @returns {string} The parsed error
 */
function objectify (obj) {
  return JSON.parse(JSON.stringify(obj, Object.getOwnPropertyNames(obj)))
}

/**
 * @function
 * @public
 *
 * Get source line of error stack.
 *
 *
 * @param {Error} err The error to be analyzed
 * @returns {string} The composed source line
 */
function getErrorSource (err) {
  let result

  try {
    const { fileName, lineNumber, columnNumber } = errorStackParser.parse(err).shift()
    result = `${fileName}:${lineNumber}:${columnNumber}`
  } catch (err) {}

  return result
}

/**
 * @function
 * @public
 *
 * Handle uncaught exception if enabled per option.
 * Exit the process and log with `error` level.
 *
 * @param {Hapi.Server} server The related server instance
 * @param {boolean} enabled If uncaught exception should be handled
 */
function handleUncaught (server, enabled) {
  if (!enabled) {
    return
  }

  process.once('uncaughtException', (err) => {
    err = Object.assign({ source: getErrorSource(err) }, objectify(err))
    server.log(['uncaught', 'error'], { err })
    process.exit(1)
  })
}

module.exports = {
  contains,
  isJSON,
  noop,
  override,
  stringify,
  objectify,
  handleUncaught,
  getErrorSource
}
