var museq = function() {
  var map = sig.map,
      watch = sig.watch,
      cleanup = sig.cleanup,
      depend = sig.depend,
      reset = sig.reset,
      resume = sig.resume,
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
    var s = resume(sig())

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
    while (++i < n) put(out, bucket[i])
  }


  museq.store = {}
  return museq
}()
