/**
 * @file             : webpack.test.config.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 15.12.2018
 * Last Modified Date: 02.01.2019
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 */
var path = require('path')

module.exports = {
    mode: 'production',
    //mode: 'development',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build/test'),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd'
    },
    resolve: {
        modules:['../libs', './src', './build', 'node_modules']
    },
    externals: {
        ramda: {
            commonjs: 'ramda',
            commonjs2: 'ramda'
        }
    }
}
