const helpers = require('../_helpers')

helpers.getServer(JSON.parse(process.argv[2])).then(() => {
  console.warn(...JSON.parse(process.argv[3]))
})
