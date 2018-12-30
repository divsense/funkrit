/**
 * @file             : test/pio.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 26.12.2018
 * Last Modified Date: 29.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
import test from 'ava'
import { compose, chain, map, always, add } from 'ramda'
import { purePIO, failPIO, PIO } from '../libs/pio.js'

test('PIO :: map', async t => {

    const effect = 10
    const getGlobal = () => Promise.resolve(effect)

    const io1 = purePIO(2)
    const io2 = PIO( getGlobal )
    const io3 = map(x => x * 10, io2)

    const x1 = await io1.run()
    t.is(x1, 2)

    const x2 = await io2.run()
    t.is(x2, 10)

    const x3 = await io3.run()
    t.is(x3, 100)

})

test('IO :: chain', async t => {

    var effect = 10

    const setGlobal = x => PIO(() => {
        effect = x
        return Promise.resolve(33)
    })

    const eff = x => { effect = 100 + x; return Promise.resolve(44) }
    const setGlobal2 = x => purePIO(eff(x))

    const io1 = purePIO(2)
    const io2 = io1.chain(setGlobal)
    const io3 = io2.chain(setGlobal2)

    t.is( effect, 10)

    const i2 = await io2.run()
    t.is(i2, 33)

    t.is( effect, 2)

    const i3 = await io3.run()
    t.is(i3, 44)

    t.is( effect, 133)
})
