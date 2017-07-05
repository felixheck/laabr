const hapi = require('hapi')
const laabr = require('../src')
const StdOutInterceptor = require('fixture-stdout')

const noop = (data) => data

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

function registerPlugin (server, options) {
  server.register({
    register: laabr.plugin,
    options
  }, () => {})
}

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
  noop,
  getInterceptor,
  getServer,
  registerPlugin
}
