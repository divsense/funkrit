/**
 * @file             : test/either.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 26.12.2018
 * Last Modified Date: 28.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
import test from 'ava'
import { map, chain, always, add } from 'ramda'
import { IO, pureIO } from '../build/test/io.js'
import { Right, Left, isRight, isLeft, right, left, EitherT } from '../build/test/either.js'

test('Either :: map', t => {

    const e1 = Right(2)
    const e2 = map(add(2), e1)
    const e3 = map(always(null), e1)
    const e4 = map(x => x/0, e1)
    const e5 = map(x => {throw('a')}, e1)

    t.is(right(e1), 2)
    t.is(right(e2), 4)
    t.is(left(e3), 'null')
    t.is(isLeft(e4), true)
    t.is(isLeft(e5), true)

})

test('Either :: chain', t => {

    const e1 = Right(2)
    const e2 = chain(x => Right(x + 2), e1)
    const e3 = chain(x => Left('error'), e1)
    const e4 = chain(x => {throw('a')}, e1)
    const e5 = chain(x => Right(33), e3)

    t.is(right(e2), 4)
    t.is(left(e3), 'error')
    t.is(left(e4), 'a')
    t.is(left(e5), 'error')
})

test('EitherT :: map', t => {

    const A = 33

    const getGlobalA = pureIO(Right(A))

    const eio1 = EitherT(getGlobalA)
    const eio2 = map(x => x * 2, eio1)
    const eio3 = map(x => {throw('a')}, eio2)

    const res1 = eio2.monad.run()
    const res2 = eio3.monad.run()

    t.is(isRight(res1), true)
    t.is(right(res1), 66)
    t.is(isRight(res2), false)

})

test('EitherT :: chain', t => {

    var A = 44

    const eio1 = EitherT(pureIO(Right(11)))
    const eio2 = chain(x => EitherT( IO(() => {A = x; return Right(90 + x)}) ), eio1)

    t.is(A, 44)
    const r1 = eio1.monad.run()
    t.is(A, 44)
    const r2 = eio2.monad.run()
    t.is(A, 11)
    t.is(isRight(r2), true)
    t.is(right(r2), 101)



})

