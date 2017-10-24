const helpers = require('../_helpers')

helpers.getServer({ handleUncaught: process.argv.includes('true') }, (server) => {
  throw new Error('foobar')
})
