const helpers = require('../_helpers')

helpers.getServer(JSON.parse(process.argv[2])).then(async (server) => {
  await server.inject(JSON.parse(process.argv[3]))
})
