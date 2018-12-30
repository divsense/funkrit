/**
 * @file             : test/io.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 26.12.2018
 * Last Modified Date: 28.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
import test from 'ava'
import { compose, chain, map, always, add } from 'ramda'
import { pureIO, runIO, IO } from '../build/test/io.js'

test('IO :: map', t => {

    const effect = 10
    const getGlobal = () => effect

    const io1 = pureIO(2)
    const io2 = IO( getGlobal )
    const io3 = map(x => x * 10, io2)

    t.is( runIO(io1), 2)
    t.is( runIO(io2), 10)
    t.is( runIO(io3), 100)

})

test('IO :: chain', t => {

    var effect = 10

    const setGlobal = x => IO(() => {
        effect = x
        return 33
    })

    const eff = x => { effect = 100 + x; return 44 }
    const setGlobal2 = x => pureIO(eff(x))

    const io1 = pureIO(2)
    const io2 = io1.chain(setGlobal)
    const io3 = io2.chain(setGlobal2)

    t.is( effect, 10)
    t.is( runIO(io2), 33)
    t.is( effect, 2)
    t.is( runIO(io3), 44)
    t.is( effect, 133)
})
