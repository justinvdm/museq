
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
  var all = sig.all,
      reset = sig.reset,
      cleanup = sig.cleanup,
      ensure = sig.ensure,
      spread = sig.spread,
      put = sig.put,
      then = sig.then,
      depend = sig.depend,
      except = sig.except,
      filter = sig.filter

  var globalOrigin = +(new Date())
  var _slice = Array.prototype.slice


  function loop(x, interval, origin) {
    parseLoopOpts(arguments)

    var out = sig()
    var curr

    vv(x)
      (ensure)
      (then, function(x) { curr = x })
      (depend, out)

    vv([interval, origin])
      (all)
      (update, spread(loopTick))
      (then, function() {
        if (typeof curr != 'undefined') put(out, curr)
      })
      (depend, out)

    return out
  }


  function loopTick(interval, origin) {
    interval = interval * 1000

    return vv(nextLoop(interval, origin))
      (sleep)
      (update, function() { return tick(interval) })
      ()
  }


  function parseLoopOpts(args) {
    var interval = args[1]
    var origin = args[2]

    if (interval && typeof interval == 'object') {
      origin = interval.origin
      interval = interval.interval
    }

    interval = deflt(interval, 2)
    origin = +deflt(origin, globalOrigin)
  }


  function nextLoop(interval, origin) {
    var now = +(new Date())
    var i = Math.ceil((now - origin) / interval)
    var then = origin + (i * interval)
    return then - now
  }


  function seq(s, interval) {
    return vv(s)
      (ensure)
      (append, seqOnce, interval)
  }
  

  function seqOnce(s, interval) {
    interval = deflt(interval, 2)

    var i = -1
    var values
    var out = sig()

    vv(x)
      (ensure)
      (then, function(x) { values = x })
      (depend, out)

    vv(interval)
      (ensure)
      (filter, function() { return !!values })
      (update, function(interval) {
        interval = interval * 1000
        interval = interval / values.length
        return tick(interval)
      })
      (then, function() {
        if (++i < values.length) put(out, values[i])
      })
      (depend, out)

    return out
  }


  function tr() {
  }


  function run() {
  }


  function sleep(interval) {
    var s = sig()
    var delayId = setTimeout(resolve, interval, s)

    cleanup(s, function() {
      clearInterval(delayId)
    })

    return s
  }


  function tick(interval) {
    var s = sig()
    var intervalId = setInterval(resolve, interval, s)

    cleanup(s, function() {
      clearInterval(intervalId)
    })

    resolve(s)
    return s
  }


  function append(s, fn) {
    var out = sig()
    var args = slice(arguments, 2)

    vv(s)
      (then, function(x) { applyOut(out, fn, x, args) })
      (depend, out)

    return out
  }


  function update(s, fn) {
    var out = sig()
    var args = slice(arguments, 2)
    var curr

    vv(s)
      (then, function(x) {
        if (curr) reset(curr)
        curr = applyOut(out, fn, x, args)
      })
      (depend, out)

    return out
  }


  function applyOut(out, fn, x, args) {
    var result = fn.apply(null, [x].concat(args)
    if (!result) return null

    return vv(result)
      (then, puts, out)
      (except, raises, out)
      (depend, out)
      ()
  }


  function puts(x, s) {
    put(s, x)
  }


  function raises(e, s) {
    put(s, e)
  }


  function resolve(s) {
    put(s, null)
  }


  function deflt(a, b) {
    return exists(a)
      ? a
      : b
  }


  function exists(v) {
    return typeof a != 'undefined'
        && a !== null
  }


  function slice(arr, a, b) {
    return _slice.call(arr, a, b)
  }


  return {
    tr: tr,
    run: run,
    seq: seq,
    seqOnce: seqOnce,
    loop: loop,
    update: update,
  }
}();
museq;

return museq;

}));
