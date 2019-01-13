/**
 * @file             : test/either-io.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 26.12.2018
 * Last Modified Date: 12.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
import test from 'ava'
import { map, chain, always, add, lift as liftList } from 'ramda'
import { right, left, isRighht, isLeft, EitherT, runEitherT, liftEitherT as liftE } from '../build/test/either.js'
import { pureIO, IO } from '../build/test/io.js'
import { RightIO, LeftIO } from '../build/test/either-io.js'

test('EitherIO :: map', t => {

    const e1 = RightIO(2)
    const e2 = map(add(2), e1)
    const e3 = map(always(null), e1)
    const e4 = map(x => x/0, e1)
    const e5 = map(x => {throw('a')}, e1)

    const x1 = runEitherT(e1)
    t.is(right(x1), 2)

    const x2 = runEitherT(e2)
    t.is(right(x2), 4)

    const x3 = runEitherT(e3)
    t.is(left(x3), 'null')

    const x4 = runEitherT(e4)
    t.is(isLeft(x4), true)

    const x5 = runEitherT(e5)
    t.is(isLeft(x5), true)

})

test('EitherIO :: chain', t => {

    const e1 = RightIO(2)
    const e2 = e1.chain(x => RightIO(x + 2))
    const e3 = chain(x => LeftIO('error'), e1)
    const e4 = chain(x => RightIO(33), e3)
    const e5 = e2.chain(x => {throw('throw')})

    const x1 = runEitherT(e1)
    t.is(right(x1), 2)

    const x2 = runEitherT(e2)
    t.is(right(x2), 4)

    const x3 = runEitherT(e3)
    t.is(left(x3), 'error')

    const x4 = runEitherT(e4)
    t.is(isLeft(x4), true)
    t.is(left(x4), 'error')

    const x5 = runEitherT(e5)
    t.is(isLeft(x5), true)
    t.is(left(x5), 'throw')

})

test('EitherIO :: lift', t => {

    const e1 = RightIO(2)

    const e2 = chain(x => liftE(pureIO(x + 8)), e1)

    const io = IO(() => 11)
    const e3 = chain(x => liftE(io), e1)

    const x2 = runEitherT(e2)
    t.is(right(x2), 10)

    const x3 = runEitherT(e3)
    t.is(right(x3), 11)

})

