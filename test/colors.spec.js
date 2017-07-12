const test = require('ava')
const chalk = require('chalk')
const helpers = require('./_helpers')
const colors = require('../src/colors')

test('calculate status color correctly', (t) => {
  const mock = {
    res: {
      statusCode: 403
    }
  }

  t.is(colors.getStatus(mock, true), 4)
  t.is(colors.getStatus(mock).toString(), chalk.red.toString())
  t.is(JSON.stringify(colors.getStatus({})), JSON.stringify(helpers.noop))
})

test('calculate level color correctly', (t) => {
  const mock = {
    level: 40
  }

  t.is(colors.getLevel(mock, true), 3)
  t.is(colors.getLevel(mock).toString(), chalk.yellow.toString())
  t.is(JSON.stringify(colors.getLevel({})), JSON.stringify(helpers.noop))
})

test('calculate all colors correctly', (t) => {
  const mock = {
    level: 40,
    res: {
      statusCode: 403
    }
  }

  t.is(JSON.stringify(colors.get(mock, true)), JSON.stringify({
    dim: helpers.noop,
    level: helpers.noop,
    status: helpers.noop
  }))

  t.is(JSON.stringify(colors.get(mock)), JSON.stringify({
    dim: chalk.grey,
    level: chalk.yellow,
    status: chalk.red
  }))
})
