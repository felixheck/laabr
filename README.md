![laabr logo](https://github.com/felixheck/laabr/raw/master/assets/logo.png)
#### well-formatted, extendable pino logger for hapi.js

> Booyah! Works like a charm.
>
> &mdash; [Marcus Pöhls](https://futurestud.io/tutorials/author/marcus/)

[![Travis](https://img.shields.io/travis/felixheck/wurst.svg)](https://travis-ci.org/felixheck/laabr/builds/) ![node](https://img.shields.io/node/v/laabr.svg) ![npm](https://img.shields.io/npm/dt/laabr.svg) [![standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/) ![npm](https://img.shields.io/npm/l/laabr.svg) [![Coverage Status](https://coveralls.io/repos/github/felixheck/laabr/badge.svg?branch=master)](https://coveralls.io/github/felixheck/laabr?branch=master)
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
**laabr** is a well-formatted [pino ⇗](https://github.com/pinojs/pino) logger for [hapi.js ⇗](https://github.com/hapijs/hapi) which is based on the plugin [hapi-pino ⇗](https://github.com/pinojs/hapi-pino). It enables optionally to log in JSON for easy post-processing. It listens to various [hapi.js events ⇗](docs/tokens-formats-presets.md#formats) and logs in a well-formatted manner. Therefor it is possible to define custom formats alike the [morgan ⇗](https://github.com/expressjs/morgan) ones or make use of available presets. Additionally it enables to define own tokens which could be used in custom formats. *laabr* is the Swabian translation for *talking*.

The modules [`standard`](https://standardjs.com/) and [`ava`](https://github.com/avajs/ava) are used to grant a high quality implementation.


#### Compatibility
| Major Release | [hapi.js](https://github.com/hapijs/hapi) version | [hapi-pino](https://github.com/pinojs/hapi-pino) version | node version |
| --- | --- | --- | --- |
| `v5.1` | `>=18.3.1 @hapi/hapi` | `>= 5.4` | `>=8` |
| `v5` | `>=18 hapi` | `>= 5.4` | `>=8` |
| `v4` | `>=17 hapi` | `>= 5.1` | `>=8` |
| `v3` | `>=17 hapi` | `>= 3` | `>=8` |
| `v2` | `>=13 hapi` | `>= 1.6` | `>=6` |

#### `laabr` vs. `hapi-pino`
First of all `laabr` extends the `hapi-pino` plugin. So it is possible to use `laabr` in an almost identical manner like `hapi-pino`. This plugin provides further features which probably decelerates the logging a bit, but it should be faster than the alternatives anyway. The following features are provided:

- Easy out of the box usage
- Context-sensitive colorization
- Customizable identation for JSON strings
- Wide range of preset [tokens ⇗](docs/tokens-formats-presets.md#tokens) to extract and compose data as needed
- Preset [formats ⇗](docs/tokens-formats-presets.md#formats) combining useful tokens for an easy start
- Possibility to add own format [presets ⇗](docs/tokens-formats-presets.md#presets) for an easy reuse
- Easily customizable tokens & formats
- Override several [`console` ⇗](https://developer.mozilla.org/en-US/docs/Web/API/Console) logging methods
- In despite of everything it is possible to [preformat ⇗](docs/api.md#user-content-preformatter) & [postformat ⇗](docs/api.md#user-content-postformatter) data, e.g. to filter sensitive data

![laabr screen](https://github.com/felixheck/laabr/raw/master/assets/screen.png)

## Installation
For installation use the [npm ⇗](https://github.com/npm/npm):
```
$ npm install --save laabr
```

or clone the repository:
```
$ git clone https://github.com/felixheck/laabr
```

## Usage
#### Import
First you have to import the module:
``` js
const laabr = require('laabr');
```

#### Create hapi server
Afterwards create your hapi server if not already done:
``` js
const hapi = require('@hapi/hapi');
const server = hapi.server({
  port: 8888,
  host: 'localhost',
});
```

#### Registration
Finally register the plugin and set the correct options:
``` js
await server.register({
  plugin: laabr,
  options: {},
});
```

## Example
Take a look at several more [examples ⇗](examples/).<br/>

#### Code

``` js
const hapi = require('@hapi/hapi');
const laabr = require('laabr');

const server = hapi.server({ port: 3000 });

const options = {
  formats: { onPostStart: ':time :start :level :message' },
  tokens: { start:  () => '[start]' },
  indent: 0
};

server.route([
  {
    method: '*',
    path: '/response',
    handler() {
      return 'hello world';
    }
  },
  {
    method: 'GET',
    path: '/error',
    handler () {
      throw new Error('foobar');
    }
  }
]);

(async () => {
  try {
    await server.register({
      plugin: laabr,
      options
    });
    await server.start();
    console.log('Server started successfully');
  } catch (err) {
    console.error(err);
  }
})();

server.log('info', 'did you mean "foobar"?');
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

Do not forget to add corresponding tests to keep up 100% test coverage.<br/>
For further information read the [contributing guideline](CONTRIBUTING.md).
