import chai from 'chai';
import Future from '../src/main';

let {expect} = chai;

describe('FORK', function() {
  it('executes passed function only after a fork has been called', function(done){
    var executed = false;
    var f = new Future(function(reject, resolve) {
      executed = true;
      resolve(1);
    });

    expect(executed).to.equal(false);

    f.fork(function(e){ throw new Error('Error'); },
           function(data) {
             expect(data).to.equal(1);
             expect(executed).to.equal(true);
             done();
           });
  });

  it('maps with a function and returns another future, linking the forks', function(done) {
    var f = new Future(function(reject, resolve) {
      resolve(1);
    });

    var f2 = f.map((x) => x + 1);

    f2.fork((e) => {throw new Error('Error');},
            (data) => {
              expect(data).to.equal(2);
              done();
            });
  });

  it('can map arbitrarily', function(done) {
    var f = new Future(function(reject, resolve) {
      resolve(1);
    });

    var f2 = f.map(x => x + 1)
              .map(x => x * 2);

    f2.fork(e => {throw new Error('Error');},
            data => {
              expect(data).to.equal(4);
              done();
            });
  });
});
