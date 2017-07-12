const correlator = require('correlation-id')

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
 * @public
 *
 * Initialize the correlator by exposing and decorating
 * various correlator features to `laabr` and `req`.
 *
 * @param {Object} laabr The module as object
 * @param {Hapi.Server} server The created server instance
 * @param {string} field The correlator header field
 */
function init (laabr, server, { correlatorHeader: field }) {
  laabr.cid = getCorrelator()
  server.app.cid = laabr.cid

  server.ext('onRequest', function (req, reply) {
    req.cid = req.headers[field] || req.id

    return correlator.withId(req.cid, function () {
      reply.continue()
    })
  })
}

module.exports = {
  init
}
