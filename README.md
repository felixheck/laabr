![laabr logo](https://github.com/felixheck/laabr/raw/master/assets/logo.png)
#### well-formatted, extendable pino logger for hapi.js

> Booyah! Works like a charm.
>
> &mdash; [Marcus Pöhls](https://futurestud.io/tutorials/author/marcus/)

[![Travis](https://img.shields.io/travis/felixheck/wurst.svg)](https://travis-ci.org/felixheck/laabr/builds/) ![node](https://img.shields.io/node/v/laabr.svg) ![npm](https://img.shields.io/npm/dt/laabr.svg) [![standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/) ![npm](https://img.shields.io/npm/l/laabr.svg)
---

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API ⇗](docs/api.md)
5. [Tokens ⇗](docs/tokens-formats-presets.md#tokens)
5. [Formats ⇗](docs/tokens-formats-presets.md#formats)
7. [Presets ⇗](docs/tokens-formats-presets.md#presets)
8. [Example](#example)
9. [Developing and Testing](#developing-and-testing)
10. [Contribution](#contribution)

---

## Introduction
**laabr** is a well-formatted [pino](https://github.com/pinojs/pino) logger for [hapi.js](https://github.com/hapijs/hapi) which is based on the plugin [hapi-pino](https://github.com/pinojs/hapi-pino). It enables optionally to log in JSON for easy post-processing. It listens to various [hapi.js events](docs/tokens-formats-presets.md#formats) and logs in a well-formatted manner. Therefor it is possible to define custom formats alike the [morgan](https://github.com/expressjs/morgan) ones or make use of available presets. Additionally it enables to define own tokens which could be used in custom formats. *laabr* is the Swabian translation for *talking*.

This plugin is implemented in ECMAScript 6 without any transpilers like `babel`.<br>
Additionally `standard` and `ava` are used to grant a high quality implementation.

#### `laabr` vs. `hapi-pino`
First of all `laabr` extends the `hapi-pino` plugin. So it is possible to use `laabr` in an almost identical manner like `hapi-pino`. This plugin provides further features which probably decelerates the logging a bit, but it should be faster than the alternatives anyway. The following features are provided:

- Easy out of the box usage
- Context-sensitive colorization
- Customizable identation for JSON strings
- Wide range of preset [tokens](docs/tokens-formats-presets.md#tokens) to extract and compose data as needed
- Preset [formats](docs/tokens-formats-presets.md#formats) combining useful tokens for an easy start
- Possibility to add own format [presets](docs/tokens-formats-presets.md#presets) for an easy reuse
- Easily customizable tokens & formats
- Override several [`console`](https://developer.mozilla.org/en-US/docs/Web/API/Console) logging methods
- In despite of everything it is possible to [preformat](docs/api.md#user-content-preformatter) & [postformat](docs/api.md#user-content-postformatter) data, e.g. to filter sensitive data
- Optional integration of [correlation ids](docs/api.md#correlator) based on the module [correlation-id](https://github.com/toboid/correlation-id)

![laabr screen](https://github.com/felixheck/laabr/raw/master/assets/screen.png)

## Installation
For installation use the [Node Package Manager](https://github.com/npm/npm):
```
$ npm install --save laabr
```

or clone the repository:
```
$ git clone https://github.com/felixheck/laabr
```

Alternatively use the [Yarn Package Manager](https://yarnpkg.com):
```
$ yarn add laabr
```

## Usage
#### Import
First you have to import the module:
``` js
const laabr = require('laabr');
```

#### Create hapi server
Afterwards create your hapi server and the corresponding connection if not already done:
``` js
const server = new Hapi.Server();

server.connection({
  port: 8888,
  host: 'localhost',
});
```

#### Registration
Finally register the plugin and set the correct options:
``` js
server.register({
  register: laabr.plugin,
  options: {},
}, function(err) {
  if (err) {
    throw err;
  }
});
```

## Example
#### Code

``` js
const Hapi = require('hapi');
const laabr = require('laabr');

const server = new Hapi.Server()
server.connection({ port: 3000, host: 'localhost' })

laabr.format('onPostStart', ':time :start :level :message')
laabr.token('start', () => '[start]')

server.route([
  {
    method: '*',
    path: '/response',
    handler (req, reply) {
      reply('hello world')
    }
  },
  {
    method: 'GET',
    path: '/error',
    handler (req, reply) {
      reply(new Error('foobar'))
    }
  }
])

process.on('SIGINT', () => {
  server.stop().then((err) => {
    process.exit((err) ? 1 : 0)
  })
})

server.register({
  register: laabr.plugin,
  options: {
    indent: 0
  }
})
.then(() => server.start())
.catch(console.error)

server.log('info', 'did you mean "foobar"?')
```

#### Output

```
// (1) `log`
$ {"message":"did you mean \"foobar\"?","timestamp":1499352305938,"level":"info"}

// (2) `onPostStart`
$ 1499352305956 [start] info server started

// (3) `response` – calling `/response`
$ 1499352307927 GET 127.0.0.1 /response 200 {} (25 ms)

// (4) `request-error` & `response` – calling `/error`
$ {"error":"foobar","timestamp":1499352320071,"level":"warn"}
$ 1499352320072 GET 127.0.0.1 /error 500 {} (3 ms)

// (5) `onPostStop` – Pressing `Ctrl + C`
$ 1499352325077 info server stopped
```

## Developing and Testing
First you have to install all dependencies:
```
$ npm install
```

To execute all unit tests once, use:
```
$ npm test
```

or to run tests based on file watcher, use:
```
$ npm start
```

To get information about the test coverage, use:
```
$ npm run coverage
```

## Contribution
Fork this repository and push in your ideas.

Do not forget to add corresponding tests to keep up the almost 100% test coverage.
