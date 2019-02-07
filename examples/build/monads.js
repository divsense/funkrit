// @flow
/*::
export type Foom = {fomm:number};
export type LocalNON = {fomm:number};
*/
const {concat} = require("ramda");
function moon(name /* : string */) /* : Identifier */{
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
const moonit /* : string => string */ = concat("moon");
