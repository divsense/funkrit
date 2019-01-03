/**
 * @file             : /Users/olegkirichenko/projects/divsense/funkrit/libs/pio.js
 * License           : MIT
 * @author           : Oleg Kirichenko <oleg@divsense.com>
 * Date              : 28.12.2018
 * Last Modified Date: 01.01.2019
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

// mapAll :: (a -> PIO b) -> [a] -> PIO [b]
function mapAll(f) {
    return function(xs) {
        return PIO(() => Promise.all(xs.map(x => f(x).run())))
    }
}

// mapRace :: (a -> PIO b) -> [a] -> PIO b
function mapRace(f) {
    return function(xs) {
        return PIO(() => Promise.race(xs.map(x => f(x).run())))
    }
}

function purePIO(a) {
  return PIO(() => Promise.resolve(a));
}

function failPIO(a) {
  return PIO(() => Promise.reject(a));
}

exports.mapAll = mapAll
exports.mapRace = mapRace
exports.purePIO = purePIO
exports.failPIO = failPIO
exports.PIO = PIO

