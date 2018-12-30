/**
 * @file             : /Users/olegkirichenko/projects/divsense/funkrit/libs/pio.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 28.12.2018
 * Last Modified Date: 29.12.2018
 * Last Modified By  : Oleg Kirichenko <oleg@divsense.com>
 *
 * Promise based IO Monad
 */

function PIO(run) {
  return {
    run,

    pure: purePIO,

    // map :: PIO(a) ~> (a -> b) -> PIO(b)
    map: f => PIO(() => run().then(a => Promise.resolve(f(a)))),

    // chain :: PIO(a) ~> (a -> PIO(b)) -> PIO(b) 
    chain: f => PIO(() => run().then(a => f(a).run()))
  }
}

function purePIO(a) {
  return PIO(() => Promise.resolve(a));
}

function failPIO(a) {
  return PIO(() => Promise.reject(a));
}

exports.purePIO = purePIO
exports.failPIO = failPIO
exports.PIO = PIO

