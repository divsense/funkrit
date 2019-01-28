/**
 * @file             : /Users/olegkirichenko/projects/divsense/funkrit/test/build-ast.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.01.2019
 * Last Modified Date: 27.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */

import test from 'ava'
import { map, path, compose, find, filter, propEq, always, add } from 'ramda'
import { buildAst } from '../build/test/build-ast.js'
import { right, left, isRight, isLeft } from '../build/test/either.js'
import { runReio as runR } from '../build/test/reader-either-io.js'

test.only('build-ast : full use, noramda', t => {

    const options = {
        noramda: true
    }

    const src =
        "export foo\n" +
        "use '../../libs/number.js'\n" +
        "foo = 123"

    const res = buildAst(src)
    //const x = runR(res, options)

    //console.log("::", x)
    console.log("::", res.run(options).monad.run())

    t.pass()

    /*t.is(isRight(x), true)

    const ast = right(x)
    const imports = filter(propEq('type', 'ImportDeclaration'), ast.body)

    t.is(imports.length, 1)

    t.is(imports[0].source.value, '../../libs/number')
    t.is(imports[0].specifiers.length, 4)*/

})

test('build-ast : full use, implicit ramda', t => {

    const options = {
        noramda: false
    }

    const src =
        "export foo\n" +
        "use '../../libs/number'\n" +
        "foo = 123"

    const res = buildAst(src)
    const x = runR(res, options)

    t.is(isRight(x), true)

    const ast = right(x)

    const imports = compose(map(path(['source', 'value'])), filter(propEq('type', 'ImportDeclaration')))(ast.body)

    t.is(imports.length, 2)

    //t.is(imports.source.value, '../../libs/number')
    //t.is(imports.specifiers.length, 4)

})

test('build-ast : full use, explicit ramda', t => {

    const options = {
        noramda: false
    }

    const src =
        "export foo\n" +
        "use 'ramda'\n" +
        "use '../../libs/number'\n" +
        "foo = 123"

    const res = buildAst(src)
    const x = runR(res, options)

    t.is(isRight(x), true)

    const ast = right(x)

    const imports = compose(map(path(['source', 'value'])), filter(propEq('type', 'ImportDeclaration')))(ast.body)

    t.is(imports.length, 2)

    //t.is(imports.source.value, '../../libs/number')
    //t.is(imports.specifiers.length, 4)

})

test.skip('build-ast : exclusive use', t => {

    const fnk =
        "export foo\n" +
        "use '../../libs/number' but {isNaN, toNumber as nmb}\n" +
        "foo = 123"

    const res = buildAst(fnk)

    const x = runR(res, 3)

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

test.skip('build-ast : empty use .. but', async t => {

    const fnk =
        "export foo\n" +
        "use '../../libs/number' but {}\n" +
        "foo = 123"

    const res = build(fnk)

    const x = await runRepio(res, 3)
    const a = left(x)

    t.is(isLeft(x), true)

})

