const test = require('ava')
const spawn = require('child_process').spawn
const path = require('path')
const helpers = require('./_helpers')
const laabr = require('../src')

let consoleClone

test.beforeEach('setup interceptor', (t) => {
  consoleClone = Object.assign({}, console)
})

test.afterEach.always('cleanup interceptor', (t) => {
  Object.assign(console, consoleClone)
})

test.cb.serial('listen to `request` event', (t) => {
  const options = {
    formats: { request: '{ reqId::requestId }'}
  }

  const injection = {
    method: 'GET',
    url: '/request/log'
  }

  helpers.spawn('inject', options, injection, (log) => {
    t.truthy(log)
    t.truthy(log.reqId)
    t.regex(log.reqId, /^\d+:.+:.+$/)
    t.end()
  })
})

test.cb.serial('listen to `response` event', (t) => {
  const options = {}

  const injection = {
    method: 'GET',
    url: '/response/200'
  }

  helpers.spawn('inject', options, injection, (log) => {
    t.truthy(log)
    t.truthy(log.includes('GET 127.0.0.1 /response/200 200 {}'))
    t.end()
  })
})

test.cb.serial('listen to `response` event – post', (t) => {
  const options = {}

  const injection = {
    method: 'POST',
    url: '/response/204',
    payload: {
      foo: 42
    }
  }

  helpers.spawn('inject', options, injection, (log) => {
    t.truthy(log)
    t.truthy(log.includes('POST 127.0.0.1 /response/204 204 {"foo":42}'))
    t.end()
  })
})

test.cb.serial('listen to `request-error` event', (t) => {
  const options = {}

  const injection = {
    method: 'GET',
    url: '/request/error'
  }

  helpers.spawn('inject', options, injection, (log) => {
    t.is(log.error, 'foobar')
    t.truthy(log.timestamp)
    t.is(log.level, 'warn')
    t.is(log.environment, 'test')
    t.end()
  })
})

test.cb.serial('listen to `response` event – customized', (t) => {
  const options = {
    formats: { response: ':get[req.headers]' }
  }

  const injection = {
    method: 'GET',
    url: '/response/200'
  }

  helpers.spawn('inject', options, injection, (log) => {
    t.is(log['user-agent'], 'shot')
    t.is(log.host, '127.0.0.1:1337')
    t.end()
  })
})

test.cb.serial('listen to `caught` event', (t) => {
  const options = { handleUncaught: true }

  const injection = {}

  helpers.spawn('error', options, injection, (log) => {
    t.is(log.error, 'foobar')
    t.is(log.level, 'error')
    t.regex(log.source, new RegExp(`^${path.join(__dirname, 'fixtures/error.js')}:`))
    t.end()
  })
})

test.cb.serial('do not listen to `caught` event', (t) => {
  const options = { handleUncaught: false }

  const injection = {}

  helpers.spawn('error', options, injection, (log) => {
    t.regex(log, /throw new Error\('foobar'\)/)
    t.end()
  }, 'stderr')
})

test.cb.serial('listen to `response` event – customized/token', (t) => {
  const options = {
    formats: { response: ':hello' },
  }

  const injection = {
    method: 'GET',
    url: '/response/200'
  }

  helpers.spawn('token', options, injection, (log) => {
    t.regex(log, /^HI!/)
    t.end()
  })
})

test.cb.serial('listen to `response` event – preset', (t) => {
  const options = {
    formats: { response: 'test.env' },
    presets: { 'test.env': ':time :environment :method' }
  }

  const injection = {
    method: 'GET',
    url: '/response/200'
  }

  helpers.spawn('token', options, injection, (log) => {
    t.regex(log, /test GET/)
    t.end()
  })
})

test.cb.serial('listen to `response` event – no token', (t) => {
  const options = {
    formats: { response: ':foobar' }
  }

  const injection = {
    method: 'GET',
    url: '/response/200'
  }

  helpers.spawn('token', options, injection, (log) => {
    t.regex(log, /^:foobar/)
    t.end()
  })
})

test.cb.serial('listen to `response` event – no json token', (t) => {
  const options = {
    formats: { response: '{ foobar::foobar }' }
  }

  const injection = {
    method: 'GET',
    url: '/response/200'
  }

  helpers.spawn('token', options, injection, (log) => {
    t.is(log.foobar, ':foobar')
    t.end()
  })
})

test.cb.serial.only('listen to `response` event – no format', (t) => {
  const options = {
    formats: { response: false }
  }

  const injection = {
    method: 'GET',
    url: '/response/200'
  }

  helpers.spawn('token', options, injection, (log) => {
    t.is(log.level, 30)
    t.truthy(log.pid)
    t.truthy(log.hostname)
    t.end()
  })
})

