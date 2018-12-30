/**
 * @file             : webpack.config.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 15.12.2018
 * Last Modified Date: 27.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
var path = require('path')

module.exports = {
    mode: 'development',
    target: 'node',
    entry: {
        'funkrit-node': './src/funkrit-node.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    resolve: {
        modules:['../monads', './src', './build', 'node_modules']
    }
}
