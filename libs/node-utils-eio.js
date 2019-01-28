/**
 * @file             : /Users/olegkirichenko/projects/divsense/funkrit/libs/node-utils-eio.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 28.12.2018
 * Last Modified Date: 26.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 *
 * read Javascript/JSON file to Javascript Object
 */

const fs = require('fs')
const {RightIO, LeftIO} = require('either-io.js')

// readExports :: String -> EitherT IO {url::String, exports::[String]}
function readExports(url) {
    try {
        const exports = Object.keys(eval('require')(url))
        return RightIO({url, exports})
    } catch(e) {
        return LeftIO(e)
    }
}

// writeToFile :: String, String -> EitherT IO Object
function writeToFile(url, content) {
    try {
        fs.writeFileSync(url, content)
        return RightIO({status: 'ok'})
    } catch(e) {
        return LeftIO(e)
    }
}

exports.readExports = readExports
exports.writeToFile = writeToFile




