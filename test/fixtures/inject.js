const helpers = require('../_helpers')

helpers.getServer(JSON.parse(process.argv[2]), (server) => {
  server.inject(JSON.parse(process.argv[3]))
})
