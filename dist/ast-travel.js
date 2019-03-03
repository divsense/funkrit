// @flow
/*::
import type { Node, Program, BlockStatement } from './ast-types';
*/
/*::
export type PNode = {property:string,node:Node};
export type Context<A> = {result:A,node:Node,parentType:string,parentProperty:string};
export type Visitors<A> = {[string]:(Context<A>) => A};
export type State<A> = {result:A,parentType:string,visitors:Visitors<A>};
*/
const {compose, concat, filter, head, isNil, map, merge, not, prop, reduce} = require("ramda");
function travelProgram/* :: <A> */(res /* : A */, visitors /* : Visitors<A> */) /* : Node => A */{
  return (node) => {
    const {result} = travel({
      result: res,
      parentType: "",
      visitors
    }, {
      property: "program",
      node
    });
    return result;
  };
}
function travel/* :: <A> */(state /* : State<A> */, pnode /* : PNode */) /* : State<A> */{
  const {result, parentType, visitors} = state;
  const {property, node} = pnode;
  const handler = prop(node.type, visitors);
  const newResult = handler ? handler({
    result,
    node,
    parentType,
    parentProperty: property
  }) : result;
  return merge(reduce(travel, {
    result: newResult,
    parentType: node.type,
    visitors
  }, getChildNodes(node)), {
    parentType,
    visitors
  });
}
function pnode(property /* : string */) /* : Node => PNode */{
  return (node) => ({
    property,
    node
  });
}
function apnode(property /* : string */, node /* : ?Node */) /* : PNode[] */{
  return node ? [{
    property,
    node
  }] : [];
}
const programBody /* : (Program ) =>  PNode[] */ = compose(map(pnode("body")), prop("body"));
function getChildNodes(node /* : Node */) /* : PNode[] */{
  switch (node.type) {
    case "Program":
      return programBody(node);
    case "BlockStatement":
      return map(pnode("body"), node.body || []);
    case "ExpressionStatement":
      return apnode("expression", node.expression);
    case "IfStatement":
      const if_start = concat(apnode("test", node.test), apnode("consequent", node.consequent));
      const if_alt = apnode("alternate", node.alternate);
      return concat(if_start, if_alt);
    case "SwitchStatement":
      return concat(apnode("discriminant", node.discriminant), map(pnode("cases"), node.cases));
    case "SwitchCase":
      const tst = apnode("test", node.test);
      const cons = map(pnode("consequent"), node.consequent);
      return concat(tst, cons);
    case "ReturnStatement":
      return apnode("argument", node.argument);
    case "FunctionExpression":
    case "FunctionDeclaration":
      const nid = apnode("id", node.id);
      const params = map(pnode("params"), node.params || []);
      const body = apnode("body", node.body);
      const fdec = concat(nid, params);
      return concat(fdec, body);
    case "VariableDeclaration":
      return map(pnode("declarations"), node.declarations);
    case "VariableDeclarator":
      const vnid = apnode("id", node.id);
      const vinit = apnode("init", node.init);
      return concat(vnid, vinit);
    case "ArrowFunctionExpression":
      const afparams = map(pnode("params"), node.params || []);
      const afbody = apnode("body", node.body);
      return concat(afparams, afbody);
    case "ArrayPattern":
    case "ArrayExpression":
      const elems = compose(filter(compose(not, isNil)), prop("elements"));
      return map(pnode("elements"), elems(node));
    case "ObjectExpression":
      return map(pnode("properties"), node.properties);
    case "Property":
      const key = apnode("key", node.key);
      const value = node.shorthand ? [] : apnode("value", node.value);
      return concat(key, value);
    case "SpreadElement":
    case "UnaryExpression":
      return apnode("argument", node.argument);
    case "LogicalExpression":
    case "BinaryExpression":
    case "AssignmentExpression":
    case "AssignmentPattern":
      return concat(apnode("left", node.left), apnode("right", node.right));
    case "ConditionalExpression":
      return concat(concat(apnode("test", node.test), apnode("consequent", node.consequent)), apnode("alternate", node.alternate));
    case "CallExpression":
      return concat(apnode("callee", node.callee), map(pnode("arguments"), node.arguments));
    case "MemberExpression":
      return concat(apnode("object", node.object), apnode("property", node.property));
    case "ImportDeclaration":
      return concat(map(pnode("specifiers"), node.specifiers), apnode("source", node.source));
    case "ImportSpecifier":
      return concat(apnode("imported", node.imported), apnode("local", node.local));
    case "ExportNamedDeclaration":
      const decl = apnode("declaratio", node.declaration);
      const src = apnode("source", node.source);
      const head = concat(decl, map(pnode("specifiers"), node.specifiers));
      return concat(head, src);
    case "ExportSpecifier":
      return concat(apnode("local", node.local), apnode("exported", node.exported));
    case "ObjectPattern":
      return map(pnode("properties"), node.properties);
  }
  return [];
}
module.exports = {
  travelProgram,
  travel,
  pnode,
  apnode,
  programBody,
  getChildNodes
};
