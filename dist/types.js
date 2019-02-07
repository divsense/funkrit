// @flow
/**
 * @file             : dist/types.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.02.2019
 * Last Modified Date: 01.02.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const { take, set, has, lensProp, indexOf, over, append, concat, compose, propEq, path, filter, map, reduce } = require('ramda')

/*::
import type { Node } from '../flow-libs/ast-types'
*/

const importTypes /*: Node => Node */ = ast => {

    const ti = reduce((m,a) => {
        const specs = map(path(['imported', 'name']), filter(has('funkrit'), a.specifiers))
        if(specs.length > 0) {
            return m + 'import type { ' + specs.join(',') + ' } from "' + a.source.value + '";\n'
        } else {
            return m
        }
    }, '', filter(propEq('type', 'ImportDeclaration'), ast.body))

    if(ti === '') {
        return ast
    }

    return compose(
        over(lensProp('comments'), cm => append({
                type: 'Block',
                value: '::\n' + ti
        }, cm))
        , over(lensProp('body'), map(st => {
            if(st.type === 'ImportDeclaration') {
                return over(lensProp('specifiers'), reduce((m,a) => {
                    if(has('funkrit', a)) {
                        return m
                    } else {
                        return append(a, m)
                    }
                }, []), st)
            }
            return st
        }))
    )( ast )
}

exports.importTypes = importTypes

