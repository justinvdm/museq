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
    var checks = []

    var self = {}

    self.at = function(t, fn) {
      checks.push([t, fn])
      return self
    }

    self.done = function(done) {
      check(done)
      return self
    }

    self.stop = function(stopFn) {
      stop = stopFn
      return self
    }

    function check(done) {
      var ids = []
      var values = capture(signal)

      self.at(checks[checks.length - 1][0] + 1, function() {
        ids.forEach(clearTimeout)
        stop(signal)
        done()
      })

      checks.forEach(sig.spread(function(t, fn) {
        ids.push(setTimeout(fn, t, values))
      }))
    }

    return self
  }


  function checkPulse(pulse) {
    return checkTimes(pulse)
      .stop(museq.pulse.stop)
  }


  function noop() {
  }


  return {
    capture: capture,
    fromNow: fromNow,
    checkTimes: checkTimes,
    checkPulse: checkPulse
  }
}()
