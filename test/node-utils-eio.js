/**
 * @file             : test/node-utils-eio.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 26.12.2018
 * Last Modified Date: 26.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
import test from 'ava'
import path from 'path'
import { sequence, compose, find, prop, equals, map, always, add } from 'ramda'
import { readExports, writeToFile, isRight, isLeft, runEIO } from '../build/test/node-utils-eio.js'

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

    const url1 = path.resolve('libs/math.js') 
    const url2 = path.resolve('libs/number.js') 
    const eio = map(readExports, [url1, url2])

    //const x1 = runEIO(eio1)

    console.log(">>", eio)

    t.pass()
})
