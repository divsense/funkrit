/**
 * @file             : dist/selectUsedNames.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.02.2019
 * Last Modified Date: 01.02.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const {take, concat, compose, propEq, path, filter, map, reduce} = require('ramda')
const { travel } = require('ast-travel')

function importedIds(xs, node) {

    if(node.type === 'ImportDeclaration') {
        return concat(xs, compose(
            map(path(['local','name'])),
            filter(propEq('type', 'ImportSpecifier')))
            (node.specifiers))
    }
    return xs
}

function FunctionDeclaration(result, node) {

}

const visitors = {
    FunctionDeclaration,



}

exports.selectUsedNames = function(ast) {

    const importedNames = reduce(importedIds, [], ast.body)
    
    console.log(take(10, importedNames).join(', ') + ' ...')

    const {result} = travel({result: [], visitors}, ast)

    console.log(result)

    return ast
}
