# API

<!-- TOC -->

1. [`laabr`/`laabr.plugin`](#laabrlaabrplugin)
    1. [`options`](#options)
2. [`laabr.token(<string> name, <Function> callback)`](#laabrtokenstring-name-function-callback)
3. [`laabr.preset(<string> key, <string|false> preset)`](#laabrpresetstring-key-stringfalse-preset)
4. [`laabr.format(<string> event, <string|false> format)`](#laabrformatstring-event-stringfalse-format)

<!-- /TOC -->

---

## `laabr`/`laabr.plugin`

#### `options`
- **tokens**: `Object`<br/>
Optional. Default: `{}`<br/>
It's like [`laabr.token(<string> name, <Function> callback)`](#laabrtokenstring-name-function-callback). Use `name`/`callback` as key-value pairs.

- **presets**: `Object`<br/>
Optional. Default: `{}`<br/>
It's like [`laabr.preset(<string> key, <string|false> preset)`](#laabrpresetstring-key-stringfalse-preset). Use `key`/`preset` as key-value pairs.

- **formats**: `Object`<br/>
Optional. Default: `{}`<br/>
It's like [`laabr.format(<string> event, <string|false> format)`](#laabrformatstring-event-stringfalse-format). Use `event`/`format` as key-value pairs.

- **colored**: `boolean`<br/>
Optional. Default: `false`<br/>
Partially colorizes token outputs with ANSI powered by [chalk ⇗](https://github.com/chalk/chalk).

- **indent**: `string | number`<br/>
Optional. Default: `2`<br/>
Take a look at the `space` argument of [JSON.stringify ⇗](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify). This setting is just relevant for format strings marked as JSON.

- **override**: `boolean`<br/>
Optional. Default: `false`<br/>
Override several [`console` ⇗](https://developer.mozilla.org/en-US/docs/Web/API/Console) logging methods with corresponding bound [`server.log` ⇗](https://hapijs.com/api#serverlogtags-data-timestamp) functions to enable logging everywhere. Keep the `options.pino.level` in mind which is set to `info` by default.

- <strong id="preformatter">preformatter</strong>: `Function <[data[, options]]>`<br/>
Optional. Default: `(data) => data`<br/>
Preformat the originally logged message before getting processed by `laabr`. The function is passed the JSON object and the options as arguments and have to return an object as well. The plugin evaluates the type of the logged message just before – so it is not possible to fake an event. But have in mind that the token's return value could be affected.

- <strong id="postformatter">postformatter</strong>: `Function <[data[, options]]>`<br/>
Optional. Default: `(data) => data`<br/>
Preformat the logged message after getting processed by `laabr`. The function is passed the processed string and the options as  arguments and have to return a string as well.

- **handleUncaught**: `boolean`<br/>
Optional. Default: `false`<br/>
If uncaught exception should be logged. Overrides the default behavior of [`Event: 'uncaughtException'` ⇗](https://nodejs.org/api/process.html#process_event_uncaughtexception) but exits the process.
> **Hint**: If enabled it's possible that errors thrown during the processing of the plugin and its underlying plugins get hidden, e.g. in `options.preformatter`/`options.postformatter`. So if the process exits without any reason, disable this option for debugging.

- **stream**: `Writable`<br/>
Optional. Default: `process.stdout`<br/>
Take a look at the `stream` argument of [pino ⇗](https://github.com/pinojs/pino/blob/master/docs/API.md).

- **pino**: `Object`<br/>
Optional. Default: `{}`<br/>
[pino ⇗](https://github.com/pinojs/pino) related options. `prettyPrint`, `timestamp` and `browser` are effectless. The created instance is passed to [hapi-pino ⇗](https://github.com/pinojs/hapi-pino).

- **hapiPino**: `Object`<br/>
Optional. Default: `{}`<br/>
[hapi-pino ⇗](https://github.com/pinojs/hapi-pino) related options. `prettyPrint` and `instance` are effectless. Use `options.pino` to configre the passed `instance`.

## `laabr.token(<string> name, <Function> callback)`
To define a token, simply invoke `laabr.token()` with the name and a callback function.<br/>Best Practise: Run `laabr.token` before registering the plugin.

**`callback(<Object> data, <Object> colors)`**
The callback function is expected to be called with the arguments `data` and `colors`. Those represent the logged data and an object containing respective [chalk ⇗](https://github.com/chalk/chalk) functions. Additionally, the token can accept further arguments of it's choosing to customize behavior. The `colors` object contains the following key: `level`, `status` and `dim`. Those represent chalk color functions related to the context, the log level and the request status code. This callback function is expected to return a string value. The value returned is then available as `:hello` in this case below:

``` js
laabr.token('hello', () => 'hello!');
```

*Hint:* disable the respective format, get the complete logged message and inspect the properties. With this it is quite easy to define custom tokens.

## `laabr.preset(<string> key, <string|false> preset)`
To define own format presets, simply invoke `laabr.preset()` with an unique key and a format string. Use your own or provided presets for an easy reuse and exchange by passing the key to `laabr.format()` instead of the format string itself.<br/>Best Practise: Run `laabr.preset` before registering the plugin.

``` js
laabr.preset('server.env', ':time :environment :host :host[port]');
```

## `laabr.format(<string> event, <string|false> format)`
To define a format, simply invoke `laabr.format()` with the event and a format string. Use existing tokens with `:<token>` within the format string.<br>
If the `format` is set to `false`, it logs the whole json message without any pretty-printed format.<br/>Best Practise: Run `laabr.format` before registering the plugin.

``` js
laabr.format('onPostStart', ':time :hello world!');
```

Furthermore it is possible to define JSON strings. Therefor enclose the template string with `{` & `}` and use an object-like structure:

``` js
laabr.format('onPostStart', '{ ts::time, msg::hello }');
```

*Hint*: If you work with the JSON/object-like structure above and you want to work with custom strings, enclose them in quotes/backticks. If you want to concatinate tokens with custom string use a combination of `+` and quotes/backticks – use quotes for invalid object keys. To run inline function/methods use braces.

``` js
laabr.format('response', '{ responseTime: { value::responseTime, unit:`ms` }}');
laabr.format('response', '{ responseTime::responseTime + `ms` }');
laabr.format('response', '{ "response-time"::responseTime }');
laabr.format('response', '{ message:(JSON.stringify(:message)) }');
```

Or use a format preset key instead of a format string:

``` js
laabr.format('onPostStart', 'server.env');
```

The `event` is allowed to be `onPostStart`, `onPostStop`, `response`, `request-error`, `log` and `uncaught`. The events are almost analog to the [hapi-pino ⇗](https://github.com/pinojs/hapi-pino) ones.
