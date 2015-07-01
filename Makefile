REPORTER ?= spec
TESTS = $(shell find ./test/* -name "*.test.js")

# test commands

teaser:
	@echo "" && \
	node -pe "Array(18).join('#')" && \
	echo '# Running tests #' && \
	node -pe "Array(18).join('#')" && \
	echo ''

ifeq (true,$(COVERAGE))
test:
	make coveralls
else
test:
	make tests
test-harmony:
	make tests-harmony
endif

tests:
	@if [ "$$GREP" ]; then \
		make jshint && make teaser && ./node_modules/mocha/bin/mocha --check-leaks --colors -t 10000 --reporter $(REPORTER) -g "$$GREP" $(TESTS); \
	else \
		make jshint && make teaser && ./node_modules/mocha/bin/mocha --check-leaks --colors -t 10000 --reporter $(REPORTER) $(TESTS); \
	fi

tests-harmony:
	@if [ "$$GREP" ]; then \
		make jshint && make teaser && ./node_modules/mocha/bin/mocha --harmony --check-leaks --colors -t 10000 --reporter $(REPORTER) -g "$$GREP" $(TESTS); \
	else \
		make jshint && make teaser && ./node_modules/mocha/bin/mocha --harmony --check-leaks --colors -t 10000 --reporter $(REPORTER) $(TESTS); \
	fi

jshint:
	./node_modules/.bin/jshint lib test

cover:
	make teaser; \
	node --harmony ./node_modules/istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec $(TESTS); \
	rm -rf coverage

coveralls:
	node --harmony ./node_modules/istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec; \
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js; \
	rm -rf ./coverage

.PHONY: test test-harmony tests tests-harmony cover coveralls
