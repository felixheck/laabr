const hapi = require('hapi')
const spawn = require('child_process').spawn
const path = require('path')
const laabr = require('../src')
const utils = require('../src/utils')

function spawnServer(type, options, injection, done, stream = 'stdout') {
  const childProcess = spawn(
    'node',
    [path.join(__dirname, `fixtures/${type}`), JSON.stringify(options), JSON.stringify(injection)]
  )

  childProcess[stream].once('data', (data) => {
    let log = data.toString()

    try {
      log = JSON.parse(log)
    } catch (err) {}

    done(log)
  })
}
/**
 * @function
 * @public
 *
 * Register the `laabr` plugin with passed options
 *
 * @param {Hapi.Server} server The server to be decorated
 * @param {Object} options The plugin related options
 * @param {Function} done The success callback handler
 */
function registerPlugin (server, options, done = () => {}) {
  server.register({
    register: laabr.plugin,
    options
  }, () => {
    done(server)
  })
}

/**
 * @function
 * @public
 *
 * Create server with routes, plugin and error handler
 *
 * @param {Object} options The plugin related options
 * @param {Function} done The success callback handler
 * @returns {Hapi.Server} The created server instance
 */
function getServer (options, done) {
  const server = new hapi.Server()

  server.connection({
    host: '127.0.0.1',
    port: 1337
  })

  function logCID () {
    console.log('cid', laabr.cid.get())
  }

  server.route([
    {
      method: '*',
      path: '/request/log',
      handler (req, reply) {
        req.log('info', 'foobar')
        reply({ foo: 42 })
      }
    },
    {
      method: '*',
      path: '/request/id',
      handler (req, reply) {
        console.log('cid', laabr.cid.get())
        logCID()
        reply({ foo: 42 })
      }
    },
    {
      method: '*',
      path: '/request/id/req',
      handler (req, reply) {
        console.log('cid', req.headers['x-laabr-cid'])
        logCID()
        reply({ foo: 42 })
      }
    },
    {
      method: '*',
      path: '/request/id/next',
      handler (req, reply) {
        console.log('cid', laabr.cid.get())
        laabr.cid.with(logCID)
        reply({ foo: 42 })
      }
    },
    {
      method: '*',
      path: '/response/{code}',
      handler (req, reply) {
        reply({ foo: 42 }).code(parseInt(req.params.code))
      }
    },
    {
      method: '*',
      path: '/request/error',
      handler (req, reply) {
        reply(new Error('foobar'))
      }
    }
  ])

  registerPlugin(server, options, done)
  process.on('SIGINT', () => {
    server.stop({ timeout: 10000 }).then((err) => {
      process.exit((err) ? 1 : 0)
    })
  })

  return server
}

module.exports = {
  noop: utils.noop,
  spawn: spawnServer,
  getServer,
  registerPlugin,
}
