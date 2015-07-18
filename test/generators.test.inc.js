// --------------------
// promisify-any module
// Generator tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
	Promise = require('bluebird'),
	promisify = require('../lib/');

// init
chai.config.includeStack = true;

// tests

/* jshint expr: true */
/* jshint esnext: true */
/* global describe, it */

describe('generator function', function() {
	it('is converted to promise-returning function', function() {
		var f = function*() {
            return yield Promise.resolve(1);
        };

		var fn = promisify(f);

        var promise = fn();
		expect(promise).to.be.instanceof(promisify.Promise);
        return promise;
	});

	it('resolves on sync return', function() {
		var f = function*() {
            return 1;
        };

		var fn = promisify(f);

		var resolved;
		var promise = fn().then(function() {
			resolved = true;
		});

		return promise.then(function() {
			expect(resolved).to.be.true;
		});
	});

	it('resolves on yielded resolved promise', function() {
		var f = function*() {
            return yield Promise.resolve(1);
        };

		var fn = promisify(f);

		var resolved;
		var promise = fn().then(function() {
			resolved = true;
		});

		return promise.then(function() {
			expect(resolved).to.be.true;
		});
	});

	it('returns result', function() {
		var f = function*() {
            return 1;
        };

		var fn = promisify(f);

		return fn().then(function(r) {
			expect(r).to.equal(1);
		});
	});

	it('returns yielded resolved result', function() {
		var f = function*() {
            return yield Promise.resolve(1);
        };

		var fn = promisify(f);

		return fn().then(function(r) {
			expect(r).to.equal(1);
		});
	});

	it('is passed arguments', function() {
		var x, y;
		var f = function*(_x, _y) {
			x = _x;
			y = _y;
            return yield Promise.resolve(1);
        };

		var fn = promisify(f, 2);

		return fn(1, 2).then(function() {
			expect(x).to.equal(1);
			expect(y).to.equal(2);
		});
	});

	it('is passed this', function() {
		var x;
		var f = function*() {
			x = this.x;
            return yield Promise.resolve(1);
        };

		var fn = promisify(f);
		var obj = {x: 1, fn: fn};

		return obj.fn().then(function() {
			expect(x).to.equal(1);
		});
	});

	it('rejects on thrown error', function() {
		var f = function*() {
            var res = yield Promise.resolve(1); // jshint ignore:line
			throw new Error('error');
        };

		var fn = promisify(f);

		return fn().then(function() {
			expect(false).to.be.true;
		}).catch(function(err) {
			expect(err.message).to.equal('error');
		});
	});

	it('rejects on yielded rejected promise', function() {
		var f = function*() {
            return yield Promise.reject(new Error('error'));
        };

		var fn = promisify(f);

		return fn().then(function() {
			expect(false).to.be.true;
		}).catch(function(err) {
			expect(err.message).to.equal('error');
		});
	});
});

describe('promisify.generators()', function() {
	it('promisifies all generators', function() {
		var obj = {
		    addOne: function *(x) {
		        return yield Promise.resolve(x + 1);
		    },
		    double: function *(x) {
		        return yield Promise.resolve(x * 2);
		    }
		};

		promisify.generators(obj);

		return obj.addOne(10).then(obj.double).then(function(r) {
		    expect(r).to.equal(22);
		});
	});
});
