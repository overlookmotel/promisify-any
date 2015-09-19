// --------------------
// promisify-any module
// --------------------

// modules
var Promise = require('bluebird'),
    isGeneratorFn = require('is-generator').fn;

var co;
try {
    co = require('co-bluebird');
} catch(err) {}

// exports

var promisify = module.exports = function(fn, options) {
    // conform options
    if (typeof options == 'number') {
        options = {numArgs: options};
    } else {
        if (options === undefined) options = {};
        if (options.numArgs === undefined) options.numArgs = promisify.defaultNumArgs;
    }

    // load Promise + co from promisify (so they can be altered by user)
    var Promise = options.Promise || promisify.Promise,
        co = options.co || promisify.co;

    // deal with generators
    if (isGeneratorFn(fn)) return co.wrap(fn);

    // deal with callback functions
    if (fn.length > options.numArgs) return Promise.promisify(fn);

    // deal with sync functions or promise-returning functions
    return Promise.method(fn);
};

// promisify all generators method
promisify.generators = function(obj, options) {
    // conform options
    if (!options) options = {};

    // load co from promisify (so it can be altered by user)
    var co = options.co || promisify.co;

    // promisify all methods of the object which are generators
    for (var name in obj) {
        var fn = obj[name];
        if (isGeneratorFn(fn)) obj[name] = co.wrap(fn);
    }

    // return obj for chaining
    return obj;
};

// define default options
promisify.defaultNumArgs = 0;

promisify.Promise = Promise;
promisify.co = co;
