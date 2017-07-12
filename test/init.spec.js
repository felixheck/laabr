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

test('throw error if own options are invalid – override', (t) => {
  t.throws(() => helpers.getServer({
    override: null
  }), Error)

  t.throws(() => helpers.getServer({
    override: 42
  }), Error)

  t.throws(() => helpers.getServer({
    override: ''
  }), Error)

  t.throws(() => helpers.getServer({
    override: 'foobar'
  }), Error)

  t.throws(() => helpers.getServer({
    override: NaN
  }), Error)

  t.throws(() => helpers.getServer({
    override: {}
  }), Error)

  t.throws(() => helpers.getServer({
    override: []
  }), Error)

  t.throws(() => helpers.getServer({
    override: new RegExp()
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

test('throw error if own options are invalid – preformatter', (t) => {
  t.throws(() => helpers.getServer({
    preformatter: (a, b) => ({ a, b })
  }), Error)

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

test('throw error if own options are invalid – postformatter', (t) => {
  t.throws(() => helpers.getServer({
    preformatter: (a, b) => ({ a, b })
  }), Error)

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

test('throw no error if own options are valid – colored', (t) => {
  t.notThrows(() => helpers.getServer({
    colored: true
  }), Error)
})

test('throw no error if own options are valid – override', (t) => {
  t.notThrows(() => helpers.getServer({
    override: true
  }), Error)
})

test('throw no error if own options are valid – indent', (t) => {
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

test('throw no error if own options are valid – preformatter', (t) => {
  t.notThrows(() => helpers.getServer({
    preformatter: () => ({ foo: 'bar' })
  }), Error)

  t.notThrows(() => helpers.getServer({
    preformatter: (a) => (a)
  }), Error)
})

test('throw no error if own options are valid – postformatter', (t) => {
  t.notThrows(() => helpers.getServer({
    preformatter: () => ('foobar')
  }), Error)

  t.notThrows(() => helpers.getServer({
    preformatter: (a) => (a)
  }), Error)
})
