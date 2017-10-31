const helpers = require('../_helpers')

helpers.getServer(JSON.parse(process.argv[2])).then((server) => {
  server.start().then(() => {
    server.stop({ timeout: 100 })
  })
})
