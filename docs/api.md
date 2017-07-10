1. [Introduction](../#introduction)
2. [Installation](../#installation)
3. [Usage](../#usage)
4. API
5. [Tokens ⇗](tokens-formats-presets.md#tokens)
5. [Formats ⇗](tokens-formats-presets.md#formats)
7. [Presets ⇗](tokens-formats-presets.md#presets)
8. [Example](../#example)
9. [Developing and Testing](../#developing-and-testing)
10. [Contribution](../#contribution)

## API
#### `laabr.plugin`

**`options`**
- **colored**: `boolean`<br/>
Optional. Default: `false`<br/>
Partially colorizes token outputs with ANSI powered by [chalk](https://github.com/chalk/chalk).

- **indent**: `string | number`<br/>
Optional. Default: `2`<br/>
Take a look at the `space` argument of [JSON.stringify](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify). This setting is just relevant for format strings marked as JSON.

- **override**: `boolean`<br/>
Optional. Default: `false`<br/>
Override several [`console`](https://developer.mozilla.org/en-US/docs/Web/API/Console) logging methods with corresponding bound [`server.log`](https://hapijs.com/api#serverlogtags-data-timestamp) functions to enable logging everywhere. Keep the `options.pino.level` in mind which is set to `info` by default.

- **stream**: `Writable`<br/>
Optional. Default: `process.stdout`<br/>
Take a look at the `stream` argument of [pino](https://github.com/pinojs/pino/blob/master/docs/API.md).

- **pino**: `Object`<br/>
Optional. Default: `{}`<br/>
[pino](https://github.com/pinojs/pino) related options. `prettyPrint`, `timestamp` and `browser` are effectless. The created instance is passed to [hapi-pino](https://github.com/pinojs/hapi-pino).

- **hapiPino**: `Object`<br/>
Optional. Default: `{}`<br/>
[hapi-pino](https://github.com/pinojs/hapi-pino) related options. `prettyPrint`, `mergeHapiLogData` and `instance` are effectless. Use `options.pino` to configre the passed `instance`.

#### `laabr.token(<string> name, <Function> callback)`
To define a token, simply invoke `laabr.token()` with the name and a callback function. Run `laabr.token` before registering the plugin.

**`callback(<Object> data, <Object> colors)`**
The callback function is expected to be called with the arguments `data` and `colors`. Those represent the logged data and an object containing respective [chalk](https://github.com/chalk/chalk) functions. Additionally, the token can accept further arguments of it's choosing to customize behavior. The `colors` object contains the following key: `level`, `status` and `dim`. Those represent chalk color functions related to the context, the log level and the request status code. This callback function is expected to return a string value. The value returned is then available as `:hello` in this case below:

``` js
laabr.token('hello', () => 'hello!');
```

*Hint:* disable the respective format, get the complete logged message and inspect the properties. With this it is quite easy to define custom tokens.

#### `laabr.preset(<string> key, <string|false> preset)`
To define own format presets, simply invoke `laabr.preset()` with an unique key and a format string. Use your own or provided presets for an easy reuse and exchange by passing the key to `laabr.format()` instead of the format string itself. Run `laabr.format` before registering the plugin.

``` js
laabr.preset('server.env', ':time :environment :host :host[port]');
```

#### `laabr.format(<string> event, <string|false> format)`
To define a format, simply invoke `laabr.format()` with the event and a format string. Use existing tokens with `:<token>` within the format string.<br>
If the `format` is set to `false`, it logs the whole json message without any pretty-printed format. Run `laabr.format` before registering the plugin.

``` js
laabr.format('onPostStart', ':time :hello world!');
```

Furthermore it is possible to define JSON strings. Therefor enclose the template string with `({` & `})` and use an object-like structure:

``` js
laabr.format('onPostStart', '({ ts::time, msg::hello world! })');
```

Or use a format preset key instead of a format string:

``` js
laabr.format('onPostStart', 'server.env');
```

The `event` is allowed to be `onPostStart`, `onPostStop`, `response`, `request-error` and `log`. The events are analog to the [hapi-pino](https://github.com/pinojs/hapi-pino) ones.
