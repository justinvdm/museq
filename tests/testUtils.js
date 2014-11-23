museq.testUtils = function() {
  function capture(s) {
    var values = []

    sig.map(s, function(x) {
      values.push(x)
    })

    return values
  }


  function fromNow(offset) {
    return +(new Date()) + offset
  }


  function checkTimes(signal) {
    var stop = noop
    var done = noop
    var checks = []
    var ended = false

    var self = {}

    self.at = function(t, fn) {
      checks.push([t, fn])
      return self
    }

    self.done = function(doneFn) {
      done = doneFn
      run()
      return self
    }

    self.stop = function(stopFn) {
      stop = stopFn
      return self
    }

    function run() {
      var ids = []
      var values = capture(signal)

      self.at(checks[checks.length - 1][0] + 1, function() {
        ids.forEach(clearTimeout)
        end()
      })

      checks.forEach(sig.spread(function(t, fn) {
        ids.push(setTimeout(check, t, fn, values))
      }))
    }

    function check(fn, values) {
      if (ended) return
      try { fn(values) }
      catch(e) { end(e) }
    }

    function end(e) {
      ended = true
      stop(signal)
      if (e) done(e)
      else done()
    }

    return self
  }


  function checkPulse(pulse) {
    return checkTimes(pulse)
      .stop(sig.reset)
  }


  function checkSeq(seq) {
    return checkTimes(seq)
      .stop(sig.reset)
  }


  function noop() {
  }


  return {
    capture: capture,
    fromNow: fromNow,
    checkTimes: checkTimes,
    checkPulse: checkPulse,
    checkSeq: checkSeq
  }
}()
