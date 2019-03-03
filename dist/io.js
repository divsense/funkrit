// @flow
/*::
import type { Result_Monad, Error } from './result';
*/
/*::
export type Eff<A> = () => Result_Monad<A>;
export type IO_Monad<A> = {run:Eff<A>,pure(A):IO_Monad<A>,map<B>((A) => B):IO_Monad<B>,chain<B>((A) => IO_Monad<B>):IO_Monad<B>,ap<B>(IO_Monad<(A) => B>):IO_Monad<B>};
*/
const {prop} = require("ramda");
const {Result} = require("./result");
function IO/* :: <A> */(run /* : Eff<A> */) /* : IO_Monad<A> */{
  return {
    run,
    pure: (a /* : A */)/* : IO_Monad<A> */ => IO(() => Result(a)),
    map: /* :: <B> */(f /* : A=>B */)/* : IO_Monad<?B> */ => IO(() => run().map(f)),
    chain: /* :: <B> */(f /* : A=>IO_Monad<?B> */)/* : IO_Monad<?B> */ => IO(() => run().chain((x) => prop("run")(f(x))())),
    ap: /* :: <B> */(mb /* : IO_Monad<A=>B> */)/* : IO_Monad<?B> */ => IO(() => prop("run")(mb)().chain((f) => run().map(f)))
  };
}
function pureIO/* :: <A> */(a /* : A */) /* : IO_Monad<A> */{
  return IO(() => Result(a));
}
function failIO(err /* : Error */) /* : IO_Monad<null> */{
  return IO(() => Result(null, err));
}
module.exports = {
  IO,
  pureIO,
  failIO
};
