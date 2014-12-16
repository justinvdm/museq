var museq = function() {
  var all = sig.all,
      reset = sig.reset,
      cleanup = sig.cleanup,
      ensure = sig.ensure,
      spread = sig.spread,
      put = sig.put,
      then = sig.then,
      depend = sig.depend,
      except = sig.except

  var globalOrigin = +(new Date())


  function loop(x, interval, origin) {
    parseLoopOpts(arguments)

    var s = sig()
    var curr

    vv(ensure(x))
      (then, function(x) { curr = x })
      (depend, s)

    vv([interval, origin])
      (all)
      (update, spread(loopTick))
      (then, function() {
        if (typeof curr != 'undefined') put(s, curr)
      })
      (depend, s)

    return s
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


  function update(s, fn) {
    var out = sig()
    var curr

    vv(s)
      (then, function(x) {
        if (curr) reset(curr)
        curr = fn(x)

        var t
        t = then(curr, puts)
        t = except(t, raises)
        depend(t, out)
      })
      (depend, out)

    function raises(e) {
      put(out, e)
    }

    function puts(x) {
      put(out, x)
    }

    return out
  }


  function resolve(s) {
    put(s, null)
  }


  function seq(v) {
  }


  function tr() {
  }


  function run() {
  }


  function deflt(a, b) {
    return exists(a)
      ? a
      : b
  }


  function exists(v) {
    return typeof a != 'undefined'
        && a !== null
  }


  return {
    tr: tr,
    run: run,
    seq: seq,
    loop: loop,
    update: update
  }
}();
museq;
