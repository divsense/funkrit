/**
 * @file             : src/parse.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 01.12.2018
 * Last Modified Date: 01.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
const peg = require('./peg.js')
module.exports = (source, options) => {
    return peg.parse(source)
}

