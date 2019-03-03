// @flow
/*::
import type { Node } from './ast-types';
import type { Context, Visitors } from './ast-travel';
*/
const {append, indexOf} = require("ramda");
const {travelProgram} = require("./ast-travel");
function considerName(name /* : string */, result /* : string[] */) /* : string[] */{
  return indexOf(name, result) > -1 ? result : append(name, result);
}
function identifier({result, parentType, parentProperty, node} /* : Context<string[]> */) /* : string[] */{
  if (node.type !== "Identifier") {
    return result;
  }
  switch (parentType) {
    case "ReturnStatement":
    case "ExpressionStatement":
    case "IfStatement":
    case "SwitchStatement":
    case "CallExpression":
    case "ArrayExpression":
    case "BinaryExpression":
    case "SpreadElement":
    case "RestElement":
    case "UpdateExpression":
    case "UnaryExpression":
    case "LogicalExpression":
    case "BinaryExpression":
    case "AssignmentExpression":
    case "AssignmentPattern":
    case "ConditionalExpression":
      return considerName(node.name, result);
    case "VariableDeclarator":
      if (parentProperty === "init") {
        return considerName(node.name, result);
      }
      break;
    case "Property":
      if (parentProperty === "value") {
        return considerName(node.name, result);
      }
      break;
    case "MemeberExpression":
      if (parentProperty === "object") {
        return considerName(node.name, result);
      }
      break;
  }
  return result;
}
const requiredIdentifiers /* : (Node ) =>  string[] */ = travelProgram([], {
  Identifier: identifier
});
module.exports = {
  considerName,
  identifier,
  requiredIdentifiers
};
