// @flow
/**
 * @file             : ast-travel.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 02.02.2019
 * Last Modified Date: 02.02.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const { reduce, filter, map, compose, identity, reject, isNil, concat, call, has, prop } = require('ramda')

/*::

import type {Node, Statement} from '../libs/ast-types.js'

type ParentProperty = string
type ParentType = string

export type Result = any
export type Context = {
    result: Result,
    node: Node,
    parentType: string,
    parentProperty: string
}

export type Visitors = {
    [string]: Context => Result
}

export type PNode = {
    property: string,
    node: Node
}

export type State = {
    result: Result,
    parentType: string,
    visitors: Visitors
}

 */

const travel /* : (State, PNode) => State  */ = (state, pnode) => {
    const {result, parentType, visitors} = state
    const {property, node} = pnode
    const type = node.type

    const resultA = has(type, visitors) ? prop(type, visitors)({result, node, parentType, parentProperty: property}) : result

    const pnodes = getChildNodes(node)

    const { result: resultB } = reduce(travel, {result: resultA, parentType: type, visitors}, pnodes)

    return { result: resultB, parentType, visitors }
}

const pnode /* : string => Node => PNode */ = property => node => ({property, node})
const apnode /* : (string, ?Node) => PNode[] */ = (property, node) => node ? [{property, node}] : []

function getChildNodes(node /* : Node */) /* : PNode[]  */ {

    switch(node.type) {
        case 'Program':
            return map(pnode('body'), node.body)

        case 'BlockStatement':
            return map(pnode('body'), node.body || [])

        case 'ExpressionStatement':
            return apnode('expression', node.expression)

        case 'IfStatement':
            const if_start = concat(apnode('test', node.test), apnode('consequent', node.consequent))
            const if_alt = apnode('alternate', node.alternate)
            return concat(if_start, if_alt)

        case 'SwitchStatement':
            return concat(apnode('discriminant', node.discriminant), map(pnode('cases'), node.cases))

        case 'SwitchCase':
            const tst = apnode('test', node.test)
            const cons = map(pnode('consequent'), node.consequent)
            return concat(tst, cons)

        case 'ReturnStatement':
            return apnode('argument', node.argument)

        case 'FunctionExpression':
        case 'FunctionDeclaration':
            const nid = apnode('id', node.id)
            const params = map(pnode('params'), node.params || [])
            const body = apnode('body', node.body)
            const fdec = concat(nid, params)
            return concat(fdec, body)

        case 'VariableDeclaration':
            return map(pnode('declarations'), node.declarations)

        case 'VariableDeclarator':
            const vnid = apnode('id', node.id)
            const vinit = apnode('init', node.init)
            return concat(vnid, vinit)

        case 'ArrowFunctionExpression':
            const afparams = map(pnode('params'), node.params || [])
            const afbody = apnode('body', node.body)
            return concat(afparams, afbody)

        case 'ArrayPattern':
        case 'ArrayExpression':
            const nodes = node.elements.filter(Boolean)
            return map(pnode('elements'), nodes)

        case 'ObjectExpression':
            return map(pnode('properties'), node.properties)

        case 'Property':
            const key = apnode('key', node.key)
            const value = node.shorthand ? [] : apnode('value', node.value)
            return concat(key, value)

        case 'SpreadElement':
        case 'RestElement':
        case 'UpdateExpression':
        case 'UnaryExpression':
            return apnode('argument', node.argument)

        case 'LogicalExpression':
        case 'BinaryExpression':
        case 'AssignmentExpression':
        case 'AssignmentPattern':
            return concat(apnode('left', node.left), apnode('right', node.right))

        case 'ConditionalExpression':
            return concat( concat(apnode('test', node.test), apnode('consequent', node.consequent)), apnode('alternate', node.alternate))

        case 'CallExpression':
            return concat(apnode('callee', node.callee), map(pnode('arguments'), node['arguments']))

        case 'MemberExpression':
            return concat(apnode('object', node.object), apnode('property', node.property))

        case 'ImportDeclaration':
            return concat(map(pnode('specifiers'), node.specifiers), apnode('source', node.source))

        case 'ImportDefaultSpecifier':
        case 'ImportNamespaceSpecifier':
            return apnode('local', node.local)

        case 'ImportSpecifier':
            return concat(apnode('imported', node.imported), apnode('local', node.local))
    
        case 'ExportDefaultDeclaration':
            return apnode('declaratio', node.declaration)
    
        case 'ExportNamedDeclaration':
            const decl = apnode('declaratio', node.declaration)
            const src = apnode('source', node.source)
            const head = concat(decl, map(pnode('specifiers'), node.specifiers))
            return concat(head, src)

        case 'ExportSpecifier':
            return concat(apnode('local', node.local), apnode('exported', node.exported))

        case 'ExportAllDeclaration':
            return apnode('source', node.source)
    
        case 'MethodDefinition':
            return concat(apnode('key', node.key), apnode('value', node.value))

        case 'ObjectPattern':
            return map(pnode('properties'), node.properties)
    }
    return []
}

exports.travel = travel

