/**
 * @file             : /Users/olegkirichenko/projects/divsense/funkrit/webpack.config.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 15.12.2018
 * Last Modified Date: 16.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
var path = require('path')

module.exports = {
    mode: 'development',
    target: 'node',
    entry: './src/funkrit-node.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'funkrit-node.js'
    },
    resolve: {
        modules:['../monads', './src', './build', 'node_modules']
    }
}
