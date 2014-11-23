
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["sig-js"], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('sig-js'));
  } else {
    root.museq = factory(root.sig);
  }
}(this, function(sig) {

var museq = function() {
  var map = sig.map,
      watch = sig.watch,
      cleanup = sig.cleanup,
      depend = sig.depend,
      reset = sig.reset,
      put = sig.put,
      ensure = sig.ensure

  var isArray = Array.isArray


  function museq(beats, opts) {
    var pulse
    var out = sig()
    opts = parseOpts(opts)

    var s = map(ensure(beats), function(beats) {
      resetPulse()
      pulse = museq.pulse(beats.length, opts.cps, opts.origin)
      watch(out, sequence(beats, pulse))
    })

    function resetPulse() {
      if (pulse) reset(pulse)
    }

    depend(s, out)
    cleanup(out, resetPulse)
    return out
  }


  function parseOpts(opts) {
    opts = opts || {}
    opts.cps = opts.cps || museq.cps
    opts.origin = opts.origin || museq.origin
    return opts
  }


  function sequence(beats, pulse) {
    var s = sig()

    var t = map(pulse, function(i) {
      pushBucket(s, beats[i])
    })

    depend(t, s)
    return s
  }


  function pushBucket(out, bucket) {
    if (bucket === null) return
    if (!isArray(bucket)) return put(out, bucket)

    var n = bucket.length
    var i = -1
    while (++i < n) sig.put(out, bucket[i])
  }


  museq.store = {}
  return museq
}()

museq.pulse = function() {
  var map = sig.map,
      spread = sig.spread,
      watch = sig.watch,
      cleanup = sig.cleanup,
      depend = sig.depend,
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
    var s = sig()
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

;(function() {
  museq.store = {}
  museq.cps = sig.sticky(0.5)
  museq.origin = sig.sticky(new Date())
})()

return museq;

}));
