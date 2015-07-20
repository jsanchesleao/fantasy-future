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

Future.all = function(futs) {
  return new Future((reject, resolve) => {
    let results = [];
    let count = 0;
    let done = false;

    futs.forEach((fut, i) => {
      fut.fork( 
        error => { 
          if(!done) {
            done = true;
            reject(error)
          }
        },
        result => {
          results[i] = result;
          count += 1;
          if (count === futs.length) {
            resolve(results);
          }
        })
    });
         
  });
}
