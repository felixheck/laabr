const hapi = require('@hapi/hapi')
const spawn = require('child_process').spawn
const path = require('path')
const laabr = require('../src')
const utils = require('../src/utils')

/**
 * @function
 * @public
 *
 * Spawn a child process with a hapi server.
 * Used for listing on `stderr`/`stdout`.
 *
 * @param {string} type The type of fixture
 * @param {Object|Array} arg The argument passed first to process
 * @param {Object|Array} arg2 The argument passed second to process
 * @param {Function} done The handler called when a log occurs
 * @param {string} [stream='stdout'] The stream its name
 * @param {string} [listener='once'] The listener its type
 */
function spawnServer (type, arg, arg2, done, stream = 'stdout', listener = 'once') {
  const childProcess = spawn(
    'node',
    [path.join(__dirname, `fixtures/${type}`), JSON.stringify(arg), JSON.stringify(arg2)]
  )

  childProcess[stream][listener]('data', (data) => {
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
 * @param {Object} [options = {}] The plugin related options
 * @param {boolean} [asRoot = false] If the object gets registered as root property
 */
async function registerPlugin (server, options = {}, asRoot = false) {
  await server.register({
    plugin: asRoot ? laabr : laabr.plugin,
    options
  })

  return server
}

/**
 * @function
 * @public
 *
 * Create server with routes, plugin and error handler
 *
 * @param {Object} [options = {}] The plugin related options
 * @param {boolean} [asRoot = false] If the object gets registered as root property
 * @returns {Hapi.Server} The created server instance
 */
async function getServer (options = {}, asRoot = false) {
  const server = hapi.server({
    host: '127.0.0.1',
    port: 1338
  })

  server.route([
    {
      method: '*',
      path: '/request/log',
      handler (req) {
        req.log('info', 'foobar')
        return { foo: 42 }
      }
    },
    {
      method: '*',
      path: '/response/stream',
      handler (req, h) {
        return h.response({ foo: 42 }).code(200)
      },
      config: {
        payload: {
          output: 'stream',
          parse: false
        }
      }
    },
    {
      method: '*',
      path: '/response/buffer',
      handler (req, h) {
        return h.response({ foo: 42 }).code(200)
      },
      config: {
        payload: {
          parse: false
        }
      }
    },
    {
      method: '*',
      path: '/response/{code}',
      handler (req, h) {
        return h.response({ foo: 42 }).code(parseInt(req.params.code))
      }
    },
    {
      method: '*',
      path: '/request/error',
      handler () {
        throw new Error('foobar')
      }
    }
  ])

  await registerPlugin(server, options, asRoot)

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
  registerPlugin
}
