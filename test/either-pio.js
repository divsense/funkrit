/**
 * @file             : test/either-pio.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 26.12.2018
 * Last Modified Date: 30.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
import test from 'ava'
import { map, chain, always, add } from 'ramda'
import { PIO, purePIO } from '../libs/pio.js'
import { right, left, isRighht, isLeft, EitherT, runEitherT } from '../build/test/either.js'
import { RightPIO, LeftPIO } from '../build/test/either-pio.js'

test('EitherPIO :: map', async t => {

    const e1 = RightPIO(2)
    const e2 = map(add(2), e1)
    const e3 = map(always(null), e1)
    const e4 = map(x => x/0, e1)
    const e5 = map(x => {throw('a')}, e1)

    const x1 = await runEitherT(e1)
    t.is(right(x1), 2)

    const x2 = await runEitherT(e2)
    t.is(right(x2), 4)

    const x3 = await runEitherT(e3)
    t.is(left(x3), 'null')

    const x4 = await runEitherT(e4)
    t.is(isLeft(x4), true)

    const x5 = await runEitherT(e5)
    t.is(isLeft(x5), true)

})

test('EitherPIO :: chain', async t => {

    const e1 = RightPIO(2)
    const e2 = chain(x => RightPIO(x + 2), e1)
    const e3 = chain(x => LeftPIO('error'), e1)
    const e4 = chain(x => RightPIO(33), e3)
    const e5 = chain(x => {throw('a')}, e2)

    const e6 = chain(x => EitherT(PIO(() => Promise.reject('rejected: ' + x))), e1)
    const e7 = chain(x => RightPIO('ok'), e6)

    const x1 = await runEitherT(e1)
    t.is(right(x1), 2)

    const x2 = await runEitherT(e2)
    t.is(right(x2), 4)

    const x3 = await runEitherT(e3)
    t.is(left(x3), 'error')

    const x4 = await runEitherT(e4)
    t.is(isLeft(x4), true)
    t.is(left(x4), 'error')

    const x5 = await runEitherT(e5).catch(x => t.is(x, 'a'))
    t.falsy(x5)

    const x6 = await runEitherT(e7).catch(x => t.is(x, 'rejected: 2'))
    t.falsy(x6)

})

