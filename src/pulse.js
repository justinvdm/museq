museq.pulse = function() {
  pulse.stop = stop


  function pulse(beatCount, cps, origin) {
    var ticker
    var out = sig()
    cps = cps || museq.cps
    origin = origin || museq.origin

    var s = sig.all([beatCount, cps, origin])

    sig.map(s, sig.spread(function(beatCount, cps, origin) {
      if (ticker) clearTicker(ticker)
      ticker = pulseTick(out, beatCount, cps, origin)
    }))

    sig.depend(s, out)
    out.ticker = ticker
    return out
  }


  function pulseTick(s, beatCount, cps, origin) {
    origin = +origin

    var now = +(new Date())
    var interval = (cps * 1000) / beatCount
    var i = Math.ceil((now - origin) / interval)
    var then = origin + (i * interval)

    return tick(s, i, beatCount, interval, (then - now))
  }


  function tick(s, i, n, interval, delay) {
    var d = {}
    i = i - 1

    d.delayId = setTimeout(function() {
      update()
      d.intervalId = setInterval(update, interval)
    }, delay)

    function update() {
      sig.put(s, i++ % n)
    }

    return d
  }


  function clearTicker(ticker) {
    clearTimeout(ticker.delayId)
    if ('intervalId' in ticker) clearInterval(ticker.intervalId)
  }


  function stop(pulse) {
    clearTicker(pulse.ticker)
    sig.reset(pulse)
  }


  return pulse
}()
