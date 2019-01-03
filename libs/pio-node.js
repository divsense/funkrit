/**
 * @file             : libs/pio-node.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 28.12.2018
 * Last Modified Date: 02.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 *
 * read Javascript/JSON file to Javascript Object
 */

const path = require('path')
const {PIO, purePIO, failPIO} = require('./pio.js')

// readExportedNames :: String -> {String::[String]}
function readExportedNames(name) {
    try {
        return PIO(() => {
            const exported = Object.keys(eval('require')(name))
            return Promise.resolve({name, exported})
        })
    } catch(e) {
        return failPIO(e)
    }
}

exports.readExportedNames = readExportedNames

