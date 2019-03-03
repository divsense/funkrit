BUILDDIR := build
OBJS := $(addprefix $(BUILDDIR)/, \
	peg-parser.js \
	io.js \
	ast-nodejs.js \
	ast-types.js \
	ast-travel.js \
	result.js \
	required-identifiers.js \
	commonjs.js \
)

BUILDEXMPLDIR := examples/build
EXAMPLES := $(addprefix $(BUILDEXMPLDIR)/, monads.js monads.ast types.js use-types.js )

vpath %.pegjs grammar
vpath %.fnk src
vpath %.fnk examples

all: $(OBJS) examples

dist: $(OBJS)
	cp $(BUILDDIR)/* dist

# Libs
build/io.js: io.fnk
	node ./bin/funkrit-node.js -o $@ $<

build/result.js: result.fnk
	node ./bin/funkrit-node.js -o $@ $<

build/required-identifiers.js: required-identifiers.fnk
	node ./bin/funkrit-node.js -o $@ $<

build/commonjs.js: commonjs.fnk
	node ./bin/funkrit-node.js -o $@ $<

# Parser
build/peg-parser.js: funkrit.pegjs
	./node_modules/.bin/pegjs -o $@ $<

# Builder
build/funkrit-node.js: webpack.config.js $(OBJS)
	./node_modules/.bin/webpack --config $@

build/ast-nodejs.js: ast-nodejs.fnk build/peg-parser.js
	node ./bin/funkrit-node.js -o $@ $<

build/ast-types.js: ast-types.fnk
	node ./bin/funkrit-node.js -o $@ $<

build/ast-travel.js: ast-travel.fnk
	node ./bin/funkrit-node.js -o $@ $<

# Examples

examples: $(EXAMPLES) build/peg-parser.js

examples/build/monads.js: monads.fnk
	node ./bin/funkrit-node.js -o $@ $<

examples/build/monads.ast: monads.fnk
	node ./bin/funkrit-node.js --ast $< > $@

examples/build/types.js: types.fnk
	node ./bin/funkrit-node.js -o $@ $<

examples/build/use-types.js: use-types.fnk
	node ./bin/funkrit-node.js -o $@ $<

# Temp

temp: temp/test.ast

play: temp/play.js temp/play.ast

temp/play.js: temp/play.fnk
	node ./bin/funkrit-node.js -o $@ $<

temp/play.ast: temp/play.fnk
	node ./bin/funkrit-node.js --ast -o $@ $<

temp/test.ast: temp/test.js
	node node_modules/.bin/acorn --ecma2015 --module $< > $@

clean:
	- rm build/*.js

.PHONY = all node clean temp examples parser dist play

