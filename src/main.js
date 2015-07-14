export default class Future {

  constructor(action) {
    this.action = action;
  }

  fork(err, succ) {
    this.action(err, succ);
  }

  map(fn) {
    return this.chain(x => Future.of(fn(x)));
  }

  chain(fn) {
    return new Future((reject, resolve) => 
      this.fork(e => reject(e),
                data => fn(data).fork(reject, resolve)));
  }
};

Future.of = function(x) {
  return new Future((_, resolve) => resolve(x));
};
