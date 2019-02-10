// @flow
/*::
import type { Identifier, Node } from '../../flow-libs/ast-types.js';
*/
const {} = require("ramda");
function moonit(str /* : string */) /* : string */{
  return "moon" + str;
}
function makeIdent(name /* : string */) /* : Identifier */{
  return {
    type: "Identifier",
    name: moonit(name),
    _Identifier: undefined,
    start: 0,
    end: 0,
    loc: {
      end: {
        column: 0,
        line: 0
      },
      start: {
        column: 0,
        line: 0
      }
    },
    typeAnnotation: null,
    innerComments: null,
    leadingComments: null,
    trailingComments: null
  };
}
module.exports = {
  moonit,
  makeIdent
};
