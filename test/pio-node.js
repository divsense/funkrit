/**
 * @file             : test/pio-node.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 26.12.2018
 * Last Modified Date: 02.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
import test from 'ava'
import { compose, find, prop, equals, map, always, add } from 'ramda'
import { readExportedNames } from '../libs/pio-node.js'

test('pio-node :: readExportedNames', async t => {

    const io1 = map(compose(find(equals('find')), prop('exported')), readExportedNames('ramda'))
    const io2 = map(compose(find(equals('sin')), prop('exported')), readExportedNames('../libs/math'))

    const x1 = await io1.run()
    t.is(x1, 'find')

    const x2 = await io2.run()
    t.is(x2, 'sin')


})
