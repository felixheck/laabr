const helpers = require('../_helpers')

const options = Object.assign({
  tokens: {
    hello: () => 'HI!'
  }
}, JSON.parse(process.argv[2]))

helpers.getServer(options).then((server) => {
  server.inject(JSON.parse(process.argv[3]))
})
