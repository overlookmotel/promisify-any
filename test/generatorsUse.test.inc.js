// --------------------
// promisify-any module
// Generator use tests
// --------------------

// modules
var chai = require('chai'),
	expect = chai.expect,
	Promise = require('bluebird'),
	promisify = require('../lib/'),
	FakePromise = require('./fakePromise');

// init
chai.config.includeStack = true;

// tests

/* jshint expr: true */
/* jshint esnext: true */
/* global it */

it('with generator', function() {
	var usePromisify = promisify.use(FakePromise);

	var fn = usePromisify(function*() {
		yield Promise.resolve();
	});

	var p = fn();
	expect(p).to.be.instanceof(FakePromise);
});
