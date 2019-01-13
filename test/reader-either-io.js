/**
 * @file             : test/reader-either-io.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 26.12.2018
 * Last Modified Date: 12.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
import test from 'ava'
import { map, chain, always, add } from 'ramda'
import { IO, pureIO } from '../build/test/io.js'
import { right, left, isRight, isLeft, EitherT, liftEitherT as liftE } from '../build/test/either.js'
import { liftReaderT as liftR } from '../build/test/reader.js'
import { pureReio, failReio, runReio, askReio, liftIO } from '../build/test/reader-either-io.js'

test('Reio :: map', t => {

    const e1 = pureReio(2)
    const e2 = map(add(2), e1)
    const e3 = map(always(null), e1)
    const e4 = map(x => x/0, e1)
    const e5 = map(x => {throw('err')}, e1)

    const x1 = runReio(e1, 0)
    t.is(right(x1), 2)

    const x2 = runReio(e2, 0)
    t.is(right(x2), 4)

    const x3 = runReio(e3, 0)
    t.is(left(x3), 'null')

    const x4 = runReio(e4, 0)
    t.is(isLeft(x4), true)

    const x5 = runReio(e5, 0)
    t.is(isLeft(x5), true)
    t.is(left(x5), 'err')

})

test('Reio :: chain', t => {

    const e1 = pureReio(2)
    const e2 = chain(x => pureReio(x + 2), e1)
    const e3 = chain(x => failReio('error'), e1)
    const e4 = chain(x => pureReio(33), e3)
    const e5 = chain(x => {throw('a')}, e2)

    const x1 = runReio(e1, 0)
    t.is(right(x1), 2)

    const x2 = runReio(e2, 0)
    t.is(right(x2), 4)

    const x3 = runReio(e3, 0)
    t.is(left(x3), 'error')

    const x4 = runReio(e4, 0)
    t.is(isLeft(x4), true)
    t.is(left(x4), 'error')

    const x5 = runReio(e5)
    t.is(isLeft(x5), true)
    t.is(left(x5), 'a')

})

test('Reio :: lift', t => {

    const io1 = x => IO(() => 'resolved: ' + x)
    const io2 = x => IO(() => x + ' = ok')

    const e1 = pureReio(2)
    const e2 = e1.chain(x => liftR(liftE(io1(x))))
    const e3 = e2.chain(x => liftIO(io2(x)))

    const x2 = runReio(e2, 0)
    t.is(isRight(x2), true)
    t.is(right(x2), 'resolved: 2')

    const x3 = runReio(e3, 0)
    t.is(isLeft(x3), false)
    t.is(right(x3), 'resolved: 2 = ok')
})

test('Repio :: ask', t => {

    const e1 = pureReio(2)
    const e2 = e1.chain(x => askReio())

    const x2 = runReio(e2, 100)
    t.is(right(x2), 100)
})

