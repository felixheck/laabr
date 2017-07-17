const test = require('ava')
const helpers = require('./_helpers')

test('throw error if plugin gets registered twice', (t) => {
  t.throws(() => helpers.registerPlugin(helpers.getServer()), Error)
})

test('throw error if nested plugin throws error', (t) => {
  t.throws(() => helpers.registerPlugin(helpers.getServer({
    hapiPino: {
      tags: {
        foo: 'bar'
      }
    }
  })), Error)
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
    preformatter: (a, b, c) => ({ a, b, c })
  }), Error)

  t.throws(() => helpers.getServer({
    preformatter: null
  }), Error)

  t.throws(() => helpers.getServer({
    preformatter: false
  }), Error)

  t.throws(() => helpers.getServer({
    preformatter: NaN
  }), Error)

  t.throws(() => helpers.getServer({
    preformatter: {}
  }), Error)

  t.throws(() => helpers.getServer({
    preformatter: []
  }), Error)

  t.throws(() => helpers.getServer({
    preformatter: new RegExp()
  }), Error)
})

test('throw error if own options are invalid – postformatter', (t) => {
  t.throws(() => helpers.getServer({
    postformatter: (a, b, c) => ({ a, b, c })
  }), Error)

  t.throws(() => helpers.getServer({
    postformatter: null
  }), Error)

  t.throws(() => helpers.getServer({
    postformatter: false
  }), Error)

  t.throws(() => helpers.getServer({
    postformatter: NaN
  }), Error)

  t.throws(() => helpers.getServer({
    postformatter: {}
  }), Error)

  t.throws(() => helpers.getServer({
    postformatter: []
  }), Error)

  t.throws(() => helpers.getServer({
    postformatter: new RegExp()
  }), Error)
})

test('throw error if own options are invalid – correlator', (t) => {
  t.throws(() => helpers.getServer({
    correlator: null
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: 42
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: ''
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: 'foobar'
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: NaN
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: []
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: {
      enabled: ''
    }
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: {
      enabled: 'foobar'
    }
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: {
      enabled: 42
    }
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: {
      enabled: null
    }
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: {
      enabled: NaN
    }
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: {
      enabled: {}
    }
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: {
      enabled: []
    }
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: {
      enabled: new RegExp()
    }
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: {
      header: null
    }
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: {
      header: false
    }
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: {
      header: NaN
    }
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: {
      header: {}
    }
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: {
      header: []
    }
  }), Error)

  t.throws(() => helpers.getServer({
    correlator: {
      header: new RegExp()
    }
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

  t.notThrows(() => helpers.getServer({
    preformatter: (a, b) => ({ a, b })
  }), Error)
})

test('throw no error if own options are valid – postformatter', (t) => {
  t.notThrows(() => helpers.getServer({
    preformatter: () => ('foobar')
  }), Error)

  t.notThrows(() => helpers.getServer({
    preformatter: (a) => (a)
  }), Error)

  t.notThrows(() => helpers.getServer({
    postformatter: (a, b) => ({ a, b })
  }), Error)
})

test('throw no error if own options are valid – correlator', (t) => {
  t.notThrows(() => helpers.getServer({
    correlator: true
  }), Error)

  t.notThrows(() => helpers.getServer({
    correlator: false
  }), Error)

  t.notThrows(() => helpers.getServer({
    correlator: {}
  }), Error)

  t.notThrows(() => helpers.getServer({
    correlator: {
      enabled: true
    }
  }), Error)

  t.notThrows(() => helpers.getServer({
    correlator: {
      enabled: false
    }
  }), Error)

  t.notThrows(() => helpers.getServer({
    correlator: {
      header: 'x-foobar'
    }
  }), Error)

  t.notThrows(() => helpers.getServer({
    correlator: {
      enabled: false,
      header: 'x-foobar'
    }
  }), Error)
})
