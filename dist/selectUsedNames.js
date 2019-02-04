// @flow
/**
 * @file             : dist/selectUsedNames.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.02.2019
 * Last Modified Date: 01.02.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const { take, lensProp, indexOf, over, append, concat, compose, propEq, path, filter, map, reduce } = require('ramda')
const { travel } = require('./ast-travel')

/*::

import type { Node, Identifier, ImportSpecifier } from '../libs/ast-types'
import type { PNode, State, Context, Result, Visitors } from './ast-travel'

*/

const identifier /*: Context => Result */
    = ({result, parentType, parentProperty, node}) => {
    /*
    const xx = parentType + " : " + parentProperty + " = " + node.name
    if(parentType !== 'ImportSpecifier') {
        console.log(xx)
    }
    */

    if(node.type !== 'Identifier') {
        return result
    }

    switch(parentType) {
        case 'ReturnStatement':
        case 'ExpressionStatement':
        case 'IfStatement':
        case 'SwitchStatement':
        case 'CallExpression':
        case 'ArrayExpression':
        case 'BinaryExpression':
        case 'SpreadElement':
        case 'RestElement':
        case 'UpdateExpression':
        case 'UnaryExpression':
        case 'LogicalExpression':
        case 'BinaryExpression':
        case 'AssignmentExpression':
        case 'AssignmentPattern':
        case 'ConditionalExpression':
            return append(node.name, result)

        case 'VariableDeclarator':
            if(parentProperty === 'init') {
                return append(node.name, result)
            }
            break
        case 'Property':
            if(parentProperty === 'value') {
                return append(node.name, result)
            }
            break
        case 'MemeberExpression':
            if(parentProperty === 'object') {
                return append(node.name, result)
            }
            break
    }

    return result
}

const extractUsedNames /*: string[] => (ImportSpecifier[], ImportSpecifier) => ImportSpecifier[] */ 
    = names => (m, spec) => indexOf(path(['local', 'name'], spec), names) === -1 ? m : append(spec, m)

const usedNames /*: string[] => Node => Node */
    = names => node => node.type === 'ImportDeclaration' ? over(lensProp('specifiers'), reduce(extractUsedNames(names), []), node) : node

const selectUsedNames /*: Node => Node */ = ast => {
    const visitors = { Identifier: identifier }

    const {result} = travel({result: [], parentType: '', visitors}, {property: 'program', node: ast})

    const x = over(lensProp('body'), map(usedNames(result)), ast)

    //  console.log(x.body.map()

    return x
}

exports.selectUsedNames = selectUsedNames

