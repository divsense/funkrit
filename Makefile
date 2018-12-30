BUILDDIR := build
OBJS := $(addprefix $(BUILDDIR)/, peg-parser.js io.js state.js either.js either-pio.js get-ast.js)

BUILDTESTDIR := build/test
TESTS := $(addprefix $(BUILDTESTDIR)/, io.js state.js reader.js either.js either-pio.js)

vpath %.pegjs grammar
vpath %.fnk src
vpath %.fnk examples

all: node examples #temp

test: $(TESTS)
	npm test

node: build/funkrit-node.js

build/funkrit-node.js: webpack.config.js $(OBJS)
	./node_modules/.bin/webpack --config $<

build/io.js: io.fnk
	node ./bin/funkrit-node.js $< > $@

build/state.js: state.fnk
	node ./bin/funkrit-node.js $< > $@

build/reader.js: reader.fnk
	node ./bin/funkrit-node.js $< > $@

build/either.js: either.fnk
	node ./bin/funkrit-node.js $< > $@

build/either-pio.js: either-pio.fnk
	node ./bin/funkrit-node.js $< > $@

build/get-ast.js: get-ast.fnk build/peg-parser.js #build/funkrit-import-mode.js
	node ./bin/funkrit-node.js -e libs $< > $@

build/peg-parser.js: funkrit.pegjs
	./node_modules/.bin/pegjs -o $@ $<

build/funkrit-import-mode.js: funkrit-import-mode.fnk
	node ./bin/funkrit-node.js -e libs $< > $@

# Tests
build/test/io.js: build/io.js
	./node_modules/.bin/webpack --config webpack.test.config.js $< -o $@

build/test/reader.js: build/reader.js
	./node_modules/.bin/webpack --config webpack.test.config.js $< -o $@

build/test/state.js: build/state.js
	./node_modules/.bin/webpack --config webpack.test.config.js $< -o $@

build/test/either-pio.js: build/either-pio.js
	./node_modules/.bin/webpack --config webpack.test.config.js $< -o $@

build/test/either.js: build/either.js
	./node_modules/.bin/webpack --config webpack.test.config.js $< -o $@

# Examples

examples: examples/build/monads.js examples/build/monads.ast

examples/build/monads.js: monads.fnk build/peg-parser.js
	node ./bin/funkrit-node.js -e libs $< > $@

examples/build/monads.ast: monads.fnk
	node ./bin/funkrit-node.js --ast -e libs $< > $@

temp: temp/play.js temp/play.ast temp/test.ast

temp/play.js: temp/play.fnk build/peg-parser.js
	node ./bin/funkrit-node.js $< > $@

temp/play.ast: temp/play.fnk build/peg-parser.js
	node ./bin/funkrit-node.js --ast --no-ramda $< > $@

temp/test.ast: temp/test.js
	node node_modules/.bin/acorn --ecma2015 --module $< > $@


clean:
	- rm build/*

.PHONY = all node clean temp test
