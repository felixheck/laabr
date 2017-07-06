const Hapi = require('hapi')
const laabr = require('./src')

laabr.format('onPostStart', ':time :start :level :message')
laabr.token('start', () => '[start]')

const server = new Hapi.Server()
server.connection({ port: 3000, host: 'localhost' })

server.route([
  {
    method: '*',
    path: '/response',
    handler (req, reply) {
      reply('hello world')
    }
  },
  {
    method: 'GET',
    path: '/error',
    handler (req, reply) {
      reply(new Error('foobar'))
    }
  }
])

process.on('SIGINT', () => {
  server.stop().then((err) => {
    process.exit((err) ? 1 : 0)
  })
})

server.register({
  register: laabr.plugin,
  options: {
    indent: 0
  }
})
.then(() => server.start())
.catch(console.error)

server.log('info', 'did you mean "foobar"?')
