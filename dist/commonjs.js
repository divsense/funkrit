// @flow
/*::
import type { Node, Identifier, Property, VariableDeclaration, ExportNamedDeclaration, ExpressionStatement, ImportDeclaration, ImportSpecifier } from './ast-types';
*/
const {append, compose, lensProp, over, prop, reduce} = require("ramda");
function toObjProp({local, imported} /* : ImportSpecifier */) /* : Property */{
  return {
    type: "Property",
    method: false,
    shorthand: local.name === imported.name,
    computed: false,
    key: imported,
    value: local,
    kind: "init"
  };
}
function toVarDecl({source, specifiers} /* : ImportDeclaration */) /* : VariableDeclaration */{
  return {
    type: "VariableDeclaration",
    kind: "const",
    declarations: [{
      type: "VariableDeclarator",
      id: {
        type: "ObjectPattern",
        properties: specifiers.map(toObjProp)
      },
      init: {
        type: "CallExpression",
        callee: {
          type: "Identifier",
          name: "require"
        },
        arguments: [source]
      }
    }]
  };
}
function toProp(ident /* : Identifier */) /* : Property */{
  return {
    type: "Property",
    method: false,
    shorthand: true,
    computed: false,
    key: ident,
    value: ident,
    kind: "init"
  };
}
function toExpr({specifiers} /* : ExportNamedDeclaration */) /* : ExpressionStatement */{
  return {
    type: "ExpressionStatement",
    expression: {
      type: "AssignmentExpression",
      operator: "=",
      left: {
        type: "MemberExpression",
        computed: false,
        object: {
          type: "Identifier",
          name: "module"
        },
        property: {
          type: "Identifier",
          name: "exports"
        }
      },
      right: {
        type: "ObjectExpression",
        properties: specifiers.map(compose(toProp, prop("local")))
      }
    }
  };
}
function convertImports(body /* : Node[] */, node /* : Node */) /* : Node[] */{
  return append(node.type === "ImportDeclaration" ? toVarDecl(node) : node, body);
}
function convertExports(body /* : Node[] */, node /* : Node */) /* : Node[] */{
  return append(node.type === "ExportNamedDeclaration" ? toExpr(node) : node, body);
}
const import2require /* : (Node ) =>  Node */ = over(lensProp("body"), reduce(convertImports, []));
const export2require /* : (Node ) =>  Node */ = over(lensProp("body"), reduce(convertExports, []));
module.exports = {
  toObjProp,
  toVarDecl,
  toProp,
  toExpr,
  convertImports,
  convertExports,
  import2require,
  export2require
};
