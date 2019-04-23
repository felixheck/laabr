const hapi = require('@hapi/hapi')
const laabr = require('../src')

const server = hapi.server({ port: 3000 })

server.route([
  {
    method: '*',
    path: '/response',
    handler () {
      return 'hello world'
    }
  },
  {
    method: 'GET',
    path: '/error',
    handler () {
      throw new Error('foobar')
    }
  }
]);

(async () => {
  try {
    await server.register({
      plugin: laabr,
      options: {}
    })
    await server.start()
    console.log('Server started successfully')
  } catch (err) {
    console.error(err)
  }
})()

server.log('info', 'did you mean "foobar"?')
