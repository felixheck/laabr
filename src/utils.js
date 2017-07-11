/**
 * @function
 * @public
 *
 * Check if the variable is a string/Array and contains
 * the request search term
 *
 * @param {string | Array} str The variable to be searched
 * @param {*} search The search term to be found
 *
 * @returns {boolean} Whether the variable contains the search term
 */
function contains (str, search) {
  return str && str.includes && str.includes(search)
}

/**
 * @function
 * @public
 *
 * Find value of header field in a stringified header.
 *
 * @param {Object} header The stringified header
 * @param {string} field The header field to be searched for
 * @returns {Array | null} The result of the executed RegExp
 */
function getHeader (header, field) {
  const re = new RegExp(`(?:\\r\\n)${field}: *([a-zA-z0-9 /,:;=-]*)`, 'gi')
  return re.exec(header, field)
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
  ['trace', 'log', 'info', 'warn', 'error'].forEach(method => {
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

module.exports = {
  contains,
  getHeader,
  isJSON,
  noop,
  override,
  stringify
}
