const test = require('ava')
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
