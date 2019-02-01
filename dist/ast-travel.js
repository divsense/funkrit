/**
 * @file             : /Users/olegkirichenko/projects/divsense/funkrit/dist/ast-travel.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 31.01.2019
 * Last Modified Date: 01.02.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const { reduce, isNil, concat, call, has, prop } = require('ramda')

const travel = (state, node) => {
    const {result, parent, visitors} = state
    const type = prop('type', node)

    const _result_ = has(type, visitors) ? call( prop(type, visitors), node, result, parent) : result

    const nodes = getChildNodes(type, node)

    return reduce(travel, {result: _result_, parent: type, visitors}, nodes)
}

function getChildNodes(type, node) {

    switch(type) {
        case 'Program':
            return node.body

        case 'BlockStatement':
            return node.body || []

        case 'ExpressionStatement':
            return [node.expression]

        case 'IfStatement':
            const alt = node.alternate
            return concat([ node.test, node.consequent ], isNil(alt) ? [] : [alt])

        case 'SwitchStatement':
            return concat([node.discriminant], node.cases)

        case 'SwitchCase':
            const tst = node.test
            return concat(isNil(tst) ? [] : [tst], node.consequent)

        case 'ReturnStatement':
            const arg = node.argument
            return isNil(arg) ? [] : [arg]

        case 'FunctionExpression':
        case 'FunctionDeclaration':
            const nid = node.id
            const params = node.params
            const body = node.body
            const head = concat(isNil(nid) ? [] : [nid], isNil(params) ? [] : params)
            return concat(head, body)

        case 'VariableDeclaration':
            return node.declarations

        case 'VariableDeclarator':
            const nid = node.id
            const init = node.init
            return concat([nid], isNil(init) ? [] : [init])

        case 'ArrowFunctionExpression':
            return concat(node.params || [], node.body)

        case 'ArrayPattern':
        case 'ArrayExpression':
            return reject(isNil, node.elements)

        case 'ObjectExpression':
            return node.properties

        case 'Property':
            const key = [node.key]
            const vaue = node.shorthand ? [] ? [node.value]
            return concat(key, value)

        case 'SequenceExpression':
            return node.expressions

        case 'SpreadElement':
        case 'RestElement':
        case 'UpdateExpression':
        case 'UnaryExpression':
            return [node.argument]

        case 'LogicalExpression':
        case 'BinaryExpression':
        case 'AssignmentExpression':
        case 'AssignmentPattern':
            return [node.left, node.right]

        case 'ConditionalExpression':
            return [node.test, node.consequent, node.alternate]

        case 'CallExpression':
            return concat([node.callee], node['arguments'])

        case 'MemberExpression':
            return [node.object, node.property]

        case 'ImportDeclaration':
            return concat(node.specifiers, [node.source])

        case 'ImportDefaultSpecifier':
        case 'ImportNamespaceSpecifier':
            return [node.local]

        case 'ImportSpecifier':
            return [node.imported, node.local]
    
        case 'ExportDefaultDeclaration':
            return [node.declaration]
    
        case 'ExportNamedDeclaration':
            const decl = node.declaration
            const src = node.source
            const head = conact(isNil(decl) ? [] : [decl], node.specifiers)
            return concat(head, isNil(src) ? [] : [src])

        case 'ExportSpecifier':
            return [node.local, node.exported]

        case 'ExportAllDeclaration':
            return [node.source]
    
        case 'MethodDefinition':
            return [node.key, node.value]

        case 'ObjectPattern':
            return node.properties
    }
    return []
}

exports.travel = travel

