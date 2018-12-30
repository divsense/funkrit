/**
 * @file             : test/reader.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 26.12.2018
 * Last Modified Date: 29.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
import test from 'ava'
import { map, add } from 'ramda'
import { Right, Left, isRight, right, left } from '../build/test/either.js'
import { Reader, pureReader, ask, ReaderT, askT } from '../build/test/reader.js'

test('Reader :: map', t => {
    const s1 = pureReader(12)
    const s2 = map(add(2), s1)

    t.is(s1.run(0), 12)
    t.is(s2.run(0), 14)
})

test('Reader :: ask', t => {
    t.is(ask().run(55), 55)
})

test('Reader :: chain', t => {
    const s1 = pureReader(2)
    const s2 = s1.chain(x => ask())
    const s3 = s2.chain(x => pureReader(x * 10))

    t.is(s1.run(100), 2)
    t.is(s2.run(3), 3)
    t.is(s3.run(3), 30)
})

test('ReaderT :: map', t => {
    const r1 = ReaderT( r => Right(2) )
    const r2 = map(x => x + 2, r1)

    const ma1 = r1.run(0)
    const ma2 = r2.run(0)

    t.is(isRight(ma1), true)
})

test('ReaderT :: chain', t => {
    const r1 = ReaderT( r => Right(2) )
    const r2 = r1.chain(x => askT(Right))

    const ma1 = r1.run(0)
    const ma2 = r2.run(199)

    t.is(isRight(ma1), true)
    t.is(isRight(ma2), true)
    t.is(right(ma2), 199)
})
