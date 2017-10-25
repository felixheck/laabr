const helpers = require('../_helpers')

helpers.getServer(JSON.parse(process.argv[2]), (server) => {
  console.warn(...JSON.parse(process.argv[3]))
})
