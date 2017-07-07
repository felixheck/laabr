const test = require('ava')
const helpers = require('./_helpers')
const laabr = require('../src')
const tokens = require('../src/tokens')

const mockColors = {
  level: helpers.noop,
  status: helpers.noop,
  dim: helpers.noop
}

test('throw error if token arguments are invalid – key', (t) => {
  t.throws(() => laabr.token(null, () => 42), Error)
  t.throws(() => laabr.token(false, () => 42), Error)
  t.throws(() => laabr.token(NaN, () => 42), Error)
  t.throws(() => laabr.token(42, () => 42), Error)
  t.throws(() => laabr.token('', () => 42), Error)
  t.throws(() => laabr.token({}, () => 42), Error)
  t.throws(() => laabr.token([], () => 42), Error)
  t.throws(() => laabr.token(new RegExp(), () => 42), Error)
})

test('throw error if token arguments are invalid – token', (t) => {
  t.throws(() => laabr.token('foobar', null), Error)
  t.throws(() => laabr.token('foobar', false), Error)
  t.throws(() => laabr.token('foobar', NaN), Error)
  t.throws(() => laabr.token('foobar', 42), Error)
  t.throws(() => laabr.token('foobar', ''), Error)
  t.throws(() => laabr.token('foobar', 'foobar'), Error)
  t.throws(() => laabr.token('foobar', {}), Error)
  t.throws(() => laabr.token('foobar', []), Error)
  t.throws(() => laabr.token('foobar', new RegExp()), Error)
  t.throws(() => laabr.token('foobar', (a, b, c, d) => 42), Error)
})

test('throws no error if token arguments are valid', (t) => {
  t.notThrows(() => laabr.token('foobar', () => 42), Error)
  t.is(tokens['foobar'](), 42)
})

test('return requested general attributes', (t) => {
  const mockData = {
    host: 'localhost',
    port: 3000,
    uri: 'http://localhost:3000',
    address: '127.0.0.1',
    level: 60,
    time: 971186136,
    responseTime: 42,
    foo: 42,
    bar: {
      foo: 42
    },
    msg: 'foobar',
    err: {
      message: 'error'
    }
  }

  t.is(tokens['level'](mockData, mockColors), 'fatal')
  t.is(tokens['level'](mockData, mockColors, 'code'), 60)
  t.is(tokens['time'](mockData, mockColors), mockData.time)
  t.is(tokens['time'](mockData, mockColors, 'iso'), '1970-01-12T05:46:26.136Z')
  t.is(tokens['time'](mockData, mockColors, 'utc'), 'Mon, 12 Jan 1970 05:46:26 GMT')
  t.is(tokens['responseTime'](mockData), mockData.responseTime)
  t.is(tokens['get'](mockData, mockColors, 'foo'), mockData.foo)
  t.is(tokens['get'](mockData, mockColors, 'bar'), mockData.bar)
  t.is(tokens['message'](mockData), mockData.msg)
  t.is(tokens['error'](mockData), mockData.err.message)
  t.is(tokens['host'](mockData), mockData.host)
  t.is(tokens['host'](mockData, mockColors, 'uri'), mockData.uri)
  t.is(tokens['host'](mockData, mockColors, 'address'), mockData.address)
  t.is(tokens['host'](mockData, mockColors, 'port'), mockData.port)
  t.is(tokens['host'](mockData, mockColors, 'foo'), undefined)
  t.is(tokens['environment'](), 'test')
})

test('return requested alternative attributes', (t) => {
  const mockData = {
    data: 'foobar'
  }

  t.is(tokens['message'](mockData), mockData.data)
})

test('return requested req/res attributes', (t) => {
  const mockData = {
    res: {
      statusCode: 200,
      header: '\r\nfoobar: no-cache\r\nbarfoo:42'
    },
    req: {
      method: 'get',
      url: '/',
      remoteAddress: '127.0.0.1',
      headers: {
        'x-header': 'foobar'
      }
    }
  }

  t.is(tokens['method'](mockData, mockColors), mockData.req.method)
  t.is(tokens['status'](mockData, mockColors), mockData.res.statusCode)
  t.is(tokens['payload'](mockData), JSON.stringify({}))
  t.is(tokens['remoteAddress'](mockData), mockData.req.remoteAddress)
  t.is(tokens['url'](mockData), mockData.req.url)
  t.is(tokens['req'](mockData, mockColors, 'x-header'), mockData.req.headers['x-header'])
  t.is(tokens['res'](mockData, mockColors, 'foobar'), 'no-cache')
  t.is(tokens['res'](mockData, mockColors, 'barfoo'), '42')
  t.is(tokens['res'](mockData, mockColors, 'foo'), undefined)
})
