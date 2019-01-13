/**
 * @file             : /Users/olegkirichenko/projects/divsense/funkrit/bin/funkrit-node.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.12.2018
 * Last Modified Date: 10.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const { compose, append, keys, map, flatten } = require('ramda')
const fs = require('fs')
const buildOptions = require('minimist-options')
const minimist = require('minimist')
const { build } = require('../dist/build-ast.js')
const { runRepio } = require('../dist/reader-either-pio.js')
const { isRight, right, left } = require('../dist/either.js')
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
    output: {
        type: 'string',
        alias: ['o']
    },
    stdlib: {
        type: 'string',
        alias: ['s'],
        default: 'ramda'
    },
    stopEarly: true
})

const args = minimist(process.argv.slice(2), options)

if(!args._.length || args.help) {
    console.log('Usage:')
    console.log('npm run funkrit [options] <source>')
    console.log('  [-a, --ast]      : generate AST only')
    console.log('  [-o, --output]   : output path')
    console.log('  [-s, --stdlib]   : standard library (default: "ramda"')
    console.log('  <source>         : path to funkrit source file (if equals to "-" then read from STDIN)')
    return
}

try {
    const input = args._[0]
    const insrc = input === '-' ? '/dev/stdin' : input
    const source = fs.readFileSync(insrc).toString()

    const es = !args.e ? [] : Array.isArray(args.e) ? args.e : [args.e]

    const pres = build(source)

    runRepio(pres, args).then(eres => {
        if(isRight(eres)) {
            const ast = right(eres)

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
                    console.log(generate(ast))
                }
            }

        } else {
            console.log('Error:', left(eres))
        }
    })
    .catch( err => {
        console.log('PError:', err)
    })


}
catch(err) {
    console.log('FError:', err)
}

