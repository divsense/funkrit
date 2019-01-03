/**
 * @file             : test/build-ast.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.01.2019
 * Last Modified Date: 02.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */

import test from 'ava'
import { map, chain, always, add } from 'ramda'
import { build } from '../build/test/build-ast.js'
import { right, left } from '../build/test/either.js'
import { runRepio } from '../build/test/reader-either-pio.js'

test('build-ast', async t => {

    const fnk =
        "export foo\n" +
        "use '../../libs/math'\n" +
        "use '../../libs/number'\n" +
        "foo = 123"

    const res = build(fnk)

    const x = await runRepio(res, 3)
    const a = right(x)

    console.log(">>", a)

    t.pass()

    //t.is(a[0], 'T')

})

