const test = require('ava')
const helpers = require('./_helpers')
const laabr = require('../src')

let consoleClone

test.beforeEach((t) => {
  consoleClone = Object.assign({}, console)
})

test.afterEach.always((t) => {
  Object.assign(console, consoleClone)
})

test.serial('correlator is not exposed – laabr', async (t) => {
  await helpers.getServer({ correlator: false })

  t.falsy(laabr.cid)
})

test.serial('correlator is exposed – laabr', async (t) => {
  helpers.getServer({ correlator: true })

  t.truthy(laabr.cid)
  t.truthy(laabr.cid.get)
  t.truthy(laabr.cid.with)
  t.truthy(laabr.cid.bind)
})

test.serial('correlator is not exposed – server.app', async (t) => {
  const server = await helpers.getServer({ correlator: false })

  t.falsy(server.app.cid)
})

test.serial('correlator is not exposed – server.cid', async (t) => {
  const server = await helpers.getServer({ correlator: false })

  t.falsy(server.cid)
})

test.serial('correlator is exposed – server.cid', async (t) => {
  const server = await helpers.getServer({ correlator: true })

  t.truthy(server.cid)
  t.truthy(server.cid.get)
  t.truthy(server.cid.with)
  t.truthy(server.cid.bind)
})

// test.cb.serial('CID is the same even in other function', (t) => {
//   const options = {
//     correlator: true,
//     hapiPino: { logEvents: false }
//   }

//   const injection = {
//     method: 'GET',
//     url: '/request/id'
//   }

//   let log1

//   helpers.spawn('inject', options, injection, (log) => {
//     t.truthy(log)

//     if (!log1) {
//       log1 = log
//     } else {
//       t.is(log1, log)
//       t.end()
//     }
//   }, undefined, 'on')
// })

// test.cb.serial('CID is the same even in other function – `response` event', (t) => {
//   const options = {
//     correlator: true,
//     formats: { response: 'cid :cid' }
//   }

//   const injection = {
//     method: 'GET',
//     url: '/request/id'
//   }

//   let log1
//   let log2

//   helpers.spawn('inject', options, injection, (log) => {
//     t.truthy(log)

//     if (!log1) {
//       log1 = log
//     } else if (!log2) {
//       log2 = log
//     } else {
//       t.is(log1, log2)
//       t.is(log1, log)
//       t.is(log2, log)
//       t.end()
//     }
//   }, undefined, 'on')
// })

// test.cb.serial('CID is the same even in other function – req.headers["x-laabr-cid"]', (t) => {
//   const options = { correlator: true }

//   const injection = {
//     method: 'GET',
//     url: '/request/id/req'
//   }

//   let log1

//   helpers.spawn('inject', options, injection, (log) => {
//     t.truthy(log)

//     if (!log1) {
//       log1 = log
//     } else {
//       t.is(log1, log)
//       t.end()
//     }
//   }, undefined, 'on')
// })

// test.cb.serial('CID is not the same because of `with`', (t) => {
//   const options = { correlator: true }

//   const injection = {
//     method: 'GET',
//     url: '/request/id/next'
//   }

//   let log1

//   helpers.spawn('inject', options, injection, (log) => {
//     t.truthy(log)

//     if (!log1) {
//       log1 = log
//     } else {
//       t.not(log1, log)
//       t.end()
//     }
//   }, undefined, 'on')
// })

// test.cb.serial('use the unset `x-correlation-id` header', (t) => {
//   const options = { correlator: true }

//   const injection = {
//     method: 'GET',
//     url: '/request/id'
//   }

//   let log1

//   helpers.spawn('inject', options, injection, (log) => {
//     t.truthy(log)
//     t.regex(log, /^cid \d+:.+:.+/)

//     if (!log1) {
//       log1 = log
//     } else {
//       t.is(log1, log)
//       t.end()
//     }
//   }, undefined, 'on')
// })

// test.cb.serial('use the set `x-correlation-id` header', (t) => {
//   const options = { correlator: true }

//   const injection = {
//     method: 'GET',
//     url: '/request/id',
//     headers: {
//       'x-correlation-id': 'foobar'
//     }
//   }

//   let log1

//   helpers.spawn('inject', options, injection, (log) => {
//     t.truthy(log)
//     t.regex(log, /^cid foobar/)

//     if (!log1) {
//       log1 = log
//     } else {
//       t.is(log1, log)
//       t.end()
//     }
//   }, undefined, 'on')
// })

// test.cb.serial('use a set custom header', (t) => {
//   const options = {
//     correlator: {
//       enabled: true,
//       header: 'x-foobar-id'
//     }
//   }

//   const injection = {
//     method: 'GET',
//     url: '/request/id',
//     headers: {
//       'x-foobar-id': 'foobar'
//     }
//   }

//   let log1

//   helpers.spawn('inject', options, injection, (log) => {
//     t.truthy(log)
//     t.regex(log, /^cid foobar/)

//     if (!log1) {
//       log1 = log
//     } else {
//       t.is(log1, log)
//       t.end()
//     }
//   }, undefined, 'on')
// })
