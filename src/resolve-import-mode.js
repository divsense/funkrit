/**
 * @file             : /Users/olegkirichenko/projects/divsense/funkrit/src/resolve-import-mode.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 02.12.2018
 * Last Modified Date: 09.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const { over, assocPath, assoc, compose, path, prop, lensProp, map, when, both, propEq, pathEq, has } = require('ramda')

const funkritImportMode = type => both(propEq('type', 'ImportDeclaration'), pathEq(['funkrit', 'importMode'], type))

// resolve :: SpecResolver -> ImportDeclaration -> ImportDeclaration
// SpecResolver :: (String, [String]) -> {source, specifiers}
const resolve = f => decl => {
    const name = path(['source', 'value'], decl)
    const specs = prop('specifiers', decl)
    const {libPath, specifiers} = f(name, specs)
    return compose(
        assocPath(['source', 'value'], libPath),
        assoc('specifiers', specifiers)
    )(decl)
}

// resolveImports :: String -> SpecResolver -> AST -> AST
const resolveImports = type => f => over(lensProp('body'), map(when(funkritImportMode(type), resolve(f))))

// resolveFullImports :: String -> (AST -> AST) -> AST -> AST
exports.resolveFullImports = resolveImports('Full')
    
// resolveExclusiveImports :: String -> (AST -> AST) -> AST -> AST
exports.resolveExclusiveImports = resolveImports('Exclusive')
    
