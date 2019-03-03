// @flow
/*::
export type Error = [number,string];
export type Result_Monad<A> = {value:A,error:?Error,pure(A):Result_Monad<A>,map<B>((A) => B):Result_Monad<?B>,chain<B>((A) => Result_Monad<?B>):Result_Monad<?B>,ap<B>(Result_Monad<(A) => B>):Result_Monad<?B>};
*/
const {always, compose, tryCatch} = require("ramda");
function errorResult/* :: <A> */(code /* : number */, description /* : string */) /* : Result_Monad<?A> */{
  return Result(null, [code, description]);
}
function checkForAbnormal/* :: <A> */(a /* : ?A */) /* : Result_Monad<?A> */{
  return a === null || a === Infinity || a === undefined ? errorResult(0, "safeMap:abnormal") : Result(a);
}
function safeMap/* :: <A,B> */(f /* : A=>B */) /* : A => Result_Monad<?B> */{
  return tryCatch(compose(checkForAbnormal, f), always(errorResult(0, "map:exception")));
}
function Result/* :: <A> */(value /* : A */, error /* : ?Error */) /* : Result_Monad<A> */{
  return {
    value,
    error,
    pure: (a /* : A */)/* : Result_Monad<A> */ => Result(a),
    map: /* :: <B> */(f /* : A=>B */)/* : Result_Monad<?B> */ => error ? Result(null, error) : safeMap(f)(value),
    chain: /* :: <B> */(f /* : A=>Result_Monad<?B> */)/* : Result_Monad<?B> */ => {
      if (error) {
        return Result(null, error);
      } else {
        return tryCatch(f, always(errorResult(0, "chain:exception")))(value);
      }
    },
    ap: /* :: <B> */(mb /* : Result_Monad<A=>B> */)/* : Result_Monad<?B> */ => {
      if (error) {
        return Result(null, error);
      } else {
        return mb.chain(function (f) {
          return safeMap(f)(value);
        });
      }
    }
  };
}
module.exports = {
  errorResult,
  checkForAbnormal,
  safeMap,
  Result
};
