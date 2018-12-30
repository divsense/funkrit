/**
 * @file             : test/reader-either-pio.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 26.12.2018
 * Last Modified Date: 30.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
import test from 'ava'
import { map, chain, always, add } from 'ramda'
import { PIO, purePIO } from '../libs/pio.js'
import { right, left, isRighht, isLeft, EitherT, liftRight } from '../build/test/either.js'
import { liftReaderT } from '../build/test/reader.js'
import { pureRepio, failRepio, runRepio, askRepio, liftPIO } from '../build/test/reader-either-pio.js'

test('Repio :: map', async t => {

    const e1 = pureRepio(2)
    const e2 = map(add(2), e1)
    const e3 = map(always(null), e1)
    const e4 = map(x => x/0, e1)
    const e5 = map(x => {throw('a')}, e1)

    const x1 = await runRepio(e1, 0)
    t.is(right(x1), 2)

    const x2 = await runRepio(e2, 0)
    t.is(right(x2), 4)

    const x3 = await runRepio(e3, 0)
    t.is(left(x3), 'null')

    const x4 = await runRepio(e4, 0)
    t.is(isLeft(x4), true)

    const x5 = await runRepio(e5, 0)
    t.is(isLeft(x5), true)

})

test('Repio :: chain', async t => {

    const e1 = pureRepio(2)
    const e2 = chain(x => pureRepio(x + 2), e1)
    const e3 = chain(x => failRepio('error'), e1)
    const e4 = chain(x => pureRepio(33), e3)
    const e5 = chain(x => {throw('a')}, e2)

    const x1 = await runRepio(e1, 0)
    t.is(right(x1), 2)

    const x2 = await runRepio(e2, 0)
    t.is(right(x2), 4)

    const x3 = await runRepio(e3, 0)
    t.is(left(x3), 'error')

    const x4 = await runRepio(e4, 0)
    t.is(isLeft(x4), true)
    t.is(left(x4), 'error')

    const x5 = await runRepio(e5).catch(x => t.is(x, 'a'))
    t.falsy(x5)

})

test('Repio :: lift', async t => {

    const pio1 = x => PIO(() => Promise.resolve('resolved: ' + x))
    const pio2 = x => PIO(() => Promise.resolve(x + ' = ok'))

    const e1 = pureRepio(2)
    const e2 = e1.chain(x => liftReaderT(liftRight(pio1(x))))
    const e3 = e2.chain(x => liftPIO(pio2(x)))

    const x2 = await runRepio(e2, 0)
    t.is(right(x2), 'resolved: 2')

    const x3 = await runRepio(e3, 0)
    t.is(right(x3), 'resolved: 2 = ok')
})

test('Repio :: ask', async t => {

    const e1 = pureRepio(2)
    const e2 = e1.chain(x => askRepio())

    const x2 = await runRepio(e2, 100)
    t.is(right(x2), 100)
})

