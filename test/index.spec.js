const test = require('ava')
const path = require('path')
const helpers = require('./_helpers')

let consoleClone

test.beforeEach((t) => {
  consoleClone = Object.assign({}, console)
})

test.afterEach.always((t) => {
  Object.assign(console, consoleClone)
})

test.serial.cb('listen to `request` event', (t) => {
  const options = {
    formats: { request: '{ reqId::requestId }' }
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

test.serial.cb('listen to `response` event', (t) => {
  const options = {}

  const injection = {
    method: 'GET',
    url: '/response/200',
    remoteAddress: '127.0.0.1'
  }

  helpers.spawn('inject', options, injection, (log) => {
    t.truthy(log)
    t.truthy(log.includes('GET 127.0.0.1 http://127.0.0.1:1338/response/200 200 {}'))
    t.end()
  })
})

test.serial.cb('listen to `response` event – post', (t) => {
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
    t.truthy(log.includes('POST 127.0.0.1 http://127.0.0.1:1338/response/204 204 {"foo":42}'))
    t.end()
  })
})

test.serial.cb('listen to `response` event – buffer', (t) => {
  const options = {}

  const injection = {
    method: 'POST',
    url: '/response/buffer',
    payload: {
      foo: 42
    }
  }

  helpers.spawn('inject', options, injection, (log) => {
    t.truthy(log)
    t.truthy(log.includes('POST 127.0.0.1 http://127.0.0.1:1338/response/buffer 200 {"foo":42}'))
    t.end()
  })
})

test.serial.cb('listen to `response` event – readable stream', (t) => {
  const options = {}

  const injection = {
    method: 'POST',
    url: '/response/stream',
    payload: {
      foo: 42
    }
  }

  helpers.spawn('inject', options, injection, (log) => {
    t.truthy(log)
    t.truthy(log.includes('POST 127.0.0.1 http://127.0.0.1:1338/response/stream 200 [Readable]'))
    t.end()
  })
})

test.serial.cb('listen to `request-error` event', (t) => {
  const options = {}

  const injection = {
    method: 'GET',
    url: '/request/error'
  }

  helpers.spawn('inject', options, injection, (log) => {
    t.is(log.error, 'foobar')
    t.truthy(log.timestamp)
    t.is(log.level, 'error')
    t.is(log.environment, 'test')
    t.end()
  })
})

test.serial.cb('listen to `response` event – customized', (t) => {
  const options = {
    formats: { response: ':get[req.headers]' }
  }

  const injection = {
    method: 'GET',
    url: '/response/200'
  }

  helpers.spawn('inject', options, injection, (log) => {
    t.is(log['user-agent'], 'shot')
    t.is(log.host, '127.0.0.1:1338')
    t.end()
  })
})

test.serial.cb('listen to `response` event – customized/token', (t) => {
  const options = {
    formats: { response: ':hello' }
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

test.serial.cb('listen to `response` event – preset', (t) => {
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

test.serial.cb('listen to `response` event – no token', (t) => {
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

test.serial.cb('listen to `response` event – no json token', (t) => {
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

test.serial.cb('listen to `response` event – no format', (t) => {
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

test.serial.cb('listen to `onPostStart` events', (t) => {
  const options = {
    formats: { onPostStart: ':time :level :message :host[uri]' },
    hapiPino: { logEvents: ['onPostStart'] }
  }

  const injection = {}

  helpers.spawn('startStop', options, injection, (log) => {
    t.regex(log, /info server started http:\/\/127.0.0.1:1338/)
    t.end()
  })
})

test.serial.cb('listen to `onPostStop` events', (t) => {
  const options = {
    formats: { onPostStart: ':time :level :message :host[uri]' },
    hapiPino: { logEvents: ['onPostStop'] }
  }

  const injection = {}

  helpers.spawn('startStop', options, injection, (log) => {
    console.log(log)

    t.regex(log, /info server stopped/)
    t.end()
  })
})

test.serial.cb('listen to `log` event', (t) => {
  const options = {
    formats: { onPostStart: ':time :level :message :host[uri]' },
    hapiPino: { logEvents: false }
  }

  const logs = {
    tags: 'info',
    value: ['foobar']
  }

  helpers.spawn('log', options, logs, (log) => {
    t.is(log.message, 'foobar')
    t.truthy(log.timestamp)
    t.is(log.level, 'info')
    t.is(log.environment, 'test')
    t.end()
  })
})

test.serial.cb('listen to `log` event – customized', (t) => {
  const options = {
    indent: 0,
    hapiPino: { logEvents: false }
  }

  const logs = {
    tags: 'info',
    value: [{
      foo: {
        bar: 42
      }
    }]
  }

  helpers.spawn('log', options, logs, (log) => {
    t.deepEqual(log.message, logs.value[0])
    t.truthy(log.timestamp)
    t.is(log.level, 'info')
    t.is(log.environment, 'test')
    t.end()
  })
})

test.serial.cb('listen to `log` event – multiple tags', (t) => {
  const options = {
    indent: 0,
    formats: { log: '{ tags::tags, message::message }' },
    hapiPino: { logEvents: false }
  }

  const logs = {
    tags: ['info', 'foobar'],
    value: [{
      foo: {
        bar: 42
      }
    }]
  }

  helpers.spawn('log', options, logs, (log) => {
    t.deepEqual(log.message, logs.value[0])
    t.deepEqual(log.tags, ['info', 'foobar'])
    t.end()
  })
})

test.serial.cb('listen to `log` event – concat strings – backticks', (t) => {
  const options = {
    indent: 0,
    formats: { log: '{ message::message + `bar` }' },
    hapiPino: { logEvents: false }
  }

  const logs = {
    tags: ['info'],
    value: ['foobar']
  }

  helpers.spawn('log', options, logs, (log) => {
    t.is(log.message, 'foobarbar')
    t.end()
  })
})

test.serial.cb('listen to `log` event – inline strings – backticks', (t) => {
  const options = {
    indent: 0,
    formats: { log: '{ message: [:message,`bar`] }' },
    hapiPino: { logEvents: false }
  }

  const logs = {
    tags: ['info'],
    value: ['foo']
  }

  helpers.spawn('log', options, logs, (log) => {
    t.deepEqual(log.message, ['foo', 'bar'])
    t.end()
  })
})

test.serial.cb('listen to `log` event – concat strings – single quotes', (t) => {
  const options = {
    indent: 0,
    formats: { log: '{ message::message + \'bar\' }' },
    hapiPino: { logEvents: false }
  }

  const logs = {
    tags: ['info'],
    value: ['foo']
  }

  helpers.spawn('log', options, logs, (log) => {
    t.is(log.message, 'foobar')
    t.end()
  })
})

test.serial.cb('listen to `log` event – inline strings – single quotes', (t) => {
  const options = {
    indent: 0,
    formats: { log: '{ message: [:message,\'bar\'] }' },
    hapiPino: { logEvents: false }
  }

  const logs = {
    tags: ['info'],
    value: ['foo']
  }

  helpers.spawn('log', options, logs, (log) => {
    t.deepEqual(log.message, ['foo', 'bar'])
    t.end()
  })
})

test.serial.cb('listen to `log` event – concat strings – double quotes', (t) => {
  const options = {
    indent: 0,
    formats: { log: '{ message::message + "bar" }' },
    hapiPino: { logEvents: false }
  }

  const logs = {
    tags: ['info'],
    value: ['foo']
  }

  helpers.spawn('log', options, logs, (log) => {
    t.is(log.message, 'foobar')
    t.end()
  })
})

test.serial.cb('listen to `log` event – inline strings – double quotes', (t) => {
  const options = {
    indent: 0,
    formats: { log: '{ message: [:message,"bar"] }' },
    hapiPino: { logEvents: false }
  }

  const logs = {
    tags: ['info'],
    value: ['foo']
  }

  helpers.spawn('log', options, logs, (log) => {
    t.deepEqual(log.message, ['foo', 'bar'])
    t.end()
  })
})

test.serial.cb('preformat the originally logged message', (t) => {
  const options = {
    indent: 0,
    formats: { log: false },
    hapiPino: { logEvents: false }
  }

  const logs = {
    tags: ['info'],
    value: ['foo']
  }

  helpers.spawn('preformatter', options, logs, (log) => {
    t.truthy(log.foo)
    t.deepEqual(log.foo, 'bar')
    t.end()
  })
})

test.serial.cb('postformat the originally logged message', (t) => {
  const options = {
    indent: 0,
    formats: { log: false },
    hapiPino: { logEvents: false }
  }

  const logs = {
    tags: ['info'],
    value: ['foo']
  }

  helpers.spawn('postformatter', options, logs, (log) => {
    t.falsy(log.foo)
    t.truthy(log.bar)
    t.deepEqual(log.bar, 'foo')
    t.end()
  })
})

test.serial.cb('get log message by overriden `console.warn` – single', (t) => {
  const options = {
    indent: 0,
    override: true,
    hapiPino: { logEvents: false }
  }

  const logs = ['foobar']

  helpers.spawn('console', options, logs, (log) => {
    t.is(log.message, 'foobar')
    t.end()
  })
})

test.serial.cb('get log message by overriden `console.warn` – multiple', (t) => {
  const options = {
    indent: 0,
    override: true,
    hapiPino: { logEvents: false }
  }

  const logs = ['foo', 'bar']

  helpers.spawn('console', options, logs, (log) => {
    t.deepEqual(log.message, ['foo', 'bar'])
    t.end()
  })
})

test.serial.cb('listen to `caught` event', (t) => {
  const options = { handleUncaught: true }

  helpers.spawn('error', options, true, (log) => {
    t.is(log.error, 'foobar')
    t.is(log.level, 'error')
    t.regex(log.source, new RegExp(`^${path.join(__dirname, 'fixtures/error.js')}:`))
    t.end()
  })
})

test.serial.cb('listen to `caught` event – invalid error', (t) => {
  const options = { handleUncaught: true }

  helpers.spawn('error', options, false, (log) => {
    t.is(log.error, '-')
    t.is(log.level, 'error')
    t.is(log.source, '-')
    t.end()
  })
})

test.serial.cb('do not listen to `caught` event', (t) => {
  const options = { handleUncaught: false }

  helpers.spawn('error', options, true, (log) => {
    t.regex(log, /throw new Error\('foobar'\)/)
    t.end()
  }, 'stderr')
})
