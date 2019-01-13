/**
 * @file             : test/ast-utils.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.01.2019
 * Last Modified Date: 06.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */

import test from 'ava'
import { view  } from 'ramda'
import { updateFunkritUseImports } from '../build/test/ast-utils.js'

test('ast-utils :: updateFunkritUseImports', t => {

    const ast = {
        body: [
            {
                type: 'ImportDeclaration'
            },
            {
                type: 'ImportDeclaration',
                source: {value: 'foo'},
                funkrit: {use: 'Full'},
                specifiers: []
            },
            {
                type: 'ImportDeclaration',
                source: {value: 'bar'},
                funkrit: {use: 'Exclusive'},
                specifiers: [
                    {
                        type: 'ImportSpecifier',
                        imported: {
                            type: 'Identifier',
                            name: 'kuku'
                        },
                        local: {
                            type: 'Identifier',
                            name: 'lama'
                        }
                    },
                    {
                        type: 'ImportSpecifier',
                        imported: {
                            type: 'Identifier',
                            name: 'salad'
                        },
                        local: {
                            type: 'Identifier',
                            name: 'salad'
                        }
                    }
                ]
            }
        ]
    }

    const libexp1 = {
        url: 'foo',
        exports: [ 'f1', 'f2' ]
    }

    const ast1 = updateFunkritUseImports(ast, libexp1)

    t.is(ast1.body[1].specifiers[0].imported.name, 'f1')
    t.is(ast1.body[1].specifiers[1].imported.name, 'f2')

    const libexp2 = {
        url: 'bar',
        exports: [ 'kuku', 'salad', 'soup' ]
    }

    const ast2 = updateFunkritUseImports(ast, libexp2)

    t.is(ast2.body[2].specifiers.length, 2)
    t.is(ast2.body[2].specifiers[0].imported.name, 'kuku')
    t.is(ast2.body[2].specifiers[0].local.name, 'lama')
    t.is(ast2.body[2].specifiers[1].imported.name, 'soup')
    t.is(ast2.body[2].specifiers[1].local.name, 'soup')

})

