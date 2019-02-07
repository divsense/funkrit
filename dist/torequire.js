// @flow

const { over, map, append, lensProp, reduce } = require('ramda')

/*::
 
import type Node from '../flow-libs/ast-types.js'

*/

const import2require /*: Node -> Node */ = over(lensProp('body'), reduce((m,a) => {
    if(a.type === 'ImportDeclaration') {
        const req = {
            type: "VariableDeclaration",
            declarations: [
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "ObjectPattern",
                        properties: map(s => {
                            return {
                                type: "Property",
                                method: false,
                                shorthand: s.imported.name === s.local.name,
                                computed: false,
                                key: {
                                    type: "Identifier",
                                    name: s.imported.name
                                },
                                value: {
                                    type: "Identifier",
                                    name: s.local.name
                                },
                                kind: "init"
                            }

                        }, a.specifiers)
                    },
                    init: {
                        type: "CallExpression",
                        callee: {
                            type: "Identifier",
                            name: "require"
                        },
                        arguments: [
                            {
                                type: "Literal",
                                value: a.source.value,
                                raw: a.source.raw
                            }
                        ]
                    }
                }
            ],
            kind: "const"
        }
        return append(req, m)
    }
    return append(a, m)
}, []))

const export2require /*: Node -> Node */ = over(lensProp('body'), reduce((m,a) => {
    /*
    {
      "type": "ExportNamedDeclaration",
      "specifiers": [
        {
          "type": "ExportSpecifier",
          "local": {
            "type": "Identifier",
            "name": "moon"
          },
          "exported": {
            "type": "Identifier",
            "name": "moon"
          }
        }
      ]
    }
    */
    if(a.type === 'ExportNamedDeclaration') {
        const node = {
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
                    properties: map(spec => ({
                            type: "Property",
                            key: {
                                type: "Identifier",
                                name: spec.exported.name
                            },
                            computed: false,
                            value: {
                                type: "Identifier",
                                name: spec.exported.name
                            },
                            kind: "init",
                            method: false,
                            shorthand: true
                        }), a.specifiers)
                }
            }
        }
        return append(node, m)
    }
    return append(a, m)
}, []))

module.exports = { import2require, export2require }


