
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["drainpipe","sig-js"], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('drainpipe'), require('sig-js'));
  } else {
    root.museq = factory(root.vv, root.sig);
  }
}(this, function(vv, sig) {

var museq = function() {
  var all = sig.all,
      ensure = sig.ensure,
      ensureVal = sig.ensureVal,
      cleanup = sig.cleanup,
      spread = sig.spread,
      put = sig.put,
      then = sig.then,
      map = sig.map,
      val = sig.val,
      once = sig.once,
      update = sig.update,
      append = sig.append


  var globalInterval = val(1000)
  var globalOrigin = +(new Date())
  var _slice = Array.prototype.slice


  function sync(s, origin, interval) {
    s = ensure(s)
    origin = origin || globalOrigin
    interval = interval || globalInterval

    return vv([interval, origin])
      (all)
      (once)
      (update, spread, function(interval, origin) {
        return vv(nextIntersection(interval, origin))
          (sleep)
          (update, function() { return s })
          ()
      })
      ()
  }


  function loop(s, interval) {
    s = ensure(s)
    interval = ensureVal(interval || globalInterval)

    return update(s, function(v) {
      return vv(interval)
        (update, tick)
        (map, function() { return v })
        ()
    })
  }


  function seq(s, interval) {
    s = ensure(s)
    interval = ensureVal(interval || globalInterval)

    return append(s, function(values) {
      var i = -1

      return vv(interval)
        (update, function(interval) {
          return tick(interval / values.length)
        })
        (then, function() {
          if (++i < values.length) put(this, values[i])
        })
        ()
    })
  }


  function every(s, n, fn) {
    var i = -n
    fn = prime(slice(arguments, 3), fn)

    return map(s, function(x) {
      return ++i % n === 0
        ? fn.call(this, x)
        : x
    })
  }


  function nextIntersection(interval, origin) {
    origin = +origin
    var now = +(new Date())
    var i = Math.ceil((now - origin) / interval)
    var then = origin + (i * interval)
    return then - now
  }


  function sleep(interval) {
    var s = sig()
    var delayId = setTimeout(resolve, interval, s)

    cleanup(s, function() {
      clearInterval(delayId)
    })

    return s
  }


  function tick(interval) {
    var s = sig()
    var intervalId = setInterval(resolve, interval, s)

    cleanup(s, function() {
      clearInterval(intervalId)
    })

    resolve(s)
    return s
  }


  function resolve(s) {
    put(s, null)
  }


  function prime(args, fn) {
    if (!args.length) return fn

    return function(x) {
      return fn.apply(this, [x].concat(args))
    }
  }


  function slice(arr, a, b) {
    return _slice.call(arr, a, b)
  }


  return {
    seq: seq,
    loop: loop,
    sync: sync,
    every: every
  }
}();
museq;

return museq;

}));
