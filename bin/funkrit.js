/**
 * @file             : bin/funkrit.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.12.2018
 * Last Modified Date: 02.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const fs = require('fs')
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
    console.log('  [-i, --import]   : path to manifest of imported identifiers (JSON)')
    console.log('  [-o, --output]   : output path')
    console.log('  <source>         : path to funkrit source file (if equals to "-" then read from STDIN)')
    return
}

try {
    const input = args._[0]
    const insrc = input === '-' ? '/dev/stdin' : input
    const source = fs.readFileSync(insrc).toString()

    //console.log(source)

    const ast = parse(source)

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
    console.log('Error:', err.message)
}



