var museq = function() {
  var all = sig.all,
      ensure = sig.ensure,
      ensureVal = sig.ensureVal,
      setup = sig.setup,
      teardown = sig.teardown,
      spread = sig.spread,
      put = sig.put,
      then = sig.then,
      map = sig.map,
      val = sig.val,
      update = sig.update,
      append = sig.append,
      redir = sig.redir


  var globalInterval = val(1000)
  var globalOrigin = +(new Date())
  var _slice = Array.prototype.slice


  function sync(v, origin, interval) {
    origin = origin || globalOrigin
    interval = interval || globalInterval

    return vv([v, origin, interval])
      (all)
      (update, spread, function(v, origin, interval) {
        return vv(nextIntersection(origin, interval))
          (sleep)
          (map, function() { return v })
          ()
      })
      ()
  }


  function loop(v, interval) {
    var s = ensure(v)
    interval = ensureVal(interval || globalInterval)

    return update(s, function(v) {
      return vv(interval)
        (tick)
        (map, function() { return v })
        ()
    })
  }


  function seq(values, interval) {
    var s = ensure(values)
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
        var id
        setup(s, function() { id = setTimeout(resolve, interval, s) })
        teardown(s, function() { clearTimeout(id) })
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
        var id
        setup(s, function() { id = setInterval(resolve, interval, s) })
        teardown(s, function() { clearInterval(id) })
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
    interval: globalInterval
  }
}();
museq;
