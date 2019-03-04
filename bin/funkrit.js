/**
 * @file             : bin/funkrit-node.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.12.2018
 * Last Modified Date: 27.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const { compose, append, keys, map, flatten } = require('ramda')
const fs = require('fs')
const path = require('path')
const buildOptions = require('minimist-options')
const minimist = require('minimist')

const { build } = require('../dist/ast-nodejs.js')
const { fnkGenerator } = require('../libjs/fnkGenerator.js')
const { generate } = require('astring')

const ramdaNames = keys(require('ramda'))

const options = buildOptions({
    help: {
        type: 'boolean',
        alias: ['h']
    },
    ast: {
        type: 'boolean',
        alias: ['a']
    },
    commonjs: {
        type: 'boolean',
        alias: ['c'],
        default: false
    },
    output: {
        type: 'string',
        alias: ['o']
    },
    stopEarly: true
})

const args = minimist(process.argv.slice(2), options)

//console.log(args)

if(!args._.length || args.help) {
    console.log('Usage:')
    console.log('npm run funkrit [options] <source>')
    console.log('  [-a, --ast]      : generate AST only')
    console.log('  [-c, --commonjs] : produce commonJS module')
    console.log('  [-o, --output]   : output path')
    console.log('  <source>         : path to funkrit source file (if equals to "-" then read from STDIN)')
    return
}

try {
    const input = args._[0]
    const insrc = input === '-' ? '/dev/stdin' : input
    const source = fs.readFileSync(insrc).toString()

    const es = !args.e ? [] : Array.isArray(args.e) ? args.e : [args.e]

    const astResult = build({
        code: source,
        commonJs: true,
        stdLib: {
            source: 'ramda',
            names: ramdaNames
        }})

    if(astResult.error) {
        console.log("Error: " + astResult.error)
    } else {
        const ast = astResult.value

        if(args.ast) {
            const astJson = JSON.stringify(ast, null, 2)
            if(args.output) {
                fs.writeFileSync(args.output, astJson)
            } else {
                console.log(astJson)
            }
        } else {
            const code = generate(ast, {comments: true, generator: fnkGenerator})
            if(args.output) {
                fs.writeFileSync(args.output, code)
            } else {
                console.log(code)
            }
        }
    }

}
catch(err) {
    console.log('Error:', err)
}