test.cb.serial('listen to `onPostStart/onPostStop` events', (t) => {
  laabr.format('onPostStart', ':time :level :message :host[uri]')

  helpers.getServer(undefined, (server) => {
    server.start().then(() => {
      t.truthy(interceptOut.find('info server started http://127.0.0.1:1337'))

      server.stop({ timeout: 1000 }, () => {
        t.truthy(interceptOut.find('info server stopped'))
        t.end()
      })
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

  laabr.format('log', '{ tags::tags, message::message }')
  helpers.getServer({ indent: 0 }, (server) => {
    server.log(['info', 'foobar'], mockData)
    const result = JSON.parse(interceptOut.find('"message":{"foo":{"bar":42}}').string)

    t.truthy(result)
    t.deepEqual(result.message, mockData)
    t.deepEqual(result.tags, ['info', 'foobar'])
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

test.cb.serial('listen to `log` event – concat strings – backticks', (t) => {
  const mockData = 'foo'

  laabr.format('log', '{ message::message + `bar` }')
  helpers.getServer({ indent: 0 }, (server) => {
    server.log(['info'], mockData)
    const result = JSON.parse(interceptOut.find('"message":"foobar"').string)

    t.truthy(result)
    t.deepEqual(result.message, 'foobar')
    t.end()
  })
})

test.cb.serial('listen to `log` event – inline strings – backticks', (t) => {
  const mockData = 'foo'

  laabr.format('log', '{ message: [:message,`bar`] }')
  helpers.getServer({ indent: 0 }, (server) => {
    server.log(['info'], mockData)
    const result = JSON.parse(interceptOut.find('"message":["foo","bar"]').string)

    t.truthy(result)
    t.deepEqual(result.message, ['foo', 'bar'])
    t.end()
  })
})

test.cb.serial('listen to `log` event – concat strings – single quotes', (t) => {
  const mockData = 'foo'

  laabr.format('log', '{ message::message + \'bar\' }')
  helpers.getServer({ indent: 0 }, (server) => {
    server.log(['info'], mockData)
    const result = JSON.parse(interceptOut.find('"message":"foobar"').string)

    t.truthy(result)
    t.deepEqual(result.message, 'foobar')
    t.end()
  })
})

test.cb.serial('listen to `log` event – inline strings – single quotes', (t) => {
  const mockData = 'foo'

  laabr.format('log', '{ message: [:message,\'bar\'] }')
  helpers.getServer({ indent: 0 }, (server) => {
    server.log(['info'], mockData)
    const result = JSON.parse(interceptOut.find('"message":["foo","bar"]').string)

    t.truthy(result)
    t.deepEqual(result.message, ['foo', 'bar'])
    t.end()
  })
})

test.cb.serial('listen to `log` event – concat strings – double quotes', (t) => {
  const mockData = 'foo'

  laabr.format('log', '{ message::message + "bar" }')
  helpers.getServer({ indent: 0 }, (server) => {
    server.log(['info'], mockData)
    const result = JSON.parse(interceptOut.find('"message":"foobar"').string)

    t.truthy(result)
    t.deepEqual(result.message, 'foobar')
    t.end()
  })
})

test.cb.serial('listen to `log` event – inline strings – double quotes', (t) => {
  const mockData = 'foo'

  laabr.format('log', '{ message: [:message,"bar"] }')
  helpers.getServer({ indent: 0 }, (server) => {
    server.log(['info'], mockData)
    const result = JSON.parse(interceptOut.find('"message":["foo","bar"]').string)

    t.truthy(result)
    t.deepEqual(result.message, ['foo', 'bar'])
    t.end()
  })
})

test.cb.serial('preformat the originally logged message', (t) => {
  const mockData = 'foo'
  const preformatter = (data) => ({ foo: 'bar' })

  laabr.format('log', false)

  helpers.getServer({ preformatter, indent: 0 }, (server) => {
    server.log(['info'], mockData)
    const result = JSON.parse(interceptOut.find('"foo":"bar"').string)

    t.truthy(result)
    t.truthy(result.foo)
    t.deepEqual(result.foo, 'bar')
    t.deepEqual(Object.keys(result).sort(), ['foo'].sort())
    t.end()
  })
})

test.cb.serial('postformat the originally logged message', (t) => {
  const mockData = 'foo'
  const preformatter = (data) => ({ foo: 'bar' })
  const postformatter = (data) => (JSON.stringify({ bar: 'foo' }))

  laabr.format('log', false)

  helpers.getServer({ preformatter, postformatter, indent: 0 }, (server) => {
    server.log(['info'], mockData)
    const result = JSON.parse(interceptOut.find('"bar":"foo"').string)

    t.truthy(result)
    t.falsy(result.foo)
    t.truthy(result.bar)
    t.deepEqual(result.bar, 'foo')
    t.deepEqual(Object.keys(result).sort(), ['bar'].sort())
    t.end()
  })
})
