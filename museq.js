
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
  museq.store = {}
  museq.stop = stop


  var isArray = Array.isArray


  function museq(beats, opts) {
    var out = sig()
    opts = parseOpts(opts)

    var s = sig.map(sig.ensure(beats), function(beats) {
      if (out.pulse) museq.pulse.stop(out.pulse)
      out.pulse = museq.pulse(beats.length, opts.cps, opts.origin)
      sequence(out, beats, out.pulse)
    })

    sig.depend(s, out)
    return out
  }


  function parseOpts(opts) {
    opts = opts || {}
    opts.cps = opts.cps || museq.cps
    opts.origin = opts.origin || museq.origin
    return opts
  }


  function sequence(out, beats, pulse) {
    var s = sig.map(pulse, function(i) {
      pushBucket(out, beats[i])
    })

    sig.depend(s, out)
  }


  function pushBucket(out, bucket) {
    if (bucket === null) return
    if (!isArray(bucket)) return sig.push(out, bucket)

    var n = bucket.length
    var i = -1
    while (++i < n) sig.push(out, bucket[i])
  }


  function ensureArray(v) {
    return !isArray(v)
      ? [v]
      : v
  }


  function stop(seq) {
    museq.pulse.stop(seq.pulse)
    sig.reset(seq)
  }


  return museq
}()

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
      sig.push(s, i++ % n)
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

;(function() {
  museq.store = {}
  museq.cps = sig(0.5)
  museq.origin = sig(new Date())
})()

return museq;

}));
