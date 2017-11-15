const helpers = require('../_helpers')

;(async () => {
  await helpers.getServer(JSON.parse(process.argv[2]))
  const validError = JSON.parse(process.argv[3])

  setTimeout(function () {
    if (validError) {
      throw new Error('foobar')
    } else {
      throw 'foobar' // eslint-disable-line
    }
  })
})()
