BUILDDIR := build
OBJS := $(addprefix $(BUILDDIR)/, \
	funkrit-parser.js \
)

BUILDEXMPLDIR := examples/build
EXAMPLES := $(addprefix $(BUILDEXMPLDIR)/, \
	ex1.ast \
	ex1.js \
)

vpath %.pegjs grammar
vpath %.fnk examples

all: $(OBJS) examples

# Parser
build/funkrit-parser.js: funkrit.pegjs
	./node_modules/.bin/pegjs -o $@ $<

# Examples

examples: $(EXAMPLES) build/funkrit-parser.js

examples/build/ex1.ast: ex1.fnk
	node ./bin/funkrit.js --ast $< > $@

examples/build/ex1.js: ex1.fnk
	node ./bin/funkrit.js $< > $@

# Temp

temp: temp/test.ast

temp/test.ast: temp/test.js
	node node_modules/.bin/acorn --ecma2015 --module $< > $@

clean:
	- rm build/*.js examples/build/*.js examples/build/*.ast

.PHONY = all node clean temp examples

