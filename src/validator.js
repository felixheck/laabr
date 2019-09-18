const joi = require('@hapi/joi')

/**
 * @type Object.<joi.scheme>
 * @private
 *
 * Collection of `Joi` validators
 */
const validators = {
  formatLabel: joi.string().valid('log', 'request', 'response', 'request-error', 'onPostStart', 'onPostStop', 'uncaught'),
  tokenLabel: joi.string(),
  format: joi.alternatives().try(joi.string(), joi.any().valid(false)),
  token: joi.function().maxArity(3),
  preformatterOutput: joi.object(),
  postformatterOutput: joi.string(),
  options: joi.object({
    formats: joi.object().allow(null),
    presets: joi.object().allow(null),
    tokens: joi.object().allow(null),
    colored: joi.boolean().default(false),
    override: joi.boolean().default(false),
    indent: joi.alternatives().try(joi.number(), joi.string()).allow('').default(2),
    preformatter: joi.function().maxArity(2),
    postformatter: joi.function().maxArity(2),
    handleUncaught: joi.boolean().default(false),
    stream: joi.object().allow(null),
    hapiPino: joi.object({
      stream: joi.object().allow(null),
      prettyPrint: joi.boolean(),
      tags: joi.object(),
      allTags: joi.string(),
      instance: joi.object(),
      logEvents: joi.alternatives().try(joi.array().items(joi.string()), joi.any().allow(false, null)),
      mergeHapiLogData: joi.boolean().default(false),
      serializers: joi.object(),
      logRouteTags: joi.boolean(),
      ignorePaths: joi.array().items(joi.string()),
      logPayload: joi.boolean().default(true),
      level: joi.string()
    }).default(),
    pino: joi.object({
      safe: joi.boolean(),
      name: joi.string(),
      serializers: joi.object(),
      timestamp: joi.alternatives().try(joi.function(), joi.boolean()),
      slowtime: joi.boolean(),
      extreme: joi.boolean(),
      level: joi.string(),
      levelVal: joi.number(),
      customLevels: joi.object(),
      redact: joi.alternatives().try(joi.array(), joi.object()),
      prettyPrint: joi.any(),
      messageKey: joi.string().default('msg'),
      changeLevelName: joi.string(),
      useLevelLabels: joi.boolean(),
      onTerminated: joi.function(),
      enabled: joi.boolean(),
      browser: joi.any(),
      base: joi.object(),
      crlf: joi.boolean()
    }).default()
  }).default()
}

/**
 * @function
 * @public
 *
 * Validate a value based on the stored and requested
 * validators. If the requested validators does not
 * exist, get the passed in value.
 *
 * @param {string} type The requested validator name
 * @param {*} value The value to be validated
 * @returns {*} The value, if possible validated
 *
 * @throws The passed in value could not be validated
 */
function validate (type, value) {
  switch (type) {
    case 'options':
    case 'preformatterOutput':
    case 'postformatterOutput':
      return joi.attempt(value, validators[type])
    case 'format':
    case 'formatLabel':
    case 'token':
    case 'tokenLabel':
      return joi.assert(value, validators[type])
    default:
      return value
  }
}

module.exports = validate
