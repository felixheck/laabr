const test = require('ava')
const helpers = require('./_helpers')
const laabr = require('../src')

let consoleClone

test.beforeEach('setup interceptor', (t) => {
  consoleClone = Object.assign({}, console)
})

test.afterEach.always('cleanup interceptor', (t) => {
  Object.assign(console, consoleClone)
})

test.cb.serial('correlator is not exposed – laabr', (t) => {
  helpers.getServer({ correlator: false }, () => {
    t.falsy(laabr.cid)
    t.end()
  })
})

test.cb.serial('correlator is exposed – laabr', (t) => {
  helpers.getServer({ correlator: true }, () => {
    t.truthy(laabr.cid)
    t.truthy(laabr.cid.get)
    t.truthy(laabr.cid.with)
    t.truthy(laabr.cid.bind)
    t.end()
  })
})

test.cb.serial('correlator is not exposed – server.app', (t) => {
  helpers.getServer({ correlator: false }, (server) => {
    t.falsy(server.app.cid)
    t.end()
  })
})

test.cb.serial('correlator is exposed – server.app', (t) => {
  helpers.getServer({ correlator: true }, (server) => {
    t.truthy(server.app.cid)
    t.truthy(server.app.cid.get)
    t.truthy(server.app.cid.with)
    t.truthy(server.app.cid.bind)
    t.end()
  })
})

test.cb.serial('correlator is not exposed – server.cid', (t) => {
  helpers.getServer({ correlator: false }, (server) => {
    t.falsy(server.cid)
    t.end()
  })
})

test.cb.serial('correlator is exposed – server.cid', (t) => {
  helpers.getServer({ correlator: true }, (server) => {
    t.truthy(server.cid)
    t.truthy(server.cid.get)
    t.truthy(server.cid.with)
    t.truthy(server.cid.bind)
    t.end()
  })
})

test.cb.serial('CID is the same even in other function', (t) => {
  helpers.getServer({ correlator: true }, (server) => {
    server.on('tail', () => {
      const [log1, log2] = interceptOut.filter('cid')

      t.truthy(log1)
      t.truthy(log2)
      t.is(log1, log2)
      t.end()
    })

    server.inject({
      method: 'GET',
      url: '/request/id'
    })
  })
})

test.cb.serial('CID is the same even in other function – `response` event', (t) => {
  laabr.format('response', 'cid :cid')
  helpers.getServer({ correlator: true }, (server) => {
    server.on('tail', () => {
      const [log1, log2, log3] = interceptOut.filter('cid')

      t.truthy(log1)
      t.truthy(log2)
      t.truthy(log3)
      t.is(log1, log2)
      t.is(log1, log3)
      t.is(log2, log3)
      t.end()
    })

    server.inject({
      method: 'GET',
      url: '/request/id'
    })
  })
})

test.cb.serial('CID is the same even in other function – req.headers["x-laabr-cid"]', (t) => {
  helpers.getServer({ correlator: true }, (server) => {
    server.on('tail', () => {
      const [log1, log2] = interceptOut.filter('cid')

      t.truthy(log1)
      t.truthy(log2)
      t.is(log1, log2)
      t.end()
    })

    server.inject({
      method: 'GET',
      url: '/request/id/req'
    })
  })
})

test.cb.serial('CID is not the same because of `with`', (t) => {
  helpers.getServer({ correlator: true }, (server) => {
    server.on('tail', () => {
      const [log1, log2] = interceptOut.filter('cid')

      t.truthy(log1)
      t.truthy(log2)
      t.not(log1, log2)
      t.end()
    })

    server.inject({
      method: 'GET',
      url: '/request/id/next'
    })
  })
})

test.cb.serial('use the unset `x-correlation-id` header', (t) => {
  helpers.getServer({ correlator: true }, (server) => {
    server.on('tail', () => {
      const [log1, log2] = interceptOut.filter('cid')

      t.truthy(log1)
      t.truthy(log2)
      t.is(log1, log2)
      t.regex(log1, /^cid \d+:.+:.+\n$/)
      t.regex(log2, /^cid \d+:.+:.+\n$/)
      t.end()
    })

    server.inject({
      method: 'GET',
      url: '/request/id'
    })
  })
})

test.cb.serial('use the set `x-correlation-id` header', (t) => {
  helpers.getServer({ correlator: true }, (server) => {
    server.on('tail', () => {
      const [log1, log2] = interceptOut.filter('cid')

      t.truthy(log1)
      t.truthy(log2)
      t.is(log1, log2)
      t.is(log1, 'cid foobar\n')
      t.is(log2, 'cid foobar\n')
      t.end()
    })

    server.inject({
      method: 'GET',
      url: '/request/id',
      headers: {
        'x-correlation-id': 'foobar'
      }
    })
  })
})

test.cb.serial('use a set custom header', (t) => {
  helpers.getServer({ correlator: { enabled: true, header: 'x-foobar-id' } }, (server) => {
    server.on('tail', () => {
      const [log1, log2] = interceptOut.filter('cid')

      t.truthy(log1)
      t.truthy(log2)
      t.is(log1, log2)
      t.is(log1, 'cid foobar\n')
      t.is(log2, 'cid foobar\n')
      t.end()
    })

    server.inject({
      method: 'GET',
      url: '/request/id',
      headers: {
        'x-foobar-id': 'foobar'
      }
    })
  })
})
