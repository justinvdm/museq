
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
      append = sig.append,
      redir = sig.redir


  var globalInterval = val(1000)
  var globalOrigin = +(new Date())
  var _slice = Array.prototype.slice


  function tempo(interval) {
    put(globalInterval, interval)
  }


  function sync(s, origin, interval) {
    origin = origin || globalOrigin
    interval = interval || globalInterval

    return vv([s, origin, interval])
      (all)
      (update, spread, function(v, origin, interval) {
        return vv(nextIntersection(origin, interval))
          (sleep)
          (map, function() { return v })
          ()
      })
      ()
  }


  function loop(s, interval) {
    s = ensure(s)
    interval = ensureVal(interval || globalInterval)

    return update(s, function(v) {
      return vv(interval)
        (tick)
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
        (div, values.length)
        (tick)
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


  function nextIntersection(origin, interval) {
    origin = +origin
    var now = +(new Date())
    var i = Math.ceil((now - origin) / interval)
    var then = origin + (i * interval)
    return then - now
  }


  function sleep(interval) {
    return vv(interval)
      (ensure)
      (update, function(interval) {
        var s = sig()
        var intervalId = setTimeout(resolve, interval, s)
        cleanup(s, function() { clearTimeout(intervalId) })
        return s
      })
      ()
  }


  function tick(interval) {
    var out = sig()

    vv(interval)
      (ensure)
      (update, function(interval) {
        var s = sig()
        var intervalId = setInterval(resolve, interval, s)
        cleanup(s, function() { clearInterval(intervalId) })
        return s
      })
      (redir, out)

    resolve(out)
    return out
  }


  function div(a, b) {
    return vv([a, b])
      (all)
      (map, spread, function(a, b) { return a / b })
      ()
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
    every: every,
    tempo: tempo
  }
}();
museq;

return museq;

}));
