/**
 * @file             : src/parse.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.12.2018
 * Last Modified Date: 09.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const { objOf, over, concat, lensProp, nth, indexOf, always, filter, map, compose, prop, path, propEq, find, assoc } = require('ramda')
const peg = require('./peg.js')
const {resolveFullImports, resolveExclusiveImports} = require('./resolve-import-mode.js')

const ident = compose(
    compose(assoc('type', 'Identifier'), objOf('name'))
)

const impSpecs = ({local, imported}) => ({
    type: 'ImportSpecifier',
    imported: ident(imported),
    local: ident(local)
})

// updateImports :: ((ImportDeclaration, [String]) -> [String]) -> [EmbeddedLib] -> ImportDeclaration -> ImportDeclaration
const updateImports = f => embeddedLibs => (name, specs) => {
    const lib = find(propEq('libName', name), embeddedLibs)
    const libNames = prop('names', lib)
    const names = compose(filter(x => !!x), map(f(specs)))(libNames)
    const specifiers = map(impSpecs, names)
    const libPath = prop('libPath', lib)
    return {libPath, specifiers}
}

// fullImports :: [EmbeddedLib] -> ImportDeclaration -> ImportDeclaration
const fullImports = updateImports(_ => x => ({local: x, imported: x}))
const exclusiveImports = updateImports(specs => x => {
    const index = indexOf(x, map(path(['imported', 'name']), specs))
    if(index > -1) {
        const y = compose(path(['local', 'name']), nth(index))(specs)
        if(y === x) {
            return null
        } else {
            return {local: y, imported: x}
        }

    } else {
        return {local: x, imported: x}
    }
})

// toFullImport :: String -> ImportDeclaration
const toFullImport = name => ({
    type: "ImportDeclaration",
    source: {
        type: 'Literal',
        value: name
    },
    specifiers: [],
    funkrit: {importMode: 'Full'}
})

// addImplicitImports :: [ImplicitLib] -> AST -> AST
const addImplicitImports = impLibs => over(lensProp('body'), concat(map(toFullImport, impLibs)))

// parse :: Options -> String -> AST
// Options ::
//   embeddedLibs ::
//     lib :: String
//     names :: [String]
//
module.exports = ({embeddedLibs, implicitLibs}) => compose(
    resolveExclusiveImports(exclusiveImports(embeddedLibs)),
    resolveFullImports(fullImports(embeddedLibs)),
    addImplicitImports(implicitLibs),
    peg.parse)


