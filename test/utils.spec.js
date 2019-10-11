const test = require('ava')
const helpers = require('./_helpers')
const utils = require('../src/utils')
const validator = require('../src/validator')

let consoleClone

test.beforeEach((t) => {
  consoleClone = Object.assign({}, console)
})

test.afterEach((t) => {
  Object.assign(console, consoleClone)
})

test('return passed in value', (t) => {
  t.is(utils.noop('foobar'), 'foobar')
})

test('return `true` because of valid json-like string', (t) => {
  t.truthy(utils.isJSON('{foobar}'))
})

test('return `false` because of invalid json-like string', (t) => {
  t.false(utils.isJSON('[foobar]'))
  t.false(utils.isJSON('(foobar)'))
})

test('return stringified value', (t) => {
  t.is(utils.stringify('foo-bar'), '"foo-bar"')
})

test.serial('do not override `console` methods with `server.log`', async (t) => {
  await helpers.getServer({ override: false })

  t.is(console.trace, consoleClone.trace)
  t.is(console.log, consoleClone.log)
  t.is(console.info, consoleClone.info)
  t.is(console.warn, consoleClone.warn)
  t.is(console.error, consoleClone.error)
})

test.serial('override `console` methods with `server.log`', async (t) => {
  await helpers.getServer({ override: true })

  t.not(console.trace, consoleClone.trace)
  t.not(console.log, consoleClone.log)
  t.not(console.info, consoleClone.info)
  t.not(console.warn, consoleClone.warn)
  t.not(console.error, consoleClone.error)
  t.not(console.debug, consoleClone.debug)
  t.is(console.trace.name, 'bound wrapper')
  t.is(console.log.name, 'bound wrapper')
  t.is(console.info.name, 'bound wrapper')
  t.is(console.warn.name, 'bound wrapper')
  t.is(console.error.name, 'bound wrapper')
  t.is(console.debug.name, 'bound wrapper')
})

test('get objectified error', (t) => {
  const result = utils.objectify(new Error('foobar'))

  t.truthy(result)
  t.truthy(result.stack)
  t.truthy(result.message)
  t.is(result.message, 'foobar')
})

test('get error its source', (t) => {
  t.regex(utils.getErrorSource(new Error('foobar')), new RegExp(`^${__filename}:\\d+:\\d+$`))
})

test('return value if no validator is defined', (t) => {
  t.is(validator('foobar', 'foobar'), 'foobar')
})
