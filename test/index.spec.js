const test = require('ava')
const helpers = require('./_helpers')
const laabr = require('../src')
let interceptor

test.beforeEach('setup interceptor', (t) => {
  interceptor = helpers.getInterceptor()
})

test.afterEach('cleanup interceptor', (t) => {
  interceptor.release()
})

test.cb.serial('listen to `onPostStart/onPostStop` events', (t) => {
  const server = helpers.getServer()

  server.start().then(() => {
    t.truthy(interceptor.find('info server started'))

    server.stop({ timeout: 1000 }, () => {
      t.truthy(interceptor.find('info server stopped'))
      t.end()
    })
  })
})

test.cb.serial('listen to `response` event', (t) => {
  const server = helpers.getServer()

  server.on('tail', () => {
    t.truthy(interceptor.find('GET 127.0.0.1 /response/200 200 {}'))
    t.end()
  })

  server.inject({
    method: 'GET',
    url: '/response/200'
  })
})

test.cb.serial('listen to `response` event – post', (t) => {
  const server = helpers.getServer()

  server.on('tail', () => {
    t.truthy(interceptor.find('POST 127.0.0.1 /response/204 204 {"foo":42}'))
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

test.cb.serial('listen to `request-error` event', (t) => {
  const server = helpers.getServer()

  server.on('tail', () => {
    const result = JSON.parse(interceptor.find('"error": "foobar"').string)

    t.is(result.error, 'foobar')
    t.truthy(result.timestamp)
    t.is(result.level, 'warn')
    t.is(result.environment, 'test')
    t.deepEqual(Object.keys(result).sort(), ['timestamp', 'error', 'level', 'environment'].sort())
    t.truthy(interceptor.find('GET 127.0.0.1 /requestError 500 {}'))

    t.end()
  })

  server.inject({
    method: 'GET',
    url: '/requestError'
  })
})

test('listen to `log` event', (t) => {
  const server = helpers.getServer({ indent: 0 })

  server.log('info', 'foobar')
  const result = JSON.parse(interceptor.find('"message":"foobar"').string)

  t.is(result.message, 'foobar')
  t.truthy(result.timestamp)
  t.is(result.level, 'info')
  t.is(result.environment, 'test')
  t.deepEqual(Object.keys(result).sort(), ['timestamp', 'message', 'level', 'environment'].sort())
})

test.cb.serial('listen to `response` event – customized', (t) => {
  laabr.format('response', ':get[req.headers]')
  const server = helpers.getServer()

  server.on('tail', () => {
    t.truthy(interceptor.find('{"user-agent":"shot","host":"127.0.0.1:1337"}'))
    t.end()
  })

  server.inject({
    method: 'GET',
    url: '/response/200'
  })
})

test.cb.serial('listen to `response` event – no token', (t) => {
  laabr.format('response', ':foobar')
  const server = helpers.getServer()

  server.on('tail', () => {
    t.truthy(interceptor.find(':foobar'))
    t.end()
  })

  server.inject({
    method: 'GET',
    url: '/response/200'
  })
})

test.cb.serial('listen to `response` event – no json token', (t) => {
  laabr.format('response', '({ foobar::foobar })')
  const server = helpers.getServer()

  server.on('tail', () => {
    t.truthy(interceptor.find('"foobar": ":foobar"'))
    t.end()
  })

  server.inject({
    method: 'GET',
    url: '/response/200'
  })
})

test.cb.serial('listen to `response` event – no format', (t) => {
  laabr.format('response', false)
  const server = helpers.getServer()

  server.on('tail', () => {
    const result = JSON.parse(interceptor.find('"msg": "request completed"').string)

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

test('listen to `log` event – customized', (t) => {
  const server = helpers.getServer({ indent: 0 })
  const mockData = {
    foo: {
      bar: 42
    }
  }

  server.log('info', mockData)
  const result = JSON.parse(interceptor.find('"message":{"foo":{"bar":42}}').string)

  t.truthy(result)
  t.deepEqual(result.message, mockData)
  t.truthy(result.timestamp)
  t.is(result.level, 'info')
  t.is(result.environment, 'test')
  t.deepEqual(Object.keys(result).sort(), ['timestamp', 'message', 'level', 'environment'].sort())
})
