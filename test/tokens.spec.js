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
  t.throws(() => laabr.token(null, () => 42))
  t.throws(() => laabr.token(false, () => 42))
  t.throws(() => laabr.token(NaN, () => 42))
  t.throws(() => laabr.token(42, () => 42))
  t.throws(() => laabr.token('', () => 42))
  t.throws(() => laabr.token({}, () => 42))
  t.throws(() => laabr.token([], () => 42))
  t.throws(() => laabr.token(new RegExp(), () => 42))
})

test('throw error if token arguments are invalid – token', (t) => {
  t.throws(() => laabr.token('foobar', null))
  t.throws(() => laabr.token('foobar', false))
  t.throws(() => laabr.token('foobar', NaN))
  t.throws(() => laabr.token('foobar', 42))
  t.throws(() => laabr.token('foobar', ''))
  t.throws(() => laabr.token('foobar', 'foobar'))
  t.throws(() => laabr.token('foobar', {}))
  t.throws(() => laabr.token('foobar', []))
  t.throws(() => laabr.token('foobar', new RegExp()))
  t.throws(() => laabr.token('foobar', (a, b, c, d) => 42))
})

test('throw no error if token arguments are valid', (t) => {
  t.notThrows(() => laabr.token('foobar', () => 42))
  t.is(tokens.foobar(), 42)
})

test('return requested general attributes', (t) => {
  const mockData = {
    pid: 52818,
    tags: ['foobar'],
    host: 'localhost',
    port: 3000,
    uri: 'http://localhost:3000',
    address: '127.0.0.1',
    protocol: 'http',
    level: 60,
    time: 971186136,
    responseTime: 42,
    foo: 42,
    bar: {
      foo: 42
    },
    msg: 'foobar',
    err: new Error('foobar')
  }

  process.env.FOO = 'bar'

  t.is(tokens.pid(mockData), mockData.pid)
  t.is(tokens.tags(mockData), mockData.tags)
  t.is(tokens.level(mockData, mockColors), 'fatal')
  t.is(tokens.level(mockData, mockColors, 'code'), 60)
  t.is(tokens.time(mockData, mockColors), mockData.time)
  t.is(tokens.time(mockData, mockColors, 'iso'), '1970-01-12T05:46:26.136Z')
  t.is(tokens.time(mockData, mockColors, 'utc'), 'Mon, 12 Jan 1970 05:46:26 GMT')
  t.is(tokens.responseTime(mockData), mockData.responseTime)
  t.is(tokens.get(mockData, mockColors, 'foo'), mockData.foo)
  t.is(tokens.get(mockData, mockColors, 'bar'), mockData.bar)
  t.is(tokens.message(mockData), mockData.msg)
  t.is(tokens.error(mockData), mockData.err.message)
  t.is(tokens.error({ data: mockData }), mockData.err.message)
  t.is(tokens.host(mockData), mockData.host)
  t.is(tokens.host(mockData, mockColors, 'uri'), mockData.uri)
  t.is(tokens.host(mockData, mockColors, 'address'), mockData.address)
  t.is(tokens.host(mockData, mockColors, 'port'), mockData.port)
  t.is(tokens.host(mockData, mockColors, 'protocol'), mockData.protocol)
  t.is(tokens.host(mockData, mockColors, 'foo'), undefined)
  t.is(tokens.environment(), 'test')
  t.is(tokens.environment(mockData, mockColors, 'FOO'), 'bar')
  t.is(tokens.res(mockData, mockColors, 'foo'), undefined)
})

test('return empty array in case of no tags', (t) => {
  const mockData = {}

  t.deepEqual(tokens.tags(mockData), [])
})

test('return requested alternative attributes', (t) => {
  const mockData = {
    data: 'foobar'
  }

  t.is(tokens.message(mockData), mockData.data)
  t.is(tokens.error(mockData), undefined)
})

test('return requested req/res attributes', (t) => {
  const mockData = {
    res: {
      statusCode: 200,
      headers: {
        foobar: 'no-cache',
        barfoo: '42'
      }
    },
    req: {
      id: '1499781055994:f3lix:67067:j4zmw7av:10000',
      method: 'get',
      url: '/',
      remoteAddress: '127.0.0.1',
      remotePort: 52086,
      headers: {
        'x-header': 'foobar'
      }
    }
  }

  t.is(tokens.requestId(mockData), mockData.req.id)
  t.is(tokens.method(mockData, mockColors), mockData.req.method.toUpperCase())
  t.is(tokens.status(mockData, mockColors), mockData.res.statusCode)
  t.is(tokens.payload(mockData), JSON.stringify({}))
  t.is(tokens.remoteAddress(mockData), mockData.req.remoteAddress)
  t.is(tokens.remotePort(mockData), mockData.req.remotePort)
  t.is(tokens.url(mockData), mockData.req.url)
  t.is(tokens.req(mockData, mockColors, 'x-header'), mockData.req.headers['x-header'])
  t.is(tokens.res(mockData, mockColors, 'foobar'), 'no-cache')
  t.is(tokens.res(mockData, mockColors, 'barfoo'), '42')
  t.is(tokens.res(mockData, mockColors, 'foo'), undefined)
})
