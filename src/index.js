var mu = function() {
  var all = sig.all,
      reset = sig.reset,
      cleanup = sig.cleanup,
      resolve = sig.resolve,
      resume = sig.resume,
      ensure = sig.ensure,
      watch = sig.watch,
      map = sig.map,
      put = sig.put

  var globalOrigin = +(new Date())


  function loop(v, interval, origin) {
    parseLoopOpts(arguments)

    return sig(function() {
      var s = resume(sig())
      var started = false
      var curr

      map(ensure(v), function update(x) {
        curr = x
        started = true
      })

      map(loopTick(interval, origin), function() {
        if (started) put(s, curr)
      })

      return s
    })
  }


  function loopTick() {
    var args = arguments

    return sig(function() {
      var s = resume(sig())
      var t

      all(args, function(interval, origin) {
        clear()
        t = tick(interval * 1000, nextLoop(interval, origin))
        watch(s, t)
      })

      cleanup(s, clear)
      return s

      function clear() {
        if (t) reset(t)
      }
    })
  }


  function parseLoopOpts(args) {
    var interval = args[1]
    var origin = args[2]

    if (interval && typeof interval == 'object') {
      origin = interval.origin
      interval = interval.interval
    }

    interval = deflt(interval, 2),
    origin = +deflt(origin, globalOrigin)
  }


  function nextLoop(interval, origin) {
    var now = +(new Date())
    var i = Math.ceil((now - origin) / (interval * 1000))
    var then = origin + (i * interval)
    return then - now
  }


  function tick(interval, delay) {
    return sig(function() {
      var s = resume(sig())
      var intervalId

      var delayId = setTimeout(function() {
        intervalId = setInterval(resolve, interval, s)
      }, delay)

      cleanup(s, function() {
        clearTimeout(delayId)
        clearInterval(intervalId)
      })

      return s
    })
  }


  function seq() {
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
    loop: loop
  }
}()
