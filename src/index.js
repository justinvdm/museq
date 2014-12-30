var museq = function() {
  var all = sig.all,
      cleanup = sig.cleanup,
      ensureSig = sig.ensure,
      spread = sig.spread,
      put = sig.put,
      then = sig.then,
      map = sig.map,
      redir = sig.redir,
      isSig = sig.isSig,
      val = sig.val,
      once = sig.once,
      update = sig.update,
      append = sig.append


  var globalOrigin = +(new Date())
  var isArray = Array.isArray
  var _slice = Array.prototype.slice


  function tempo(s, ms) {
    s = ensure(s)
    s.tempo = then(ensureSig(ms), val())
    return s
  }


  function sync(s, origin) {
    s = ensure(s)
    origin = origin || globalOrigin

    return vv([s.tempo, origin])
      (all)
      (once)
      (update, spread, function(interval, origin) {
        return vv(nextIntersection(interval, origin))
          (sleep)
          (update, function() { return s })
          ()
      })
      (tempo, s.tempo)
      ()
  }


  function loop(s) {
    s = ensure(s)

    var v
    var out = sig()

    vv(s)
      (then, function(nextV) { v = nextV })
      (redir, out)

    vv(s.tempo)
      (update, tick)
      (then, function() {
        if (typeof v != 'undefined') put(this, v)
      })
      (redir, out)

    return out
  }


  function seq(s) {
    s = ensure(s)

    return append(s, function(values) {
      var i = -1

      return vv(s.tempo)
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
    s = ensure(s)
    var i = -n
    fn = prime(slice(arguments, 3), fn)

    return map(s, function(x) {
      return ++i % n === 0
        ? fn.call(this, x)
        : x
    })
  }


  function tr(s, fn) {
    fn = prime(slice(arguments, 2), fn)

    return map(s, function(obj) {
      return isArray(obj)
        ? obj.map(fn, this)
        : fn.call(this, obj)
    })
  }


  function run(s) {
    var args = slice(arguments, 1)

    return tr(s, function(obj) {
      return typeof obj == 'function'
        ? obj.apply(this, args)
        : obj
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


  function exists(v) {
    return typeof v != 'undefined'
        && v !== null
  }


  function slice(arr, a, b) {
    return _slice.call(arr, a, b)
  }


  function ifExists(v, fn) {
    return exists(v)
      ? fn.call(this, v)
      : v
  }


  function ensure(v) {
    if ((v || 0).museq) return v

    // 'copy' signals to avoid assigning properties to non-museq signals
    if (isSig(v)) v = then(v, sig())

    v = ensureSig(v)
    v.museq = true
    return tempo(v, 2000)
  }


  return {
    tr: tr,
    seq: seq,
    run: run,
    loop: loop,
    sync: sync,
    every: every,
    tempo: tempo,
    ifExists: ifExists
  }
}();
museq;
