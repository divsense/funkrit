// @flow
//
/*::
type Bar<A,B> = {moo:number,left(a:A):Foo,run(a:string,f:B):boolean};
type Foo = {
    moom: boolean,
    soup: string,
    nmb: number
}
type Boom = Foo|string;
*/

//const {F, T, __, add, addIndex, adjust, all, allPass, always, and, any, anyPass, ap, aperture, append, apply, applySpec, applyTo, ascend, assoc, assocPath, binary, bind, both, call, chain, clamp, clone, comparator, complement, compose, composeK, composeP, composeWith, concat, cond, construct, constructN, contains, converge, countBy, curry, curryN, dec, defaultTo, descend, difference, differenceWith, dissoc, dissocPath, divide, drop, dropLast, dropLastWhile, dropRepeats, dropRepeatsWith, dropWhile, either, empty, endsWith, eqBy, eqProps, equals, evolve, filter, find, findIndex, findLast, findLastIndex, flatten, flip, forEach, forEachObjIndexed, fromPairs, groupBy, groupWith, gt, gte, has, hasIn, hasPath, head, identical, identity, ifElse, inc, includes, indexBy, indexOf, init, innerJoin, insert, insertAll, intersection, intersperse, into, invert, invertObj, invoker, is, isEmpty, isNil, join, juxt, keys, keysIn, last, lastIndexOf, length, lens, lensIndex, lensPath, lensProp, lift, liftN, lt, lte, map, mapAccum, mapAccumRight, mapObjIndexed, match, mathMod, max, maxBy, mean, median, memoizeWith, merge, mergeAll, mergeDeepLeft, mergeDeepRight, mergeDeepWith, mergeDeepWithKey, mergeLeft, mergeRight, mergeWith, mergeWithKey, min, minBy, modulo, move, multiply, nAry, negate, none, not, nth, nthArg, o, objOf, of, omit, once, or, otherwise, over, pair, partial, partialRight, partition, path, pathEq, pathOr, pathSatisfies, pick, pickAll, pickBy, pipe, pipeK, pipeP, pipeWith, pluck, prepend, product, project, prop, propEq, propIs, propOr, propSatisfies, props, range, reduce, reduceBy, reduceRight, reduceWhile, reduced, reject, remove, repeat, replace, reverse, scan, sequence, set, slice, sort, sortBy, sortWith, split, splitAt, splitEvery, splitWhen, startsWith, subtract, sum, symmetricDifference, symmetricDifferenceWith, tail, take, takeLast, takeLastWhile, takeWhile, tap, test, then, times, toLower, toPairs, toPairsIn, toString, toUpper, transduce, transpose, traverse, trim, tryCatch, type, unapply, unary, uncurryN, unfold, union, unionWith, uniq, uniqBy, uniqWith, unless, unnest, until, update, useWith, values, valuesIn, view, when, where, whereEq, without, xprod, zip, zipObj, zipWith, thunkify} = require("ramda");
const {compose, head, gt, prop, filter} = require("ramda");

function foo() /* : string */ {
  return "ok";
}

function foo2(b /* : number */) /* : boolean */ {
  return b > 1;
}

function foo3(b /* : number */, a /* : number */) /* : number */ {
  return a + b;
}

// [['number'], ['number'], ['boolean']]
function foo4(a /* : number */) /* : number => boolean */  {
  return b => a > b;
}

// [['number'], ['string'], ['boolean'], ['Foo']]
function foo4(a /* : number */) /* : string => boolean => Foo */  {
  return s => b => ({
      moom: b,
      soup: s,
      nmb: a + 1
  })
}

// [['number', 'number'], ['string'], ['boolean'], ['Foo']]
function foo5(a /* : number */, a2 /* : number */) /* : string => boolean => Foo */  {
  return s => b => ({
      moom: b,
      soup: s,
      nmb: a + a2 + 1
  })
}

// [['number', 'number'], ['string'], ['boolean'], ['Foo']]
function goog(a /* : ?number */) /* : Foo */  {
  return {
      moom: true,
      soup: "okok",
      nmb: a + 1
  }
}

const getSoup /* : Foo => string */ = prop('soup')

const bar /* : Array<number> => string */ = compose(getSoup, goog, head, filter(gt(9)));

//export {foo};
