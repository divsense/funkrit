/**
 * @file             : test/node-utils-eio.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 26.12.2018
 * Last Modified Date: 27.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
import test from 'ava'
import path from 'path'
import { sequence, compose, find, prop, equals, map, always, add } from 'ramda'
import { RightIO, isRight, isLeft, runEIO, pureEIO } from '../build/test/either-io.js'
import { readExports, writeToFile } from '../build/test/node-utils-eio.js'

test('readExports, happy path', t => {

    const eio1 = map(compose(find(equals('find')), prop('exports')), readExports('ramda'))
    const url = path.resolve('libs/math.js') 
    const eio2 = map(compose(find(equals('sin')), prop('exports')), readExports(url))

    const x1 = runEIO(eio1)

    t.is(isRight(x1), true)
    t.is(x1.right, 'find')

    const x2 = runEIO(eio2)

    t.is(isRight(x2), true)
    t.is(x2.right, 'sin')

})

test('readExports, unhappy path', t => {

    const url = path.resolve('libs/math-nono.xx') 
    const eio1 = map(compose(find(equals('sin')), prop('exports')), readExports(url))

    const x1 = runEIO(eio1)

    t.is(isLeft(x1), true)
})

test('readExports, sequence', t => {

    const url1 = '../../libs/math.js'  // relative to build/test
    const url2 = '../../libs/number.js'
    const mxs = map(readExports, [url1, url2])
    const eio = sequence(RightIO, mxs)

    const x = runEIO(eio)

    t.is(isRight(x), true)
    t.is(x.right.length, 2)

})
