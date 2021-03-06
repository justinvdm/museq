# museq

> **note** For now, this project is deprecated. I no longer use or work on it, and doubt others are using it. If by any chance you were using this, and would like to see more of it in some form, let me know: justnvdm(at)gmail.com

time-sequence things in javascript

```javascript
var str = require('util').format,
    sig = require('sig-js'),
    museq = require('museq')


var i = 0

museq.loop([1, 2, 3, 4])
 .call(museq.every, 2, function(values) {
   return values.slice(0, 3)
 })
 .call(museq.seq)
 .map(function(v) {
   return str('%d (%ds)', v, i++)
 })
 .each(sig.log)

// 1 (0s)
// 2 (1s)
// 3 (2s)
// 4 (3s)
// 1 (4s)
// 2 (5s)
// 3 (6s)
// 1 (7s)
// 2 (8s)
// 3 (9s)
// 4 (10s)
// 1 (11s)
// 2 (12s)
// 3 (13s)
// 1 (14s)
// 2 (15s)
// 3 (16s)
// 4 (17s)
```

museq outputs [sig](https://github.com/justinvdm/sig)-based signals. Reading [sig's readme](https://github.com/justinvdm/sig#sig) to get an idea of what sig is might help for using museq and reading its api docs.


## install

node:

```
$ npm install museq
```

```
var museq = require('museq')
```

browser:

```
$ bower install museq
```

```html
<script src="/bower_components/sig-js/sig.js"></script>
<script src="/bower_components/museq/museq.js"></script>
```


## api

### sync(v[, origin[, interval]])

Synchronises a value or signal to an origin timestamp and an interval. In the context of music, this can be useful for synchronising multiple tracks to start playing at the same time. 

If a value is given as `v`, the value will be outputted by the returned signal when the next time intersection occurs. If a signal is given as `v`, each value outputted by `v` will be outputted by the returned signal each time the next time intersection occurs.

`origin` should be given in milliseconds since the unix epoch. If `origin` isn't given, the timestamp at which `museq` was loaded is used. If `origin` is a signal, a new sync will occur each time `origin` outputs a new value.

`interval` should be given in milliseconds. If `interval` isn't given, [the global interval](#interval) is used. If `interval` is a signal, a new sync will occur each time `interval` outputs a new value.

```javascript
var s = museq.sync(23, +(new Date()) - 500, 1000)
s.each(sig.log)

// 500 milliseconds later ...
// 23
```

### loop(v[, interval])

Loops a value or signal to play each `interval`.

If a value is given as `v`, the value will be outputted by the returned signal each `interval`. If a signal is given as `v`, the latest value outputted by `v` will be used as the value outputted by the returned signal each `interval`.

`interval` should be given in milliseconds. If `interval` isn't given, [the global interval](#interval) is used. If `interval` is a signal, each value it outputs will cause the returned signal to output subsequent values at the new interval value.

```javascript
museq.loop(23, 1000)
  .each(sig.log)

// 23

// 1 second later ...
// 23

// 2 seconds later ...
// 23

// 3 seconds later ...
// 23

// ...
```

### seq(values[, interval])

Takes in an array of values or a signal that outputs arrays of values and sequences the values to be outputted by the returned signal at equivalent intervals adding up to `interval`. For example, if `interval` is given as `4000` and the `values` is given as `[1, 2, 3, 4]`, `1` will be outputted at 0 seconds, `2` at 1 seconds, `3` at 2 seconds and `t` at 3 seconds.

If an array is given as `values`, each value in the array will be outputted at the next `interval / values.length` milliseconds. If a signal is given as `values`, each value in each array outputted by `values` will by sequenced, along with any previous arrays outputted by `values`.

`interval` should be given in milliseconds. If `interval` isn't given, [the global interval](#interval) is used. If `interval` is a signal, each value it outputs will cause the returned signal to output subsequent sequence values at the new interval value.


```javascript
museq.seq([1, 2, 3, 4], 4000)
  .each(sig.log)

// 1

// 1 second later ...
// 2

// 2 seconds later ...
// 3

// 3 seconds later ...
// 4
```

### every(s, n, fn[, arg2[, arg3[, ...]]])

Takes in a signal `s` and returns a new signal that maps each `n`th value through a function `fn`. Each value outputted by `s` that isn't the `n`th value will simply be outputted by the returned signal without passing it through `fn`. If extra arguments are given, they are used as extra arguments to each call to `fn`.


```javascript
var s = sig()

s.every(s, 2, function(v) { return v * 2 })
 .each(sig.log)

s.putEach([1, 2, 3, 4])
// 1
// 4
// 3
// 8
```


### interval

`museq.interval` is the global interval used as a default for `sync`, `loop` and `seq`. It is a signal, so any new value given to it will cause any currently active signals listening to it to react to the new value. The signal is initialised to `2000` milliseconds.

```javascript
museq.interval.put(500)
// all existing and new museq signals will now use 500 milliseconds as their interval

museq.interval.put(1000)
// all existing and new museq signals will now use 1000 milliseconds as their interval
```
