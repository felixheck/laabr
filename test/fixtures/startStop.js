const helpers = require('../_helpers')

helpers.getServer(JSON.parse(process.argv[2])).then(async (server) => {
  try {
    await server.start()
    await server.stop({ timeout: 100 })
  } catch (err) {
    console.log(err)
  }
})
