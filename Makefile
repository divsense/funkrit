OBJDIR := objdir
OBJS := $(addprefix $(OBJDIR)/,foo.o bar.o baz.o)

vpath %.pegjs grammar
vpath %.fnk src
vpath %.fnk examples

all: node examples temp

node: build/funkrit-node.js

build/funkrit-node.js: webpack.config.js build/ast-node.js
	./node_modules/.bin/webpack --config $<

build/ast-node.js: ast-node.fnk build/peg-parser.js #build/funkrit-import-mode.js
	node ./bin/funkrit-node.js -e libs $< > $@

build/peg-parser.js: funkrit.pegjs
	./node_modules/.bin/pegjs -o $@ $<

build/funkrit-import-mode.js: funkrit-import-mode.fnk
	node ./bin/funkrit-node.js -e libs $< > $@

examples: examples/build/monads.js examples/build/monads.ast

examples/build/monads.js: monads.fnk
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

.PHONY = all node clean temp
