museq.pulse = function() {
  var map = sig.map,
      spread = sig.spread,
      watch = sig.watch,
      cleanup = sig.cleanup,
      depend = sig.depend,
      resume = sig.resume,
      reset = sig.reset,
      put = sig.put,
      all = sig.all


  function pulse(beatCount, cps, origin) {
    var ticker
    var out = sig()
    cps = cps || museq.cps
    origin = origin || museq.origin

    var s = all([beatCount, cps, origin])

    map(s, spread(function(beatCount, cps, origin) {
      resetTicker()
      ticker = pulseTick(beatCount, cps, origin)
      watch(out, ticker)
    }))

    depend(s, out)
    cleanup(out, resetTicker)

    function resetTicker() {
      if (ticker) reset(ticker)
    }

    return out
  }


  function pulseTick(beatCount, cps, origin) {
    origin = +origin

    var now = +(new Date())
    var interval = (cps * 1000) / beatCount
    var i = Math.ceil((now - origin) / interval)
    var then = origin + (i * interval)

    return tick(i, beatCount, interval, (then - now))
  }


  function tick(i, n, interval, delay) {
    var s = resume(sig())
    var intervalId
    i--

    var delayId = setTimeout(function() {
      update()
      intervalId = setInterval(update, interval)
    }, delay)

    cleanup(s, function() {
      clearTimeout(delayId)
      clearInterval(intervalId)
    })

    function update() {
      put(s, i++ % n)
    }

    return s
  }


  return pulse
}()
