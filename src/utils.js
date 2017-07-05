const contains = (str, search) => str && str.includes && str.includes(search)
const isJSON = (data) => data && data.startsWith('({') && data.endsWith('})')
const noop = (data) => data
const stringify = (data) => String(JSON.stringify(data))

function getHeader (obj, field) {
  const re = new RegExp(`(?:\\r\\n)${field}: *([a-zA-z0-9 /,:;=-]*)`, 'gi')
  return re.exec(obj.header, field)
}

module.exports = {
  contains,
  isJSON,
  noop,
  stringify,
  getHeader
}
