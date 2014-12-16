var museq = function() {
  var all = sig.all,
      reset = sig.reset,
      cleanup = sig.cleanup,
      ensure = sig.ensure,
      spread = sig.spread,
      put = sig.put,
      then = sig.then,
      depend = sig.depend,
      except = sig.except,
      filter = sig.filter,
      map = sig.map

  var globalOrigin = +(new Date())
  var _slice = Array.prototype.slice


  function loop(x, interval, origin) {
    parseLoopOpts(arguments)
    var out = sig()

    vv(x)
      (ensure)
      (then, function(nextX) { x = nextX })
      (depend, out)

    vv([interval, origin])
      (all)
      (update, spread(loopTick))
      (then, function() {
        if (typeof x != 'undefined') put(out, x)
      })
      (depend, out)

    return out
  }


  function loopTick(interval, origin) {
    interval = interval * 1000

    return vv(nextLoop(interval, origin))
      (sleep)
      (update, function() { return tick(interval) })
      ()
  }


  function parseLoopOpts(args) {
    var interval = args[1]
    var origin = args[2]

    if (interval && typeof interval == 'object') {
      origin = interval.origin
      interval = interval.interval
    }

    interval = deflt(interval, 2)
    origin = +deflt(origin, globalOrigin)
  }


  function nextLoop(interval, origin) {
    var now = +(new Date())
    var i = Math.ceil((now - origin) / interval)
    var then = origin + (i * interval)
    return then - now
  }


  function seq(values, interval) {
    return vv(values)
      (ensure)
      (append, seqOnce, interval)
  }
  

  function seqOnce(values, interval) {
    interval = deflt(interval, 2)

    var i = -1
    var out = sig()

    vv([values, interval])
      (all)
      (update, spread(function(nextValues, interval) {
        values = nextValues
        interval = interval * 1000
        interval = interval / nextValues.length
        return tick(interval)
      }))
      (then, function() {
        if (++i < values.length) put(out, values[i])
      })
      (depend, out)

    return out
  }


  function every(s, n, fn) {
    var i = -n
    var args = slice(arguments, 3)

    return map(s, function(x) {
      return !(++i % n)
        ? fn.apply(this, [x].concat(args))
        : x
    })
  }


  function tr() {
  }


  function run() {
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


  function append(s, fn) {
    var out = sig()
    var args = slice(arguments, 2)

    vv(s)
      (then, function(x) { applyOut(out, fn, x, args) })
      (depend, out)

    return out
  }


  function update(s, fn) {
    var out = sig()
    var args = slice(arguments, 2)
    var curr

    vv(s)
      (then, function(x) {
        if (curr) reset(curr)
        curr = applyOut(out, fn, x, args)
      })
      (depend, out)

    return out
  }


  function applyOut(out, fn, x, args) {
    var result = fn.apply(null, [x].concat(args))
    if (!result) return

    return vv(result)
      (then, puts, out)
      (except, raises, out)
      (depend, out)
      ()
  }


  function puts(x, s) {
    put(s, x)
  }


  function raises(e, s) {
    put(s, e)
  }


  function resolve(s) {
    put(s, null)
  }


  function deflt(a, b) {
    return exists(a)
      ? a
      : b
  }


  function exists(v) {
    return typeof v != 'undefined'
        && v !== null
  }


  function slice(arr, a, b) {
    return _slice.call(arr, a, b)
  }


  return {
    tr: tr,
    seq: seq,
    run: run,
    loop: loop,
    every: every,
    seqOnce: seqOnce,
    update: update,
  }
}();
museq;
