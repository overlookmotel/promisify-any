// --------------------
// promisify-any module
// FakePromise constructor used in tests
// --------------------

var FakePromise = module.exports = function() {};

FakePromise.method = function() {
    return function() {
        return new FakePromise();
    };
};
