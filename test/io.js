/**
 * @file             : test/io.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 26.12.2018
 * Last Modified Date: 26.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
import test from 'ava'
import { compose, chain, map, always, add } from 'ramda'
import { pureIO, failIO, IO } from '../build/io.js'

test('IO :: functor', t => {

    const effect = 10
    const getGlobal = () => effect

    const io1 = pureIO(2)
    const io2 = IO( getGlobal )
    const io3 = map(x => x * 10, io2)

    const io4 = map(x => null, io3)
    const io5 = map(x => 2, io4)

    const io6 = map(x => {throw "Error!"}, io3)
    const io7 = map(x => 2, io6)

    const io8 = map(x => x/0, io3)
    const io9 = map(x => 2, io8)

    const io10 = map(x => x/"a", io3)
    const io11 = map(x => 2, io8)

    t.is( io1.run(), 2)
    t.is( io2.run(), 10)
    t.is( io3.run(), 100)

    t.is( io4.run(), null)
    t.is( io4.error[0], 1)
    t.is( io5.error[0], 1)

    t.is( io6.run(), null)
    t.is( io6.error[0], 1)
    t.is( io7.error[0], 1)

    t.is( io8.run(), null)
    t.is( io9.error[0], 1)
    t.is( io9.error[0], 1)

    t.is( io10.run(), null)
    t.is( io11.error[0], 1)
    t.is( io11.error[0], 1)

})

test('IO :: monad', t => {

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
    t.is( io2.run(), 33)
    t.is( effect, 2)
    //t.is( runIO(io3), 44)
    //t.is( effect, 133)
})

/*
test('IO :: applicative', t => {

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
*/
