/**
 * @file             : bin/funkrit.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.12.2018
 * Last Modified Date: 10.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const { compose, append, keys, map, flatten } = require('ramda')
const fs = require('fs')
const path = require('path')
const buildOptions = require('minimist-options')
const minimist = require('minimist')
const parse = require('../src/parse.js')
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
    ramda: {
        type: 'boolean',
        default: true
    },
    implicit: {
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
    console.log('  [--no-ramda]     : exclude ramda')
    console.log('  [-e, --epath]    : path to embedded libraries')
    console.log('  [-o, --output]   : output path')
    console.log('  <source>         : path to funkrit source file (if equals to "-" then read from STDIN)')
    return
}

const resolveEmbeddedLibs = compose(flatten, map( x => {
    const abspath = path.resolve(x)
    return fs.readdirSync(abspath).map(p => {
        const libPath = abspath + '/' + p
        const libName = path.basename(p, '.js')
        const names = keys(require(libPath))

        return { libName, libPath, names }
    })
}))

const addRamda = (needRamda, libs) => {
    if(!needRamda) {
        return libs
    }
    const libName = 'ramda'
    const libPath = 'ramda'
    const names = keys(require('ramda')) || []
    return append({ libName, libPath, names }, libs)
}

try {
    const input = args._[0]
    const insrc = input === '-' ? '/dev/stdin' : input
    const source = fs.readFileSync(insrc).toString()

    const es = !args.e ? [] : Array.isArray(args.e) ? args.e : [args.e]

    const embeddedLibs = addRamda(args.ramda, resolveEmbeddedLibs(es))

    //console.log(source)

    const ast = parse({embeddedLibs, needRamda: args.ramda})(source)

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





