const correlator = require('correlation-id')
const deprecate = require('depd')('correlator')
const validator = require('./validator')

/**
 * @function
 * @private
 *
 * Get a correlator clone with shorter names.
 *
 * @returns {Object.<Function>} The correlator
 */
function getCorrelator () {
  return {
    get: correlator.getId,
    with: correlator.withId,
    bind: correlator.bindId
  }
}

/**
 * @function
 * @private
 *
 * Convert boolean option into valid object.
 *
 * @param {Object} options The plugin related options
 * @returns {Object} The validated and converted options
 */
function validateOption (options) {
  if ([true, false].includes(options.correlator)) {
    options.correlator = { enabled: options.correlator }
  }

  return validator('correlator', options.correlator)
}

/**
 * @function
 * @private
 *
 * Expose and decoratevarious correlator features.
 *
 * @param {Object} laabr The module as object
 * @param {Hapi.Server} server The created server instance
 */
function expose (laabr, server) {
  laabr.cid = getCorrelator()
  server.decorate('server', 'cid', laabr.cid)
  server.app.cid = {}

  Object.keys(laabr.cid).forEach(fn => {
    server.app.cid[fn] = deprecate.function(laabr.cid[fn])
  })
}

/**
 * @function
 * @public
 *
 * Register the `onRequest` lifecycle hook.
 *
 * @param {Hapi.Server} server The created server instance
 * @param {string} field The header field to be extracted
 */
function register (server, { header: field }) {
  server.ext('onRequest', function (req, reply) {
    req.headers['x-laabr-cid'] = req.headers[field] || req.id

    return correlator.withId(req.headers['x-laabr-cid'], function () {
      reply.continue()
    })
  })
}

/**
 * @function
 * @public
 *
 * Initialize the correlator by exposing and decorating
 * various correlator features to `laabr` and `req`.
 *
 * @param {Object} laabr The module as object
 * @param {Hapi.Server} server The created server instance
 * @param {Object} options The plugin related options
 */
function init (laabr, server, options) {
  const correlator = validateOption(options)

  if (!correlator.enabled) {
    return
  }

  expose(laabr, server)
  register(server, correlator)
}

module.exports = {
  init
}
