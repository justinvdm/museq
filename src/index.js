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
