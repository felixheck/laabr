const test = require('ava')
const helpers = require('./_helpers')

require('events').EventEmitter.defaultMaxListeners = 50

test('throw error if plugin gets registered twice', async (t) => {
  await helpers.getServer()
  await t.throwsAsync(helpers.registerPlugin())
})

test('throw error if own options are invalid – colored', async (t) => {
  await t.throwsAsync(helpers.getServer({
    colored: null
  }))

  await t.throwsAsync(helpers.getServer({
    colored: 42
  }))

  await t.throwsAsync(helpers.getServer({
    colored: ''
  }))

  await t.throwsAsync(helpers.getServer({
    colored: 'foobar'
  }))

  await t.throwsAsync(helpers.getServer({
    colored: NaN
  }))

  await t.throwsAsync(helpers.getServer({
    colored: {}
  }))

  await t.throwsAsync(helpers.getServer({
    colored: []
  }))

  await t.throwsAsync(helpers.getServer({
    colored: new RegExp()
  }))
})

test('throw error if own options are invalid – override', async (t) => {
  await t.throwsAsync(helpers.getServer({
    override: null
  }))

  await t.throwsAsync(helpers.getServer({
    override: 42
  }))

  await t.throwsAsync(helpers.getServer({
    override: ''
  }))

  await t.throwsAsync(helpers.getServer({
    override: 'foobar'
  }))

  await t.throwsAsync(helpers.getServer({
    override: NaN
  }))

  await t.throwsAsync(helpers.getServer({
    override: {}
  }))

  await t.throwsAsync(helpers.getServer({
    override: []
  }))

  await t.throwsAsync(helpers.getServer({
    override: new RegExp()
  }))
})

test('throw error if own options are invalid – indent', async (t) => {
  await t.throwsAsync(helpers.getServer({
    indent: null
  }))

  await t.throwsAsync(helpers.getServer({
    indent: false
  }))

  await t.throwsAsync(helpers.getServer({
    indent: NaN
  }))

  await t.throwsAsync(helpers.getServer({
    indent: {}
  }))

  await t.throwsAsync(helpers.getServer({
    indent: []
  }))

  await t.throwsAsync(helpers.getServer({
    indent: new RegExp()
  }))
})

test('throw error if own options are invalid – preformatter', async (t) => {
  await t.throwsAsync(helpers.getServer({
    preformatter: (a, b, c) => ({ a, b, c })
  }))

  await t.throwsAsync(helpers.getServer({
    preformatter: null
  }))

  await t.throwsAsync(helpers.getServer({
    preformatter: false
  }))

  await t.throwsAsync(helpers.getServer({
    preformatter: NaN
  }))

  await t.throwsAsync(helpers.getServer({
    preformatter: {}
  }))

  await t.throwsAsync(helpers.getServer({
    preformatter: []
  }))

  await t.throwsAsync(helpers.getServer({
    preformatter: new RegExp()
  }))
})

test('throw error if own options are invalid – postformatter', async (t) => {
  await t.throwsAsync(helpers.getServer({
    postformatter: (a, b, c) => ({ a, b, c })
  }))

  await t.throwsAsync(helpers.getServer({
    postformatter: null
  }))

  await t.throwsAsync(helpers.getServer({
    postformatter: false
  }))

  await t.throwsAsync(helpers.getServer({
    postformatter: NaN
  }))

  await t.throwsAsync(helpers.getServer({
    postformatter: {}
  }))

  await t.throwsAsync(helpers.getServer({
    postformatter: []
  }))

  await t.throwsAsync(helpers.getServer({
    postformatter: new RegExp()
  }))
})

test('throw error if own options are invalid – handleUncaught', async (t) => {
  await t.throwsAsync(helpers.getServer({
    handleUncaught: null
  }))

  await t.throwsAsync(helpers.getServer({
    handleUncaught: 42
  }))

  await t.throwsAsync(helpers.getServer({
    handleUncaught: ''
  }))

  await t.throwsAsync(helpers.getServer({
    handleUncaught: 'foobar'
  }))

  await t.throwsAsync(helpers.getServer({
    handleUncaught: NaN
  }))

  await t.throwsAsync(helpers.getServer({
    handleUncaught: {}
  }))

  await t.throwsAsync(helpers.getServer({
    handleUncaught: []
  }))

  await t.throwsAsync(helpers.getServer({
    handleUncaught: new RegExp()
  }))
})

test('throw no error if own options are valid – default', async (t) => {
  await t.notThrowsAsync(helpers.getServer({}))
})

test('throw no error if own options are valid – default/root ', async (t) => {
  await t.notThrowsAsync(helpers.getServer({}, true))
})

test('throw no error if own options are valid – colored', async (t) => {
  await t.notThrowsAsync(helpers.getServer({
    colored: true
  }))
})

test('throw no error if own options are valid – override', async (t) => {
  await t.notThrowsAsync(helpers.getServer({
    override: true
  }))
})

test('throw no error if own options are valid – indent', async (t) => {
  await t.notThrowsAsync(helpers.getServer({
    indent: 4
  }))

  await t.notThrowsAsync(helpers.getServer({
    indent: ''
  }))

  await t.notThrowsAsync(helpers.getServer({
    indent: '  '
  }))
})

test('throw no error if own options are valid – handleUncaught', async (t) => {
  await t.notThrowsAsync(helpers.getServer({
    handleUncaught: true
  }))

  await t.notThrowsAsync(helpers.getServer({
    handleUncaught: false
  }))
})

test('throw no error if own options are valid – preformatter', async (t) => {
  await t.notThrowsAsync(helpers.getServer({
    preformatter: () => ({ foo: 'bar' })
  }))

  await t.notThrowsAsync(helpers.getServer({
    preformatter: (a) => (a)
  }))

  await t.notThrowsAsync(helpers.getServer({
    preformatter: (a, b) => ({ a, b })
  }))
})

test('throw no error if own options are valid – postformatter', async (t) => {
  await t.notThrowsAsync(helpers.getServer({
    preformatter: () => ('foobar')
  }))

  await t.notThrowsAsync(helpers.getServer({
    preformatter: (a) => (a)
  }))

  await t.notThrowsAsync(helpers.getServer({
    postformatter: (a, b) => ({ a, b })
  }))
})
