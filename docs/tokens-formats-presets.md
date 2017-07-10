1. [Introduction](../#introduction)
2. [Installation](../#installation)
3. [Usage](../#usage)
4. [API ⇗](api.md)
5. [Tokens ⇗](#tokens)
5. [Formats ⇗](#formats)
7. [Presets ⇗](#presets)
8. [Example](../#example)
9. [Developing and Testing](../#developing-and-testing)
10. [Contribution](../#contribution)

## Tokens
The following tokens are available by default:

#### General
- `:pid` – The process identifies.
- `:level[field?]` - The logging Level. If `field` is unset, get the label. Otherwise, if `field=code`, get the level itself.
- `:time[format?]` - The current date and time in UTC. The available formats are:<br>
  - Default is the timestamp configured with `options.pino.timestamp` (`971186136`)
  - `iso` for the common ISO 8601 date time format. Just works if `options.pino.timestamp` is unset (`1970-01-12T05:46:26.136Z`)
  - `utc` for the common RFC 1123 date time format Just works if `options.pino.timestamp` is unset (`Mon, 12 Jan 1970 05:46:26 GMT`)
- `:message[field=msg]` - The `msg` or `data` field of the log. Just works with logged strings or [`server.log`](https://hapijs.com/api#serverlogtags-data-timestamp)/[`request.log`](https://hapijs.com/api#requestlogtags-data-timestamp). Otherwise pass a custom field with fallback to the `msg` and `data` fields or use the `:get[field]` token. Both alternatives expect dot notation paths.
- `:get[field]` – The value related to the given path in dot notation. Like `:message[field]` but without fallback.
- `:error[field=message]` - The `message` field of the error object. Alternatively pass a dot notation path to the token. Helpful paths are `message`, `stack`, `type`, `output`, `isServer` and `isBoom`.
- `:environment` - The `NODE_ENV` environment variable.

#### Request/Response
- `:responseTime` - The response time in milliseconds.
- `:res[header]` - The given `header` of the response.
- `:req[header]` - The given `header` of the request.
- `:status` - The status code of the request/response.
- `:method` - The http request method.
- `:payload` - The request payload. Just works with `options.hapiPino.logPayload = true`, it is enabled by default.
- `:remoteAddress` - The remote client IP address.
- `:remotePort` - The remote client port.
- `:url` - The parsed url of the request.

#### Host
- `:host[field?]` – Information about the host. Get the host by default. This token is just available for the `onPostStart` & `onPostStop` events. It uses the [`server.info` object](https://hapijs.com/api#serverinfo), so it just works for a single connection. The available information are:<br>
  - Default is the host name of the connection (`localhost`)
  - `port` for the connection port (`3000`)
  - `address` for the active IP address bound to the connection (`127.0.0.1`)
  - `protocol` for the used protocol (`http`)
  - `uri` for the complete host url (`http://localhost:3000`)

## Formats
The following formats/[presets](#presets) are set by default:

| Event           | Preset                             |
|----------------:|------------------------------------|
| `log`           | [`log.tinyjson`](presets.md#logtinyjson)     |
| `response`      | [`response.tiny`](presets.md#responsetiny)   |
| `request-error` | [`error.tinyjson`](presets.md#errortinyjson) |
| `onPostStart`   | [`server.info`](presets.md#serverinfo)       |
| `onPostStop`    | [`server.info`](presets.md#serverinfo)       |

## Presets
#### `log.tiny`
```
:time :level :message
```

*Example Output*
```
1499260782451 info foobar
```

#### `log.tinyjson`
```
({ message::message, timestamp::time, level::level, environment::environment })
```

*Example Output*
```
{
  "message": "foobar",
  "timestamp": 1499260782451,
  "level": "info",
  "environment": "development"
}
```

#### `response.tiny`
```
:time :method :remoteAddress :url :status :payload (:responseTime ms)
```

*Example Output*
```
1499255578965 GET 127.0.0.1 / 200 {} (24 ms)
```

#### `error.tiny`
```
:time :level :error
```

*Example Output*
```
1499260782451 info Internal Server Error
```

#### `error.tinyjson`
``` js
({ error::error, timestamp::time, level::level, environment::environment })
```

*Example Output*
```
{
  "error": "Internal Server Error",
  "timestamp": 1499260782451,
  "level": "info",
  "environment": "development"
}
```

#### `server.info`
```
:time :level :message at: :host[uri]
```

*Example Output*
```
1499255572003 info server stopped at http://localhost:3000
```
