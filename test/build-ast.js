/**
 * @file             : test/build-ast.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.01.2019
 * Last Modified Date: 06.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */

import test from 'ava'
import { map, find, propEq, always, add } from 'ramda'
import { build } from '../build/test/build-ast.js'
import { right, left, isRight, isLeft } from '../build/test/either.js'
import { runRepio } from '../build/test/reader-either-pio.js'

test('build-ast : full use', async t => {

    const fnk =
        "export foo\n" +
        "use '../../libs/number'\n" +
        "foo = 123"

    const res = build(fnk)

    const x = await runRepio(res, 3)

    t.is(isRight(x), true)

    const ast = right(x)
    const imports = find(propEq('type', 'ImportDeclaration'), ast.body)

    t.truthy(imports)

    t.is(imports.source.value, '../../libs/number')
    t.is(imports.specifiers.length, 4)

})

test('build-ast : exclusive use', async t => {

    const fnk =
        "export foo\n" +
        "use '../../libs/number' but {isNaN, toNumber as nmb}\n" +
        "foo = 123"

    const res = build(fnk)

    const x = await runRepio(res, 3)

    t.is(isRight(x), true)

    const ast = right(x)

    const imports = find(propEq('type', 'ImportDeclaration'), ast.body)
    t.truthy(imports)

    t.is(imports.source.value, '../../libs/number')
    t.is(imports.specifiers.length, 3)

    const imp1 = find(x => x.imported.name === 'isNaN', imports.specifiers)
    const imp2 = find(x => x.imported.name === 'toNumber' && x.local.name === 'nmb', imports.specifiers)

    t.falsy(imp1)
    t.truthy(imp2)
})

test('build-ast : empty use .. but', async t => {

    const fnk =
        "export foo\n" +
        "use '../../libs/number' but {}\n" +
        "foo = 123"

    const res = build(fnk)

    const x = await runRepio(res, 3)
    const a = left(x)

    t.is(isLeft(x), true)

})

