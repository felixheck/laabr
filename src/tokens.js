const correlator = require('correlation-id')
const get = require('lodash.get')
const pino = require('pino')
const utils = require('./utils')
const validator = require('./validator')

/**
 * @type Object.<Function>
 * @public
 *
 * Collection of tokens.
 */
const tokens = {}

/**
 * @function
 * @public
 *
 * Assign new token to the collection.
 *
 * @param {string} key The name of the token
 * @param {Function} token The token callback
 */
function assign (key, token) {
  validator('tokenLabel', key)
  validator('token', token)

  tokens[key] = token
}

/**
 * @function
 * @public
 *
 * Initialize tokens passed as options to plugin.
 *
 * @param {Object} [optionTokens = {}] The defined tokens
 */
function init (optionTokens = {}) {
  Object.keys(optionTokens).forEach((key) => assign(key, optionTokens[key]))
}

assign('pid', data => (
  data.pid
))

assign('tags', data => (
  data.tags
))

assign('level', (data, colors, field) => {
  if (field === 'code') {
    return colors.level(data.level)
  }

  return colors.level(pino.levels.labels[data.level])
})

assign('time', (data, colors, field) => {
  const date = new Date(data.time)
  let ts = data.time

  switch (field) {
    case 'iso':
      ts = date.toISOString()
      break
    case 'utc':
      ts = date.toUTCString()
      break
  }

  return colors.dim(ts)
})

assign('message', (data, colors, field = 'msg') => (
  get(data, field) || data.msg || data.data
))

assign('get', (data, colors, field) => (
  get(data, field)
))

assign('error', (data, colors, field = 'message') => (
  get(data.err, field)
))

assign('environment', (data, colors, field = 'NODE_ENV') => (
  process.env[field]
))

assign('cid', (data, colors) => (
  correlator.getId() || tokens.req(data, colors, 'x-laabr-cid')
))
assign('requestId', data => (
  data.req && data.req.id
))

assign('responseTime', data => (
  data.responseTime
))

assign('res', (data, colors, field) => {
  if (!data.res) {
    return undefined
  }

  const match = utils.getHeader(data.res.header, field)

  return (match && match[1]) || undefined
})

assign('req', (data, colors, field) => (
  data.req && data.req.headers && data.req.headers[field]
))

assign('status', (data, colors) => (
  colors.status(data.res && data.res.statusCode)
))

assign('method', (data, colors) => (
  colors.status(data.req && data.req.method)
))

assign('payload', data => (
  JSON.stringify(data.payload || {})
))

assign('remoteAddress', data => (
  data.req && data.req.remoteAddress
))

assign('remotePort', data => (
  data.req && data.req.remotePort
))

assign('url', data => (
  data.req && data.req.url
))

assign('host', (data, colors, field = 'host') => {
  switch (field) {
    case 'uri':
    case 'address':
    case 'port':
    case 'host':
    case 'protocol':
      return data[field]
    default:
      return undefined
  }
})

Object.assign(tokens, { assign, init })

module.exports = tokens
