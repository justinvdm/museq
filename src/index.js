var museq = function() {
  var all = sig.all,
      ensure = sig.ensure,
      cleanup = sig.cleanup,
      spread = sig.spread,
      put = sig.put,
      then = sig.then,
      map = sig.map,
      redir = sig.redir,
      val = sig.val,
      once = sig.once,
      update = sig.update,
      append = sig.append


  var globalInterval = val(2000)
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
    interval = ensure(interval || globalInterval)

    var v
    var out = sig()

    vv(s)
      (then, function(nextV) { v = nextV })
      (redir, out)

    vv(interval)
      (update, tick)
      (then, function() {
        if (typeof v != 'undefined') put(this, v)
      })
      (redir, out)

    return out
  }


  function seq(s, interval) {
    s = ensure(s)

    interval = vv(interval || globalInterval)
      (ensure)
      (then, val())
      ()

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
