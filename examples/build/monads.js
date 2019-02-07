// @flow
/*::
export type Foom = {fomm:number};
type LocalNON = {fomm:number};
*/
// :: import type { Identifier,Node } from "../../flow-libs/ast-types.js"
const {concat} = require("ramda");
const {sin} = require("../../libs/math.js");
const {} = require("../../flow-libs/ast-types.js");
function moon(name /* : string */) /* : Node */{
  return {
    type: "Identifier",
    name: moonit(name),
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
    }
  };
}
const moonit /* : string => string */ = concat("moon");
module.exports = {
  moon
};
