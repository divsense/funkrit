/**
 * @file             : /Users/olegkirichenko/projects/divsense/funkrit/libs/node-utils-pio.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 28.12.2018
 * Last Modified Date: 06.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 *
 * read Javascript/JSON file to Javascript Object
 */

const fs = require('fs')
const path = require('path')
const {PIO, purePIO, failPIO} = require('pio.js')

// readExportedNames :: String -> {String::[String]}
function readExportedNames(url) {
    try {
        return PIO(() => {
            const exports = Object.keys(eval('require')(url))
            return Promise.resolve({url, exports})
        })
    } catch(e) {
        return failPIO(e)
    }
}

// writeToFile :: String, String -> {String::String}
function writeToFile(url, content) {
    try {
        return PIO(() => {
            fs.writeFileSync(url, content)
            return Promise.resolve({status: 'ok'})
        })
    } catch(e) {
        return failPIO(e)
    }
}

exports.readExportedNames = readExportedNames
exports.writeToFile = writeToFile

