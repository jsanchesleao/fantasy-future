var identity = x => x;

var comp = (f, g) => x => f(g(x));

export default function Future(action, mappingFn = identity) {
  this.action = action;
  this.mappingFn = mappingFn;
};

Future.prototype.fork = function(err, succ) {
  this.action(err, 
              r => succ(this.mappingFn(r)));
};

Future.prototype.map = function(fn) {
  return new Future(this.action, comp(fn, this.mappingFn));
};
