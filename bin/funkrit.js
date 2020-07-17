#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const buildOptions = require('minimist-options')
const minimist = require('minimist')

const { parse } = require("../build/funkrit-parser");
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

if(!args._.length || args.help) {
    console.log('Usage:')
    console.log('npm run funkrit -- [options] <source>')
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

    const ast = parse(source)

    if(args.ast) {
        const astJson = JSON.stringify(ast, null, 2)
        if(args.output) {
            fs.writeFileSync(args.output, astJson)
        } else {
            console.log(astJson)
        }
    } else {
        const code = generate(ast, { ecmaVersion: 6 })
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

