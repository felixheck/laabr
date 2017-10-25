const helpers = require('../_helpers')

helpers.getServer(JSON.parse(process.argv[2]), (server) => {
  const validError = JSON.parse(process.argv[3])

  if (validError) {
    throw new Error('foobar')
  } else {
    throw 'foobar' // eslint-disable-line
  }
})
