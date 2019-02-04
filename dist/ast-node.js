/**
 * @file             : dist/ast-node.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.12.2018
 * Last Modified Date: 27.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const { identity, append, reduce, objOf, keys, not, any, both, pathEq, prepend, over, concat, lensProp, nth, indexOf, always, filter, map, compose, prop, path, propEq, find, assoc } = require('ramda')
const {parse} = require('../build/peg-parser.js')
const {Right} = require('./either.js')
const { selectUsedNames } = require('./selectUsedNames.js')

const ident = compose(
    compose(assoc('type', 'Identifier'), objOf('name'))
)

const impSpecs = name => ({
    type: 'ImportSpecifier',
    imported: ident(name),
    local: ident(name)
})

// fullImport :: String, [String] -> ImportDeclaration
const fullImport = (name, imps) => ({
    type: "ImportDeclaration",
    source: {
        type: 'Literal',
        value: name
    },
    specifiers: map(impSpecs, imps),
    funkrit: {importMode: 'Full'}
})

// addRamdaImport :: AST -> AST
const addRamdaImport = over(lensProp('body'), prepend(fullImport('ramda', keys(require('ramda')))))

//noExplicitRamdaImport :: AST -> Bool
const noExplicitRamdaImport = compose(
    not,
    any(both(propEq('type', 'ImportDeclaration'), pathEq(['source', 'value'], 'ramda'))),
    prop('body')
)

const addRamda = () => {
    const libName = 'ramda'
    const libPath = 'ramda'
    const names = keys(require('ramda')) || []
    return { libName, libPath, names }
}

const importToRequire = over(lensProp('body'), reduce((m,a) => {

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

const test = x => {

    const mm = Right(12)

    console.log("/*")
    console.log(mm)
    console.log("*/")

    return x
}


exports.parse = compose(/* test, */ importToRequire, selectUsedNames, addRamdaImport, parse)

