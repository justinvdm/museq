mu.testUtils = function() {
  var all = sig.all,
      then = sig.then,
      reset = sig.reset,
      except = sig.except,
      cleanup = sig.cleanup,
      put = sig.put,
      map = sig.map


  function capture(s) {
    var values = []

    sig.map(s, function(x) {
      values.push(x)
    })

    return values
  }


  function timeCheck(s) {
    return {
      runs: [],
      target: s,
      state: capture(s)
    }
  }


  timeCheck.at = function(d, ms, fn) {
    var s = sig(function() {
      var s = sig()

      var id = setTimeout(function() {
        put(s, d.state)
      }, ms)

      cleanup(s, function() {
        clearTimeout(id)
      })

      return map(s, fn)
    })

    d.runs.push(s)
    return d
  }


  timeCheck.end = function(d, done) {
    vv(d.runs)
      (all)
      (then, function() { end() })
      (except, end)

    function end(e) {
      reset(d.target)
      d.runs.forEach(reset)
      if (e) done(e)
      else done()
    }

    return d
  }


  function fromNow(offset) {
    return +(new Date()) + offset
  }


  return {
    capture: capture,
    fromNow: fromNow,
    timeCheck: timeCheck
  }
}()
