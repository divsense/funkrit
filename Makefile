BUILDDIR := build
OBJS := $(addprefix $(BUILDDIR)/, \
	peg-parser.js \
	build-ast.js \
	ast-utils.js \
	io.js \
	state.js \
	reader.js \
	either.js \
	either-io.js \
	either-pio.js \
    reader-either-io.js \
    reader-either-pio.js \
	)

TESTDIR := build/test
TESTS := $(addprefix $(TESTDIR)/, \
	build-ast.js \
	ast-utils.js \
	io.js \
	state.js \
	reader.js \
	either.js \
	either-io.js \
	either-pio.js \
	reader-either-io.js \
	reader-either-pio.js \
	)

BUILDEXMPLDIR := examples/build
EXAMPLES := $(addprefix $(BUILDEXMPLDIR)/, monads.js monads.ast )

vpath %.pegjs grammar
vpath %.fnk src
vpath %.fnk examples

all: $(OBJS) examples

test: $(TESTS)
	npm test

#node: build/funkrit-node.js

#parser: build/peg-parser.js

# Libs
build/ast-utils.js: ast-utils.fnk
	node ./bin/funkrit-node.js -o $@ $<

build/io.js: io.fnk
	node ./bin/funkrit-node.js -o $@ $<

build/state.js: state.fnk
	node ./bin/funkrit-node.js -o $@ $<

build/reader.js: reader.fnk
	node ./bin/funkrit-node.js -o $@ $<

build/either.js: either.fnk
	node ./bin/funkrit-node.js -o $@ $<

build/either-io.js: either-io.fnk
	node ./bin/funkrit-node.js -o $@ $<

build/either-pio.js: either-pio.fnk
	node ./bin/funkrit-node.js -o $@ $<

build/reader-either-io.js: reader-either-io.fnk
	node ./bin/funkrit-node.js -o $@ $<

build/reader-either-pio.js: reader-either-pio.fnk
	node ./bin/funkrit-node.js -o $@ $<

# Parser
build/peg-parser.js: funkrit.pegjs
	./node_modules/.bin/pegjs -o $@ $<

# Builder
build/funkrit-node.js: webpack.config.js $(OBJS)
	./node_modules/.bin/webpack --config $@

build/build-ast.js: build-ast.fnk build/peg-parser.js
	node ./bin/funkrit-node.js -o $@ $<

build/funkrit-import-mode.js: funkrit-import-mode.fnk
	node ./bin/funkrit-node.js -o $@ $<

# Tests
build/test/build-ast.js: build/build-ast.js
	./node_modules/.bin/webpack --config webpack.test.config.js -o $@ $<

build/test/ast-utils.js: build/ast-utils.js
	./node_modules/.bin/webpack --config webpack.test.config.js -o $@ $<

build/test/io.js: build/io.js
	./node_modules/.bin/webpack --config webpack.test.config.js -o $@ $<

build/test/reader.js: build/reader.js
	./node_modules/.bin/webpack --config webpack.test.config.js -o $@ $<

build/test/state.js: build/state.js
	./node_modules/.bin/webpack --config webpack.test.config.js -o $@ $<

build/test/either.js: build/either.js
	./node_modules/.bin/webpack --config webpack.test.config.js -o $@ $<

build/test/either-io.js: build/either-io.js
	./node_modules/.bin/webpack --config webpack.test.config.js -o $@ $<

build/test/either-pio.js: build/either-pio.js
	./node_modules/.bin/webpack --config webpack.test.config.js -o $@ $<

build/test/reader-either-io.js: build/reader-either-io.js
	./node_modules/.bin/webpack --config webpack.test.config.js -o $@ $<

build/test/reader-either-pio.js: build/reader-either-pio.js
	./node_modules/.bin/webpack --config webpack.test.config.js -o $@ $<

# Examples

examples: $(EXAMPLES) build/peg-parser.js

examples/build/monads.js: monads.fnk
	node ./bin/funkrit-node.js -o $@ $<

examples/build/monads.ast: monads.fnk
	node ./bin/funkrit-node.js --ast $< > $@

examples/build/use.js: use.fnk
	node ./bin/funkrit-node.js -o $@ $<

examples/build/use.ast: use.fnk
	node ./bin/funkrit-node.js --ast -o $@ $<

# Temp

temp: temp/test.ast

temp/play.js: temp/play.fnk
	node ./bin/funkrit-node.js -o $@ $<

temp/play.ast: temp/play.fnk
	node ./bin/funkrit-node.js --ast -o $@ $<

temp/test.ast: temp/test.js
	node node_modules/.bin/acorn --ecma2015 --module $< > $@

clean:
	- rm build/*.js
	- rm build/test/*.js

.PHONY = all node clean temp test examples parser

