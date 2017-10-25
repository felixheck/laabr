const helpers = require('../_helpers')

helpers.getServer(JSON.parse(process.argv[2]), (server) => {
  const logs = JSON.parse(process.argv[3])
  server.log(logs.tags, ...logs.value)
})
