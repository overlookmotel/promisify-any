# promisify-any.js

# Promisify any of: callback function, sync function, generator function, promise-returning function

## Current status

[![Build Status](https://secure.travis-ci.org/overlookmotel/promisify-any.png?branch=master)](http://travis-ci.org/overlookmotel/promisify-any)
[![Dependency Status](https://david-dm.org/overlookmotel/promisify-any.png)](https://david-dm.org/overlookmotel/promisify-any)

All features are tested. API may be subject to alteration in future versions (v0.1.0 or later).

## What is it for?

There are plenty of modules for promisifying callback functions. But what if you are writing a module where the user provides a function as an input to your API and you want to give them flexibility to either use promises or callbacks in that function? And what about generator functions?

This module takes an input which can be any of:

- Async callback function
- Sync function
- Promise-returning function
- Generator function which yields promises

...and turns any of the above into a promise-returning function.

## Usage

### Installation

    npm install promisify-any

### Loading

```js
var promisify = require('promisify-any');
```

### Promisifying

Pass the function to be converted to `promisify`.

```js

fn = promisify(fn);

```

The result of calling `fn` now will be a promise.

```js
fn().then(function(result) {
    // ...
});
```

If the function expects arguments, the number of arguments (not including the callback) MUST be provided as a 2nd argument to `promisify`.

```js
var fn = function(a, b, cb) {
    return cb(null, a + b);
};

fn = promisify(fn, 2);
```

This is so that you end up with the same function, with any of the following inputs:

```js
var fns = [
    function(a, b, cb) { return cb(null, a + b); },
    function(a, b) { return a + b; },
    function(a, b) { return Promise.resolve(a + b); },
    function *(a, b) { return yield Promise.resolve(a + b); }
];

fns = fns.map(function(fn) {return promisify(fn, 2)});
// fns[0] == fns[1] == fns[2] == fns[3]

```

Internally, `promisify-any` works out if an input function uses a callback or not, based on the number of arguments the function has. So it needs to know in advance how many arguments it *should* have!

#### Async callback functions

Async callback functions are "promisified".

e.g. Returning a value through callback:

```js
var fn = promisify(function(cb) {
    setImmediate(function() {
        cb(null, 123);
    });
});

fn().then(function(res) {
    // res = 123
});
```

e.g. Taking arguments (note that number of expected arguments is passed to `promisify`):

```js
var fn = promisify(function(x, y, cb) {
    setImmediate(function() {
        cb(null, x + y);
    });
}, 2);

fn(3, 4).then(function(res) {
    // res = 7
});
```

e.g. Returning an error through callback:

```js
var fn = promisify(function(cb) {
    setImmediate(function() {
        cb(new Error('oops!'));
    });
});

fn().catch(function(err) {
    // err.message = 'oops!'
});
```

#### Sync functions

Sync functions are turned into asynchronous promise-returning functions:

```js
var fn = promisify(function(x, y) {
    return x + y;
}, 2);

fn(3, 4).then(function(res) {
    // res = 7
});
```

```js
var fn = promisify(function() {
    throw new Error('oops!');
});

fn().catch(function(err) {
    // err.message = 'oops!'
});
```

#### Promise-returning functions

Promise-returning functions are left unchanged.

```js
var fn = promisify(function(x, y) {
    return Promise.resolve(x + y);
}, 2);

fn(3, 4).then(function(res) {
    // res = 7
});
```

#### Generator functions

Generator functions are wrapped using [co](https://www.npmjs.com/package/co) (`co.wrap()`) so that they can yield promises. The resulting function also returns a promise.

```js
var fn = promisify(function(x, y) {
    var res = yield [
        Promise.resolve(x * 10),
        Promise.resolve(y * 10)
    ];

    return res[0] + res[1];
}, 2);

fn(3, 4).then(function(res) {
    // res = 70
});
```

NB Generators are only supported in node v0.11 upwards and require node to be run with the `--harmony` flag.

## Tests

Use `npm test` to run the tests.

## Changelog

See changelog.md

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/promisify-any/issues
