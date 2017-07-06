const hapi = require('hapi')
const StdOutInterceptor = require('fixture-stdout')
const laabr = require('../src')
const utils = require('../src/utils')

/**
 * @function
 * @public
 *
 * Initiate and get `stdout` interceptor decorated with
 * further methods to help debugging and testing
 *
 * @returns {StdOutInterceptor} The initiated interceptor
 */
function getInterceptor () {
  const interceptor = new StdOutInterceptor()
  var _writes = []

  interceptor.capture((string, encoding, fd) => {
    _writes.push({
      string,
      encoding,
      fd
    })
    return false
  })

  interceptor.get = () => _writes
  interceptor.find = (search) => (
    _writes.find((item) => item.string.includes(search))
  )

  return interceptor
}

/**
 * @function
 * @public
 *
 * Register the `laabr` plugin with passed options
 *
 * @param {Hapi.Server} server The server to be decorated
 * @param {Object} options The plugin related options
 */
function registerPlugin (server, options) {
  server.register({
    register: laabr.plugin,
    options
  }, () => {})
}

/**
 * @function
 * @public
 *
 * Create server with routes, plugin and error handler
 *
 * @param {Object} options The plugin related options
 * @returns {Hapi.Server} The created server instance
 */
function getServer (options) {
  const server = new hapi.Server()

  server.connection({
    host: '127.0.0.1',
    port: 1337
  })

  server.route([
    {
      method: '*',
      path: '/response/{code}',
      handler (req, reply) {
        reply({ foo: 42 }).code(parseInt(req.params.code))
      }
    },
    {
      method: '*',
      path: '/requestError',
      handler (req, reply) {
        reply(new Error('foobar'))
      }
    }
  ])

  registerPlugin(server, options)
  process.on('SIGINT', () => {
    server.stop({ timeout: 10000 }).then((err) => {
      process.exit((err) ? 1 : 0)
    })
  })

  return server
}

module.exports = {
  noop: utils.noop,
  getInterceptor,
  getServer,
  registerPlugin
}
