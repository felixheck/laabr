const helpers = require('../_helpers')

const options = Object.assign({
  preformatter: (data) => ({ foo: 'bar' })
}, JSON.parse(process.argv[2]))

helpers.getServer(options).then((server) => {
  const logs = JSON.parse(process.argv[3])
  server.log(logs.tags, ...logs.value)
})
