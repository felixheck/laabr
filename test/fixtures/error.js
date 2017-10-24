const helpers = require('../_helpers')
const utils = require('../../src/utils')

helpers.getServer({ handleUncaught: process.argv.includes('true') }, (server) => {
  throw new Error('foobar')
})
