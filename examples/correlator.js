const Hapi = require('hapi')
const laabr = require('../src')

const server = new Hapi.Server()
server.connection({ port: 3000, host: 'localhost' })

function another () {
  server.log('info', `correlation id: ${laabr.cid.get()}`)
}

server.route([
  {
    method: '*',
    path: '/response',
    handler (req, reply) {
      another()
      reply(`correlation id: ${req.cid}`)
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
    correlator: true
  }
})
.then(() => server.start())
.catch(console.error)
