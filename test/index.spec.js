const test = require('ava')
const helpers = require('./_helpers')
const laabr = require('../src')

let consoleClone
let interceptOut
let interceptErr

test.beforeEach('setup interceptor', (t) => {
  consoleClone = Object.assign({}, console)
  interceptOut = helpers.getInterceptor()
  interceptErr = helpers.getInterceptor({ stream: process.stderr })
})

test.afterEach('cleanup interceptor', (t) => {
  Object.assign(console, consoleClone)
  helpers.disableInterceptor(interceptOut, interceptErr)
})

test.cb.serial('listen to `onPostStart/onPostStop` events', (t) => {
  laabr.format('onPostStart', ':time :level :message :host[uri]')

   helpers.getServer({}, (server) => {
    server.start().then(() => {
      t.truthy(interceptOut.find('info server started http://127.0.0.1:1337'))

      server.stop({ timeout: 1000 }, () => {
        t.truthy(interceptOut.find('info server stopped'))
        t.end()
      })
    })
   })
})

test.cb.serial('listen to `response` event', (t) => {
  helpers.getServer({}, (server) => {
    server.on('tail', () => {
      t.truthy(interceptOut.find('GET 127.0.0.1 /response/200 200 {}'))
      t.end()
    })

    server.inject({
      method: 'GET',
      url: '/response/200'
    })
  })
})

test.cb.serial('listen to `response` event – post', (t) => {
  helpers.getServer({}, (server) => {
    server.on('tail', () => {
      t.truthy(interceptOut.find('POST 127.0.0.1 /response/204 204 {"foo":42}'))
      t.end()
    })

    server.inject({
      method: 'POST',
      url: '/response/204',
      payload: {
        foo: 42
      }
    })
  })
})

test.cb.serial('listen to `request-error` event', (t) => {
  helpers.getServer({}, (server) => {
    server.on('tail', () => {
      const result = JSON.parse(interceptOut.find('"error": "foobar"').string)

      t.is(result.error, 'foobar')
      t.truthy(result.timestamp)
      t.is(result.level, 'warn')
      t.is(result.environment, 'test')
      t.deepEqual(Object.keys(result).sort(), ['timestamp', 'error', 'level', 'environment'].sort())
      t.truthy(interceptOut.find('GET 127.0.0.1 /requestError 500 {}'))

      t.end()
    })

    server.inject({
      method: 'GET',
      url: '/requestError'
    })
  })
})

test.cb.serial('listen to `log` event', (t) => {
  helpers.getServer({ indent: 0 }, (server) => {
    server.log('info', 'foobar')
    const result = JSON.parse(interceptOut.find('"message":"foobar"').string)

    t.is(result.message, 'foobar')
    t.truthy(result.timestamp)
    t.is(result.level, 'info')
    t.is(result.environment, 'test')
    t.deepEqual(Object.keys(result).sort(), ['timestamp', 'message', 'level', 'environment'].sort())
    t.end()
  })
})

test.cb.serial('listen to `response` event – customized', (t) => {
  laabr.format('response', ':get[req.headers]')

  helpers.getServer({}, (server) => {
    server.on('tail', () => {
      t.truthy(interceptOut.find('{"user-agent":"shot","host":"127.0.0.1:1337"}'))
      t.end()
    })

    server.inject({
      method: 'GET',
      url: '/response/200'
    })
  })
})

test.cb.serial('listen to `response` event – preset', (t) => {
  laabr.preset('test.env', ':time :environment :method')
  laabr.format('response', 'test.env')

  helpers.getServer({}, (server) => {
    server.on('tail', () => {
      t.truthy(interceptOut.find('test GET'))
      t.end()
    })

    server.inject({
      method: 'GET',
      url: '/response/200'
    })
  })
})

test.cb.serial('listen to `response` event – no token', (t) => {
  laabr.format('response', ':foobar')

  helpers.getServer({}, (server) => {
    server.on('tail', () => {
      t.truthy(interceptOut.find(':foobar'))
      t.end()
    })

    server.inject({
      method: 'GET',
      url: '/response/200'
    })
  })
})

test.cb.serial('listen to `response` event – no json token', (t) => {
  laabr.format('response', '({ foobar::foobar })')

  helpers.getServer({}, (server) => {
    server.on('tail', () => {
      t.truthy(interceptOut.find('"foobar": ":foobar"'))
      t.end()
    })

    server.inject({
      method: 'GET',
      url: '/response/200'
    })
  })
})

test.cb.serial('listen to `response` event – no format', (t) => {
  laabr.format('response', false)

  const server = helpers.getServer({}, (server) => {
    server.on('tail', () => {
      const result = JSON.parse(interceptOut.find('"msg": "request completed"').string)

      t.truthy(result)
      t.is(result.level, 30)
      t.truthy(result.pid)
      t.truthy(result.hostname)
      t.end()
    })

    server.inject({
      method: 'GET',
      url: '/response/200'
    })
  })
})

test.cb.serial('listen to `log` event – customized', (t) => {
  const mockData = {
    foo: {
      bar: 42
    }
  }

  helpers.getServer({ indent: 0 }, (server) => {
    server.log('info', mockData)
    const result = JSON.parse(interceptOut.find('"message":{"foo":{"bar":42}}').string)

    t.truthy(result)
    t.deepEqual(result.message, mockData)
    t.truthy(result.timestamp)
    t.is(result.level, 'info')
    t.is(result.environment, 'test')
    t.deepEqual(Object.keys(result).sort(), ['timestamp', 'message', 'level', 'environment'].sort())
    t.end()
  })
})

test.cb.serial('listen to `log` event – multiple tags', (t) => {
  const mockData = {
    foo: {
      bar: 42
    }
  }

  laabr.format('log', '({ tags::tags, message::message })')
  helpers.getServer({ indent: 0 }, (server) => {
    server.log(['info', 'foobar'], mockData)
    const result = JSON.parse(interceptOut.find('"message":{"foo":{"bar":42}}').string)

    t.truthy(result)
    t.deepEqual(result.message, mockData)
    t.deepEqual(result.tags, ['info', 'foobar'])
    t.end()
  })
})

test.cb.serial('get deprecation messages because of deprecating options', (t) => {
  helpers.getServer({ indent: 0, plugin: {} }, () => {
    t.truthy(interceptErr.find('`options.plugin` will be deprecated soon. Use `options.hapiPino` instead'))
    t.end()
  })
})

test.cb.serial('get log message by overriden `console.warn` – single', (t) => {
  helpers.getServer({ indent: 0, override: true }, () => {
    console.warn('foobar')
    t.truthy(interceptOut.find('"message":"foobar"'))
    t.end()
  })
})

test.cb.serial('get log message by overriden `console.warn` – multiple', (t) => {
  helpers.getServer({ indent: 0, override: true }, () => {
    console.warn('foo', 'bar')

    t.truthy(interceptOut.find('"message":["foo","bar"]'))
    t.end()
  })
})
