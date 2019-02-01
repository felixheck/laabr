const test = require('ava')
const helpers = require('./_helpers')

require('events').EventEmitter.defaultMaxListeners = 50

test('throw error if plugin gets registered twice', async (t) => {
  await helpers.getServer()
  await t.throwsAsync(helpers.registerPlugin(), Error)
})

test('throw error if own options are invalid – colored', async (t) => {
  await t.throwsAsync(helpers.getServer({
    colored: null
  }), Error)

  await t.throwsAsync(helpers.getServer({
    colored: 42
  }), Error)

  await t.throwsAsync(helpers.getServer({
    colored: ''
  }), Error)

  await t.throwsAsync(helpers.getServer({
    colored: 'foobar'
  }), Error)

  await t.throwsAsync(helpers.getServer({
    colored: NaN
  }), Error)

  await t.throwsAsync(helpers.getServer({
    colored: {}
  }), Error)

  await t.throwsAsync(helpers.getServer({
    colored: []
  }), Error)

  await t.throwsAsync(helpers.getServer({
    colored: new RegExp()
  }), Error)
})

test('throw error if own options are invalid – override', async (t) => {
  await t.throwsAsync(helpers.getServer({
    override: null
  }), Error)

  await t.throwsAsync(helpers.getServer({
    override: 42
  }), Error)

  await t.throwsAsync(helpers.getServer({
    override: ''
  }), Error)

  await t.throwsAsync(helpers.getServer({
    override: 'foobar'
  }), Error)

  await t.throwsAsync(helpers.getServer({
    override: NaN
  }), Error)

  await t.throwsAsync(helpers.getServer({
    override: {}
  }), Error)

  await t.throwsAsync(helpers.getServer({
    override: []
  }), Error)

  await t.throwsAsync(helpers.getServer({
    override: new RegExp()
  }), Error)
})

test('throw error if own options are invalid – indent', async (t) => {
  await t.throwsAsync(helpers.getServer({
    indent: null
  }), Error)

  await t.throwsAsync(helpers.getServer({
    indent: false
  }), Error)

  await t.throwsAsync(helpers.getServer({
    indent: NaN
  }), Error)

  await t.throwsAsync(helpers.getServer({
    indent: {}
  }), Error)

  await t.throwsAsync(helpers.getServer({
    indent: []
  }), Error)

  await t.throwsAsync(helpers.getServer({
    indent: new RegExp()
  }), Error)
})

test('throw error if own options are invalid – preformatter', async (t) => {
  await t.throwsAsync(helpers.getServer({
    preformatter: (a, b, c) => ({ a, b, c })
  }), Error)

  await t.throwsAsync(helpers.getServer({
    preformatter: null
  }), Error)

  await t.throwsAsync(helpers.getServer({
    preformatter: false
  }), Error)

  await t.throwsAsync(helpers.getServer({
    preformatter: NaN
  }), Error)

  await t.throwsAsync(helpers.getServer({
    preformatter: {}
  }), Error)

  await t.throwsAsync(helpers.getServer({
    preformatter: []
  }), Error)

  await t.throwsAsync(helpers.getServer({
    preformatter: new RegExp()
  }), Error)
})

test('throw error if own options are invalid – postformatter', async (t) => {
  await t.throwsAsync(helpers.getServer({
    postformatter: (a, b, c) => ({ a, b, c })
  }), Error)

  await t.throwsAsync(helpers.getServer({
    postformatter: null
  }), Error)

  await t.throwsAsync(helpers.getServer({
    postformatter: false
  }), Error)

  await t.throwsAsync(helpers.getServer({
    postformatter: NaN
  }), Error)

  await t.throwsAsync(helpers.getServer({
    postformatter: {}
  }), Error)

  await t.throwsAsync(helpers.getServer({
    postformatter: []
  }), Error)

  await t.throwsAsync(helpers.getServer({
    postformatter: new RegExp()
  }), Error)
})

test('throw error if own options are invalid – handleUncaught', async (t) => {
  await t.throwsAsync(helpers.getServer({
    handleUncaught: null
  }), Error)

  await t.throwsAsync(helpers.getServer({
    handleUncaught: 42
  }), Error)

  await t.throwsAsync(helpers.getServer({
    handleUncaught: ''
  }), Error)

  await t.throwsAsync(helpers.getServer({
    handleUncaught: 'foobar'
  }), Error)

  await t.throwsAsync(helpers.getServer({
    handleUncaught: NaN
  }), Error)

  await t.throwsAsync(helpers.getServer({
    handleUncaught: {}
  }), Error)

  await t.throwsAsync(helpers.getServer({
    handleUncaught: []
  }), Error)

  await t.throwsAsync(helpers.getServer({
    handleUncaught: new RegExp()
  }), Error)
})

test('throw no error if own options are valid – default', async (t) => {
  await t.notThrowsAsync(helpers.getServer({}), Error)
})

test('throw no error if own options are valid – default/root ', async (t) => {
  await t.notThrowsAsync(helpers.getServer({}, true), Error)
})

test('throw no error if own options are valid – colored', async (t) => {
  await t.notThrowsAsync(helpers.getServer({
    colored: true
  }), Error)
})

test('throw no error if own options are valid – override', async (t) => {
  await t.notThrowsAsync(helpers.getServer({
    override: true
  }), Error)
})

test('throw no error if own options are valid – indent', async (t) => {
  await t.notThrowsAsync(helpers.getServer({
    indent: 4
  }), Error)

  await t.notThrowsAsync(helpers.getServer({
    indent: ''
  }), Error)

  await t.notThrowsAsync(helpers.getServer({
    indent: '  '
  }), Error)
})

test('throw no error if own options are valid – handleUncaught', async (t) => {
  await t.notThrowsAsync(helpers.getServer({
    handleUncaught: true
  }), Error)

  await t.notThrowsAsync(helpers.getServer({
    handleUncaught: false
  }), Error)
})

test('throw no error if own options are valid – preformatter', async (t) => {
  await t.notThrowsAsync(helpers.getServer({
    preformatter: () => ({ foo: 'bar' })
  }), Error)

  await t.notThrowsAsync(helpers.getServer({
    preformatter: (a) => (a)
  }), Error)

  await t.notThrowsAsync(helpers.getServer({
    preformatter: (a, b) => ({ a, b })
  }), Error)
})

test('throw no error if own options are valid – postformatter', async (t) => {
  await t.notThrowsAsync(helpers.getServer({
    preformatter: () => ('foobar')
  }), Error)

  await t.notThrowsAsync(helpers.getServer({
    preformatter: (a) => (a)
  }), Error)

  await t.notThrowsAsync(helpers.getServer({
    postformatter: (a, b) => ({ a, b })
  }), Error)
})
