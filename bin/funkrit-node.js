/**
 * @file             : bin/funkrit-node.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.12.2018
 * Last Modified Date: 13.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const { compose, append, keys, map, flatten } = require('ramda')
const fs = require('fs')
const path = require('path')
const buildOptions = require('minimist-options')
const minimist = require('minimist')
const {parse} = require('../dist/ast-node.js')
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
    output: {
        type: 'string',
        alias: ['o']
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
    console.log('  [-o, --output]   : output path')
    console.log('  <source>         : path to funkrit source file (if equals to "-" then read from STDIN)')
    return
}

try {
    const input = args._[0]
    const insrc = input === '-' ? '/dev/stdin' : input
    const source = fs.readFileSync(insrc).toString()

    const es = !args.e ? [] : Array.isArray(args.e) ? args.e : [args.e]

    const ast = parse(source)

    if(args.ast) {
        if(args.output) {
        } else {
            console.log(JSON.stringify(ast, null, 2))
        }
    } else {
        const code = generate(ast)
        if(args.output) {
            fs.writeFileSync(args.output, code)
        } else {
            console.log(code)
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

