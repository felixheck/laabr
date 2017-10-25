const helpers = require('../_helpers')
const laabr = require('../../src')

laabr.token('hello', () => 'HI!')

helpers.getServer(JSON.parse(process.argv[2]), (server) => {
  server.inject(JSON.parse(process.argv[3]))
})
