/**
 * @file             : libs/node-utils-io.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 28.12.2018
 * Last Modified Date: 13.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 *
 * read Javascript/JSON file to Javascript Object
 */

const fs = require('fs')
const path = require('path')
const {IO, pureIO, failIO} = require('io.js')

// consoleError :: String -> IO ()
function consoleError(str) {
    return IO(() => console.error(str))
}

// readExportedNames :: [String] -> {String::[String]}
function readExportedNames(urls) {
    try {
        return IO(() => urls.map(url => {
            const exports = Object.keys(eval('require')(url))
            return {url, exports}
        }))
    } catch(e) {
        return failIO(e)
    }
}

// writeToFile :: String, String -> {String::String}
function writeToFile(url, content) {
    try {
        return IO(() => {
            fs.writeFileSync(url, content)
            return {status: 'ok'}
        })
    } catch(e) {
        return failIO(e)
    }
}

exports.readExportedNames = readExportedNames
exports.writeToFile = writeToFile
exports.consoleError = consoleError

