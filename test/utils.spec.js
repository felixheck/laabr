const test = require('ava')
const helpers = require('./_helpers')
const utils = require('../src/utils')

test('return passed in value', (t) => {
  t.is(utils.noop('foobar'), 'foobar')
})

test('return `true` because of valid json-like string', (t) => {
  t.truthy(utils.isJSON('({foobar})'))
})

test('return `false` because of invalid json-like string', (t) => {
  t.false(utils.isJSON('{foobar}'))
  t.false(utils.isJSON('(foobar)'))
  t.false(utils.isJSON('{(foobar)}'))
})

test('return stringified value', (t) => {
  t.is(utils.stringify('foo-bar'), '"foo-bar"')
})

test('do not override `console` methods with `server.log`', (t) => {
  const consoleClone = Object.assign({}, console)
  const server = helpers.getServer({ override: false })

  t.is(consoleClone.trace, console.trace)
  t.is(consoleClone.log, console.log)
  t.is(consoleClone.info, console.info)
  t.is(consoleClone.warn, console.warn)
  t.is(consoleClone.error, console.error)

  Object.assign(console, consoleClone)
})
