/**
 * @file             : libs/node-utils-io.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 28.12.2018
 * Last Modified Date: 26.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 *
 * read Javascript/JSON file to Javascript Object
 */

const {IO} = require('io.js')

// logError :: String -> IO ()
function logError(str) {
    return IO(() => console.error(str))
}

exports.logError = logError

