const test = require('ava')
const helpers = require('./_helpers')

test('throw error if plugin gets registered twice', (t) => {
  t.throws(() => helpers.registerPlugin(helpers.getServer()), Error)
})

test('throw error if own options are invalid – colored', (t) => {
  t.throws(() => helpers.getServer({
    colored: null
  }), Error)

  t.throws(() => helpers.getServer({
    colored: 42
  }), Error)

  t.throws(() => helpers.getServer({
    colored: ''
  }), Error)

  t.throws(() => helpers.getServer({
    colored: 'foobar'
  }), Error)

  t.throws(() => helpers.getServer({
    colored: NaN
  }), Error)

  t.throws(() => helpers.getServer({
    colored: {}
  }), Error)

  t.throws(() => helpers.getServer({
    colored: []
  }), Error)

  t.throws(() => helpers.getServer({
    colored: new RegExp()
  }), Error)
})

test('throw error if own options are invalid – indent', (t) => {
  t.throws(() => helpers.getServer({
    indent: null
  }), Error)

  t.throws(() => helpers.getServer({
    indent: false
  }), Error)

  t.throws(() => helpers.getServer({
    indent: NaN
  }), Error)

  t.throws(() => helpers.getServer({
    indent: {}
  }), Error)

  t.throws(() => helpers.getServer({
    indent: []
  }), Error)

  t.throws(() => helpers.getServer({
    indent: new RegExp()
  }), Error)
})

test('throws no error if own options are valid – colored', (t) => {
  t.notThrows(() => helpers.getServer({
    colored: true
  }), Error)
})

test('throws no error if own options are valid – indent', (t) => {
  t.notThrows(() => helpers.getServer({
    indent: 4
  }), Error)

  t.notThrows(() => helpers.getServer({
    indent: ''
  }), Error)

  t.notThrows(() => helpers.getServer({
    indent: '  '
  }), Error)
})

