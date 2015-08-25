# Fantasy Future

A [Fantasy Land](https://github.com/fantasyland/fantasy-land) compatible Future Monad implementation.

## Installation

```bash
npm install fantasy-future
```

## What are Futures?
Futures are an abstraction similar to Promises, with two little differences:
* Futures are mappable, which means that you can manipulate them with any library that does map and flatmap, rather than keep chaining 'then' calls
* A Future only starts running asynchronous tasks when a special *fork* method is called.

```javascript
/* with promises: */
var result = new Promise(function(reject, resolve) {
  myAwesomeAsyncCalculation(function(data) {
    resolve(data);
  });
}).then(function(data) {
  return "This is my data: " + data;
});

/* with futures */
var Future = require('fantasy-future');
var result = new Future(function(reject, resolve) {
  myAwesomeAsyncCalculation(function(data) {
    resolve(data);
  })
}).map(function(data) {
  return "This will only run after fork: " + data;
}).fork(function(error){
  console.log('an error occurred');
}, function(data) {
  console.log('data is: ' + data);
});
```
### Why don't just use Promises?
Basically because promises are too eager. They run as soon as they are created, and this makes controlling side effects of the code difficult. Creating a Future is always a pure operation, and always idempotent. The side effects will only run after a call to __fork__. This makes it easier to use Futures in function compositions.

Also, you can use any library that can combine functors (such as arrays or maybes), to combine Futures, so Ramda works with Futures without using those clumsy special forms of compose for promises.

```javascript
  var R = require('ramda');
  var result = new Future(function(reject, resolve) {
    resolve([1, 2, 3, 4, 5, 6]);
  });
 
  var resultFiltered = result.map(R.filter(R.gt(3))); // will hold [1, 2]

  resultFiltered.fork(R.identity, console.log.bind(console));
```

API
---

### new Future(action)
Constructor. Accepts a function of two args, *reject* and *resolve*. Pretty much like the default ES2015 Promise constructor
```javascript
var res = new Future(function(reject, resolve) {
  setTimeout(function() {
    resolve(1);
  }, 1000);
});
```

### Future.all(futures)
Accepts an array of futures, and returns a single future, holding an array with the individual results in the same order.

```javascript
  /* foo, bar and baz are futures */
  var result = Future.all([foo, bar, baz]); 
  /* result will hold an array with the values
     of foo, bar and baz */
```

### Future.map(transform)
Accepts a function to transform the value held by the future.

Returns another future, that will hold the transformed value.
```javascript
  var foo = new Future(...);
  var transformed = foo.map(function(data) {
    return data + 1;
  });
```

### Future.chain(transform)
Accepts a function that transforms the value held by the future in another future.

This will return another future, that will reject if this transformation rejects, or will succeed with the new value, if the transformation succeeds.

```javascript
  var foo = new Future(...);
  var chained = foo.chain(function(data) {
    return new Future(...);
  });

  /* chained will not end holding another future, but will flatten it's structure */
```

### Future.fork(errorAction, successAction)
This will trigger the future initial action, and if it rejects, the errorAction callback will be invoked with the failure, otherwise the successAction callback is invoked.

```javascript
  var foo = new Future(...);
  foo.fork(
    function(error) {
      console.log('Something went wrong, the future was rejected', error);
    }, 
    function(success) {
      console.log('Here is your AWESOME result: ', success);
    });
```

License
-------

Fantasy Future is released under __ISC__ License. Click [here](http://opensource.org/licenses/ISC) for details.

