// @flow
/*::
import type { Node, ImportDeclaration, ImportSpecifier, Identifier } from './ast-types';
import type { Result_Monad } from './result';
*/
/*::
export type StdLib = {source:string,names:string[]};
export type Settings = {code:string,stdLib:StdLib,commonJs:boolean};
*/
const {always, append, compose, indexOf, length, lensProp, map, over, path, pathEq, prepend, reduce, when} = require("ramda");
const {requiredIdentifiers} = require("./required-identifiers");
const {import2require, export2require} = require("./commonjs");
const {parse} = require("./peg-parser");
const {Result} = require("./result");
function build({code, commonJs, stdLib} /* : Settings */) /* : Result_Monad<?Node> */{
  const process = compose(when(always(commonJs), compose(export2require, import2require)), over(lensProp("body"), reduce(removeEmptyImports, [])), selectUsedNames, addFunkritFullUse(stdLib), parse);
  return Result(code).map(process);
}
function removeEmptyImports(body /* : Node[] */, node /* : Node */) /* : Node[] */{
  if (node.type !== "ImportDeclaration" || length(node.specifiers) > 0) {
    return append(node, body);
  } else {
    return body;
  }
}
function importSpec(name /* : string */) /* : ImportSpecifier */{
  return {
    type: "ImportSpecifier",
    imported: {
      type: "Identifier",
      name
    },
    local: {
      type: "Identifier",
      name
    }
  };
}
function makeFunkritFullUse({source, names} /* : StdLib */) /* : ImportDeclaration */{
  return {
    type: "ImportDeclaration",
    source: {
      type: "Literal",
      value: source
    },
    specifiers: names.map(importSpec),
    funkrit: {
      use: "Full"
    }
  };
}
function addFunkritFullUse(stdlib /* : StdLib */) /* : Node => Node */{
  return over(lensProp("body"), prepend(makeFunkritFullUse(stdlib)));
}
function extractUsedNames(names /* : string[] */) /* : (ImportSpecifier[],ImportSpecifier) => ImportSpecifier[] */{
  return (m, spec) => indexOf(path(["local", "name"], spec), names) === -1 ? m : append(spec, m);
}
function usedNames(names /* : string[] */) /* : Node => Node */{
  return (node) => node.type === "ImportDeclaration" && pathEq(["funkrit", "use"], "Full", node) ? over(lensProp("specifiers"), reduce(extractUsedNames(names), []), node) : node;
}
function selectUsedNames(ast /* : Node */) /* : Node */{
  const names = requiredIdentifiers(ast);
  return over(lensProp("body"), map(usedNames(names)), ast);
}
module.exports = {
  build,
  removeEmptyImports,
  importSpec,
  makeFunkritFullUse,
  addFunkritFullUse,
  extractUsedNames,
  usedNames,
  selectUsedNames
};
