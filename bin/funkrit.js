/**
 * @file             : bin/funkrit.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.12.2018
 * Last Modified Date: 09.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const { compose, map, flatten } = require('ramda')
const fs = require('fs')
const path = require('path')
const buildOptions = require('minimist-options')
const minimist = require('minimist')
const parse = require('../src/parse.js')
//const resolveImports = require('../src/resolve-imports.js')
const { generate } = require('astring')

const options = buildOptions({
    help: {
        type: 'boolean',
        alias: ['h']
    },
    ast: {
        type: 'boolean',
        alias: ['a']
    },
    import: {
        type: 'string',
        alias: ['i']
    },
    stopEarly: true
})

const args = minimist(process.argv.slice(2), options)

//console.log(args)

if(!args._.length || args.help) {
    console.log('Usage:')
    console.log('npm run funkrit [options] <source>')
    console.log('  [-a, --ast]      : generate AST only')
    console.log('  [-i, --implicit] : implicit import')
    console.log('  [-e, --epath]    : path to embedded libraries')
    console.log('  [-o, --output]   : output path')
    console.log('  <source>         : path to funkrit source file (if equals to "-" then read from STDIN)')
    return
}

const implicitLibs = !args.i ? [] : Array.isArray(args.i) ? args.i : [args.i] 
const es = !args.e ? [] : Array.isArray(args.e) ? args.e : [args.e] 

const resolveEmbeddedLibs = compose(flatten, map( x => {
    const abspath = path.resolve(x)
    return fs.readdirSync(abspath).map(p => {
        const libPath = abspath + '/' + p
        const libName = path.basename(p, '.js')
        const names = require(libPath).names

        return { libName, libPath, names }
    })
}))

try {
    const input = args._[0]
    const insrc = input === '-' ? '/dev/stdin' : input
    const source = fs.readFileSync(insrc).toString()
    const embeddedLibs = resolveEmbeddedLibs(es)

    //console.log(embeddeds)

    //console.log(source)

    const ast = parse({implicitLibs, embeddedLibs})(source)

    //return

    if(args.ast) {
        if(args.output) {
        } else {
            console.log(JSON.stringify(ast, null, 2))
        }
    } else {
        if(args.output) {
        } else {
            console.log(generate(ast))
        }
    }

}
catch(err) {
    console.log('Error:', err)
    //console.log('Error:', err.message)
}

function resolvePath(p) {
    return path.extname(p) == '' ? p + '.js' : p
}

function resolveEmbeddedLibPath(name) {
    if(name.indexOf('/') > -1) {
        return resolvePath(name)
    } else {
        return resolvePath('../libs/' + name) || resolvePath('./node_modules/funkrit/libs/' + name)
    }
}





