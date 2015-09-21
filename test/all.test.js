// --------------------
// promisify-any module
// Tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
	Promise = require('bluebird'),
	generatorSupported = require('generator-supported'),
	promisify = require('../lib/'),
	FakePromise = require('./fakePromise');

// init
chai.config.includeStack = true;

// tests

/* jshint expr: true */
/* global describe, it */

describe('callback function', function() {
	it('is converted to promise-returning function', function() {
		var f = function(cb) {
			process.nextTick(function() {
				cb();
			});
		};

		var fn = promisify(f);

		var promise = fn();
		expect(promise).to.be.instanceof(promisify.Promise);
		return promise;
	});

	it('resolves on success', function() {
		var f = function(cb) {
			process.nextTick(function() {
				cb();
			});
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
		var f = function(cb) {
			process.nextTick(function() {
				cb(null, 1);
			});
		};

		var fn = promisify(f);

		return fn().then(function(r) {
			expect(r).to.equal(1);
		});
	});

	it('returns asyncronously even if callback called syncronously', function() {
		var order = [];
		var f = function(cb) {
			order.push('func');
			cb();
		};

		var fn = promisify(f);

		var promise = fn().then(function() {
			order.push('then');
		});
		order.push('after');

		return promise.then(function() {
			expect(order).to.be.deep.equal(['func', 'after', 'then']);
		});
	});

	it('is passed arguments', function() {
		var x, y;
		var f = function(_x, _y, cb) {
			process.nextTick(function() {
				x = _x;
				y = _y;
				cb();
			});
		};

		var fn = promisify(f, 2);

		return fn(1, 2).then(function() {
			expect(x).to.equal(1);
			expect(y).to.equal(2);
		});
	});

	it('is passed this', function() {
		var x;
		var f = function(cb) {
			x = this.x;
			process.nextTick(function() {
				cb();
			});
		};

		var fn = promisify(f);
		var obj = {x: 1, fn: fn};

		return obj.fn().then(function() {
			expect(x).to.equal(1);
		});
	});

	it('rejects on thrown error', function() {
		var f = function(cb) { // jshint ignore:line
			throw new Error('error');
		};

		var fn = promisify(f);

		return fn().then(function() {
			expect(false).to.be.true;
		}).catch(function(err) {
			expect(err.message).to.equal('error');
		});
	});

	it('rejects on callback error', function() {
		var f = function(cb) {
			process.nextTick(function() {
				cb(new Error('error'));
			});
		};

		var fn = promisify(f);

		return fn().then(function() {
			expect(false).to.be.true;
		}).catch(function(err) {
			expect(err.message).to.equal('error');
		});
	});
});

describe('sync function', function() {
	it('is converted to promise-returning function', function() {
		var f = function() {
			return 1;
		};

		var fn = promisify(f);

		var promise = fn();
		expect(promise).to.be.instanceof(promisify.Promise);
		return promise;
	});

	it('resolves on success', function() {
		var f = function() {
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

	it('returns result', function() {
		var f = function() {
			return 1;
		};

		var fn = promisify(f);

		return fn().then(function(r) {
			expect(r).to.equal(1);
		});
	});

	it('returns asyncronously', function() {
		var order = [];
		var f = function() {
			order.push('func');
		};

		var fn = promisify(f);

		var promise = fn().then(function() {
			order.push('then');
		});
		order.push('after');

		return promise.then(function() {
			expect(order).to.be.deep.equal(['func', 'after', 'then']);
		});
	});

	it('is passed arguments', function() {
		var x, y;
		var f = function(_x, _y) {
			x = _x;
			y = _y;
		};

		var fn = promisify(f, 2);

		return fn(1, 2).then(function() {
			expect(x).to.equal(1);
			expect(y).to.equal(2);
		});
	});

	it('is passed this', function() {
		var x;
		var f = function() {
			x = this.x;
		};

		var fn = promisify(f);
		var obj = {x: 1, fn: fn};

		return obj.fn().then(function() {
			expect(x).to.equal(1);
		});
	});

	it('rejects on thrown error', function() {
		var f = function() {
			throw new Error('error');
		};

		var fn = promisify(f);

		return fn().then(function() {
			expect(false).to.be.true;
		}).catch(function(err) {
			expect(err.message).to.equal('error');
		});
	});
});

describe('promise-returning function', function() {
	it('remains untouched', function() {
		var f = function() {
			return Promise.resolve(1);
		};

		var fn = promisify(f);

		var promise = fn();
		expect(promise).to.be.instanceof(promisify.Promise);
		return promise;
	});

	it('resolves on success', function() {
		var f = function() {
			return Promise.resolve(1);
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
		var f = function() {
			return Promise.resolve(1);
		};

		var fn = promisify(f);

		return fn().then(function(r) {
			expect(r).to.equal(1);
		});
	});

	it('is passed arguments', function() {
		var x, y;
		var f = function(_x, _y) {
			x = _x;
			y = _y;
			return Promise.resolve(1);
		};

		var fn = promisify(f, 2);

		return fn(1, 2).then(function() {
			expect(x).to.equal(1);
			expect(y).to.equal(2);
		});
	});

	it('is passed this', function() {
		var x;
		var f = function() {
			x = this.x;
			return Promise.resolve(1);
		};

		var fn = promisify(f);
		var obj = {x: 1, fn: fn};

		return obj.fn().then(function() {
			expect(x).to.equal(1);
		});
	});

	it('rejects on thrown error', function() {
		var f = function() {
			throw new Error('error');
		};

		var fn = promisify(f);

		return fn().then(function() {
			expect(false).to.be.true;
		}).catch(function(err) {
			expect(err.message).to.equal('error');
		});
	});

	it('rejects on rejected promise', function() {
		var f = function() {
			return Promise.reject(new Error('error'));
		};

		var fn = promisify(f);

		return fn().then(function() {
			expect(false).to.be.true;
		}).catch(function(err) {
			expect(err.message).to.equal('error');
		});
	});
});

if (generatorSupported) {
	require('./generators.test.inc.js');
} else {
	describe('generator function', function() {
		it('works');
	});
}

describe('use method uses supplied promise implementation', function() {
	it('with function', function() {
		var usePromisify = promisify.use(FakePromise);

		var fn = usePromisify(function() {
			return Promise.resolve();
		});

		var p = fn();
		expect(p).to.be.instanceof(FakePromise);
	});

	if (generatorSupported) {
		require('./generatorsUse.test.inc.js');
	} else {
		it('with generator');
	}
});
