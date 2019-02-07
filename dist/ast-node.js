/** @flow
 *
 * @file             : dist/ast-node.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.12.2018
 * Last Modified Date: 27.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const { identity, append, reduce, objOf, keys, not, any, both, pathEq, prepend, over, concat, lensProp, nth, indexOf, always, filter, map, compose, prop, path, propEq, find, assoc } = require('ramda')
const { parse } = require('../build/peg-parser.js')
const { selectUsedNames } = require('./selectUsedNames.js')
const { importTypes, exportTypes } = require('./types.js')
const { export2require, import2require } = require('./torequire.js')

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

/*
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
*/

exports.parse = compose( export2require, import2require, importTypes, /* exportTypes, */ selectUsedNames, addRamdaImport, parse)

