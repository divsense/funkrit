// @flow
const {filter, gt, isNil} = require("ramda");
const foo /* : number[] => number[] */ = filter(gt(0));
const bar /* : number[] => number[] */ = filter(isNil);
export {foo};
