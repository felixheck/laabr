const test = require('ava')
const validator = require('../src/validator')

test('return value if no validator is defined', (t) => {
  t.is(validator('foobar', 'foobar'), 'foobar')
})
