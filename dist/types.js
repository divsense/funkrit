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
            return append({
                type: 'Line',
                value: ':: import type { ' + specs.join(',') + ' } from "' + a.source.value + '"'
            }, m)
        } else {
            return m
        }
    }, [], filter(propEq('type', 'ImportDeclaration'), ast.body))

    if(ti.length === 0) {
        return ast
    }

    return compose(
        over(lensProp('comments'), cm => concat(cm, ti))
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

const exportTypes /*: Node => Node */ = ast => {

    const typesExported = reduce((m,a) => {
        const ex = map(path(['exported', 'name']), filter(has('funkrit'), a.specifiers))
        return concat(m, ex)
    }, [], filter(propEq('type', 'ExportNamedDeclaration'), ast.body))

    if(typesExported.length === 0) {
        return ast
    }

    return compose(
        over(lensProp('comments'), append({
            type: 'Line',
            value: ':: export type ' + typesExported.join(',')
        }))
        , over(lensProp('body'), map(st => {
            if(st.type === 'ExportNamedDeclaration') {
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

exports.exportTypes = exportTypes
exports.importTypes = importTypes

