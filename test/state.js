/**
 * @file             : test/state.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 26.12.2018
 * Last Modified Date: 27.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
import test from 'ava'
import { map, add } from 'ramda'
import { State, pureState, StateT } from '../build/test/state.js'

test('State :: map', t => {

    const s1 = pureState(12)
    const s2 = map(add(2), s1)

    t.deepEqual(s1.run(100), [12, 100])
    t.deepEqual(s2.run(222), [14, 222])

})

test('State :: chain', t => {

    const s1 = pureState(2)
    const s2 = s1.chain(x => pureState(x * 10))

    t.deepEqual(s1.run(100), [2, 100])
    t.deepEqual(s2.run(333), [20, 333])

})

