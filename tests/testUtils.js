mu.testUtils = function() {
  var all = sig.all,
      then = sig.then,
      reset = sig.reset,
      except = sig.except,
      cleanup = sig.cleanup,
      resolve = sig.resolve


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
    var s = sig()

    var id = setTimeout(function() {
      fn(d.state)
      resolve(s)
    }, ms)

    cleanup(s, function() {
      clearTimeout(id)
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
